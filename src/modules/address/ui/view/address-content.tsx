"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserAddress } from "@/action/user/get";
import Spinner from "@/components/spinner";
import AddressCard from "../../components/address-card";
import AddAddressCard from "../../components/add-address-card";
import dynamic from "next/dynamic";

const AddressFormDialog = dynamic(
  () => import('../../components/add-address-form-dialog'),
  { ssr: false },
);
const DeleteAddressDialog = dynamic(
  () => import('../../components/delete-address-dilalog'),
  { ssr: false },
);

const AddressContent = () => {
  const { data: addressData, isPending } = useQuery({
    queryKey: ["addresses"],
    queryFn: () =>  getUserAddress(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {addressData?.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
        <AddAddressCard />
      </div>

      <AddressFormDialog />
      <DeleteAddressDialog />
    </>
  );
};

export default AddressContent;
