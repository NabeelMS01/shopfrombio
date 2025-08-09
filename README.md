# ShopFromBio: A Multi-Tenant E-commerce Platform

This repository contains the source code for ShopFromBio, a modern, full-stack application built with Next.js and the T3 stack. It allows users to sign up, create their own single-page e-commerce store, and make it available under a custom subdomain.

The application provides a comprehensive dashboard for store owners to manage their products, view sales data, and customize their store's appearance. It also features a modern, responsive storefront for customers, complete with a shopping cart and checkout flow.

## 1. Core Features Implemented

### User Authentication & Session Management
- **Signup & Login**: Users can create an account using their email and password. Passwords are securely hashed using `bcryptjs`.
- **Session Management**: Authentication state is managed using JWTs (JSON Web Tokens) stored in secure, HTTP-only cookies.
- **Protected Routes**: The dashboard is protected, and unauthorized users are redirected to the login page. The middleware also handles redirecting authenticated users away from login/signup pages.

### Multi-Tenancy via Subdomains
- **Store Creation**: Upon first login, users are prompted to create a store, which includes defining a unique subdomain.
- **Dynamic Routing**: The application's middleware (`src/middleware.ts`) dynamically rewrites requests from a subdomain (e.g., `my-store.localhost:3000`) to the corresponding store page (`/my-store`), enabling a multi-tenant architecture.

### E-commerce Storefront
- **Public Store Page**: Each subdomain resolves to a unique, publicly accessible store page that displays the store's name and products.
- **Modern UI**: The storefront is designed to be a modern and clean e-commerce experience.
- **Shopping Cart**: A fully client-side shopping cart allows customers to add/remove items and update quantities. The cart state persists in `localStorage`.
- **Checkout Flow**: A dedicated checkout page (`/[subdomain]/checkout`) displays an order summary and a form for shipping details. (Note: Payment gateway integration is not yet implemented).
- **"Buy Now" Functionality**: In addition to adding to the cart, customers can click "Buy Now" to be taken directly to the checkout page with the selected item.

### Store Management Dashboard
A comprehensive, authenticated dashboard for store owners.
- **Overview Page (`/dashboard`)**: Displays high-level statistics about the store, such as Total Revenue, Sales, and Product Count (currently using mock data).
- **Products Page (`/dashboard/products`)**:
    - View all products in a table.
    - Add new products or edit existing ones through a dialog form.
    - Product details include title, price, cost, stock count, type (physical or service), and product variants (e.g., size, color) with optional stock per variant.
- **Sales Page (`/dashboard/sales`)**:
    - Displays a table of recent orders (currently using mock data).
    - **AI-Powered Sales Summary**: Features a "Generate Summary" button that calls a Genkit AI flow to analyze the sales data and provide a text-based summary of trends and insights.
- **Settings Page (`/dashboard/settings`)**:
    - Allows the user to update their store name and subdomain.
    - Includes fields for a Razorpay Key ID and theme customization options (UI only).

---

## 2. API Routes and Server Actions

The application uses Next.js Server Actions for all backend logic, eliminating the need for traditional API routes.

- **`src/app/actions/auth.ts`**:
    - `signup()`: Handles new user registration, password hashing, and creating a user in the database.
    - `login()`: Verifies user credentials and establishes a session by setting a JWT cookie.
    - `logout()`: Clears the session cookie to log the user out.

- **`src/app/actions/store.ts`**:
    - `createStore()`: Creates a new store record in the database, linked to the user.
    - `updateStore()`: Updates store settings, including name, subdomain, and theme.

- **`src/app/actions/product.ts`**:
    - `addProduct()`: Adds a new product to the user's store.
    - `updateProduct()`: Modifies an existing product's details.

- **`src/ai/flows/summarize-sales-data.ts`**:
    - `summarizeSalesData()`: A Genkit flow that accepts sales data as a JSON string and uses a Google AI model to generate a natural language summary.

---

## 3. Technology Stack & Project Structure

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with `shadcn/ui` for the component library.
- **Database**: MongoDB with Mongoose for schema modeling.
- **Authentication**: Manual implementation using JWTs and `bcryptjs`.
- **Generative AI**: Google AI via Genkit for the sales summary feature.

### Key Directories:
- **`src/app`**: Contains all the routes and pages for the application.
    - **`/(public)`**: Group for public-facing pages like the landing page, login, and signup.
    - **`/dashboard`**: Group for all authenticated store management pages.
    - **`/[subdomain]`**: Dynamic route for the public storefronts.
- **`src/components`**: Reusable React components.
- **`src/models`**: Mongoose schemas for User, Store, and Product.
- **`src/lib`**: Utility functions, including database connection (`mongoose.ts`) and session management (`session.ts`).
- **`src/hooks`**: Custom React hooks, like `useCart` for shopping cart state.
- **`src/ai`**: Configuration and flows for Genkit.
- **`middleware.ts`**: Handles all incoming requests for routing and authentication logic.
