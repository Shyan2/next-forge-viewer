import type { Metadata } from 'next';
import './globals.css';
import Nav from '@components/Nav';

export const metadata: Metadata = {
	title: 'Forge Viewer',
	description: 'Forge Viewer by Autodesk using NextJS',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body>
				<main className="h-screen w-screen grid grid-rows-[auto,1fr]">
					<Nav /> {/* This takes up the amount of space it needs */}
					<div className="overflow-auto">
						{children} {/* This fills the rest and scrolls if needed */}
					</div>
				</main>
			</body>
		</html>
	);
};

export default RootLayout;
