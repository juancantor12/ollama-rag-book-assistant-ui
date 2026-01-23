# Ollama RAG Book Assistant — UI

This is the React UI for the [Ollama RAG Book Assistant ](https://github.com/juancantor12/ollama-rag-book-assistant), providing a web interface for querying books using a local LLM powered by RAG. It features a fully functional user interface with JWT authentication, RBAC management, book handling, and querying. Built with Vite+React.

**Features**
- Built with Vite, React, TanStack Query, and React Router.
- JWT Auth with RBAC — Secure login via HTTP-only cookies, dynamic UI based on user roles and permissions.
- Book Querying UI — Upload, generate embeddings, and ask an LLM about the books your books.
- PDF Integration — View the actual pages cited by the LLM in a PDF viewport.
- Dynamic Admin Interface — Auto-generated CRUDs for all RBAC entities and models via schema introspection.
- API-First Design — Built to work seamlessly with the FastAPI backend.
- Offline Demo Mode — Simulates LLM responses when the backend isn’t running.
- Deploy-Ready — Configured for deployment on GitHub Pages.
- Responsive — Works across screen sizes (styling in progress).

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/juancantor12/ollama-rag-book-assistant-ui.git
cd ollama-rag-book-assistant-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
This will launch the app on [http://localhost:5173](http://localhost:5173)

## Build & Deployment

The app is pre-configured to deploy on GitHub Pages. To build:

```bash
npm run build
```

To preview the built version locally:

```bash
npm run preview
```

To deploy in Github pages (make sure you build first):

```bash
npm run deploy
```


## Usage Overview

### Ask
- Query a local LLM about the book
- Click on citations to jump directly to the referenced PDF pages

### Auth & RBAC
- Secure login system using JWT (HttpOnly cookie)
- UI navigation is dynamically built based on user roles and permissions

### Book Management
- Upload and manage PDF files
- See the current embeddings generation status
- Trigger embeddings generation for specific books

### Dynamic CRUD
- Backend exposes a `get_schema` endpoint
- UI uses it to dynamically generate Create, Read, Update, Delete components
- Supports many-to-one and many-to-many fields

*(WIP: some RBAC restrictions on these actions are not yet fully enforced in the UI)*

## Notes
- **Security Warning**: The GitHub Pages deployment requires CORS and cookie support from your self-hosted backend API. Use with caution in public deployments.
- **Optimization Todo**: TanStack query logic can be further abstracted for cleaner code.
- **Styling Todo**: Responsive but still needs polish.

## Roadmap

- Enforce RBAC in dynamic CRUD generation (not only in navigation)
- Finalize styling and responsive behavior
- Dockerized full-stack setup with reverse proxy

## Contact

juancantor.all@gmail.com

[Backend Repo](https://github.com/juancantor12/ollama-rag-book-assistant)
