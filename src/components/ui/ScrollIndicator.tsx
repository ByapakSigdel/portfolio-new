import React from 'react';

export default function ScrollIndicator() {
	return (
		<div className="w-full flex justify-center mt-4">
			<div className="h-8 w-8 rounded-full animate-bounce" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--accent-medium)' }} />
		</div>
	);
}
