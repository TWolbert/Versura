export function StandardResponse(data: {}, status = 200, statusText: string | null = null) {
    return new Response(JSON.stringify(data), {
        status,
        statusText: statusText || codeToString(status),
        headers: {
            'Content-Type': 'application/json',
            'X-Versura-Signature': 'Versura 1.0.0'
        }
    });
}

function codeToString(code: number) {
    switch (code) {
        case 200:
            return 'OK';
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 500:
            return 'Internal Server Error';
        default:
            return 'Unknown Error';
    }
}