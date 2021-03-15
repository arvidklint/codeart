import Head from "next/head";
import dynamic from "next/dynamic";

import styles from "../styles/Home.module.css";

const LineSketch = dynamic(() => import("../components/line-sketch"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>Code Art</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <LineSketch />
      </main>
    </div>
  );
}
