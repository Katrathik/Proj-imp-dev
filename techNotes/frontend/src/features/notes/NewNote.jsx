import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm' 

// NewNote needs existing data unlike users wherein we have new users

const NewNote = () => {
    // get all users from the state
    const users = useSelector(selectAllUsers)

    if(!users.length) return <p>No currently available!</p>

    // if we have users , render the noteform with users to choose form, else show loading
    const content =  <NewNoteForm users={users} /> 

    return content
}
export default NewNote