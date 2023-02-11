import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider as JotaiProvider } from "jotai";

import type { AppProps } from "next/app";
interface CustomAppProps extends Omit<AppProps, "Component"> {
  Component: AppProps["Component"] & { layout: string };
}
import DashboardLayout from "../components/layout/Dashboard";
import RegularLayout from "../components/layout/Regular";
import NoLayout from "@/components/layout/NoLayout";

const layouts = {
  dashboard: DashboardLayout,
  regular: RegularLayout,
  none: NoLayout
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const Layout = layouts[Component.layout] || NoLayout;

  return (
    <SessionProvider session={pageProps.session}>
      <JotaiProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </JotaiProvider>
    </SessionProvider>
  );
}
