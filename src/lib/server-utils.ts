import { Pet, User } from "@prisma/client";
import { redirect } from "next/navigation";
import "server-only";

import { auth } from "./auth";
import { prisma } from "./db";

export const checkAuth = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
};

export const createUser = async (email: string, hashedPassword: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  return user;
};

export const getPetById = async (petId: Pet["id"]) => {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });

  return pet;
};

export const getPetsByUserId = async (userId: User["id"]) => {
  const pets = await prisma.pet.findMany({
    where: {
      userId,
    },
  });

  return pets;
};

export const getUserByEmail = async (email: User["email"]) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};
