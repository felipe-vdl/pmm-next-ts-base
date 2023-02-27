import { UserInfo } from "@/types/interfaces";

export default async function getUserInfo() {
  try {
    const res = await fetch("/api/user/get-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      throw new Error("Ocorreu um erro.")
    }

    const data = await res.json();
    return data as UserInfo;

  } catch (error) {
    throw error;
  }
}