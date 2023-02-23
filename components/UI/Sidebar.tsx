import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

export default function Sidebar() {
  const { data: session } = useSession();
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState<boolean>(true);

  return (
    <div className="z-20 sticky left-[-0.1%] flex bg-light-900 text-light-50 shadow shadow-black/30 dark:bg-dark-900 dark:text-dark-50">
      <ul
        className={`flex ${
          sidebarIsCollapsed ? "" : "sm:min-w-[12rem]"
        } flex-col border-r border-light-500 dark:border-dark-500`}
      >
        <li className={`${sidebarIsCollapsed ? "mx-auto" : "ml-auto"}`}>
          <button
            title="Expandir/Contrair"
            onClick={() => setSidebarIsCollapsed((st) => !st)}
            className={`${
              sidebarIsCollapsed ? "mx-auto" : "ml-auto mr-2"
            } mt-2 mb-1 rounded bg-zinc-200 p-2 text-zinc-800 hover:bg-zinc-300 dark:bg-dark-500 dark:text-white hover:dark:bg-zinc-600`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {sidebarIsCollapsed ? (
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              ) : (
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              )}
            </svg>
          </button>
        </li>
        {session &&
          (session.user.role === "ADMIN" ||
            session.user.role === "SUPERADMIN") && (
            <li>
              <Dropdown
                sidebarIsCollapsed={sidebarIsCollapsed}
                section={{
                  id: "configuracoes",
                  title: "Configurações",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>
                  ),
                }}
                links={[
                  {
                    title: "Criar Usuário",
                    href: "/users/new",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path
                          fillRule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Lista de Usuários",
                    href: "/users",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      </svg>
                    ),
                  },
                ]}
              />
            </li>
          )}
      </ul>
    </div>
  );
}
