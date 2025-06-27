import { useState, useEffect } from 'react'
import { usePost, paths } from '../Api/Api.jsx'
import Create from '../CRUD/Create.jsx'
import Read from '../CRUD/Read.jsx'
import Update from '../CRUD/Update.jsx'

function Roles () {
    const [msg, setMsg] = useState({class: "", text: ""})
    const [displayEditPopUp, setDisplayEditPopup] = useState(false)
    const [editData, setEditData] = useState({})
    const {
        mutate: mutateLoadSchema,
        isSuccess: isSuccessLoadSchema,
        data: dataLoadSchema,
    } = usePost()

    const {
        mutate: mutateLoadRoles,
        isSuccess: isSuccessLoadRoles,
        data: dataLoadRoles,
    } = usePost()

    const {
        mutate: mutateLoadPermissions,
        isSuccess: isSuccessLoadPermissions,
        data: dataLoadPermissions,
    } = usePost()

    useEffect(()=>{
        mutateLoadSchema({path: paths.loadSchema, data: {model_name: "role"}})
        mutateLoadRoles({path: paths.role.read, data:{limit: 10, offset: 0}})
        mutateLoadPermissions({path: paths.permission.read, data:{limit: 1000, offset: 0}})
    }, [])

    const handleEdit = (e, item) => {
        e.preventDefault()
        setEditData(item)
        setDisplayEditPopup(true)
    }
    const postSuccessHook = () => {
        mutateLoadRoles({path: paths.role.read, data:{limit: 10, offset: 0}})
    }
    return (
        <>
            {
                displayEditPopUp &&
                isSuccessLoadPermissions &&
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <Update 
                                model="role"
                                setMsg={setMsg}
                                schema={dataLoadSchema}
                                data={editData}
                                options={{permissions: dataLoadPermissions}} 
                                updateHook={usePost}
                                path={paths.role.update}
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
                    isSuccessLoadPermissions &&
                        <Create 
                            model="role"
                            setMsg={setMsg}
                            schema={dataLoadSchema}
                            options={{permissions: dataLoadPermissions}} 
                            saveHook={usePost}
                            path={paths.role.create}
                            postSuccessHook={postSuccessHook}
                        />
                }
                {isSuccessLoadRoles &&
                    <Read 
                        model="role"
                        setMsg={setMsg}
                        data={dataLoadRoles}
                        deleteHook={usePost} 
                        path={paths.role.delete}
                        postSuccessHook={postSuccessHook}
                        handleEdit={handleEdit}
                    />}

            </div>
        </>
    )
}
export default Roles