import { User } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../db";
import { Message } from "@/types/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | Message>
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      if (session.user.role === "SUPERADMIN" || session.user.role === "ADMIN") {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
      } else {
        return res.status(403).json({ message: "Usuário não tem permissão para acessar este recurso." });
      }

    } else {
      return res.status(401).json({ message: "Usuário não está autenticado." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
}
