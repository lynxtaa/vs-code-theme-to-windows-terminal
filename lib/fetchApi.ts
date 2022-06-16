export async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
	const response = await fetch(`/api${path}`, init)
	if (!response.ok) {
		if (response.headers.get('content-type')?.includes('application/json')) {
			const { error } = await response.json()
			throw new Error(`Error requesting: ${error} (${response.status})`)
		}
		throw new Error(`Error requesting: ${response.status}`)
	}
	return response
}
