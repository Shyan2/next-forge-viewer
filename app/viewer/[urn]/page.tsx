'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Viewer from '@components/Viewer';
import Error from '@components/Error';

const ViewerPage = () => {
	const [error, setError] = useState<string | null>(null);
	const pathName = usePathname();
	const urn = pathName.split('/')[2];

	const handleError = (error: string | Error) => {
		setError(error.toString());
	};

	return (
		<div className="w-full h-full">
			{!error ? <Viewer urn={urn} setError={handleError} /> : <Error message={error} />}
		</div>
	);
};

export default ViewerPage;
