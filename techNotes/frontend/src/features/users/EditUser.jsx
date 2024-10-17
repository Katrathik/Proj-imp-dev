import { useParams } from 'react-router-dom'
import EditUsersForm from './EditUsersForm'
import { useGetUsersQuery } from './usersApiSlice'

import useTitle from '../../hooks/useTitle'

const EditUser = () => {
    useTitle('techNotes: Edit User')

    const { id } = useParams()

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    if (!user) return <p>Not Found!</p>

    const content = <EditUsersForm user={user} />

    return content
}
export default EditUser
