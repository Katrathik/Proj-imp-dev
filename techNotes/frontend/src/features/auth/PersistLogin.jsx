
// help us remian logged in even on refresh
import { Outlet, Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"



const PersistLogin = () => {


    const [persist] = usePersist()
    // get the token from the current state for access
    const token = useSelector(selectCurrentToken)
    console.log(token)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()



    useEffect(() => {
        if (!token && persist) {
          const verifyRefreshToken = async () => {
            console.log('verifying refresh token')
            try {
              await refresh()
              setTrueSuccess(true) // give time to confirm credentials are set
            } catch (err) {
              console.error(err)
            }
          }
          verifyRefreshToken()
        }
      }, [token, persist, refresh])

        


    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet /> // shows login on refresh
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        // isUninitialized means uninit refresh mutation
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default PersistLogin