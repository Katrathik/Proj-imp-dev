import{
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({
    // we can iterate over id and get items here 

})

// if initialState exists in usersAdapter then we call getInitialState
const initialState = usersAdapter.getInitialState()

// take apiSlice and inject endpoints to it
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            // get all users from the server
            query: () => '/users',
            // validate status
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },

            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    // if id is there, we return a list of tags with id's that can be invalidated, else same result but without id
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            },
            
        }),
        // add new user by changing the state and also update and delete

        addNewUser: builder.mutation({
            // pass initialUserData as an argument and in body , pass the data entered in form by user
            // by spredaing it as an object to be stored for that user
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            // force the cache to update
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        // same as post method
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            // here , we invaliadte the one user in cache who is updated to store new data
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        // delete by id 
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            // same as in patch
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
    
})

//rtk auto creates a hook starting with use and ending with Query for the above defined functions in builder
export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    // built in functions which perform name like operations
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state

    // so the getSelectors will return data from state based on above functions
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)


