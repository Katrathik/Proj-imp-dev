import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
// the above thing is auto created by rtk query on defining getUsers endpoint
// and it adds a lot of functionalities too to it which are destructured below
const UsersList = () => {

    const{
        data:users,
        isLoading,
        isSuccess,
        isError,
        error
    }= useGetUsersQuery('usersList',{
        // every min data is requried
        pollingInterval: 60000, // 60 secs
        refetchOnFocus: true, // if we focus on other window and ocme back,refetch data
        refetchOnMountOrArgChange: true // refetch on remounting the component
    })


    let content

    // set content to loading if yes
    if(isLoading) content = <p>Loading...</p>


    // if error is there , show the error
    if(isError) {
        content = <p className="errmsg">{error?.data?.message}</p>

    }
    // if success 
    if (isSuccess) {
        // destructure id from users data
        const { ids } = users

        // if ids is there
        // map over ids and for each id we are returning the user component
        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />)
            

        content = (
            // table with css classes in index.css
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Username</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default UsersList