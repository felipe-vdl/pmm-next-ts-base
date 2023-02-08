import navbarLogo from "../../assets/navbar-logo.png";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import Router from "next/router";

export default function Navbar() {
  const { data, status } = useSession();
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    Router.push("/login");
  };

  return (
    <header
      className={`z-10 bg-dourado px-6 text-2xl font-bold text-white shadow shadow-black/30`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <Link href="/">
          <Image
            src={navbarLogo}
            height={70}
            alt="Mesquita SGP"
            className="py-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          />
        </Link>
        <ul className="relative flex items-center gap-6 self-stretch">
          {status === "unauthenticated" && (
            <>
              <li>
                <Link href="/login">LOGIN</Link>
              </li>
            </>
          )}
          <li>
            <ThemeToggler />
          </li>
          {status === "authenticated" && (
            <li className="group flex cursor-pointer items-center self-stretch">
              <button className="rounded-full bg-roxo py-1 px-3 text-3xl">
                {data.user.name.charAt(0)}
              </button>
              <div className="absolute left-[-1.5rem] top-[5.9rem] z-10 hidden w-[8rem] flex-col items-end border border-t-0 bg-light-500 text-base font-light text-light-50 shadow shadow-black/30 hover:flex group-hover:flex dark:border-dark-500 dark:bg-dark-500 dark:text-dark-50 sm:top-[5.9rem] md:top-[5.9rem]">
                <Link
                  className="light:border-light-500 w-full border-b p-2 text-end hover:bg-light-900 dark:border-dark-900 dark:hover:bg-dark-900"
                  href="/changepassword"
                >
                  Alterar Senha
                </Link>
                <button
                  className="w-full p-2 text-end hover:bg-light-900 dark:hover:bg-dark-900"
                  onClick={handleSignOut}
                >
                  Sair
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
