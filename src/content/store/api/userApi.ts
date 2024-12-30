// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIResponse } from '../../types/user.api.types';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.fluentez.com/api/v1/`,
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',
    }),
    tagTypes: ['User', 'Follow', 'Search'],
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
