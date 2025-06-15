import { useEffect } from 'react'
import { useNavigate, NavLink } from "react-router"
import { useQueryClient } from '@tanstack/react-query'
import { useLogout } from "../Api/Api.jsx"

function Navbar ({data}){
	const queryClient = useQueryClient();
    const {
		refetch: fetchLogout,
		isError: isErrorLogout,
		isSuccess: isSuccessLogout
	} = useLogout()
	let navigate = useNavigate()
	const excludedPaths = ["check_session", "generate_embeddings", "load_books"]
	const availablePaths = data.permissions.filter(path => !excludedPaths.includes(path));
	let locations = availablePaths.map( (permission, index) => 
	        <NavLink to={"/"+permission} key={index+1}>
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
			navigate("/")
		}
	}, [isSuccessLogout])

	return (
		<>
			<nav className="card">
				<NavLink to={"/"} key={0}>Home</NavLink>
				{locations}
				{availablePaths.length > 0 && <NavLink to={"/logout"} onClick={(e)=> {handleLogout(e)}} key={availablePaths.length}>Logout</NavLink>}
			</nav>
			{isErrorLogout && <div className="card warn">The logout service failed...</div>}
		</>
	)
}

export default Navbar