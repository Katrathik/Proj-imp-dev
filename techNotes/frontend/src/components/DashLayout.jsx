// this is shown after a user has logged in (this page is a part of dash)
import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"
const DashLayout = () => {
  return (
    <>
    {/* DashHeader is above every page on the protected part of the site */}
        <DashHeader />
        <div className="dash-container">
            <Outlet />
        </div>
        <DashFooter />
    </>
  )
}

export default DashLayout