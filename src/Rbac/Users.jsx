import { useEffect } from 'react'
import { useLoadSchema, useLoadUsers } from '../Api/Api.jsx'
import List from '../CRUD/List.jsx'

function Users () {
	const {
        mutate: mutateLoadSchema,
        isLoading: isLoadingLoadSchema,
        isSuccess: isSuccessLoadSchema,
        data: dataLoadSchema,
        isError: isErrorLoadSchema,
    } = useLoadSchema()

    const {
        mutate: mutateLoadUsers,
        isLoading: isLoadingLoadUsers,
        isSuccess: isSuccessLoadUsers,
        data: dataLoadUsers,
        isError: isErrorLoadUsers,
    } = useLoadUsers()

    useEffect(()=>{
        mutateLoadSchema("user")
        mutateLoadUsers({limit: 10, offset: 0})
    }, [])

    return (
        <div>
            {isLoadingLoadUsers && <div className="card">Loading users..</div>}
            {isErrorLoadUsers && <div className="card warn">Error loading users..</div>}
            {isSuccessLoadUsers && <List data={dataLoadUsers} />}
        </div>
    )
}
export default Users