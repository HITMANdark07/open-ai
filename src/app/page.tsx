import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl text-center font-bold underline">
        Hello Open AI!
      </h1>
    </div>
  );
}
