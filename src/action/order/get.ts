"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const getOrders = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const orders = await prisma.order.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      paymentMethod: true,
      orderItems: true,
      paymentStatus: true,
      status: true,
    },
  });
  return orders;
};

export const getOrderById = async (orderId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      paymentMethod: true,
      orderItems: true,
      paymentStatus: true,
      status: true,
      address: true,
      phoneNumber: true,
      name: true,
    },
  });
  return order;
};
