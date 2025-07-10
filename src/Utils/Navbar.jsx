import { useEffect } from 'react'
import { useNavigate, NavLink } from "react-router"
import { useQueryClient } from '@tanstack/react-query'
import { useLogout } from "../Api/Api.jsx"
const base = import.meta.env.VITE_ENV === "local" ? "" : "/"+import.meta.env.VITE_REPO

function Navbar ({data}){
	const queryClient = useQueryClient()
    const {
		refetch: fetchLogout,
		isError: isErrorLogout,
		isSuccess: isSuccessLogout
	} = useLogout()
	let navigate = useNavigate()
	const excludedPaths = ["check_session", "generate_embeddings", "load_books", "get_schema"]
	const availablePaths = data.permissions.filter(path => !excludedPaths.includes(path))
	let locations = availablePaths.map( (permission, index) => 
	        <NavLink to={base+"/"+permission} key={index+1}>
	        	{permission.charAt(0).toUpperCase() + permission.slice(1).replace(/_/g, ' ')}
	        </NavLink>
    )
    const handleLogout = (e) => {
    	e.preventDefault()
    	fetchLogout()
	}

	useEffect(()=>{
		if (isSuccessLogout === true){
			queryClient.clear()
			navigate(base+"/")
		}
	}, [isSuccessLogout])

	return (
		<>
			<nav className="card">
				<NavLink className="nav" to={base+"/"} key={0}>Home</NavLink>
				{locations}
				{availablePaths.length > 0 && <NavLink className="nav" to={base+"/logout"} onClick={(e)=> {handleLogout(e)}} key={availablePaths.length}>Logout</NavLink>}
			</nav>
			{isErrorLogout && <div className="card err">The logout service failed...</div>}
		</>
	)
}

export default Navbar