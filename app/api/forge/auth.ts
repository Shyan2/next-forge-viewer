const API_ENDPOINT = 'https://developer.api.autodesk.com/authentication/v2/token';

const bodyData = {
	grant_type: 'client_credentials',
	scope: 'data:read',
};

interface TokenData {
	access_token: string;
	expires_in: number;
	// add more properties of the token data as needed
}

interface Cache {
	[key: string]: TokenData;
}

const fetchTokenFromServer = async (scope: string[]) => {
	const scope_string = scope.join(' '); // Joins all array elements into a single string separated by spaces
	console.log(scope_string);
	const clientId: string = process.env.FORGE_CLIENT_ID || '';
	const clientSecret: string = process.env.FORGE_CLIENT_SECRET || '';

	if (!clientId || !clientSecret) {
		console.log('Missing environmental variables.');
		return new Response(JSON.stringify({ success: false, error: 'Missing environment variables.' }), { status: 500 });
	}

	const combined = `${clientId}:${clientSecret}`;
	const encoded = Buffer.from(combined).toString('base64');

	const response = await fetch(API_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encoded}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'data:read' }).toString(),
	});

	const data = await response.json();

	return data;
};

let cache: Cache = {};
const getToken = async (scope: string[]) => {
	const key = scope.join('+');
	if (cache[key]) {
		return cache[key];
	}

	// let token = { access_token: 'hello', expires_in: 5 };
	let token = await fetchTokenFromServer(scope);

	cache[key] = token;

	setTimeout(() => {
		delete cache[key];
	}, token.expires_in * 1000);

	return token;
};

export const getInternalToken = () => {
	return getToken(['bucket:create', 'bucket:read', 'data:read']);
};
