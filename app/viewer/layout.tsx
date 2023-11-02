import Script from 'next/script';
export default function ViewerLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* Autodesk Forge Viewer files */}
			<link
				rel="stylesheet"
				href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css"
				type="text/css"
			/>
			<Script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js" />
			{/* End Autodesk Forge Viewer files */}

			<section className="h-full w-full">{children}</section>
		</>
	);
}
