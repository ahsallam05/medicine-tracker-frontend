# MedTracker

A Medicine Expiry Date Tracking System frontend built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of medicine statistics with quick navigation to alerts
- **Medicine Management**: Add, edit, delete, and search medicines with pagination
- **Alert System**: Track expired, critical, expiring soon, out of stock, and low stock medicines
- **Admin Panel**: Manage pharmacists (add, edit, activate/deactivate, delete)
- **Responsive Design**: Mobile-friendly interface with 2-column stat cards and fixed sidebar/navbar
- **Real-time Status Badges**: Visual indicators for medicine status (Expired, Critical, Expiring Soon, etc.)

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v4** (using `@import "tailwindcss"` syntax)
- **React Router v7**
- **Axios** for API calls
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://medicine-tracker-backend.up.railway.app/api
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/
│   └── services/       # API service functions (axios)
├── components/
│   ├── layout/         # Sidebar, Navbar, Layout
│   └── ui/             # Reusable UI components (Badge, Modal, Spinner, etc.)
├── hooks/              # Custom React hooks (useAuth)
├── pages/              # Page components
│   ├── admin/          # Pharmacist management
│   ├── alerts/         # Alert sections
│   ├── medicines/      # Medicine list
│   ├── Dashboard.jsx
│   └── Login.jsx
├── utils/              # Utility functions (BadgeFactory)
├── App.jsx
└── main.jsx
```

## Key Features Implemented

### Layout
- Fixed sidebar (desktop) / overlay (mobile)
- Fixed navbar with page title and logout
- Browser-native page scroll

### Medicine List
- Search by name
- Filter by category
- Pagination (20 items per page)
- Sort by most recently added
- Edit/Delete actions with confirmation

### Alert System
- 5 alert categories: Expired, Critical, Expiring Soon, Out of Stock, Running Low
- Collapsible sections
- "Show More" functionality (10 items at a time)
- Direct navigation from dashboard stat cards

### Status Badge Priority
1. Out of Stock (highest priority)
2. Expired
3. Critical (≤ 7 days)
4. Expiring Soon (≤ 30 days)
5. Running Low (≤ 10 quantity)
6. Good (default)

### Authentication
- JWT token-based auth
- Protected routes
- Login with username/password
- Role-based access (admin sees Pharmacists menu)

## API Endpoints

The frontend communicates with the backend at `VITE_API_URL`:

- `POST /auth/login` - Authentication
- `GET /dashboard/stats` - Dashboard statistics
- `GET /medicines` - List medicines (with pagination, search, filter, sort)
- `POST /medicines` - Create medicine
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine
- `GET /alerts` - Get all alert categories
- `GET /admin/pharmacists` - List pharmacists
- `POST /admin/pharmacists` - Create pharmacist
- `PUT /admin/pharmacists/:id` - Update pharmacist
- `PUT /admin/pharmacists/:id/status` - Toggle status
- `DELETE /admin/pharmacists/:id` - Delete pharmacist

## License

MIT
