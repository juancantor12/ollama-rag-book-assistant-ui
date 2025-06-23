function Update({ 
    model,
    setMsg,
    schema,
    data,
    options,
    updateHook,
    path,
    postSuccessHook,
    postSuccessHookParams,
    setDisplayEditPopup
}){
	
	return (
        <div className="card">
            <div className="buttons-container">
                <button>Save</button>
                <button onClick={()=>{setDisplayEditPopup(false)}}>Cancel</button>
            </div>
        </div>
	)
}

export default Update