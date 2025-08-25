"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductDialogHeaderProps {
  name: string;
  price: number;
}

export const ProductDialogHeader = ({
  name,
  price,
}: ProductDialogHeaderProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
      </DialogHeader>
      <p className="mt-2 text-lg font-semibold">NT$ {price}</p>
    </>
  );
};
