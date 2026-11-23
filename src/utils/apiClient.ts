export class ApiClientError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

export async function postSeoApi<TResponse>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    code?: string;
  };

  if (!res.ok) {
    throw new ApiClientError(
      json.error || `Request failed with status ${res.status}.`,
      res.status,
      json.code
    );
  }

  return json as TResponse;
}
