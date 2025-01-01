
import { requestParse } from '../utils/request-transfer';
import { responseStringify } from '../utils/response-transfer';
import { onMessage } from 'webext-bridge/background';

onMessage('fetch', async ({ data }) => {
    return responseStringify(await fetch(await requestParse(data as string)))
});
