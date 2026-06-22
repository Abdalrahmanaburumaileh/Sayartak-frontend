# Sayartak Client

React frontend for **Sayartak Pro** — vehicle selection, garage dashboard, maintenance tracking, profile management, and an admin panel.

## Tech stack

- **React 18** + **Vite 5**
- **React Router 7** for navigation
- **Bootstrap 5** (layout utilities + footer)
- **Lucide React** for icons
- Custom CSS with mobile/desktop responsive breakpoints

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:3000` (see `../backend/README.md`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the URL shown in the terminal (usually **http://localhost:5173**).

The frontend expects the API at `http://localhost:3000/api`. Update `src/utils/api.js` and any hardcoded fetch URLs if your backend runs on a different host or port.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production (output in `dist/`) |

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/login` | Guest | Sign in |
| `/register` | Guest | Create account |
| `/admin` | Admin only | Manage users and car catalog |
| `/fuel-type` | Driver | Choose fuel type (onboarding) |
| `/select-car` | Driver | Choose car make |
| `/select-model` | Driver | Choose car model |
| `/vehicle-setup` | Driver | Enter vehicle details |
| `/dashboard` | Driver | Main dashboard with weather and health |
| `/history` | Driver | Maintenance history |
| `/profile` | Driver | Profile and garage |

Route guards in `src/components/RouteGuard.jsx` redirect users based on login state and role (`admin` vs `driver`).

## Project structure

```
client/
├── public/
│   └── car-bg.avif         # Login page background image
├── src/
│   ├── main.jsx            # App entry + global styles
│   ├── App.jsx             # Routes and layout
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Sidebar.jsx
│   │   ├── RouteGuard.jsx
│   │   ├── BrandLogo.jsx
│   │   ├── CarImage.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── FuelType.jsx
│   │   ├── SelectCar.jsx
│   │   ├── SelectModel.jsx
│   │   ├── VehicleSetup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   ├── Profile.jsx
│   │   └── AdminPanel.jsx
│   ├── styles/
│   │   └── responsive.css  # Shared sidebar + mobile breakpoints
│   └── utils/
│       ├── api.js          # Admin API helpers
│       └── carImages.js    # Image fallbacks
├── index.html
└── vite.config.js
```

## Responsive design

Pages adapt for mobile and desktop using CSS media queries at **768px** and **480px**. Shared sidebar layout lives in `src/styles/responsive.css`; each page has its own stylesheet with breakpoint rules.

## Production build

```bash
npm run build
```

This creates a `dist/` folder with optimized JS and CSS. That folder is auto-generated — you can delete it during development; run `npm run build` again when you need a fresh build.

Serve `dist/` with any static file host, and point the API URL to your production backend.

## Notes

- User session is stored in `localStorage` under the key `user`.
- Car images and brand logos are loaded from the backend database via `/api/cars` and `/api/cars/image`.
- The `dist/` folder should not be edited manually and is safe to delete while developing.
