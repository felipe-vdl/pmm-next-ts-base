import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { prisma } from "@/db";
import { Role } from "@prisma/client";
import { Message, UserInfo } from "@/types/interfaces";

import { AppNotification } from "@/types/interfaces";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UserCreateProps {
  user: UserInfo;
}

interface NewUserForm {
  name: string;
  email: string;
  role: string;
}

const UserCreate = ({ user }: UserCreateProps) => {
  const notificationInitialState: AppNotification = { message: "", type: "" };
  const [notification, setNotification] = useState<AppNotification>(
    notificationInitialState
  );
  const formInitalState: NewUserForm = {
    name: "",
    email: "",
    role: "",
  };
  const [form, setForm] = useState<NewUserForm>(formInitalState);

  const queryClient = useQueryClient();

  const newUserMutation = useMutation({
    mutationFn: async (variables: NewUserForm) => {
      try {
        setNotification(notificationInitialState);
        const response = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: (data: Message) => {
      queryClient.invalidateQueries(["users"]);
      setNotification({ type: "success", message: data.message });
      setForm(formInitalState);
    },
    onError: (error: { message: string }) => {
      if (error?.message) {
        setNotification({
          message: error.message ?? "Ocorreu um erro.",
          type: "error",
        });
      }
    },
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (Object.values(form).every((entry) => entry.trim().length > 0)) {
      newUserMutation.mutate(form);
    } else {
      setNotification({
        type: "error",
        message: "Preencha as informações.",
      });
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm((st) => ({ ...st, [evt.target.name]: evt.target.value }));
  };

  const handleSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((st) => ({ ...st, [evt.target.name]: evt.target.value }));
  };

  return (
    <>
      <Head>
        <title>Novo Usuário</title>
      </Head>
      <div className="m-auto flex w-full flex-col items-center rounded-[12px] bg-light-500 text-white shadow shadow-black/20 dark:bg-dark-500 sm:w-[25rem] md:w-[30rem] lg:w-[38rem]">
        <div className="w-full rounded-t-[12px] bg-dourado py-1 text-center">
          <h2 className="text-2xl font-light">Novo Usuário</h2>
        </div>
        <form
          className="flex w-full flex-col gap-8 p-4 pt-8"
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
          <div className="flex flex-col gap-6 px-1">
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={form.name}
              className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
              placeholder="Nome Completo"
            />
            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={form.email}
              className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
              placeholder="E-mail"
            />
            <select
              onChange={handleSelect}
              name="role"
              value={form.role}
              className="rounded border-b border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
              placeholder="Confirmar Nova Senha"
            >
              <option value="" className="">
                Nível do Usuário
              </option>
              {Object.values(Role).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <button
            disabled={newUserMutation.isLoading}
            className="rounded-[10px] bg-roxo p-1 text-xl font-light hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {newUserMutation.isLoading ? "Criando usuário..." : "Criar"}
          </button>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<UserCreateProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else {
    const authUser = await prisma.user.findFirst({
      where: {
        id: +session.user.id,
      },
    });
    if (authUser.role === "USER") {
      const queryParams =
        "?notificationMessage=O%20usu%C3%A1rio%20n%C3%A3o%20tem%20permiss%C3%A3o%20para%20acessar%20a%20p%C3%A1gina.&notificationType=error";

      return {
        redirect: {
          permanent: false,
          destination: `/${queryParams}`,
        },
        props: {},
      };
    }

    return {
      props: {
        user: {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          is_enabled: authUser.is_enabled,
        },
      },
    };
  }
};

UserCreate.layout = "dashboard";
export default UserCreate;
