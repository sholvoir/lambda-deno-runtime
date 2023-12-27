async function init() {
    const runtimeApi = `http://${Deno.env.get('AWS_LAMBDA_RUNTIME_API')}/2018-06-01/runtime`;
    let handle;
    try {
        const [file, method] = Deno.env.get('_HANDLER')?.split('.');
        const script = `${Deno.env.get('LAMBDA_TASK_ROOT')}/${file}.js`;
        handle = (await import(script))[method];
    } catch (detail) { await fetch (`${runtimeApi}/init/error`, {
        method: 'POST',
        headers: { 'Lambda-Runtime-Function-Error-Type': 'Unhandled' },
        body: JSON.stringify({
            errorMessage: 'Failed to load function.',
            errorType: 'InvalidFunctionException',
            detail
        })
    }); }
    if (!handle) Deno.exit(-1);

    const functionName = Deno.env.get('AWS_LAMBDA_FUNCTION_NAME');
    const functionVersion = Deno.env.get('AWS_LAMBDA_FUNCTION_VERSION');
    const memoryLimitInMB = Deno.env.get('AWS_LAMBDA_FUNCTION_MEMORY_SIZE');
    const logGroupName = Deno.env.get('$AWS_LAMBDA_LOG_GROUP_NAME');
    const logStreamName = Deno.env.get('$AWS_LAMBDA_LOG_STREAM_NAME');

    const eventUrl = `${runtimeApi}/invocation/next`
    while (true) {
        const event = await fetch(eventUrl);
        const headers = event.headers;
        Deno.env.set('_X_AMZN_TRACE_ID', headers.get('lambda-runtime-trace-id') || '');
        const awsRequestId = headers.get('lambda-runtime-aws-request-id');
        const responseUrl = `${runtimeApi}/invocation/${awsRequestId}`
        const context = {
            functionName, functionVersion, memoryLimitInMB, logGroupName, logStreamName, awsRequestId,
            invokedFunctionArn: headers.get('lambda-runtime-invoked-function-arn'),
            clientContext: headers.get('lambda-runtime-client-context'),
            cognitaIdentity: headers.get('lambda-runtime-cognito-identity'),
            getRemainingTimeInMillis: () => (+(headers.get('lambda-runtime-deadline-ms')||0) - Date.now())
        };
        try {
            const result = await handle(await event.json(), context);
            await fetch(`${responseUrl}/response`, { method: 'POST', body: JSON.stringify(result) });
        } catch (e) {
            await fetch(`${responseUrl}/error`, { method: 'POST', body: JSON.stringify(e) });
        }
    }
}

if (import.meta.main) await init();