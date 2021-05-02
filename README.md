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
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "https://deno.land/x/lambda/mod.ts";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
  };
}
```
use <code>deno bundle</code> to bundle your code to a sighle js file and
tell lambda that the handler is "*yourbundlejsfilename.handler*".

done. enjoy.