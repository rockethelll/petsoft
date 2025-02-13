"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { signIn, signOut } from "@/lib/auth-no-edge";
import { prisma } from "@/lib/db";
import { checkAuth, createUser, getPetById } from "@/lib/server-utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// User actions
export const logIn = async (prevState: unknown, formData: unknown) => {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          message: "Invalid credentials.",
        };
      } else {
        return {
          message: "Could not sign in.",
        };
      }
    }
    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
};

export const signUp = async (prevState: unknown, formData: unknown) => {
  // Check if formData is a FormData object
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  // Convert formData to object
  const formDataEntries = Object.fromEntries(formData.entries());

  // Validate form data
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await createUser(email, hashedPassword);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
};

export const logOut = async () => {
  await signOut({ redirectTo: "/" });
};

// Pet actions
export const addPet = async (pet: unknown) => {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
};

export const editPet = async (petId: unknown, newPetData: unknown) => {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
};

export const deletePet = async (petId: unknown) => {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id.",
    };
  }
  // authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
};

// Payment actions
export const createCheckoutSession = async () => {
  // Authentication check
  const session = await checkAuth();

  console.log("session", session.user.email);

  // Create a checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email ?? "",
    line_items: [
      {
        price: "price_1QqzndIJclgEKIi1Xzc284PD",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?canceled=true`,
  });

  // Redirect to the checkout page
  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  } else {
    return {
      message: "Could not create checkout session.",
    };
  }
};
