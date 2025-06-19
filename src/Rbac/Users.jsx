import { useState, useEffect } from 'react'
import { useLoadSchema, useLoadUsers, useLoadRoles } from '../Api/Api.jsx'
import List from '../CRUD/List.jsx'
import Add from '../CRUD/Add.jsx'

function Users () {
	const {
        mutate: mutateLoadSchema,
        isSuccess: isSuccessLoadSchema,
        data: dataLoadSchema,
    } = useLoadSchema()

    const {
        mutate: mutateLoadUsers,
        isSuccess: isSuccessLoadUsers,
        data: dataLoadUsers,
    } = useLoadUsers()

    const {
        mutate: mutateLoadRoles,
        isSuccess: isSuccessLoadRoles,
        data: dataLoadRoles,
    } = useLoadRoles()

    useEffect(()=>{
        mutateLoadSchema("user")
        mutateLoadUsers({limit: 10, offset: 0})
        mutateLoadRoles({limit: 1000, offset: 0})
    }, [])

    return (
        <div>
            {isSuccessLoadSchema && isSuccessLoadRoles && <Add model="users" schema={dataLoadSchema} options={{role_id: dataLoadRoles}} />}
            {isSuccessLoadUsers && <List model="users" data={dataLoadUsers} />}

        </div>
    )
}
export default Users