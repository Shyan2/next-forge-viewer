import { useRouter } from 'next/navigation';
interface ErrorProps {
	message: string;
}

const Error = ({ message }: ErrorProps) => {
	const router = useRouter();
	const handleClick = () => {
		router.push('/');
	};

	return (
		<div className="flex items-center justify-center h-full w-full bg-gray-100">
			<div className="text-center">
				<div className="text-red-500 mb-4">
					<span role="img" aria-label="Error Icon" className="text-6xl">
						⚠️
					</span>
				</div>
				<h1 className="text-2xl mb-4 font-semibold">Oops! An error occurred.</h1>
				<p className="text-lg mb-4">{message}</p>
				<button
					className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-700"
					onClick={handleClick}
				>
					Home
				</button>
			</div>
		</div>
	);
};

export default Error;
