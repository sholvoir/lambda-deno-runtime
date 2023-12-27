# lambda-deno-runtime

This is a Deno runtime for aws lambda. Deploy it as a layer for your function to run <code>./publish</code>.
It will down Deno Linux version and build the layer .zip file and deploy it to your aws account.
You will get the layer Arn. Add the layer Arn to your function.

## requires
* Installed and configed [aws-cli](https://aws.amazon.com/cli/).
* Installed [deno](https://deno.land/).

## how to deploy
```bash
./publish
```

## how code the handler
Just like for node.js, write your ts code like this:
```TypeScript
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context }
  from 'https://esm.sh/@types/aws-lambda@8.10.130/index.d.ts';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
  };
}
```
Use <a href="https://github.com/denoland/deno_emit" target="_blank" rel="noopener noreferrer">deno_emit</a>,
<a href="https://esbuild.github.io/" target="_blank" rel="noopener noreferrer">esbuild</a>
or <a href="https://rollupjs.org" target="_blank" rel="noopener noreferrer">rollup</a>
to bundle your code to a single js file and tell lambda that the handler is "*yourbundlejsfilename.handler*".

Done. enjoy.