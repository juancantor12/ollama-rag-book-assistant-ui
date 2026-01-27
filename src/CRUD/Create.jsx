import { useState, useEffect } from 'react'
import { Capitalize } from '../Utils/Tools.jsx'
import { paths} from '../Api/Api.jsx'

function Create({ model, setMsg, schema, options, saveHook, path, postSuccessHook }) {
    const {
        mutate: mutatePost,
        isSuccess: isSuccessPost,
        isError: isErrorPost,
        data: dataPost,
    } = saveHook()

    const initialForm = schema.reduce((accumulator, column)=>{
        if (column.name !== "idx"){
            if (column.type === "BOOLEAN") {
                accumulator[column.name] = false
            } else if (column.type === "RELATIONSHIP" && column.direction === "MANYTOMANY") {
                accumulator[column.name] = []
            } else {
                accumulator[column.name] = ''
            }
        }
        return accumulator
    }, {})

    const [formData, setFormData] = useState(initialForm)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        mutatePost({path, data: [formData], credentials: true})
    }
    
    useEffect(()=>{
        if (isSuccessPost === true){
            setFormData(initialForm)
            setMsg({class:"suc", text: Capitalize(model)+" saved."})
            postSuccessHook()
        }
    }, [isSuccessPost])

    useEffect(()=>{
        if (isErrorPost === true){
            setMsg({class:"err", text: "Unable to save."})
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
            <h5>Create a {Capitalize(model)}</h5>
            <form onSubmit={handleSubmit}>
                <div className="form ">
                    {schema.map((column, index) => {
                        if (column.primary_key === true || column.autoincrement === true) return null
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
                                        required={!column.nullable}
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
                <button>Save</button>
            </form>
        </div>
    )
}

export default Create