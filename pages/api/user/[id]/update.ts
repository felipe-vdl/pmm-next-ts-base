import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../db";
import { UserInfo } from "@/types/interfaces";

interface UpdateUserHandlerResponse {
  message: string;
  updatedUser?: Omit<UserInfo, "is_enabled" | "id">;
}

export default async function UpdateUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateUserHandlerResponse>
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

    const { name, email, role, id } = req.body;

    if (typeof id === "object")
      return res.status(400).json({ message: "Usuário inválido." });

    const checkExistingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkExistingUser && checkExistingUser.id !== +id) {
      return res.status(409).json({
        message: "O e-mail informado já está em uso por outro usuário.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: +id },
      data: {
        name: name,
        email: email,
        role: role,
      },
    });

    res.json({
      message: "Usuário atualizado com sucesso.",
      updatedUser: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.log(`Reset Password Error: ${error}`);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
}
