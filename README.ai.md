AI Overview

Purpose
- Vite + React UI for the Ollama RAG book assistant. Uses HTTP-only cookie auth and builds UI nav from permissions.

Runtime entry points
- App bootstrap: `src/main.jsx`
- Main routes: `/`, `/ask`, `/upload_book`, `/manage_access`, `/recover_admin`

Core flow
- Login -> `/login/` sets HTTP-only cookie (JWT) and returns permissions.
- Navbar renders links from permissions.
- Admin screens CRUD users/roles/permissions.
- Recovery screen posts admin reset code.

API wiring
- API base: `src/Api/Api.jsx`
- Paths: `paths` object (login, recoverAdmin, users, roles, permissions, books)
- Data fetching: `useGet`, `usePost`, `useLogout`, `useGenerateEmbeddings`

Key components
- `src/App.jsx`: login form + landing content.
- `src/Recover.jsx`: admin recovery form (username + code + new password).
- `src/Utils/Navbar.jsx`: builds nav from permissions, logout.
- `src/Utils/useCheckSession.jsx`: checks session cookie and redirects.
- `src/Ask.jsx`: Q/A interface (requires `ask` permission).
- `src/UploadBook.jsx`: upload + embeddings generation UI.
- `src/ManageAccess.jsx`: RBAC CRUD (users/roles/permissions).

Styling
- Global styles: `src/assets/App.css`
- Palette: `src/Utils/PalettePicker.jsx`

Storage
- Uses `localStorage` for `username`, `permissions`, `session_expiration` (display only).

Env settings
- `VITE_API_URL`
- `VITE_ENV` (local vs deploy)
- `VITE_REPO` (base path for deploy)
