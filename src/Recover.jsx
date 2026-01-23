import { useEffect, useState } from 'react'
import { NavLink } from "react-router"
import Header from './Utils/Header.jsx'
import { usePost, paths } from "./Api/Api.jsx"

const base = import.meta.env.VITE_ENV === "local" ? "" : "/"+import.meta.env.VITE_REPO

function Recover() {
    const { mutate: mutateRecover, isSuccess, error } = usePost()
    const [username, setUsername] = useState("")
    const [recoveryCode, setRecoveryCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (isSuccess) {
            setMessage("Password updated. You can log in now.")
        }
    }, [isSuccess])

    useEffect(() => {
        if (error) {
            if (error === 401) {
                setMessage("Invalid or expired recovery code.")
            } else if (error === 403) {
                setMessage("User is not an admin.")
            } else if (error === 404) {
                setMessage("User not found.")
            } else if (error === 500) {
                setMessage("Recovery table missing. Create DB tables first.")
            } else {
                setMessage("Recovery failed.")
            }
        }
    }, [error])

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessage("")
        mutateRecover({
            path: paths.recoverAdmin,
            data: {
                username,
                new_password: newPassword,
                recovery_code: recoveryCode
            }
        })
    }

    return (
        <>
            <Header />
            <form onSubmit={handleSubmit} className="card">
                <h3>Admin recovery</h3>
                <label>Username:<br />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /></label>
                <br />
                <label>Recovery code:<br />
                <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                /></label>
                <br />
                <label>New password:<br />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                /></label>
                <br />
                <button type="submit">Reset password</button>
                <br />
                <div className="card disclaimer">
                    The recovery code is printed in the server terminal on startup.
                </div>
                {message && <div className="card war">{message}</div>}
                <NavLink to={base+"/"}>Back to login</NavLink>
            </form>
        </>
    )
}

export default Recover
