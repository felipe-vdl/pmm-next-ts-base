import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRouter } from 'next/router';
import { AppNotification } from "@/types/interfaces";

interface FlyingNotificationProps {
  messageText?: string;
  messageType?: "" | "error" | "success";
}

export default function FlyingNotification({ messageText, messageType }: FlyingNotificationProps) {
  const router = useRouter();
  const notificationInitState: AppNotification = { message: "", type: "" };
  const [notification, setNotification] = useState<AppNotification>(notificationInitState);

  const handleClear = () => {
    setNotification(notificationInitState);

    router.push({
      pathname: router.pathname,
      query: {}
    }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (messageText.length && messageType.length) {
      setNotification({
        message: messageText,
        type: messageType
      })
    }
  }, [])

  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(<>
      {
        notification.message &&
        <div
          className={`z-20 flex w-full items-center px-4 py-2 text-center font-medium ${notification.type === "error"
            ? "bg-red-300 text-red-900"
            : "bg-green-300 text-green-800"
            }`}
        >
          <p className="mx-auto">{notification.message}</p>
          <span className="cursor-pointer hover:text-white" onClick={handleClear}>
            X
          </span>
        </div>
      }</>,
      document.querySelector("#notifications")
    );
  } else {
    return <></>
  }
}
