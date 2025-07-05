import { useState, useEffect } from 'react'
import { usePost, paths } from '../Api/Api.jsx'
import Create from '../CRUD/Create.jsx'
import Read from '../CRUD/Read.jsx'
import Update from '../CRUD/Update.jsx'

function Permissions () {
    const [msg, setMsg] = useState({class: "", text: ""})
    const [displayEditPopUp, setDisplayEditPopup] = useState(false)
    const [editData, setEditData] = useState({})
    const {
        mutate: mutateLoadSchema,
        isSuccess: isSuccessLoadSchema,
        data: dataLoadSchema,
    } = usePost()

    const {
        mutate: mutateLoadPermissions,
        isSuccess: isSuccessLoadPermissions,
        data: dataLoadPermissions,
    } = usePost()

    useEffect(()=>{
        mutateLoadSchema({path: paths.loadSchema, data: {model_name: "permission"}, credentials: true})
        mutateLoadPermissions({path: paths.permission.read, data:{limit: 10, offset: 0}, credentials: true})
    }, [])

    const handleEdit = (e, item) => {
        e.preventDefault()
        setEditData(item)
        setDisplayEditPopup(true)
    }
    const postSuccessHook = () => {
        mutateLoadPermissions({path: paths.permission.read, data:{limit: 10, offset: 0}})
    }
    return (
        <>
            {displayEditPopUp &&
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Update 
                            model="permission"
                            setMsg={setMsg}
                            schema={dataLoadSchema}
                            data={editData}
                            options={null} 
                            updateHook={usePost}
                            path={paths.permission.update}
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
                    <Create 
                        model="permission"
                        setMsg={setMsg}
                        schema={dataLoadSchema}
                        options={null} 
                        saveHook={usePost}
                        path={paths.permission.create}
                        postSuccessHook={postSuccessHook}
                    />
                }
                {isSuccessLoadPermissions &&
                    <Read 
                        model="permission"
                        setMsg={setMsg}
                        data={dataLoadPermissions}
                        deleteHook={usePost} 
                        path={paths.permission.delete}
                        postSuccessHook={postSuccessHook}
                        handleEdit={handleEdit}
                    />}

            </div>
        </>
    )
}
export default Permissions