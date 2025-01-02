export async function requestStringify(request: Request) {
    return JSON.stringify({
        cache: request.cache,
        credentials: request.credentials,
        destination: request.destination,
        integrity: request.integrity,
        keepalive: request.keepalive,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        headers: Array.from(request.headers.entries()),
        body: await streamToBase64(request.body),
        url: request.url,
    });
}

export async function requestParse(param: string) {
    const obj = JSON.parse(param);

    // decrypt obj.body. body is base64 string

    return new Request(obj.url, {
        ...obj,
        ...(obj.body
            ? {
                  body: base64ToBlob(obj.body),
              }
            : undefined),
        ...(obj.headers ? { headers: Object.fromEntries(obj.headers) } : undefined),
    });
}

async function streamToBase64(stream: ReadableStream<Uint8Array> | null) {
    if (!stream) {
        return null;
    }

    const reader = stream.getReader();
    let chunks: Uint8Array[] = [];
    let result = await reader.read();

    while (!result.done) {
        chunks.push(result.value);
        result = await reader.read();
    }

    return arrayBufferToBase64(await new Blob(chunks).arrayBuffer());
}
function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}
function base64ToBlob(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes]);
}
