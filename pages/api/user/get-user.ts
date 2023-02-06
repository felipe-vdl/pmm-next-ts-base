import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { UserInfo, Message } from "@/types/interfaces";

export default async function authUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<UserInfo | Message>
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      const authUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      return res.status(200).json({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        is_enabled: authUser.is_enabled,
      });
    } else {
      return res.status(401).json({ message: "Usuário não está autenticado." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
}
