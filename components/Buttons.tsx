'use client';
import { useRouter } from 'next/navigation';

export const GoToViewButton = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push('/viewer');
	};

	return (
		<button
			className="btn rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur"
			onClick={handleClick}
		>
			Try Here
		</button>
	);
};
