import { INavMenu } from "@/constant/navMenu";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface DropdownProps {
  title: string;
  menu?: INavMenu[];
  path?: string;
  isOpen: boolean;
  onClick: () => void;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

function DropdownItem({
  item,
  setIsMenuOpen,
}: {
  item: INavMenu;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  return (
    <div>
      {item.path ? (
        <Link
          href={item.path}
          onClick={() => {
            setIsSubOpen(false);
            setIsMenuOpen(null);
          }}
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
  path,
  title,
  menu,
  isOpen,
  onClick,
  setIsMenuOpen,
}: DropdownProps) {
  return (
    <div className="relative bg-white flex justify-center">
      {path ? (
        <Link
          onClick={() => setIsMenuOpen(null)}
          className="flex items-center gap-2 hover:text-white hover:bg-brand-core2Dark duration-300 rounded-lg px-4 py-2 text-sm"
          href={path}
        >
          {title}
        </Link>
      ) : (
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
      )}

      {menu && isOpen && menu.length > 0 && (
        <div className="absolute mt-10 w-48 bg-white overflow-hidden rounded-md drop-shadow">
          {menu.map((item, index) => (
            <DropdownItem
              key={index}
              item={item}
              setIsMenuOpen={setIsMenuOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
