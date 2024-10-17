import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import EditUsersForm from './EditUsersForm'

const EditUser = () => {
    const { id } = useParams()

    // pull dayta from state by selecting user by id destructured above from params
    const user = useSelector(state => selectUserById(state, id))

    // if user is not there, show loading, else show edit user form
    // reason we check for user is, we will show the prev form entries to user for editing fileds of their requirement
    const content = user ? <EditUsersForm user={user} /> : <p>Loading...</p>
    
    return content
}
export default EditUser