'use client';
import { usePathname } from 'next/navigation';

import Viewer from '@components/Viewer';

const ViewerPage = () => {
	// urn should actually come from the URL.
	const pathName = usePathname();
	const urn = pathName.split('/')[2];

	return (
		<div className="w-full h-screen">
			<Viewer urn={urn} />
		</div>
	);
};

export default ViewerPage;
