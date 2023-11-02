import { GoToViewButton } from '@components/Buttons';

export default function Home() {
	return (
		<section className="w-full flex flex-center flex-col items-center gap-8">
			<h1 className="mt-12 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl">Next Forge Viewer</h1>
			<p>Developed with Typescript, NextJS and Tailwind CSS</p>
			<GoToViewButton />
		</section>
	);
}
