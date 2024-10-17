import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNoteById } from './notesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditNoteForm from './EditNoteForm'

const EditNote = () => {
    const { id } = useParams()

    // select note by id and get all users
    const note = useSelector(state => selectNoteById(state, id))
    const users = useSelector(selectAllUsers)

    // if we have note and users , render the noteform with users to choose form, else show loading
    const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    return content
}
export default EditNote