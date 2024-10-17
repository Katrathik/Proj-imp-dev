import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// helps even to retain state including pre-filling on refresh maintaing consistency
const Prefetch = () => {
    // run only when component mounts
    useEffect(() => {
        console.log('subscribing')
        // create a subscription manually for users and notes that will be active and will not expire in 5 seconds or 60 secs 
        // initiate() creates a subs for the endpoints mentioned
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        // unsubscribe on leaving the protected pages
        return () => {
            console.log('unsubscribing')
            // unsubscribe from the endpoints 
            // happens when we go to public pages
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    // wrap all pages in this component
    return <Outlet />
}
export default Prefetch