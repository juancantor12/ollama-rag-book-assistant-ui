import { useState, useEffect } from 'react'
import { useLoadPermissions } from "../Api/Api.jsx"

function Permissions () {
	const [msg, setMsg] = useState('')
    const {
        mutate: mutateLoadPermissions,
        isSuccess: isSuccessLoadPermissions,
        data: dataLoadPermissions,
        isError: isErrorLoadPermissions,
    } = useLoadPermissions()

    useEffect(()=>{
        if(isErrorLoadPermissions === true){
            setMsg("There was an error loading the Permissions.")
        }
    }, [isErrorLoadPermissions])

    useEffect(()=>{
    	mutateLoadPermissions({limit: 10, offset: 0})
    }, [])

	const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="5%">Id</th>
                        <th width="80%">name</th>
                        <th width="15%">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {dataLoadPermissions.map((permission, index) => (
                    <tr key={permission.idx}>
                      <td>{permission.idx}</td>
                      <td>{permission.name}</td>
                      <td><button>Actions</button></td>
                    </tr>
                  ))}
                </tbody>
          </table>
        )
    }
    return (
        <>
        	<h4>Permissions</h4>
            {isSuccessLoadPermissions && <Table />}
            {isErrorLoadPermissions && <div className="card warn">{msg}</div>}
        </>
    )
}

export default Permissions