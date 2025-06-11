import Header from './Utils/Header.jsx'
import Navbar from './Utils/Navbar.jsx'
import useCheckSession from './Utils/useCheckSession.jsx'
import UploadBookForm from './Embeddings/UploadBookForm'
import UploadedBooks from './Embeddings/UploadedBooks'

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
				<UploadBookForm />
			</div>
			<div className="card">
				<UploadedBooks />
			</div>
		</>
	)
}

export default UploadBook