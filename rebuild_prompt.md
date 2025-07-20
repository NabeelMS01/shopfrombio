
# Prompt to Rebuild the ShopFromBio Application

## 1. Initial Project Setup

"Start a new Next.js project named 'shopfrombio' using TypeScript. Then, initialize ShadCN UI."

Follow up with: "Use the 'Default' style and 'Neutral' base color. Confirm the default options for all other settings."

## 2. Core Layout and Styling

"Set up the root layout in `src/app/layout.tsx`. Import and use the 'Inter' font from Google Fonts for the body and headline. Include the ShadCN Toaster component."

"Next, configure the base Tailwind CSS theme in `src/app/globals.css`. Set up light and dark mode colors for primary, background, card, accent, and other theme variables to match the existing application's modern blue-themed design."

## 3. Landing Page and Public Pages

"Create the public-facing pages. Start with the main landing page (`src/app/page.tsx`). It should have a hero section with the title 'Build your store and start selling' and a description about creating a store like 'shop from bio'. Include a 'Get Started Now' button linking to the signup page. Add a 'Key Features' section highlighting 'Custom Subdomains', 'Direct Payments', and 'Theme Customization'. Also, create a shared `Header` component for navigation to login and signup pages, and a simple footer."

"Now, build the user authentication pages. Create a signup page at `src/app/signup/page.tsx` with a form for first name, last name, email, and password. Create a login page at `src/app/login/page.tsx` with a form for email and password. Both pages should feature the 'ShopFromBio' logo and branding."

## 4. Subdomain Store Functionality

"Implement the core multi-tenancy feature. First, create a `middleware.ts` file at the project root. This middleware will rewrite requests from `subdomain.localhost:9002` to `/[subdomain]`. Ensure it reads the application's domain from an environment variable."

"Next, create the dynamic store page at `src/app/[subdomain]/page.tsx`. This page should display the store's name and a grid of its products. Use mock data to represent at least two different stores with a few products each, including product name, price, and a placeholder image."

## 5. Database and User Authentication

"Set up the backend for user authentication. Add Mongoose to the project to connect to a MongoDB database. Create a file (`src/lib/mongoose.ts`) to manage the database connection using a connection string from environment variables."

"Create the User model in `src/models/User.ts` with fields for `firstName`, `lastName`, `email`, and `password`."

"Implement the signup functionality. Create a server action in `src/app/actions/auth.ts`. This action should validate the form input using Zod, check if a user with the given email already exists, hash the password using `bcryptjs`, save the new user to the database, and then redirect to the '/dashboard' page upon success. Connect this server action to the form on the signup page and handle form state and errors using the `useActionState` hook."

## 6. Authenticated Dashboard

"Build the main dashboard for authenticated users. Create a dashboard layout at `src/app/dashboard/layout.tsx`. This layout must include a persistent sidebar navigation for 'Overview', 'Products', 'Sales', and 'Settings'. It should also have a header with a mobile-friendly sheet menu and a user navigation dropdown."

"Create the individual dashboard pages:"
- "`src/app/dashboard/page.tsx`: The overview page, displaying summary cards for 'Total Revenue', 'Sales', and 'Products'."
- "`src/app/dashboard/products/page.tsx`: A page to manage products. It should display a table of existing products and include a dialog to 'Add Product'."
- "`src/app/dashboard/settings/page.tsx`: A settings page with form fields for 'Store Name', 'Subdomain', 'Razorpay Key', and theme selection options."

## 7. AI-Powered Sales Summary

"Integrate the generative AI feature for sales analysis. Create the sales page at `src/app/dashboard/sales/page.tsx`. This page should display a table of recent orders using mock data."

"Add a `SalesSummary` component to this page. This component will contain a button, 'Generate Summary'. When clicked, it should call a Genkit flow."

"Create the Genkit flow in `src/ai/flows/summarize-sales-data.ts`. This flow will take sales data (as a JSON string) as input, send it to a Google AI model with a prompt instructing it to act as a sales data analyst, and return a concise summary of trends and insights. The `SalesSummary` component will then display this returned summary to the user, with appropriate loading and error states."
