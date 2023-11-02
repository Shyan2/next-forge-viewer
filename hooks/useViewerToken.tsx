import { useState, useEffect } from 'react';

export const useViewerToken = () => {
	const [accessToken, setAccessToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getToken = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/forge/viewer', {
					method: 'POST',
				});

				if (!response.ok) {
					throw new Error('Failed to fetch token');
				}

				const { data } = await response.json();
				setAccessToken(data.token);
			} catch (error: any) {
				setError(error.message || 'An error occurred while fetching the token');
				setAccessToken(null);
			} finally {
				setLoading(false);
			}
		};

		getToken();
	}, []);

	return { accessToken, tokenError: error, loading };
};
