import { toast } from '@zerodevx/svelte-toast';

export const toastMessage = (content: string, type = 1) => {
	let theme = {};

	if (type === 1) {
		theme = {
			'--toastBackground': 'green',
			'--toastBarBackground': 'darkgreen',
			'--toastColor': 'white'
		};
	} else {
		theme = {
			'--toastBackground': 'red',
			'--toastBarBackground': 'darkred',
			'--toastColor': 'white'
		};
	}

	toast.push(content, { theme });
};
