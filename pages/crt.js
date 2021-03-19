import Head from "next/head";
import CrtVideo from "../components/crt-video/";

export default function Crt() {
  return (
    <div>
      <Head>
        <title>Code Art</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CrtVideo />
      </main>
    </div>
  );
}
