'use client';
import { useState, useEffect } from 'react';

const Viewer = () => {
	const [token, setToken] = useState(null);

	useEffect(() => {
		const getToken = async () => {
			const response = await fetch('/api/forge', {
				method: 'POST',
			});

			const data = await response.json();
			setToken(data);
			console.log(data);
		};
		getToken();
	}, []);

	return <div>Viewer</div>;
};

export default Viewer;
