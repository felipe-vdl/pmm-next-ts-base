const ErrorPage = ({ error }) => {
  return <div>{error}</div>;
};

export const getServerSideProps = (context) => {
  const error = context.query?.error;

  if (!error) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {
        error: error,
      },
    };
  }
};

ErrorPage.layout = "regular";
export default ErrorPage;
