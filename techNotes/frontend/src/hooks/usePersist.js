import { useState, useEffect } from "react"
// persists login on refresh
// usestate for persist data specifically

const usePersist = () => {
    // if persist not in local storage, then set it to false
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        // when persist changes, save it to local storage
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist