import { getInternalToken } from '@app/api/forge/auth';
interface Params {
	projectId: string;
	itemId: string;
}

export const GET = async (req: any, { params }: { params: Params }) => {
	console.log(params);
	const token = await getInternalToken();
	console.log(token);
	try {
		const response = await fetch(
			`https://developer.api.autodesk.com/data/v1/projects/${params.projectId}/items/${params.itemId}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token.access_token}`,
				},
			},
		);

		// console.log(response);

		const data = await response.json();
		// console.log(data);
		const urn = data.included[0].relationships.derivatives.data.id;
		return new Response(JSON.stringify({ success: true, urn }), { status: 200 });
	} catch (error: unknown) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, error }), { status: 500 });
	}
};
