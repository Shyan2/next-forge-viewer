'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = () => {
	const [searchText, setSearchText] = useState<string>('');
	const router = useRouter();

	const handleSearchChange = (event: any) => {
		setSearchText(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		router.push(`/viewer/${encodeURIComponent(searchText)}`);
	};

	return (
		<section className="pt-16 mx-auto w-full max-w-xl flex flex-col items-center gap-4">
			<p className="text-sm font-light">View items based on their URN</p>
			<form className="flex flex-col items-center gap-4  w-full" onSubmit={handleSubmit}>
				<input
					className="block w-full rounded-md border border-gray-200 bg-white py-2.5 px-5 text-sm shadow-lg focus:border-black focus:outline-none focus:ring-0"
					type="text"
					placeholder="Input URN"
					value={searchText}
					onChange={handleSearchChange}
					required
				/>
				<button
					className="btn rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur"
					type="submit"
				>
					View
				</button>
			</form>
		</section>
	);
};

export default Search;
