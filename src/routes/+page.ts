export const load = async ({ fetch }) => {
	let blockHeight: number | null = null;
	let blockError: string | null = null;

	try {
		const response = await fetch('https://mempool.space/api/blocks/tip/height');
		if (response.ok) {
			blockHeight = await response.json();
		} else {
			blockError = `API returned status ${response.status}`;
		}
	} catch (err) {
		blockError = 'Failed to fetch block height';
	}

	return { blockHeight, blockError };
};
