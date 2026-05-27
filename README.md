# Ironside · Gym OS

A full-featured gym management web app — designed as a modern, deployable replacement for GymMaster. Built with React, Vite, and Tailwind CSS.

## Demo accounts

After running the app, sign in with any of these:

| Role          | Username      | Password      |
| ------------- | ------------- | ------------- |
| Admin         | `admin`       | `admin`       |
| Receptionist  | `reception`   | `reception`   |
| Trainer       | `trainer`     | `trainer`     |
| Member        | `member`      | `member`      |

Each role sees a different navigation and feature set.

## Features

### For gym staff (admin / receptionist)
- **Dashboard** — Active members, revenue, check-ins, class utilization. Alerts for overdue payments and expiring memberships.
- **Members** — Full CRUD with plan management (Basic ₦15,000 / Standard ₦25,000 / Premium ₦40,000), search and filters, member detail drawer with payment and visit history.
- **Class Schedule** — 7-day grid view with booking status and trainer assignments.
- **Trainers** — Trainer profiles with client counts and ratings.
- **Check-ins** — Live activity log. Generate a printable QR poster for the gym entrance.
- **Payments** — Track paid, pending, and overdue payments. Mark as paid in one click.
- **Point of Sale** — Sell supplements, apparel, gear, day passes, and PT sessions. Cart, checkout (cash / card / transfer / account billing), and full inventory tracking with low-stock alerts.
- **Sales Pipeline** — Kanban board of leads across six stages (New → Contacted → Tour Booked → Free Trial → Won/Lost). Drag and drop to update. Convert trial leads to members in one click.
- **Access Control** — Monitor doors, view granted and denied entries, lock and unlock remotely.
- **Messages & Marketing** — Automated SMS and email templates (welcome, expiry reminder, overdue payment, class reminder, birthday). Compose broadcasts to all members, premium members, or expiring memberships.
- **Analytics** — Revenue trend, plan distribution, top classes, peak hours.

### For trainers
- Personal dashboard with weekly schedule.
- View own classes with full attendee lists.
- Manage assigned clients.

### For members
- **Home** — Big check-in button, upcoming classes, recent visits, payment status.
- **My QR** — Camera-based check-in. Open the camera, scan the QR poster at the gym, and the check-in is logged instantly.
- **Book Classes** — Browse the weekly schedule and book or cancel slots.
- **My Visits** — Full check-in history.
- **My Payments** — Payment history and outstanding balance.

## Check-in flow

Members scan a single QR code displayed at the gym (printable poster). Each member's phone:
1. Opens the Ironside app
2. Taps "Check In"
3. Camera opens with QR overlay
4. Scans the poster — instant check-in logged

The QR poster is generated and printable from the staff Check-ins tab.

## Running locally

```bash
npm install
npm run dev
```

The app opens at http://localhost:3000.

## Building for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploying to Vercel

Quickest option for a client demo:

1. Push this folder to a GitHub repo.
2. Go to vercel.com and sign in with GitHub.
3. Click "Add New Project" → import the repo.
4. Vercel auto-detects Vite. Click Deploy.
5. You'll get a live URL in about 30 seconds.

Alternatively, drag-and-drop the `dist/` folder to the Vercel dashboard for a no-config deploy.

## Tech stack

- **React 18** with hooks
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for analytics charts
- **html5-qrcode** for camera-based QR scanning
- **qrcode** for QR generation
- **lucide-react** for icons
- **localStorage** for client-side persistence (resets per browser)

All state persists across page reloads via localStorage with the `ironside:` prefix. To reset to seed data, clear site data in your browser.

## File structure

```
src/
├── App.jsx                       Main app shell, state management, routing
├── main.jsx                      Entry point
├── index.css                     Tailwind + global styles
├── components/
│   ├── Layout.jsx                Sidebar and Header
│   ├── ui.jsx                    StatCard, Modal, Field, etc.
│   ├── CheckInPoster.jsx         Printable gym-side QR poster
│   └── QRScanner.jsx             Camera-based scanner
├── data/
│   ├── seed.js                   Demo data and constants
│   └── roles.js                  Role config
├── utils/
│   └── storage.js                localStorage helpers
└── views/
    ├── LoginScreen.jsx           Split-panel login
    ├── CoreViews.jsx             Dashboard, members, classes, etc.
    ├── POSView.jsx               Point of sale + inventory
    ├── PipelineViews.jsx         Leads, access control, messages
    └── RoleViews.jsx             Trainer and member views
```

## Customization

- Branding: edit colors in `tailwind.config.js` (currently lime / amber / stone palette).
- Plans and pricing: see `PLAN_PRICES` in `src/data/seed.js`.
- Message templates: edit `seedTemplates` in `src/data/seed.js`.
- Demo accounts: edit `DEMO_ACCOUNTS` in `src/data/seed.js`.

## License

This is a demo project. Feel free to use as a starting point for your own gym management system.
