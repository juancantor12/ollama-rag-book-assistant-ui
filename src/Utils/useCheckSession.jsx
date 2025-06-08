import { useEffect, useRef } from 'react'
import { checkSessionApi } from "../Api/Api.jsx"
import { useNavigate   } from "react-router"

const useCheckSession = () => {
    const sessionChecked = useRef(false);
    let navigate = useNavigate()
    const {
        refetch: fetchCheckSession,
        isError: isErrorCheckSession,
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = checkSessionApi()

    useEffect(() => {
        if (!sessionChecked.current) {
            fetchCheckSession()
            sessionChecked.current = true
        }
    }, []);    

    useEffect(()=>{
        if (isErrorCheckSession === true){
            localStorage.removeItem("permissions")
            localStorage.removeItem("session_expiration")
            localStorage.removeItem("username")
            navigate("/")
        }
    }, [isErrorCheckSession])

    useEffect(()=>{
        if (isSuccessCheckSession === true){
            localStorage.setItem("permissions", dataCheckSession.permissions)
            localStorage.setItem("session_expiration", dataCheckSession.session_expiration)
            localStorage.setItem("username", dataCheckSession.username)
            navigate("/assistant")
        }
    }, [isSuccessCheckSession])
}

export default useCheckSession