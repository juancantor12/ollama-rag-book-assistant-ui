import { useEffect, useRef } from 'react'
import { checkSessionApi } from "../Api/Api.jsx"
import { useNavigate   } from "react-router"

function useCheckSession ( toHomeIfError = false ) {
    const sessionChecked = useRef(false);
    let navigate = useNavigate()
    const {
        refetch,
        isError,
        isSuccess,
        data
    } = checkSessionApi()

    useEffect(() => {
        if (!sessionChecked.current) {
            refetch()
            sessionChecked.current = true
        }
    }, []);    

    useEffect(()=>{
        if (isError === true){
            localStorage.removeItem("permissions")
            localStorage.removeItem("session_expiration")
            localStorage.removeItem("username")
            if (toHomeIfError && isError) {
                navigate("/")
            }
        }
    }, [isError])

    useEffect(()=>{
        if (isSuccess === true){
            localStorage.setItem("permissions", data.permissions)
            localStorage.setItem("session_expiration", data.session_expiration)
            localStorage.setItem("username", data.username)
        }
    }, [isSuccess])

    return {refetch, isError, isSuccess, data}
}

export default useCheckSession