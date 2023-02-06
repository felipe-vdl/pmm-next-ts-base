import Link from "next/link";

function FourOhFour() {
  return (
    <div className="m-auto flex flex-col items-center dark:bg-dark-500 p-8 gap-4 rounded-lg shadow shadow-black/30">
      <h1 className="text-3xl">404 - A página não foi encontrada.</h1>
      <Link
        href="/"
        className="bg-roxo py-2 px-4 text-white hover:bg-indigo-600 rounded text-xl shadow shadow-black/40"
      >
        Página Inicial
      </Link>
    </div>
  );
}

FourOhFour.layout = "regular";
export default FourOhFour;
