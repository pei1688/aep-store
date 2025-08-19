"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const getUserProfile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      Address: true,
    },
  });

  return profile;
};

export const getUserAddress = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const addresses = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      Address: true,
    },
  });

  return addresses?.Address ?? [];
};
