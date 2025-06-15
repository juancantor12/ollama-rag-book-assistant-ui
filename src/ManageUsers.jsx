import Header from './Utils/Header.jsx'
import Navbar from './Utils/Navbar.jsx'
import useCheckSession from './Utils/useCheckSession.jsx'
import Users from './Rbac/Users.jsx'
import Roles from './Rbac/Roles.jsx'
import Permissions from './Rbac/Permissions.jsx'

function UploadBook () {
	const nfData = {
		permissions: []
	}
	const {
		isError: isErrorCheckSession,
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession(true)

	return (
		<>
			<Header />
			{isErrorCheckSession && <Navbar data={nfData}/>}
			{isSuccessCheckSession && <Navbar data={dataCheckSession}/>}
			<div className="card">
				<Users />
			</div>
			<div className="card">
				<Roles />
			</div>
			<div className="card">
				<Permissions />
			</div>
		</>
	)
}

export default UploadBook