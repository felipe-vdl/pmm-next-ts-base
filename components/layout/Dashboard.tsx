import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";
import Sidebar from "../UI/Sidebar";
import { useRouter } from "next/router";
import QueryNotification from "../UI/QueryNotification";
import { AppNotification } from "@/types/interfaces";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const notificationMessage = router.query.notificationMessage as string;
  const notificationType = router.query.notificationType as ("" | "error" | "success");

  return (
    <div className="bg-light-900 dark:bg-dark-900 flex min-h-screen flex-col">
      <div id="notifications" />
      <Navbar />
      <div className="w-screen overflow-auto flex flex-1 bg-light-900 text-light-50 dark:bg-dark-900 dark:text-dark-50">
        <Sidebar />
        <div className="flex flex-1 p-4 w-full">{children}</div>
      </div>
      <Footer />
      {notificationMessage && 
        <QueryNotification messageText={notificationMessage} messageType={notificationType} />
      }
    </div>
  );
}
