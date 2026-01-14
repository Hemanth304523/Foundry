# Quick Start Guide

Get Foundry up and running in 5 minutes!

## 1. Clone and Setup

```bash
# Navigate to the project directory
cd C:\Users\304523\Desktop\Foundry
```

## 2. Start Backend

Open a new terminal:

```bash
cd server
uvicorn main:app --reload --port 8001
```

Wait for the message: `Application startup complete.`

**Backend running at**: http://localhost:8001
**API Docs at**: http://localhost:8001/docs

## 3. Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

**Frontend running at**: http://localhost:5174

## 4. First Time Setup

### Create Admin Account

1. Go to http://localhost:5174/auth/login
2. Click "Create New Account"
3. Fill in:
   - Email: `admin@foundry.dev`
   - Username: `admin`
   - Password: `Admin@123` (or your own with uppercase, lowercase, number)
4. Click "Create Account"
5. You'll be logged in to the Admin Dashboard

### Add Your First Component

1. Click "Create Component" button
2. Fill in:
   - **Title**: e.g., "React Form Hook"
   - **Category**: Select one (Frontend, Backend, Database, DevOps & Cloud)
   - **Use Case**: Describe when and why to use this component
3. Click "Add New Snippet"
4. Fill in snippet details:
   - **Filename**: e.g., `useForm.ts`
   - **Language**: Select from dropdown
   - **Code**: Paste your code snippet
5. Click "Add Snippet"
6. Click "Save Component"

Your component now appears on:
- Admin Dashboard
- Public Home Page
- Category Pages
- Component Detail Page

## 5. Viewing Components

### Public Users (No Login Required)

1. Go to Home Page (http://localhost:5174)
2. Click "Browse Components"
3. Select a category
4. Click on component to view details
5. Click "Copy" to copy code snippets

### Admin Users

1. Login at /auth/login
2. Dashboard shows all components
3. Filter by category
4. Edit or delete components

## Project Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5174 | http://localhost:5174 |
| Backend (FastAPI) | 8001 | http://localhost:8001 |
| API Docs (Swagger) | 8001 | http://localhost:8001/docs |
| Database | - | `./server/Foundry.db` |

## Key Files

```
client/
├── src/
│   ├── App.tsx                 # Main routing
│   ├── services/api.ts         # API client
│   ├── components/             # Layout components
│   └── pages/                  # Page components

server/
├── main.py                     # FastAPI app
├── model.py                    # Database models
├── routers/
│   ├── auth.py                # Authentication
│   ├── admin.py               # Admin CRUD
│   └── public.py              # Public API
└── Foundry.db                 # SQLite database
```

## Common Tasks

### Reset Database

```bash
# Delete the database
rm server/Foundry.db

# Restart backend - new database will be created automatically
uvicorn main:app --reload --port 8001
```

### Troubleshooting

#### Port 8001 already in use
```bash
# Use a different port
uvicorn main:app --reload --port 8002

# Update client API configuration in: src/services/api.ts
# Change: const API_BASE_URL = 'http://localhost:8002/api';
```

#### Port 5174 already in use
Vite will automatically try 5175, 5176, etc.

#### Import errors in frontend
```bash
cd client
npm install --legacy-peer-deps
```

#### Backend import errors
```bash
cd server
pip install -r requirement.txt
```

## API Examples

### Public - Get All Components

```bash
curl http://localhost:8001/api/components
```

### Public - Get Category Components

```bash
curl http://localhost:8001/api/categories/frontend/components
```

### Admin - Login

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -d "username=admin&password=Admin@123" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### Admin - Create Component

```bash
curl -X POST http://localhost:8001/api/admin/components \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Component",
    "use_case": "Description here",
    "category": "frontend"
  }'
```

## Color Scheme

- **Primary Red**: `#ff5252`
- **Light Red**: `#ffebee`
- **Dark Text**: `#333333`
- **Light Gray**: `#f5f5f5`
- **Border**: `#e0e0e0`

## Feature Checklist

- [x] Public component browsing
- [x] Category-based organization
- [x] Admin authentication
- [x] Component creation/editing
- [x] Code snippet management
- [x] Copy-to-clipboard functionality
- [x] Responsive design
- [x] Framer Motion animations
- [x] Modern styling with gradients

## Next Steps

1. Explore the API docs: http://localhost:8001/docs
2. Add sample components
3. Customize styling in `client/src/index.css` and component CSS files
4. Configure environment variables for production
5. Deploy to your preferred cloud provider

## Support

- Check the main README.md for full documentation
- Review API documentation at /docs endpoint
- Check browser console for error messages
- Verify both backend and frontend are running on correct ports

Happy coding! 🚀
