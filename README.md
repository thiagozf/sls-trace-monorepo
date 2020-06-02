# Serverless trace monorepo

Monorepo scenario for issue [236](https://github.com/danielcondemarin/serverless-next.js/issues/236) of [serverless-next.js](https://github.com/danielcondemarin/serverless-next.js/issues/236).

### Steps to reproduce:

1. Setup Next.js monorepo with a starter app

```bash
mkdir sls-trace-monorepo && cd sls-trace-monorepo
echo '{
  "private": true,
  "workspaces": ["packages/*"]
}' > package.json
npm init next-app packages/nextjs-blog --example "https://github.com/vercel/next-learn-starter/tree/master/learn-starter"
```

2. Check that all modules are installed in repo's root, while `packages/nextjs-blog/node_modules` is empty (just a symlink to `.next` bin)

3. Add a SSR page for good measure

```jsx
// packages/nextjs-blog/pages/index.js

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
```

4. Configure Serverless Next.js component

```yml
# serverless.yml

name: sls-trace-monorepo

blog:
  component: serverless-next.js@1.12.0-alpha.7
  inputs:
    nextConfigDir: ./packages/nextjs-blog
    useServerlessTraceTarget: true
```

5. Deploy

```bash
serverless
```

6. Check that instead of copying modules to `packages/nextjs-blog/.serverless_next/default-lambda/node_modules`, they are placed in `packages/nextjs-blog/node_modules`

7. Don't deploy a second time because it is going to work 'accidentally' :P

### Cause

At `@sls-next/lambda-at-edge/build`, `path.relative(this.nextConfigDir, resolvedFilePath)` resolves to `../../node_modules/<file path>`. The result is joined with `path.join(this.outputDir, handlerDirectory, <result>)`, resulting in `packages/nextjs-blog/node_modules`.
