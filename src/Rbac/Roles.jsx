import { useState, useEffect } from 'react'
import { useLoadRoles } from "../Api/Api.jsx"

function Roles () {
	const [msg, setMsg] = useState('')
    const {
        mutate: mutateLoadRoles,
        isSuccess: isSuccessLoadRoles,
        data: dataLoadRoles,
        isError: isErrorLoadRoles,
    } = useLoadRoles()

    useEffect(()=>{
        if(isErrorLoadRoles === true){
            setMsg("There was an error loading the Roles.")
        }
    }, [isErrorLoadRoles])

    useEffect(()=>{
    	mutateLoadRoles({limit: 10, offset: 0})
    }, [])

	const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="5%">Id</th>
                        <th width="65%">Role</th>
                        <th width="15%">Permissions</th>
                        <th width="15%">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {dataLoadRoles.map((role, index) => (
                    <tr key={role.idx}>
                      <td>{role.idx}</td>
                      <td>{role.name}</td>
                      <td>{role.permissions.map(
                      		permission => permission.name
                      	).join(", ")}</td>
                      <td><button>Actions</button></td>
                    </tr>
                  ))}
                </tbody>
          </table>
        )
    }
    return (
        <>
        	<h4>Roles</h4>
            {isSuccessLoadRoles && <Table />}
            {isErrorLoadRoles && <div className="card warn">{msg}</div>}
        </>
    )
}

export default Roles