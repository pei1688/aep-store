import OrderIdContent from "@/modules/order/ui/views/orderId-content";

interface OrderPageProps {
  params: { orderId: string };
}

const OrderPage = ({ params }: OrderPageProps) => {
  const orderId = params.orderId;

  return <OrderIdContent orderId={orderId} />;
};

export default OrderPage;
