import { supabase } from '@/infrastructure/api/supabase.api.ts';

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
    throw new Error("Variable d'environnement manquante : VITE_API_URL");
}

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export type QueryParams = Record<string, string | null | undefined>;

async function authorizationHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(`${baseUrl}${path}`);

    Object.entries(params ?? {}).forEach(([key, value]): void => {
        if (value !== null && value !== undefined && value !== '') {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
}

async function toApiError(response: Response): Promise<ApiError> {
    try {
        const body = await response.json();
        return new ApiError(response.status, body.message ?? response.statusText);
    } catch {
        return new ApiError(response.status, response.statusText);
    }
}

async function request<T>(
    method: string,
    path: string,
    options: { params?: QueryParams; body?: unknown } = {}
): Promise<T> {
    const response = await fetch(buildUrl(path, options.params), {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(await authorizationHeader()),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (!response.ok) {
        throw await toApiError(response);
    }

    return response.json() as Promise<T>;
}

const BackendApi = {

    get<T>(path: string, params?: QueryParams): Promise<T> {
        return request<T>('GET', path, { params });
    },

    post<T>(path: string, body: unknown): Promise<T> {
        return request<T>('POST', path, { body });
    },

    patch<T>(path: string, body: unknown): Promise<T> {
        return request<T>('PATCH', path, { body });
    },

};

export default BackendApi;
