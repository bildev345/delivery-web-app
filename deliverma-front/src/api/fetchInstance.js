
const BASE_URL = 'http://localhost:8080/api/v1';


async function request(method, endpoint, body = null, options = {}) {
    const headers = {
        ...(body && {'Content-Type' : 'application/json'}),
        ...options.headers
    };
    const config = {
        method,
        credentials : 'include',
        headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle 204 No Content (logout)
    if (response.status === 204) return null;

    // Handle 401 globally — redirect to login
    if (response.status === 401) {
        window.location.href = '/login';
        return;
    }

    // Parse JSON body
    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    // Throw on 4xx / 5xx with the parsed error body
    if (!response.ok) {
        const error = new Error(data?.message || 'Erreur serveur');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const api = {
    get: (endpoint, options) => request('GET', endpoint, null, options),
    post: (endpoint, body, options) => request('POST', endpoint, body, options),
    put: (endpoint, body, options) => request('PUT', endpoint, body, options),
    patch: (endpoint, body, options) => request('PATCH', endpoint, body, options),
    delete: (endpoint, options) => request('DELETE', endpoint, null, options),
};