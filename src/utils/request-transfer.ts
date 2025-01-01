export async function requestStringify(request: Request) {
    return JSON.stringify({
        cache: request.cache,
        credentials: request.credentials,
        destination: request.destination,
        headers: request.headers,
        integrity: request.integrity,
        keepalive: request.keepalive,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        text: await request.text(),
        url: request.url,
    });
}

export async function requestParse(param: string) {
    const obj = JSON.parse(param);

    return new Request(obj.url, obj);
}
