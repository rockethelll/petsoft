"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";

import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

import { createCheckoutSession } from "@/actions/actions";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const [isPending, startTransition] = useTransition();
  const { success, canceled } = use(searchParams);
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {success && (
        <Button
          onClick={async () => {
            await update({
              hasAccess: true,
            });
            router.push("/app/dashboard");
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          {status === "loading" ||
            (session?.user.hasAccess && <Loader2 className="animate-spin" />)}
          Access PetSoft
        </Button>
      )}

      {!success && (
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Buy lifetime access for $299
        </Button>
      )}

      {success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft
        </p>
      )}

      {canceled && (
        <p className="text-sm text-red-700">
          Payment canceled. You can try again.
        </p>
      )}
    </main>
  );
};

export default Page;
