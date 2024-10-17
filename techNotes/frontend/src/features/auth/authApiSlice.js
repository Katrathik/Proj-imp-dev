import { apiSlice } from '../../app/api/apiSlice'
import { logOut } from './authSlice'
import { setCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: {
                    
                    ...credentials},
            }),
            invalidatesTags: ['User']
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data} =await queryFulfilled
                    console.log(data)
                    dispatch(logOut()) // token = null

                    // solves the requests fetch after logout issue
                    setTimeout(() => { 
                        // give 1s to logout to by realizing that user and notes comp have unmounted
                        dispatch(apiSlice.util.resetApiState()) // reset api state which clears cache
                    },200)
                } catch (err) {
                    console.log(err)
                }
            },
            
        }),
        // now any time we do refresh mutation, it sets cred with accessToken
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data} =await queryFulfilled
                    console.log(data) // access token
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            },
            
        }),
})})

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice