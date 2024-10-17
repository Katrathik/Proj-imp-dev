import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import   { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    // get token
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    // return if token
    if (token) {
        // decode token
        const decoded = jwtDecode(token)
        //desrtucture username and roles from UserInfo
        const { username, roles } = decoded.UserInfo


        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')

        // if manager and admin role included, set status to Manager or Admin
        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin" // if admin and manager, since this line is bvelow. status will be ovewridden to Admin

        // return if token
        return { username, roles, status, isManager, isAdmin }
    }

    // returned if no token
    return { username: '', roles: [], isManager, isAdmin, status }
}
export default useAuth