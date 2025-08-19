import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronDown } from "lucide-react";
import FilterSidebar, { CategorySidebarProps } from "./filter-sidebar";

const MobileFilterSidebar = ({ allProducts }: CategorySidebarProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild className="block md:hidden">
        <Button variant="outline" className="flex items-center gap-2">
          篩選商品
          <ChevronDown className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen overflow-y-scroll px-4 pt-4">
        <DrawerHeader className="mb-2">
          <DrawerTitle>條件篩選</DrawerTitle>
          <DrawerDescription>選擇你想要查看的分類與品牌</DrawerDescription>
        </DrawerHeader>
        <FilterSidebar allProducts={allProducts} />
        <DrawerFooter className="mt-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              關閉篩選
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilterSidebar;
