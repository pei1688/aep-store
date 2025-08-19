export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto my-16 max-w-7xl md:mt-20 md:mb-32">{children}</div>
  );
}
