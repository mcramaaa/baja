import { INavMenu } from "@/constant/navMenu";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface DropdownProps {
  title: string;
  menu?: INavMenu[];
  isOpen: boolean;
  onClick: () => void;
}

function DropdownItem({ item }: { item: INavMenu }) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  return (
    <div>
      {item.path ? (
        <Link
          href={item.path}
          onClick={() => setIsSubOpen(false)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-slate-100"
        >
          {item.icon} {item.label}
        </Link>
      ) : (
        <button
          onClick={() => setIsSubOpen(!isSubOpen)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-slate-100"
        >
          <span className="flex items-center gap-2">
            {item.icon} {item.label}
          </span>
          {item.submenu &&
            (isSubOpen ? (
              <FaChevronDown className="-rotate-180 duration-300" />
            ) : (
              <FaChevronDown className="duration-300" />
            ))}
        </button>
      )}

      {isSubOpen && item.submenu && (
        <div className="top-0 pl-3 w-full rounded-md shadow-lg">
          {item.submenu.map((subItem, subIndex) => (
            <button
              key={subIndex}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 w-full"
            >
              {subItem.icon} {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default function DropDown({
  title,
  menu,
  isOpen,
  onClick,
}: DropdownProps) {
  return (
    <div className="relative bg-white flex justify-center">
      <button
        onClick={onClick}
        className="flex items-center gap-2 hover:text-white hover:bg-brand-core2Dark duration-300 rounded-lg px-4 py-2 text-sm"
      >
        {title}
        {isOpen ? (
          <FaChevronDown className="-rotate-180 duration-300" />
        ) : (
          <FaChevronDown className="duration-300" />
        )}
      </button>

      {menu && isOpen && menu.length > 0 && (
        <div className="absolute mt-10 w-48 bg-white overflow-hidden rounded-md drop-shadow">
          {menu.map((item, index) => (
            <DropdownItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
