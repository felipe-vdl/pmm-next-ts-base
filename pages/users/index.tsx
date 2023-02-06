import React, { useState } from "react";
import Router from "next/router";
import Link from "next/link";

import { useAtom } from "jotai";
import { notificationAtom } from "@/store/store";

import { GetServerSideProps } from "next";
import { AppDialog, AppNotification, UserInfo } from "@/types/interfaces";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/db";
import { User } from "@prisma/client";

import Head from "next/head";
import Table from "@/components/Table/Table";
import { createColumnHelper } from "@tanstack/react-table";
import ConfirmationDialog from "@/components/UI/ConfirmationDialog";
import FlyingNotification from "@/components/UI/FlyingNotification";

interface RowActionsProps {
  user: { id: number; is_enabled: boolean };
  authUser: UserInfo;
}
const RowActions = ({ user }: RowActionsProps) => {
  const [notification, setNotification] = useAtom(notificationAtom);

  const dialogInitialState: AppDialog = {
    isOpen: false,
    message: "",
    accept: () => {},
    reject: () => {},
  };
  const [dialog, setDialog] = useState<AppDialog>(dialogInitialState);

  const handleConfirmation = (
    accept: () => void,
    message: string = "Deseja confimar a operação?",
    reject = () => {
      setDialog((st) => dialogInitialState);
    }
  ) => {
    setDialog({
      isOpen: true,
      accept,
      reject,
      message,
    });
  };

  const handleResetPassword = async () => {
    try {
      setDialog(dialogInitialState);
      const response = await fetch(`/api/user/${user.id}/resetpassword`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      Router.replace(Router.asPath);
      setNotification({ type: "success", message: data.message });
    } catch (error) {
      setNotification({ type: "error", message: error.message });
      setDialog(dialogInitialState);
    }
  };

  const handleDeactivate = async () => {
    try {
      setDialog(dialogInitialState);
      const response = await fetch(`/api/user/${user.id}/deactivate`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      Router.replace(Router.asPath);
      setNotification({ type: "success", message: data.message });
    } catch (error) {
      setNotification({ type: "error", message: error.message });
      setDialog(dialogInitialState);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="ratio-square rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-700"
        title={`Restaurar senha do usuário.`}
        onClick={() =>
          handleConfirmation(
            handleResetPassword,
            "Você está prestes a restaurar a senha de um usuário."
          )
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
          <path
            fillRule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
      </button>
      <Link
        href={`/users/${user.id}/edit`}
        className="ratio-square rounded bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-700"
        title={`Editar informações do usuário.`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </Link>
      {user.is_enabled ? (
        <button
          className="ratio-square rounded bg-red-500 p-2 text-white transition-colors hover:bg-red-700"
          title={`Desativar o acesso do usuário.`}
          onClick={() =>
            handleConfirmation(
              handleDeactivate,
              "Você esta prestes a desativar o acesso de um usuário."
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </button>
      ) : (
        <button
          className="ratio-square rounded bg-green-500 p-2 text-white transition-colors hover:bg-green-700"
          title={`Ativar o acesso do usuário.`}
          onClick={() =>
            handleConfirmation(
              handleDeactivate,
              "Você esta prestes a ativar o acesso de um usuário."
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
          </svg>
        </button>
      )}
      {dialog.isOpen && (
        <ConfirmationDialog
          accept={dialog.accept}
          reject={dialog.reject}
          message={dialog.message}
        />
      )}
    </div>
  );
};

interface UserIndexProps {
  users: User[];
  user: UserInfo;
}
const UserCreate = ({ user, users }: UserIndexProps) => {
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
      sortingFn: "basic",
      filterFn: "numToString",
    }),
    columnHelper.accessor("name", {
      header: "Nome",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
    }),
    columnHelper.accessor(
      (row) =>
        row.created_at.toLocaleDateString("pt-br", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      {
        id: "created_at",
        header: "Data de Criação",
        cell: (info) => info.getValue().split(" ")[0],
        sortingFn: "stringDate",
        sortDescFirst: true,
        filterFn: "includesString",
      }
    ),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (props) => (
        <RowActions
          user={{
            id: props.row.original.id,
            is_enabled: props.row.original.is_enabled,
          }}
          authUser={user}
        />
      ),
    }),
  ];
  const [notification, setNotification] =
    useAtom<AppNotification>(notificationAtom);

  return (
    <>
      <Head>
        <title>Usuários</title>
        <meta
          name="description"
          content="Sistema Gerenciador de Projetos — Prefeitura de Mesquita."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Table<User> data={users} columns={columns} />
      </div>
      {notification.message && <FlyingNotification />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<UserIndexProps> = async (
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
      const queryParams = "?notificationMessage=Usu%C3%A1rio%20n%C3%A3o%20tem%20permiss%C3%A3o&notificationType=error"

      return {
        redirect: {
          permanent: false,
          destination: `/${queryParams}`,
        },
        props: {},
      };
    }

    const users = await prisma.user.findMany({});

    return {
      props: {
        user: {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          is_enabled: authUser.is_enabled,
        },
        users,
      },
    };
  }
};

UserCreate.layout = "dashboard";
export default UserCreate;
