import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

import { prisma } from "../../../../db";
import bcrypt from "bcrypt";

import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/types/interfaces";

export default async function ResetPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed." });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Usuário não está autenticado" });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
      return res.status(403).json({ message: "Permissão negada." });
    }

    const { id } = req.query;
    if (typeof id === "object")
      return res.status(400).json({ message: "Usuário inválido." });

    await prisma.user.update({
      where: { id: +id },
      data: {
        password: await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10),
      },
    });
    res.json({ message: "Senha restaurada com sucesso." });
  } catch (error) {
    console.log(`Reset Password Error: ${error}`);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
}
