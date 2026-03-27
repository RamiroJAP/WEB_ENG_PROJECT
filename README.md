# Wolves Footwear Store (WEB_ENG_PROJECT)

A React + Vite footwear store web app with two experiences:

- **Public (not logged in):** browse Shop/About, choose Admin/User login
- **User:** shop, favorites, cart/checkout + receipt, order tracker
- **Admin:** product management, stock monitoring, checkout list + status updates

## Tech Stack

- React 18 + Vite
- React Router
- Firebase Firestore (products + checkouts)
- Cloudinary (admin product image uploads)

## Getting Started

### Install & run

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run preview
```

## CI/CD (GitHub Actions)

This repo includes GitHub Actions workflows for:

- **CI:** install + build on every push / PR
- **CD:** deploy to Firebase Hosting on pushes to the `Main` branch

### Required GitHub Secret (for deploy)

Create a Firebase service account (with permissions to deploy Firebase Hosting for this project), then add its JSON as a GitHub repository secret named:

- `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D`

### Environment variables (Cloudinary upload)

Admin product image upload uses Cloudinary and expects these Vite env vars:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

Create a `.env.local` in the project root:

```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Website Flow

This section describes the end-to-end user/admin journeys based on the actual routing and context logic in the app.

### 1) Public flow (not logged in)

When there is **no active user session**, the app renders a simple top navigation:

- **Shop** → `/` or `/shop`
- **About** → `/about`
- **Login** → `/login`

On `/login`, you pick:

- **Admin** → `/login/admin`
- **User** → `/login/user`

### 2) Authentication + session behavior

- Auth is handled by `AuthContext` using **localStorage**.
- On app load, it reads `currentUser` from localStorage and restores the session.
- A default admin account is ensured in localStorage (for development/testing).

**LocalStorage keys used by auth:**

- `users` (array of saved accounts)
- `currentUser` (active session)

### 3) User flow

Once logged in as a **user** (`userType: 'user'`), the app renders the `UserLayout` header with navigation:

- Shop → `/user/shop`
- About → `/user/about`
- Favorites → `/user/favorites`
- Order Tracker → `/user/orders`
- Cart → `/user/cart`

Typical user journey:

1. **Browse products** on Shop (filter by audience/type/price)
2. **Open product details** and:
	- add/remove favorites
	- add to cart
	- leave product reviews (saved locally)
3. **Favorites** page shows saved items and can add them to cart
4. **Cart** page:
	- update quantities / remove items
	- checkout creates a Firestore checkout record
	- shows a **Receipt modal** with print/download
5. **Order Tracker** lists the current user’s orders by matching username/email against checkout records and shows status + tracker message

**Local-only user data:**

- Favorites: `wolvesFavorites`
- Product reviews: `wolvesProductReviews`

**Cart note:** cart state is kept in React state (it resets on refresh).

### 4) Admin flow

Once logged in as an **admin** (`userType: 'admin'`), the app renders the `AdminLayout` navigation:

- Products → `/admin/products`
- Stocks → `/admin/stocks`
- Checkout List → `/admin/checkouts`

Typical admin journey:

1. **Products (Admin Dashboard)**
	- filter product list
	- add new product via modal
	- optional image upload to Cloudinary before saving
	- save product to Firestore `products`
	- delete products
2. **Stocks Monitor**
	- shows stock levels and highlights Low/Critical/Out of Stock
3. **Checkout List**
	- filter by status (Pending/Completed/Pick Up/Cancelled)
	- view a checkout receipt
	- update status
	- delete checkout records

**Inventory rule:** when an admin marks an order as **Completed**, the app attempts to deduct product stock. If there isn’t enough stock, the status change is blocked.

## Route Map

### Public routes

- `/` → Shop
- `/shop` → Shop
- `/about` → About
- `/login` → Login chooser
- `/login/admin` → Admin login
- `/login/user` → User login / signup

### User routes (when logged in as user)

- `/user/home` → Shop
- `/user/shop` → Shop
- `/user/about` → About
- `/user/favorites` → Favorites
- `/user/cart` → Cart / Receipt
- `/user/orders` → Order Tracker

### Admin routes (when logged in as admin)

- `/admin/dashboard` → Admin Dashboard (products)
- `/admin/products` → Admin Dashboard (products)
- `/admin/stocks` → Stocks Monitor
- `/admin/checkouts` → Checkout List

## Data Model (Firestore)

The app reads/writes these Firestore collections:

- `products`
  - fields used include: `name`, `image`, `category`, `audience`, `stock`, `color`, `size`, `price`, `rating`, `createdAt`
- `checkouts`
  - fields used include: `customer`, `email`, `total`, `items[]`, `receiptNumber`, `status`, `date`, `stockDeducted`, `createdAt`

## Default Admin (dev/testing)

On first load, the app seeds one admin account into localStorage. If you want to use it, check the values in `src/context/AuthContext.jsx`.

## Notes / Known behavior

- User accounts are **localStorage-based** (not Firebase Auth).
- Product images are stored as Cloudinary URLs (upload happens from the browser).
- Checkout receipts can be printed/downloaded via the browser print dialog.