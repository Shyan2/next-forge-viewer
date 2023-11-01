'use client';
import { useState, useEffect, useRef } from 'react';

declare const Autodesk: any;

interface ViewerProps {
	urn: string;
}

interface GeometryLoadedEvent {
	[key: string]: any; // This allows any string key with any value.
}

const Viewer: React.FC<ViewerProps> = ({ urn }) => {
	const [accessToken, setAccessToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
			setError(error.message || 'An unknown error occurred.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getToken();
	}, []);

	useEffect(() => {
		if (urn && window) {
			initializeViewer();
		}

		return function cleanUp() {
			if (viewerRef.current && (viewerRef.current as any).finish) {
				(viewerRef.current as any).finish();
			}
		};
	}, [accessToken, urn]);

	const viewerRef = useRef(null);
	const viewerDomRef = useRef(null);

	const onModelLoaded = (event: GeometryLoadedEvent) => {
		const viewer = viewerRef.current as any;

		viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);
	};

	const initializeViewer = () => {
		if (!accessToken) {
			console.warn('Access token not available yet. Viewer not initialized.');
			return;
		}

		const viewerOptions = {
			accessToken: accessToken,
			env: 'AutodeskProduction2',
			api: 'streamingV2',
		};

		Autodesk.Viewing.Initializer(viewerOptions, async () => {
			const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDomRef.current, {
				extensions: ['Autodesk.DocumentBrowser'],
			});

			viewerRef.current = viewer;

			const startedCode = viewer.start(undefined, undefined, undefined, undefined, viewerOptions);
			if (startedCode > 0) {
				console.error('Failed to create a Viewer: WebGL not supported.');
				return;
			}

			viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded, {
				once: true,
			});

			loadModel(viewer, urn);

			// if (props?.onViewerInitialized) {
			// 	props.onViewerInitialized(viewer);
			// }
		});
	};

	const loadModel = (viewer: any, documentId: String) => {
		const onDocumentLoadSuccess = (viewerDocument: any) => {
			const defaultModel = viewerDocument.getRoot().getDefaultGeometry();

			viewer.loadDocumentNode(viewerDocument, defaultModel, {
				keepCurrentModels: true,
			});
		};

		const onDocumentLoadFailure = (error: any) => {
			console.error('Failed fetching Forge manifest');
			setError(error.message || 'An unknown error occurred.');
		};

		if (documentId) {
			Autodesk.Viewing.Document.load(`urn:${documentId}`, onDocumentLoadSuccess, onDocumentLoadFailure);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return <div ref={viewerDomRef} className="h-full w-full relative"></div>;
};

export default Viewer;
