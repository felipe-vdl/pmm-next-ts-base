import { useState } from "react";
import { v4 as uuid } from "uuid";
import Link from "next/link";

interface DropdownLink {
  icon: JSX.Element | string;
  title: string;
  href: string;
}

interface DropdownProps {
  sidebarIsCollapsed: boolean;
  section: {
    id: string;
    title: string;
    icon: JSX.Element | string;
  };
  links: DropdownLink[];
}

export default function Dropdown({
  sidebarIsCollapsed,
  section,
  links,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((st) => !st);
  };

  return (
    <div key={uuid()} className="border-b border-zinc-300 dark:border-dark-500">
      <div
        className="flex cursor-pointer items-center justify-between gap-2 border-b p-2 hover:bg-slate-200 dark:border-zinc-600 dark:hover:bg-slate-900/50"
        onClick={handleClick}
        title={section.title}
      >
        <h2 className="flex items-center justify-center gap-2 py-1">
          {section.icon}
          <span className="hidden sm:block">{!sidebarIsCollapsed ? section.title : ""}</span>
        </h2>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
        )}
      </div>
      <div
        className={`flex flex-col overflow-hidden bg-indigo-300/75 text-sm transition-all ease-in-out dark:bg-dark-500 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        {links.map((link) => (
          <Link
            key={uuid()}
            href={link.href}
            title={link.title}
            className={`${
              sidebarIsCollapsed ? "justify-center" : "justify-center sm:justify-between"
            } flex items-center gap-2 border-b border-light-500 p-2 hover:bg-indigo-400/50 dark:border-dark-50/40 dark:hover:bg-slate-800/80`}
          >
            {link.icon}
            {!sidebarIsCollapsed && <h3 className="hidden sm:block">{link.title}</h3>}
          </Link>
        ))}
      </div>
    </div>
  );
}
