"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import NavbarUser from "./navbar-user";
import NavbarCart from "./navbar-cart";
import MobileNavMenu from "./mobile/navbar-moblie";
import { CollectionWithCategory } from "@/types/collections";
import NavbarSearch from "./navbar-search";
import MobileCart from "./mobile/mobile-cart";

interface NavLinksProps {
  collections: CollectionWithCategory[];
}

export const NavLinks = ({ collections }: NavLinksProps) => {
  const filterCollection = collections.filter(
    (col) => col.name === "新品上市" || col.name === "特價商品",
  );

  return (
    <>
      {/* 桌面版導航 */}
      <nav className="hidden items-center justify-between gap-4 lg:flex">
        <div className="flex items-center gap-6">
          {filterCollection?.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}/全部`}
              className="inline-flex h-9 py-2 text-sm font-medium transition-all"
            >
              {col.name}
            </Link>
          ))}
          <Link
            href="/collections"
            className="h-9 py-2 text-sm font-medium transition-all hover:text-neutral-600"
          >
            商品系列
          </Link>
          <Link
            href={"/news"}
            className="h-9 py-2 text-sm font-medium transition-all hover:text-neutral-600"
          >
            最新消息
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-3">
            <NavigationMenuItem className="">
              <NavbarUser />
            </NavigationMenuItem>
            <NavbarCart />
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* 手機版選單按鈕 */}
      <div className="flex items-center gap-4">
        <div className="flex md:hidden gap-4">
          <NavbarSearch />
          <MobileCart />
        </div>
        <MobileNavMenu collections={collections} />
      </div>
    </>
  );
};
