"use client";

import {
  FileCodeIcon,
  HandWavingIcon,
  type Icon,
  RocketLaunchIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

type sidebarItemType = {
  id: string;
  name: string;
  link: string;
  icon: Icon;
};

const sidebarItems: sidebarItemType[] = [
  {
    id: "1",
    name: "Explore",
    link: "/explore",
    icon: RocketLaunchIcon,
  },
  {
    id: "2",
    name: "My Snippets",
    link: "/my-snippets",
    icon: FileCodeIcon,
  },
  {
    id: "3",
    name: "Profile",
    link: "/profile",
    icon: UserCircleIcon,
  },
];

const Sidebar = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-center h-11 border-b">
        <div className="flex gap-1.5 items-center">
          <HandWavingIcon weight="bold" />
          <p className="font-semibold">cachecode</p>
        </div>
      </div>
      <div className="w-full flex flex-col">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="w-full border-b flex items-center py-1.5 px-3"
          >
            <item.icon size={18} weight="duotone" />
            <span className="ml-2 text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
