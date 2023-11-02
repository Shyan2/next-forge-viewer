'use client';

const Nav = () => {
	return (
		<div className="navbar bg-neutral text-neutral-content min-h-12">
			<a className="btn btn-ghost normal-case text-xl" href="/">
				Home
			</a>
			<a className="btn btn-ghost normal-case text-xl" href="/viewer">
				Viewer
			</a>
		</div>
	);
};

export default Nav;
