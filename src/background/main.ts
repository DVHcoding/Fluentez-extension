import { onMessage } from 'webext-bridge/background';
import { requestParse } from '../utils/request-transfer';
import { responseStringify } from '../utils/response-transfer';

onMessage('fetch', async ({ data }) => {
    try {
        return await responseStringify(await fetch(await requestParse(data as string)));
    } catch (err) {
        console.error(err);
        throw err;
    }
});
