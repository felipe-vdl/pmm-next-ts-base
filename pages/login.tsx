import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Router from "next/router";
import { AppNotification } from "@/types/interfaces";
import Head from 'next/head';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const notificationInitialState: AppNotification = {
    type: "",
    message: "",
  };
  const [notification, setNotification] = useState<AppNotification>(
    notificationInitialState
  );

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    setForm((st) => {
      return { ...st, [evt.target.name]: evt.target.value };
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (form.email.trim().length && form.password.trim().length) {
      setNotification(notificationInitialState);
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (!res.error) {
        Router.push("/");
        setIsLoading(false);
      } else {
        setNotification({ message: res.error, type: "error" });
        setIsLoading(false);
      }
    } else {
      setNotification({
        message: !form.email.trim().length
          ? "Informe um E-mail"
          : "Informe uma senha",
        type: "error",
      });
    }
  };

  return (
    <>
    <Head>
      <title>Login</title>
    </Head>
    <div className="m-auto w-72 sm:w-[30rem] md:w-[36rem] lg:w-[42rem] max-w-full rounded-[30px] shadow shadow-black/30">
      <div className="rounded-t-[29px] bg-dourado py-2 text-center text-2xl font-bold text-white drop-shadow-md">
        SISTEMA BASE
      </div>
      <form
        className="flex flex-col gap-4 rounded-b-[29px] bg-light-500 p-5 dark:bg-dark-500"
        onSubmit={handleSubmit}
      >
        {notification.message && (
          <div
            className={`flex w-full items-center rounded-[8px] px-3 py-1 text-center ${
              notification.type === "error"
                ? "bg-red-300 text-red-800"
                : "bg-green-300 text-green-800"
            }`}
          >
            <p className="mx-auto">{notification.message}</p>
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => setNotification(notificationInitialState)}
            >
              X
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 border-b border-dourado dark:border-zinc-400">
          <input
            required
            id="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="flex-1 appearance-none rounded border-none bg-transparent py-1 px-2 leading-tight text-black focus:outline-none dark:text-white"
            autoComplete="nope"
          />
        </div>
        <div className="flex items-center gap-2 border-b border-dourado dark:border-zinc-400">
          <input
            required
            id="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="flex-1 appearance-none rounded border-none bg-transparent py-1 px-2 leading-tight text-black focus:outline-none dark:text-white"
            autoComplete="nope"
          />
        </div>
        <button
          disabled={isLoading}
          className="mx-auto w-1/2 rounded bg-roxo py-1 text-white hover:bg-indigo-900 disabled:bg-indigo-400"
        >
          {isLoading ? "Carregando..." : "Login"}
        </button>
      </form>
    </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};

LoginPage.layout = "regular";
export default LoginPage;
