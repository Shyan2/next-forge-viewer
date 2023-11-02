'use client';
import { useState } from 'react';
import SearchUrn from '@components/SearchUrn';
import SearchItems from '@components/SearchItems';
import SearchBuckets from '@components/SearchBuckets';

type TabId = 'urn' | 'items' | 'buckets';

const ViewerMainPage = () => {
	const [activeTab, setActiveTab] = useState<TabId>('urn');

	const handleTabClick = (tabId: TabId) => {
		setActiveTab(tabId);
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'urn':
				return <SearchUrn />;
			case 'items':
				return <SearchItems />;
			case 'buckets':
				return <SearchBuckets />;
			default:
				return null;
		}
	};

	return (
		<>
			<div className="tabs flex justify-center pt-4 mx-auto w-full max-w-xl items-center gap-4">
				<a
					className={`tab tab-bordered ${activeTab === 'urn' ? 'tab-active' : ''}`}
					onClick={() => handleTabClick('urn')}
				>
					URN
				</a>
				<a
					className={`tab tab-bordered ${activeTab === 'items' ? 'tab-active' : ''}`}
					onClick={() => handleTabClick('items')}
				>
					Items
				</a>
				<a
					className={`tab tab-bordered ${activeTab === 'buckets' ? 'tab-active' : ''}`}
					onClick={() => handleTabClick('buckets')}
				>
					Buckets
				</a>
			</div>
			<div>{renderContent()}</div>
		</>
	);
};

export default ViewerMainPage;
