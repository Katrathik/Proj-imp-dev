import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const EditNote = () => {
    useTitle('techNotes: Edit Note')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            // extract note by id matching the response
            note: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            // extract all users from the api 
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!note || !users?.length) return <p>Not Found!</p>


    if (!isManager && !isAdmin) {
        // if user is trying to edit any note not assigned to him via url, no access
        if (note.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditNoteForm note={note} users={users} />

    return content
}
export default EditNote
