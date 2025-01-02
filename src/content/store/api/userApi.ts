// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { sendMessage } from 'webext-bridge/content-script';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import type { APIResponse, IGetVocabulariesByUserIdResponse, IUpdateQuickVocabularyPayload } from '../../types/user.api.types';
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
            try {
                return await responseParse(await sendMessage('fetch', await requestStringify(input as Request), 'background'));
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    }),
    tagTypes: ['User', 'Vocabularies'],
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
        getVocabulariesByUserId: builder.query<IGetVocabulariesByUserIdResponse, { page: number; limit: number }>({
            query: ({ page, limit }) => `vocabularies?page=${page}&limit=${limit}`,
            providesTags: ['Vocabularies'],
        }),

        /* -------------------------------------------------------------------------- */
        /*                                  MUTATION                                  */
        /* -------------------------------------------------------------------------- */
        updateQuickVocabulary: builder.mutation<APIResponse, IUpdateQuickVocabularyPayload>({
            query: (payload) => ({
                url: `vocabulary/quick/${payload.vocabularyId}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['Vocabularies', 'Vocabularies'],
        }),
    }),
});

export const { useUserDetailsQuery, useGetVocabulariesByUserIdQuery, useUpdateQuickVocabularyMutation } = userApi;
