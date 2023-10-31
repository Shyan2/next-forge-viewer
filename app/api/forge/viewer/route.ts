const API_ENDPOINT = 'https://developer.api.autodesk.com/authentication/v2/token';

const bodyData = {
	grant_type: 'client_credentials',
	scope: 'data:read',
};

type CachedToken = {
	token: string;
	expiry: number;
};

let cachedToken: CachedToken | null = null;

export const POST = async () => {
	const clientId: string = process.env.FORGE_CLIENT_ID || '';
	const clientSecret: string = process.env.FORGE_CLIENT_SECRET || '';

	if (!clientId || !clientSecret) {
		console.log('Missing environmental variables.');
		return new Response(JSON.stringify({ success: false, error: 'Missing environment variables.' }), { status: 500 });
	}

	const now = Date.now();

	if (cachedToken && cachedToken.expiry > now) {
		return new Response(JSON.stringify({ success: true, data: { token: cachedToken.token } }), { status: 200 });
	}
	const combined = `${clientId}:${clientSecret}`;
	const encoded = Buffer.from(combined).toString('base64');

	try {
		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${encoded}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(bodyData).toString(),
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({ success: false, error: `Failed to retrieve token. ${response.statusText}` }),
				{ status: response.status },
			);
		}

		const data = await response.json();

		cachedToken = {
			token: data.access_token,
			expiry: now + data.expires_in * 1000 - 5000, // 5 seconds buffer
		};

		return new Response(JSON.stringify({ success: true, data: { token: data.access_token } }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: 'Failed to retrieve token due to an exception.' }), {
			status: 500,
		});
	}
};
