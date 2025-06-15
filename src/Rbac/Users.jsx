import { useState, useEffect } from 'react'
import { useLoadUsers } from "../Api/Api.jsx"

function Users () {
	const [msg, setMsg] = useState('')
    const {
        mutate: mutateLoadUsers,
        isSuccess: isSuccessLoadUsers,
        data: dataLoadUsers,
        isError: isErrorLoadUsers,
    } = useLoadUsers()

    useEffect(()=>{
        if(isErrorLoadUsers === true){
            setMsg("There was an error loading the users.")
        }
    }, [isErrorLoadUsers])

    useEffect(()=>{
    	mutateLoadUsers({limit: 10, offset: 0})
    }, [])

	const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="5%">ID</th>
                        <th width="60%">User</th>
                        <th width="15%">Role</th>
                        <th width="5%">Active</th>
                        <th width="15%">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dataLoadUsers.map((user, index) => (
                        <tr key={user.idx}>
                            <td>{user.idx}</td>
                            <td>{user.username}</td>
                            <td>{user.role.name}</td>
                            <td>{user.active ? "✓" : "X"}</td>
                            <td><button>Actions</button></td>
                    </tr>
                  ))}
                </tbody>
          </table>
        )
    }
    return (
        <>
            <h4>Users</h4>
            {isSuccessLoadUsers && <Table />}
            {isErrorLoadUsers && <div className="card warn">{msg}</div>}
        </>
    )
}

export default Users