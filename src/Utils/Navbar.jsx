import { useEffect } from 'react'
import { useNavigate, NavLink } from "react-router"
import { useLogout, queryClient } from "../Api/Api.jsx"

function Navbar ({data}){
    const {
		refetch: fetchLogout,
		isError: isErrorLogout,
		isSuccess: isSuccessLogout
	} = useLogout()
	let navigate = useNavigate()
	const excludedPaths = ["check_session"]
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
			locations = []
			queryClient.resetQueries({ queryKey: "useLogout", exact: true })
			navigate("/?refresh=1")
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