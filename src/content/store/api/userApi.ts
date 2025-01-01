// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { sendMessage } from 'webext-bridge/content-script';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import type { APIResponse } from '../../types/user.api.types';
import { responseParse } from '../../../utils/response-transfer';
import { requestStringify } from '../../../utils/request-transfer';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.fluentez.com/api/v1/',
        headers: {
            'Content-type': 'application/json',
        },
        async fetchFn(input, _init) {
            return responseParse(await sendMessage('fetch', await requestStringify(input as Request), 'background'));
        },
    }),
    tagTypes: ['User'],
    /**
     * TagTypes có tác dụng: Nếu call 1 api thì tất cả các api nào có cùng tagTypes sẽ bị gọi lại
     * Nên Những cái k cần thiết gọi lại thì phải tạo ra một tagTypes riêng
     */

    endpoints: (builder) => ({
        /* -------------------------------------------------------------------------- */
        /*                                    QUERY                                   */
        /* -------------------------------------------------------------------------- */
        // UserDetails
        userDetails: builder.query<APIResponse, void>({
            query: () => 'me',
            providesTags: ['User'],
        }),
    }),
});

export const { useUserDetailsQuery } = userApi;
