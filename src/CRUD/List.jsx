import { useState, useEffect } from 'react'

function List({ data }) {

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
    const Thead = () => {
        return (
            <thead>
                <tr>
                    {theadCols.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))}
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
                                typeof item[col] !== 'object' ? item[col] : item[col].name
                            )
                            }</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        )
    }
    return (
        <table border="1" cellPadding="10">
            <Thead />
            <Tbody />
        </table>
    )
}

export default List