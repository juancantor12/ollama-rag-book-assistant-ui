import { useState, useCallback, useEffect } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import demoPdf from '../assets/iama4.pdf'
import 'react-pdf/dist/Page/TextLayer.css';

function PDFViewer({ page, setPage, llmResponse, searchText, setSearchText}) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString()

    const [numPages, setNumPages] = useState()
    const [goToValue, setGoToValue] = useState(1)

    useEffect(() => {
        setGoToValue(page)
    }, [page])

    const handleGoToChange = (event) => {
        const value = Math.min(Math.max(event.target.value, 1), numPages)
        setGoToValue(value)
    }
    function onDocumentLoadSuccess( {numPages}){
        setNumPages(numPages);
    }

    const textRenderer = useCallback( (textItem) => {
            // return textItem.str.replace(searchText, (value) => `<mark>${value}</mark>`)
            const regex = new RegExp(searchText, 'gi');
            return textItem.str.replace(regex, (match) => `<mark>${match}</mark>`);
        },
        [searchText]
    );
    return (
        <>
            <Document file={demoPdf} onLoadSuccess={onDocumentLoadSuccess}>
                <Page 
                    pageNumber={page}
                    height={1100}
                    scale={1}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    customTextRenderer={textRenderer}
                />
            </Document>
            <div> Page {page} of {numPages}
                &nbsp;
                <div 
                    className="d-inline c-point"
                    onClick={() => setPage( page > 1 ? page - 1 : page )}
                >
                    ◀
                </div>
                &nbsp;
                <div 
                    className="d-inline c-point"
                    onClick={() => setPage(page < numPages ? page + 1 : page)}
                >
                    ▶
                </div>
                <div className="d-inline go-to-input">
                    Go to
                    <input 
                        type="number"
                        min={1}
                        max={numPages}
                        value={goToValue}
                        onChange={handleGoToChange}
                        onKeyDown={() => {
                                if (event.key === "Enter") {
                                    setPage(goToValue)
                                }
                            }
                        }
                    />
                    <div className="d-inline c-point" onClick={() => setPage(goToValue)}>▶</div>
                </div>
                <div className="d-inline go-to-input">
                    Search in page: 
                    <input 
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
        </>
    )
}

export default PDFViewer