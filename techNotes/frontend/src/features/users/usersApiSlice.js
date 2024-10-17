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
                // as per docs as 200 is given even if error is true

                return response.status === 200 && !result.isError
            },

            //when, no active subs, this timer comes in and then we get loading, so remove it
            // default is 60 seconds
            // try keeping an active subscription
            // keepUnusedDataFor: 5, // whether data to be cached or requested from the server
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            // transformResponse is a function that takes the response data from the server
            // and transforms it into the state shape that we want to use in our application
            // in this case, we are taking the response data from the server and mapping it
            // to an array of objects with the id property changed from _id to id. This is
            // because the frontend expects the id property to be named id, but the
            // backend returns it as _id. So we are renaming it so that it matches the
            // frontend's expectations. Yes, we are doing this so that the id from the frontend
            // matches the one in the MongoDB database.
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    // if id is there, we return a list of tags with id's that can be invalidated, else same result but without id
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            },
            // providesTags is a function that takes the result of the query, the error, and the argument
            // and returns an array of tags that are used to cache the result of the query.
            // The tags are used to identify the result of the query, and are used to determine
            // whether the result is already cached or not. In this case, we are returning an array
            // of tags that include the type of the result (User) and the id of the result, as well
            // as a special tag with the id of 'LIST' to indicate that the result is a list of users.
            // This is so that when we fetch the list of users, we can cache the result and use
            // the cached result instead of fetching it from the server again.
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
// this is a memoized selector that returns the entire state of users
// it takes the result of the query, and returns the data property of the result
// which is a normalized state object with ids & entities

// the getSelectors method returns some pre-built selectors for us to use
// the names of the selectors are selectAll, selectById, and selectIds
// these selectors take the state as an argument, and return the corresponding
// data from the state

// for example, selectAllUsers will return an array of all users in the state
// selectUserById will return a single user by id
// selectUserIds will return an array of all user ids in the state

