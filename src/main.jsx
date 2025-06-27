import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import Ask from './Ask.jsx'
import UploadBook from './UploadBook.jsx'
import ManageAccess from './ManageAccess.jsx'
import NotFound from './Utils/NotFound.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>  
                    <Route path="/" element={<App />} />
                    <Route path="/ask" element={<Ask />} />
                    <Route path="/upload_book" element={<UploadBook />} />
                    <Route path="/manage_access" element={<ManageAccess />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
