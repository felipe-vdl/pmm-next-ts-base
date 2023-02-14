import { atom } from "jotai";
import { AppNotification } from "@/types/interfaces";

export const notificationAtom = atom<AppNotification>({
  message: "",
  type: "",
});
