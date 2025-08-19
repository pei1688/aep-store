import Image from "next/image";

const Brand = () => {
  return (
    <section className="mx-auto my-32 w-full max-w-7xl px-6 md:px-0">
      <div className="flex md:flex-row flex-col  justify-between gap-4">
        <div className="flex w-full flex-col space-y-8">
          <span className="ae-home-title">BRAND STORY</span>
          <span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            libero aperiam cumque quaerat ipsum id quis cum porro maxime quae
            modi praesentium, velit, distinctio ratione incidunt! Enim ipsum
            voluptates harum.
          </span>
          <span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            libero aperiam cumque quaerat ipsum id quis cum porro maxime quae
            modi praesentium, velit, distinctio ratione incidunt! Enim ipsum
            voluptates harum.
          </span>
        </div>
        <div className="relative h-[500px] w-full">
          <Image
            src={"/about.jpg"}
            alt="介紹圖片-AEp"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </section>
  );
};

export default Brand;
