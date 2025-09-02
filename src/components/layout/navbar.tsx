import Image from "next/image";
import Link from "next/link";
import { getCollectionsWithCategory } from "@/action/collection";
import { NavLinks } from "./navbar-links";

const Navbar = async () => {
  const collections = await getCollectionsWithCategory();

  return (
    <header className="z-50 flex w-full items-center justify-between bg-[#FAFAFCCC] shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 lg:px-0">
        <div className="flex h-16 items-center">
          {/* Logo - 左邊 */}
          <Link
            href={"/"}
            className="flex flex-shrink-0 cursor-pointer items-center gap-4"
          >
            <Image
              src={"/logo.png"}
              alt="茄蘋帝國Logo"
              width={30}
              height={30}
            />
            <p className="ae-section-title hidden md:flex">AEp Store</p>
          </Link>

          {/* 導航功能 - 佔據剩餘空間 */}
          <div className="flex-1">
            <NavLinks collections={collections} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
