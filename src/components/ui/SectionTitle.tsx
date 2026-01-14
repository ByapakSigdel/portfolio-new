import React from 'react';

export default function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-lg font-semibold text-[#256B2D] mb-2">
			{children}
		</h2>
	);
}
