import { NextApiRequest, NextApiResponse } from 'next';

const bodyData = {
	grant_type: 'client_credentials',
	scope: 'data:read',
};

export const POST = async () => {
	const clientId: string = process.env.FORGE_CLIENT_ID || '';
	const clientSecret: string = process.env.FORGE_CLIENT_SECRET || '';

	const combined = `${clientId}:${clientSecret}`;
	const encoded = Buffer.from(combined).toString('base64');

	try {
		const response = await fetch('https://developer.api.autodesk.com/authentication/v2/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${encoded}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(bodyData).toString(),
		});

		const data = await response.json();

		return new Response(JSON.stringify(data.access_token), { status: 200 });
	} catch (error) {
		return new Response('Failed to retrieve token.', { status: 500 });
	}
};
