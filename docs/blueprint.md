# **App Name**: BioShop

## Core Features:

- User Authentication: Users can sign up and log in to create and manage their stores.
- Store Creation: Users create a unique store with its own subdomain.
- Product Management: Store owners add and manage products with descriptions, prices, and images.
- Direct Payments: Customers purchase products directly from store owners via Razorpay. This requires that each store owner enter their own Razorpay Key ID.
- Sales Reporting: Dashboard to view sales data and manage orders. Use an LLM tool to summarize the sales data, to serve as an account management tool for store owners.
- Dynamic Subdomains: Serve each store on its own subdomain. Use Next.js middleware to parse the requested host, and retrieve and render the correct store.
- Theme Customization: Store owners can customize the color theme of their store.

## Style Guidelines:

- Primary color: Light blue (#64B5F6), suggesting trust and reliability for e-commerce.
- Background color: Very light blue (#F0F8FF), providing a clean and unobtrusive backdrop.
- Accent color: A slightly more saturated blue (#42A5F5) to highlight important UI elements, but remain harmonious with the app's identity.
- Font: 'Inter', a grotesque sans-serif for clear UI and readable product descriptions.
- Simple, outlined icons to represent product categories and actions, keeping the interface uncluttered.
- Clean and organized layout with clear product grids and easy navigation. Ensure responsiveness across all devices.
- Subtle transitions and loading animations to enhance user experience without being distracting.