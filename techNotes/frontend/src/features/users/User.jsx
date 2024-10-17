import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import { useSelector } from "react-redux"
import { selectUserById } from "./usersApiSlice"



const User = ({userId}) => {
    // get user by id by passing state and id
    const user = useSelector(state => selectUserById(state, userId))
  
    const navigate = useNavigate()
    
    if(user){
        // if clicked on edit,edit user by id by moving to edit page via navigate()
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        //format roles by , and space
        const userRolesString = user.roles.toString().replaceAll(",", ", ")

        // so that active users appear with green background and inactive appear with red in the table
        const cellStatus = user.active ? "Active" : "Inactive"

        return(
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null

    
}

export default User