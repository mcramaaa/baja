"use client";

import { ROUTER } from "@/prefix/router";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import DropDown from "../dropdown/DropDown";
import { NAVMENU } from "@/constant/navMenu";

export default function Navbar() {
  const path = usePathname();
  const [isMenuOpen, setisMenuOpen] = useState<number | null>(null);

  const handleMenuOpen = (i: number) => {
    setisMenuOpen(isMenuOpen === i ? null : i);
  };

  const navLabel = () => {
    if (path === ROUTER.PIUTANG.LAPORAN) {
      return "Laporan Piutang";
    }
    if (path === ROUTER.HUTANG.LAPORAN) {
      return "Laporan Hutang";
    }
  };

  return (
    <div className="p-5 ">
      <div className="h-12 rounded-lg drop-shadow px-10 flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold uppercase">{navLabel()}</h2>
        <div className="flex gap-5">
          {NAVMENU.map((menu, i) => (
            <DropDown
              key={i}
              title={menu.label}
              menu={menu.submenu}
              isOpen={isMenuOpen === i}
              onClick={() => handleMenuOpen(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
