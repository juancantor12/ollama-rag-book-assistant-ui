import { useState, useEffect } from 'react'
import { useLoadSchema, useLoadUsers, useLoadRoles, usePost, paths } from '../Api/Api.jsx'
import Create from '../CRUD/Create.jsx'
import Read from '../CRUD/Read.jsx'
import Update from '../CRUD/Update.jsx'

function Users () {
    const [msg, setMsg] = useState({class: "", text: ""})
    const [displayEditPopUp, setDisplayEditPopup] = useState(false)
    const [editData, setEditData] = useState({})
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
    const handleEdit = (e, item) => {
        e.preventDefault()
        setEditData(item)
        setDisplayEditPopup(true)
    }
    return (
        <>
            {displayEditPopUp &&
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Update 
                            model="user"
                            setMsg={setMsg}
                            schema={dataLoadSchema}
                            data={editData}
                            options={{role_id: dataLoadRoles}} 
                            updateHook={usePost}
                            path={paths.user.update}
                            postSuccessHook={mutateLoadUsers}
                            postSuccessHookParams={{limit: 10, offset: 0}}
                            setDisplayEditPopup={setDisplayEditPopup}
                        />
                    </div>
                </div>
            }
            <div>
                {(msg.text !== "") && <div className={"card "+msg.class}>{msg.text}</div>}
                {    
                    isSuccessLoadSchema &&
                    isSuccessLoadRoles &&
                    <Create 
                        model="user"
                        setMsg={setMsg}
                        schema={dataLoadSchema}
                        options={{role_id: dataLoadRoles}} 
                        saveHook={usePost}
                        path={paths.user.create}
                        postSuccessHook={mutateLoadUsers}
                        postSuccessHookParams={{limit: 10, offset: 0}}
                    />
                }
                {isSuccessLoadUsers &&
                    <Read 
                        model="user"
                        setMsg={setMsg}
                        data={dataLoadUsers}
                        deletex={{
                            hook: usePost, 
                            postDelete: mutateLoadUsers,
                            postDeleteParams: {limit: 10, offset: 0},
                            path: paths.user.delete
                        }}
                        handleEdit={handleEdit}
                    />}

            </div>
        </>
    )
}
export default Users