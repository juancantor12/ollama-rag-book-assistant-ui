import { NavLink } from "react-router"
import Header from './Header.jsx'
import Navbar from './Navbar.jsx'
import useCheckSession from './useCheckSession.jsx'

function NotFound () {
	const nfData = {
		permissions: []
	}
	const {
		isError: isErrorCheckSession,
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession()

	return (
		<>
			<Header />
			{isErrorCheckSession && <Navbar data={nfData}/>}
			{isSuccessCheckSession && <Navbar data={dataCheckSession}/>}
			<div className="card warn">
				404: The path you are trying to navigate to doesnt exists
				<br />
				<br />
				<NavLink to={"/"}>Back to the main page</NavLink>
			</div>
		</>
	)
}

export default NotFound