'use client';
import { useEffect, useRef } from 'react';
import { useViewerToken } from '@hooks/useViewerToken';

declare const Autodesk: any;

type Viewer3D = Autodesk.Viewing.GuiViewer3D;
type ViewerEvent = Autodesk.Viewing.ViewerEvent;
type Document = Autodesk.Viewing.Document;

interface ViewerProps {
	urn: string;
	setError: (error: string | Error) => void;
}

const Viewer = ({ urn, setError }: ViewerProps) => {
	const { accessToken, tokenError, loading } = useViewerToken();
	console.log(accessToken);

	const viewerRef = useRef<Viewer3D | null>(null);
	const viewerDomRef = useRef<HTMLDivElement | null>(null);

	const onModelLoaded = (event: ViewerEvent) => {
		const viewer = viewerRef.current as Viewer3D;

		// clean up events
		viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onModelLoaded);

		//
	};

	const initializeViewer = () => {
		const viewerOptions = {
			accessToken: accessToken,
			env: 'AutodeskProduction2',
			api: 'streamingV2',
		};

		Autodesk.Viewing.Initializer(viewerOptions, () => {
			const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDomRef.current);

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
		});
	};

	const loadModel = (viewer: Viewer3D, documentId: string) => {
		const onDocumentLoadSuccess = (viewerDocument: Document) => {
			const defaultModel = viewerDocument.getRoot().getDefaultGeometry();

			viewer.loadDocumentNode(viewerDocument, defaultModel, {
				keepCurrentModels: true,
			});
		};

		const onDocumentLoadFailure = (error: any) => {
			const errorMessage = 'Failed fetching Forge manifest';
			console.error(errorMessage);
			setError(error.message || errorMessage);
		};

		if (documentId) {
			Autodesk.Viewing.Document.load(`urn:${documentId}`, onDocumentLoadSuccess, onDocumentLoadFailure);
		}
	};

	useEffect(() => {
		if (typeof Autodesk !== 'undefined' && urn && accessToken && window) {
			initializeViewer();
		}

		const cleanUpViewer = () => {
			if (viewerRef.current && (viewerRef.current as Viewer3D).finish) {
				(viewerRef.current as Viewer3D).finish();
			}
		};

		return cleanUpViewer;
	}, [accessToken, urn]);

	if (loading) return <div>Loading...</div>;
	if (tokenError) return <div>Error with Token: {tokenError}</div>;

	return <div ref={viewerDomRef} className="h-full w-full relative"></div>;
};

export default Viewer;
