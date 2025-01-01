export async function responseStringify(response: Response) {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
        headers[key] = value;
    });

    return JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: headers,
        url: response.url,
        redirected: response.redirected,
        type: response.type,
        body: await response.text(),
    });
}

export function responseParse(serializedResponse: string): Response {
    const parsed = JSON.parse(serializedResponse);
    const { status, statusText, headers, body } = parsed;
    const responseInit: ResponseInit = {
        status: status,
        statusText: statusText,
        headers: new Headers(headers)
    };

    return new Response(body, responseInit);
}