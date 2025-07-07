import { useState, useEffect } from 'react'
import { Capitalize } from '../Utils/Tools.jsx'
function Read({ model, setMsg, data, deleteHook, path, postSuccessHook, handleEdit }) {

    let columns = []
    if (data.length > 0){
        for (const property in data[0]){
            columns.push(property)
        }    
    }
    const theadCols = []
    const tbodyCols = []
    for (let i=0; i < columns.length; i++){
        if (!columns[i].includes("_id")){
            tbodyCols.push(columns[i])
            let str = String(columns[i][0]).toUpperCase() + String(columns[i]).slice(1)
            theadCols.push(str.replaceAll("_", " "))
        }
    }
    const {
        mutate: mutatePost,
        isSuccess: isSuccessDelete,
        isError: isErrorDelete,
        data: dataDelete,
    } = deleteHook()

    useEffect(()=>{
        if (isSuccessDelete === true){
            setMsg({class:"suc", text: Capitalize(model)+" deleted."})
            postSuccessHook()
        }
    }, [isSuccessDelete])

    useEffect(()=>{
        if (isErrorDelete === true){
            setMsg({class:"err", text: "Unable to delete"})
        }
    }, [isErrorDelete])

    const handleDelete = (e, idx) => {
        e.preventDefault()
        mutatePost({path, data: [idx], credentials: true})
    }

    const Thead = () => {
        return (
            <thead>
                <tr>
                    {theadCols.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))}
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
        )
    }

    const Tbody = () => {
        return (
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {tbodyCols.map((col, index2)=>(
                            <td key={index2}>{(
                                typeof item[col] === 'boolean' ? (item[col] ? 'Yes' : 'No') : 
                                    typeof item[col] !== 'object' ? item[col] : 
                                        Array.isArray(item[col]) ? item[col].map(child => child.name).join(', ') : item[col].name
                            )
                            }</td>
                        ))}
                        <td><button onClick={(e) => handleEdit(e, item)}>E</button></td>
                        <td><button onClick={(e) => handleDelete(e, item.idx)}>D</button></td>
                    </tr>
                ))}
            </tbody>
        )
    }
    return (
        <div className="card">
            <h5>List {Capitalize(model)+"s."}</h5>
            <table border="1" cellPadding="10">
                <Thead />
                <Tbody />
            </table>
        </div>
    )
}

export default Read