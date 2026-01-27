import { useState, useEffect } from 'react'
import { Capitalize } from '../Utils/Tools.jsx'

function Update({ 
    model,
    setMsg,
    schema,
    data,
    options,
    updateHook,
    path,
    postSuccessHook,
    setDisplayEditPopup
}){
    const {
        mutate: mutatePost,
        isSuccess: isSuccessPost,
        isError: isErrorPost,
        data: dataPost,
    } = updateHook()

    const initialForm = schema.reduce((accumulator, column)=>{
        if (column.type === "RELATIONSHIP" && column.direction === "MANYTOMANY" && options !== null) {
            accumulator[column.name] = data[column.name].map((option) => (option.idx.toString()))
        } else {
            accumulator[column.name] = (data[column.name] === undefined) ? '' : data[column.name] 
        }
        return accumulator
    }, {})

    const emptyForm = schema.reduce((accumulator, column)=>{
        accumulator[column.name] = column.type === 'BOOLEAN' ? false : ''
        return accumulator
    }, {})

    const [formData, setFormData] = useState(initialForm)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        mutatePost({path, data: [formData], credentials: true})
    }

    const handleCancel = (e) => {
        e.preventDefault()
        setDisplayEditPopup(false)
        setFormData(emptyForm)
    }
    
    useEffect(()=>{
        if (isSuccessPost === true){
            setDisplayEditPopup(false)
            setMsg({class:"suc", text: Capitalize(model)+" updated."})
            postSuccessHook()
        }
    }, [isSuccessPost])

    useEffect(()=>{
        if (isErrorPost === true){
            setDisplayEditPopup(false)
            setMsg({class:"err", text: "Unable to update."})
        }
    }, [isErrorPost])

    const handleChange = (e) => {
            const { name, type, checked, value } = e.target
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            })
        }
    const inputTypes = {
        VARCHAR: "text", BOOLEAN: "checkbox", INTEGER: "number"
    }
	return (
        <div className="card">
            <h5>Edit {Capitalize(model)}</h5>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    {schema.map((column, index) => {
                        if (column.primary_key === true || column.autoincrement === true){
                            return (
                                <input type="hidden" key={index} value={data[column]} />
                            )
                        }
                        if (column.name.includes("_id")){
                            return (
                                <div key={index}>
                                    <label>{Capitalize(column.name.replace("_id", ""))}</label>
                                    <select 
                                        name={column.name}
                                        required={!column.nullable}
                                        onChange={handleChange}
                                        value={formData[column.name]}
                                    >
                                        <option value="">...</option>
                                        {options[column.name].map((option, index2) => {
                                            return(
                                                <option key={index2} value={option.idx}>{option.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>       
                            )
                        } else if (column.type !== "RELATIONSHIP") {
                            return (
                                <div key={index}>
                                    <label>{Capitalize(column.name)}</label>
                                    <input 
                                        name={column.name}
                                        type={(column.name === "password" ? "password" : inputTypes[column.type])}
                                        required={(column.name === "password") ? false : !column.nullable}
                                        onChange={handleChange}
                                        {...(column.type === 'BOOLEAN' && { checked: formData[column.name] })}
                                        {...(column.type !== 'BOOLEAN' && { value: formData[column.name] })}
                                    />
                                </div>
                            )
                        } else if (column.type === "RELATIONSHIP" && column.direction === "MANYTOMANY" && options!== null) {
                            return (
                                <fieldset key={index}>
                                    <legend>{Capitalize(column.name)}:</legend>
                                    {options[column.name].map((option, index2)=> {
                                        const isChecked = formData[column.name]?.includes(option.idx.toString())
                                        return (
                                            <label key={index2}>
                                                <input
                                                    type="checkbox"
                                                    name={column.name}
                                                    value={option.idx.toString()}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        const { value, checked } = e.target
                                                        const newPermissions = [...formData[column.name]]
                                                        if (checked) {
                                                            newPermissions.push(value)
                                                        } else {
                                                            const index = newPermissions.indexOf(value)
                                                            if (index > -1) {
                                                                newPermissions.splice(index, 1)
                                                            }
                                                        }
                                                        setFormData({
                                                            ...formData,
                                                            [column.name]: newPermissions,
                                                        })
                                                    }}
                                                />
                                                &nbsp;{option.name}
                                            </label>
                                        )
                                    })}
                                </fieldset>
                            )
                        }
                    })
                }
                </div>
                <div className="buttons-container">
                    <button>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
	)
}

export default Update