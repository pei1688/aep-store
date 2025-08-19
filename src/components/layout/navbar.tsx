import Image from "next/image";
import Link from "next/link";
import { getCollectionsWithCategory } from "@/action/collection";
import { NavLinks } from "./navbar-links";
import NavbarSearch from "./navbar-search";

const Navbar = async () => {
  const collections = await getCollectionsWithCategory();

  return (
    <header className="z-50 flex w-full items-center justify-between bg-[#FAFAFCCC] shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">
        <div className="flex h-16 items-center justify-between">
          <Link href={"/"} className="flex cursor-pointer items-center gap-4">
            <Image
              src={"/logo.png"}
              alt="茄蘋帝國Logo"
              width={30}
              height={30}
            />
            <p className="hidden text-2xl font-semibold md:flex">AEp Store</p>
          </Link>

          {/* 搜尋功能 */}
          <div className="hidden md:flex">
            <NavbarSearch />
          </div>
          {/* 導航功能 */}
          <NavLinks collections={collections} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
