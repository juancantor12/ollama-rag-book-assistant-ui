import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router"
import App from './App.jsx'
import Ask from './Ask.jsx'
import Recover from './Recover.jsx'
import UploadBook from './UploadBook.jsx'
import ManageAccess from './ManageAccess.jsx'
import NotFound from './Utils/NotFound.jsx'
import PalettePicker from './Utils/PalettePicker.jsx'
import './assets/App.css'
const base = import.meta.env.VITE_ENV === "local" ? "" : "/"+import.meta.env.VITE_REPO

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PalettePicker />
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>  
                    <Route path={base+"/"} element={<App />} />
                    <Route path={base+"/recover_admin"} element={<Recover />} />
                    <Route path={base+"/ask"} element={<Ask />} />
                    <Route path={base+"/upload_book"} element={<UploadBook />} />
                    <Route path={base+"/manage_access"} element={<ManageAccess />} />
                    <Route path={base+"*"} element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
