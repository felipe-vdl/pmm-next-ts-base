import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/types/interfaces";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import bcrypt from "bcrypt";
import { prisma } from "@/db";

export default async function ChangePasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (
      !currentPassword.trim().length ||
      !newPassword.trim().length ||
      !confirmNewPassword.trim().length
    )
      return res
        .status(400)
        .json({ message: "Preencha todas as informações." });

    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ message: "Confirme a nova senha corretamente." });

    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(400).json({ message: "Usuário não está autenticado." });

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Senha atual incorreta." });

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.log(`Change Password Error: ${error}`);
    return res.status(500).json({ message: error });
  }
}
