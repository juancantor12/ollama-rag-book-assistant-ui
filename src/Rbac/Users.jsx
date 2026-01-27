import { useState, useEffect } from 'react'
import { usePost, paths } from '../Api/Api.jsx'
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
    } = usePost()

    const {
        mutate: mutateLoadUsers,
        isSuccess: isSuccessLoadUsers,
        data: dataLoadUsers,
    } = usePost()

    const {
        mutate: mutateLoadRoles,
        isSuccess: isSuccessLoadRoles,
        data: dataLoadRoles,
    } = usePost()

    useEffect(()=>{
        mutateLoadSchema({path: paths.loadSchema, data: {model_name: "user"}, credentials: true})
        mutateLoadUsers({path: paths.user.read, data:{limit: 10, offset: 0}, credentials: true})
        mutateLoadRoles({path: paths.role.read, data:{limit: 1000, offset: 0}, credentials: true})
    }, [])

    const handleEdit = (e, item) => {
        e.preventDefault()
        setEditData(item)
        setDisplayEditPopup(true)
    }
    const postSuccessHook = () => {
        mutateLoadUsers({path: paths.user.read, data:{limit: 10, offset: 0}, credentials: true})
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
                            postSuccessHook={postSuccessHook}
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
                        postSuccessHook={postSuccessHook}
                    />
                }
                {isSuccessLoadUsers &&
                    <Read 
                        model="user"
                        setMsg={setMsg}
                        data={dataLoadUsers}
                        deleteHook={usePost} 
                        path={paths.user.delete}
                        postSuccessHook={postSuccessHook}
                        handleEdit={handleEdit}
                    />}

            </div>
        </>
    )
}
export default Users