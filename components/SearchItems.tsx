'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchItems = () => {
	const router = useRouter();

	const [projectId, setProjectId] = useState<string>('');
	const [itemId, setItemId] = useState<string>('');

	const handleProjectIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProjectId(event.target.value);
	};

	const handleItemIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setItemId(event.target.value);
	};

	const fetchFileUrn = async () => {
		console.log(projectId, itemId);
		try {
			const response = await fetch(`/api/forge/projects/${projectId}/items/${itemId}`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const data = await response.json();
			// Do something with the data
			console.log(data); // for demonstration purposes
			// If you need to redirect after fetching the data:
			// router.push(`/viewer/${projectId}/${itemId}`);
			return data.urn;
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Here you can perform the API call
		const targetUrn = await fetchFileUrn();
		router.push(`/viewer/${targetUrn}`);
	};

	return (
		<section className="pt-16 mx-auto w-full max-w-xl flex flex-col items-center gap-4">
			<p className="text-sm font-light">View items based on project and itemId</p>
			<form className="flex flex-col w-full items-center gap-4" onSubmit={handleSubmit}>
				<div className="w-full flex gap-2">
					<input
						className="block w-full rounded-md border border-gray-200 bg-white py-2.5 px-5 text-sm shadow-lg focus:border-black focus:outline-none focus:ring-0"
						type="text"
						placeholder="Input project ID"
						value={projectId}
						onChange={handleProjectIdChange}
						required
					/>
					<input
						className="block w-full rounded-md border border-gray-200 bg-white py-2.5 px-5 text-sm shadow-lg focus:border-black focus:outline-none focus:ring-0"
						type="text"
						placeholder="Input item ID"
						value={itemId}
						onChange={handleItemIdChange}
						required
					/>
				</div>
				<div>
					<button
						className="btn rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur"
						type="submit"
					>
						View
					</button>
				</div>
			</form>
		</section>
	);
};

export default SearchItems;
