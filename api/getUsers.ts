import { User } from "@prisma/client";

export default async function getUsers() {
  try {
    const res = await fetch("/api/user/list", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Ocorreu um erro.");
    }

    const data = (await res.json()) as User[];
    return data;
  } catch (err) {
    throw err;
  }
}
