import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";

const HomePage = () => {
  return <div>HomePage</div>;
};

export const getServerSideProps: GetServerSideProps  = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};

HomePage.layout = "regular";
export default HomePage;
