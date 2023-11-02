import { useState, useEffect } from 'react';

export const useViewerToken = () => {
	const [accessToken, setAccessToken] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	console.log('fetching token!');
	useEffect(() => {
		const getToken = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/forge/viewer', {
					method: 'POST',
				});

				console.log(response);

				if (!response.ok) {
					throw new Error('Failed to fetch token');
				}
				const { data } = await response.json();
				setAccessToken(data.token);
			} catch (error: unknown) {
				const message = (error as Error).message || 'An error occurred while fetching the token';
				setError(message);
				setAccessToken('');
			} finally {
				setLoading(false);
			}
		};

		getToken();
	}, []);

	return { accessToken, tokenError: error, loading };
};
