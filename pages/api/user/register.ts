import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../db";
import { Message } from "@/types/interfaces";
import bcrypt from "bcrypt";

export default async function Signup(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: `${req.method} method is not allowed.` });
    }

    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const authUser = await prisma.user.findUnique({
        where: {
          email: session.user.email.toLowerCase(),
        },
      });

      if (authUser.role !== "ADMIN" && authUser.role !== "SUPERADMIN") {
        return res.status(403).json({ message: "Ação não autorizada." });
      }

      const { email, name, role } = req.body;

      if (!email || !email.includes("@") || !role || !name) {
        return res.status(422).json({ message: "Informações inválidas." });
      }

      const checkExistingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (checkExistingUser) {
        return res.status(409).json({ message: "E-mail já está em uso." });
      }

      await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          password: await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10),
          role,
          updated_at: null,
        },
      });

      return res.status(200).json({ message: "Usuário criado com sucesso." });
    } else {
      return res.status(401).json({ message: "Usuário não está autenticado." });
    }
  } catch (error) {
    console.error(`Register Error: ${error}`);
    return res.status(500).json({ message: "There was an error." });
  }
}
