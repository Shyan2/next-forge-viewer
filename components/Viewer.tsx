'use client';
import { useState, useEffect, useRef } from 'react';
import { useViewerToken } from '@hooks/useViewerToken'; // Adjust the path to where you've saved the hook

declare const Autodesk: any;

interface GeometryLoadedEvent {
	[key: string]: any; // This allows any string key with any value.
}

interface ViewerProps {
	urn: string;
	setError: (error: string | Error) => void;
}

const Viewer = ({ urn, setError }: ViewerProps) => {
	const { accessToken, tokenError, loading } = useViewerToken();

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
		});
	};

	const loadModel = (viewer: any, documentId: String) => {
		const onDocumentLoadSuccess = (viewerDocument: any) => {
			const defaultModel = viewerDocument.getRoot().getDefaultGeometry();
			console.log(viewerDocument.getRoot());

			viewer.loadDocumentNode(viewerDocument, defaultModel, {
				keepCurrentModels: true,
			});
		};

		const onDocumentLoadFailure = (error: any) => {
			console.error('Failed fetching Forge manifest');
			setError(error.message || 'Failed fetching Forge manifest. Please try a different urn.');
		};

		if (documentId) {
			Autodesk.Viewing.Document.load(`urn:${documentId}`, onDocumentLoadSuccess, onDocumentLoadFailure);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (tokenError) return <div>Error with Token: {tokenError}</div>;

	return <div ref={viewerDomRef} className="h-full w-full relative"></div>;
};

export default Viewer;
