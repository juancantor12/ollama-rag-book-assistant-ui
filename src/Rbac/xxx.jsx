import { useState, useEffect } from 'react'
import { useLoadUsers, useLoadRoles } from "../../Api/Api.jsx"

function Users () {
	const [msg, setMsg] = useState('')
    const {
        mutate: mutateLoadUsers,
        isSuccess: isSuccessLoadUsers,
        data: dataLoadUsers,
        isError: isErrorLoadUsers,
    } = useLoadUsers()
    
    const {
        mutate: mutateLoadRoles,
        isSuccess: isSuccessLoadRoles,
        data: dataLoadRoles,
        isError: isErrorLoadRoles,
    } = useLoadRoles()

    useEffect(()=>{
        if(isErrorLoadUsers === true){
            setMsg("There was an error loading the users.")
        }
    }, [isErrorLoadUsers])

    useEffect(()=>{
    	mutateLoadUsers({limit: 10, offset: 0})
        mutateLoadRoles({limit: 1000, offset: 0})
    }, [])

    const SaveUser = () => {
        const [formData, setFormData] = useState({
            username: '',
            role_id: '',
            password: '',
            active: true
        })
        const handleChange = (e) => {
            const { name, value } = e.target
            setFormData({
                ...formData,
                [name]: value,
            })
        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            console.log(formData)
            setFormData({ username: '', role_id: '', password: '', active: true})
        }
        return (
            <>
                <h5>Create a user</h5>
                <form onSubmit={handleSubmit} className="card">
                    <span style={{display: "grid"}}>
                        <label>Username: </label>
                        <input type="text" name="username" value={formData.usersname} onChange={handleChange} required/>
                    </span>
                    <span style={{display: "grid"}}>
                        <label>Password: </label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                    </span>
                    <span>
                        <label>Role: </label>
                        <select name="role_id" value={formData.role_id} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {isSuccessLoadRoles && (
                                dataLoadRoles.map((role, index) => (
                                    <option key={index} value={role.idx}>{role.name}</option>
                                ))
                            )}
                        </select>
                    </span>
                    <span>
                        <label>Active: </label>
                        <select name="active" value={formData.active} onChange={handleChange} required>
                            <option value={true} >Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                    </span>
                    <button type="submit">Save</button>
                </form>
            </>
        )
    }

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
            <SaveUser />
        </>
    )
}

export default Users