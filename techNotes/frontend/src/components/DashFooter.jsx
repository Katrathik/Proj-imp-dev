import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate,useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const DashFooter = () => {

    const { username, status } = useAuth()
    const navigate = useNavigate()
    const {pathname} = useLocation()

    const onGoHomeClicked = () => navigate("/dash")

    let goHomeButton = null

    // only if we are not at root page of /dash, the button will appear
    // means the button will not be seen in home page after logging in, but in all other navigated pages, the home button will appear in the footer
    if(pathname !== "/dash") {
           goHomeButton = (
               <button className="dash-footer__button icon-button" onClick={onGoHomeClicked} title="Home">
                   <FontAwesomeIcon icon={faHouse} />
               </button>

            )
        }

    const content = ( 
        <footer className="dash-footer">
            {goHomeButton}
            <p>Current User: {username}</p>
            <p>Status: {status}</p>
        </footer>
    )

    return content
}

export default DashFooter