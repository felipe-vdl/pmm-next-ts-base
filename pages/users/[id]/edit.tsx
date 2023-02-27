import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

import { prisma } from "@/db";
import { Role, User } from "@prisma/client";
import { UserInfo } from "@/types/interfaces";

import { AppNotification, Message } from "@/types/interfaces";
import React, { useState } from "react";
import Router from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditUserProps {
  user: UserInfo;
}

interface EditUserForm {
  name: string;
  email: string;
  role: string;
}

interface EditUserResponse {
  updatedUser: Pick<User, "name" | "email" | "role">;
  message: string;
}

const EditUser = ({ user }: EditUserProps) => {
  const notificationInitialState: AppNotification = { message: "", type: "" };
  const [notification, setNotification] = useState<AppNotification>(
    notificationInitialState
  );
  const formInitalState: EditUserForm = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const [form, setForm] = useState<EditUserForm>(formInitalState);

  const queryClient = useQueryClient();

  const editUserMutation = useMutation({
    mutationFn: async (variables: EditUserForm) => {
      const response = await fetch(`/api/user/${user.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          email: form.email,
          role: form.role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return data as Message;
    },
    onMutate: () => {
      setNotification(notificationInitialState);
    },
    onSuccess: (data: EditUserResponse) => {
      setNotification({ type: "success", message: data.message });
      setForm(data.updatedUser);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error: { message: string }) => {
      setNotification({
        message: error.message,
        type: "error",
      });
    },
  });

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (Object.values(form).every((entry) => entry.trim().length > 0)) {
      editUserMutation.mutate(form);
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
        <title>Editar Usuário</title>
      </Head>
      <div className="m-auto w-full flex-col items-center rounded-[12px] bg-light-500 text-white shadow shadow-black/20 dark:bg-dark-500 sm:w-[25rem] md:w-[30rem] lg:w-[38rem]">
        <div className="w-full rounded-t-[12px] bg-dourado py-1 text-center">
          <h2 className="text-2xl font-light">Editar Usuário</h2>
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
          <div className="flex w-full gap-8">
            <button
              disabled={editUserMutation.isLoading}
              className="flex-1 rounded-[10px] bg-roxo p-1 text-xl font-light hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {editUserMutation.isLoading ? "Editando usuário..." : "Editar"}
            </button>
            <button
              onClick={() => Router.replace("/users")}
              className="flex-1 rounded-[10px] bg-zinc-500 p-1 text-center text-xl font-light hover:bg-zinc-400 disabled:bg-indigo-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<EditUserProps> = async (
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
    const id = +context.params.id;
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

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
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_enabled: user.is_enabled,
        },
      },
    };
  }
};

EditUser.layout = "dashboard";
export default EditUser;
