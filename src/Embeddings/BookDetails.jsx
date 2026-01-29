import { useEffect, useState } from 'react'
import { useParams } from "react-router"
import Header from '../Utils/Header.jsx'
import Navbar from '../Utils/Navbar.jsx'
import useCheckSession from '../Utils/useCheckSession.jsx'
import { useGet, paths } from '../Api/Api.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function BookDetails() {
    const { book } = useParams()
    const decodedBook = decodeURIComponent(book || "")
    const {
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession(true)

    const {
        refetch: refetchIndex,
        isSuccess: isSuccessIndex,
        data: dataIndex
    } = useGet({ path: paths.books.index + decodedBook, retries: 0, credentials: true })

    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [showIndex, setShowIndex] = useState(false)

    const fetchEmbeddings = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `${apiUrl}${paths.books.embeddings}${decodedBook}?limit=${pageSize}&offset=${page * pageSize}`,
                { credentials: "include" }
            )
            if (!response.ok) {
                throw new Error("Failed to load embeddings.")
            }
            const data = await response.json()
            setItems(data.items || [])
            setTotal(data.total || 0)
        } catch (err) {
            setItems([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (decodedBook) {
            fetchEmbeddings()
            refetchIndex()
        }
    }, [decodedBook, page, pageSize])

    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return (
        <>
            <Header />
            {isSuccessCheckSession && <Navbar data={dataCheckSession} />}
            <div className="card">
                <h3>Embeddings Details</h3>
                <div>Book: {decodedBook}</div>
                <div className="details-controls">
                    <label>Page size</label>
                    <select value={pageSize} onChange={(e) => { setPage(0); setPageSize(Number(e.target.value)) }}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                {loading ? (
                    <div className="card small">Loading...</div>
                ) : (
                    <>
                        <table border="1" cellPadding="10">
                            <thead>
                                <tr>
                                    <th width="15%">ID</th>
                                    <th width="10%">Page</th>
                                    <th width="20%">Title</th>
                                    <th width="55%">Snippet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.id}</td>
                                        <td>{item.page ?? "-"}</td>
                                        <td>{item.title ?? "-"}</td>
                                        <td>{item.snippet ?? ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="details-pagination">
                            <div>Page: {page + 1} / {totalPages}</div>
                            <div className="details-pagination-actions">
                                <button className="details-prev" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
                                <button className="details-next" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="card">
                <button onClick={() => setShowIndex((v) => !v)}>
                    {showIndex ? "Hide index" : "Show index"}
                </button>
                {showIndex && isSuccessIndex && (
                    <pre className="exam-context">
                        {dataIndex.index}
                    </pre>
                )}
            </div>
        </>
    )
}

export default BookDetails
