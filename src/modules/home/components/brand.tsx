import Image from "next/image";

const Brand = () => {
  return (
    <section className="mx-auto my-32 w-full max-w-7xl px-6 md:px-0">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex w-full space-y-8">
          <h1 className="ae-home-title flex-1 text-center">BRAND STORY</h1>
          <p className="ae-capton flex-1">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            libero aperiam cumque quaerat ipsum id quis cum porro maxime quae
            modi praesentium, velit, distinctio ratione incidunt! Enim ipsum
            voluptates harum.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            libero aperiam cumque quaerat ipsum id quis cum porro maxime quae
            modi praesentium, velit, distinctio ratione incidunt! Enim ipsum
            voluptates harum.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Brand;
