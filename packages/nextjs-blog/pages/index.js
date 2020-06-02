import Head from "next/head";

function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="title">
        Yay <a href="https://nextjs.org">Next.js!</a>
      </h1>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default Home;
