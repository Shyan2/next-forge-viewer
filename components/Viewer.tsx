'use client';
import { useState, useEffect } from 'react';

interface ViewerProps {
	urn: string;
}

const Viewer: React.FC<ViewerProps> = ({ urn }) => {
	// urn should actually come from the URL.
	const [token, setToken] = useState(null);
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

				setToken(data.token);
			} catch (error: any) {
				setError(error.message || 'An unknown error occurred.');
			} finally {
				setLoading(false);
			}
		};
		getToken();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return <div>Viewer with Token: {token}</div>; // Display or use token as needed
};

export default Viewer;
