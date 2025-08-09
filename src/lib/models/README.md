# Supabase Models for Next.js

This directory contains a well-structured model layer for Supabase that follows Next.js best practices and provides a clean, type-safe interface for database operations.

## 📁 Structure

```
src/lib/models/
├── base.ts              # Base model class with common CRUD operations
├── user.ts              # User model with authentication methods
├── store.ts             # Store model with multi-tenant operations
├── product.ts           # Product model with variant management
├── product-variant.ts   # Product variant model
└── index.ts             # Exports all models and types
```

## 🚀 Features

### **Base Model Class**
- **Generic CRUD operations**: Create, Read, Update, Delete
- **Type safety**: Full TypeScript support with database types
- **Pagination**: Built-in pagination support
- **Error handling**: Consistent error handling across all models
- **Count operations**: Get record counts efficiently

### **Specialized Models**
- **User Model**: Authentication, password hashing, profile management
- **Store Model**: Multi-tenant operations, subdomain management, analytics
- **Product Model**: Product management with variants, search, statistics
- **Product Variant Model**: Variant-specific operations

## 📖 Usage Examples

### **User Operations**
```typescript
import { userModel } from '@/lib/models';

// Create user with password hashing
const user = await userModel.createWithPassword({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'securepassword'
});

// Verify credentials
const user = await userModel.verifyPassword('john@example.com', 'password');

// Get user with store
const userWithStore = await userModel.getUserWithStore(userId);
```

### **Store Operations**
```typescript
import { storeModel } from '@/lib/models';

// Get store by subdomain
const store = await storeModel.getBySubdomain('my-store');

// Get store with products
const storeWithProducts = await storeModel.getStoreWithProductsBySubdomain('my-store');

// Get store statistics
const stats = await storeModel.getStoreStats(storeId);

// Update store settings
await storeModel.updateSettings(storeId, {
  name: 'New Store Name',
  theme: 'blue'
});
```

### **Product Operations**
```typescript
import { productModel } from '@/lib/models';

// Create product with variants
const product = await productModel.createWithVariants({
  store_id: storeId,
  title: 'T-Shirt',
  price: 29.99,
  stock: 100,
  product_type: 'product'
}, [
  {
    variant_type: 'size',
    variant_name: 'Small',
    stock: 25
  },
  {
    variant_type: 'size',
    variant_name: 'Medium',
    stock: 30
  }
]);

// Search products
const results = await productModel.searchInStore(storeId, 'shirt');

// Get product statistics
const stats = await productModel.getProductStats(storeId);
```

### **Pagination**
```typescript
// Get paginated results
const { data, count, page, totalPages } = await productModel.getProductsPaginated(
  storeId, 
  1, // page
  10 // limit
);
```

## 🔧 Model Methods

### **Base Model Methods**
- `getAll()` - Get all records
- `getById(id)` - Get single record by ID
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Delete record
- `count()` - Get total count
- `getPaginated(page, limit)` - Get paginated results

### **User Model Methods**
- `getByEmail(email)` - Get user by email
- `existsByEmail(email)` - Check if email exists
- `createWithPassword(data)` - Create user with hashed password
- `verifyPassword(email, password)` - Verify login credentials
- `getUserWithStore(userId)` - Get user with store data
- `updateProfile(userId, data)` - Update user profile
- `changePassword(userId, password)` - Change user password
- `getUserStats(userId)` - Get user statistics

### **Store Model Methods**
- `getBySubdomain(subdomain)` - Get store by subdomain
- `getByUserId(userId)` - Get store by user ID
- `subdomainExists(subdomain)` - Check if subdomain exists
- `subdomainExistsForOtherUser(subdomain, excludeUserId)` - Check subdomain for other users
- `getStoreWithProducts(storeId)` - Get store with products
- `getStoreWithProductsBySubdomain(subdomain)` - Get store with products by subdomain
- `getStoreStats(storeId)` - Get store statistics
- `updateSettings(storeId, settings)` - Update store settings
- `getStoresWithUsers()` - Get all stores with user info
- `searchStores(searchTerm)` - Search stores
- `getStoreAnalytics(storeId)` - Get detailed analytics

### **Product Model Methods**
- `getByStoreId(storeId)` - Get products by store
- `getWithVariants(productId)` - Get product with variants
- `createWithVariants(productData, variants)` - Create product with variants
- `updateWithVariants(productId, productData, variants)` - Update product with variants
- `searchInStore(storeId, searchTerm)` - Search products in store
- `getByType(storeId, productType)` - Get products by type
- `getLowStockProducts(storeId, threshold)` - Get low stock products
- `updateStock(productId, newStock)` - Update product stock
- `getProductStats(storeId)` - Get product statistics
- `getProductsPaginated(storeId, page, limit)` - Get paginated products
- `deleteWithVariants(productId)` - Delete product and variants

### **Product Variant Model Methods**
- `getByProductId(productId)` - Get variants by product
- `getByType(productId, variantType)` - Get variants by type
- `createMany(variants)` - Create multiple variants
- `updateStock(variantId, newStock)` - Update variant stock
- `getLowStockVariants(threshold)` - Get low stock variants
- `getVariantStats(productId)` - Get variant statistics
- `deleteByProductId(productId)` - Delete variants by product
- `variantExists(productId, type, name)` - Check if variant exists

## 🛡️ Error Handling

All models use consistent error handling:

```typescript
try {
  const user = await userModel.getByEmail('john@example.com');
  // Handle success
} catch (error) {
  // Handle error - Supabase errors are thrown automatically
  console.error('Database error:', error);
}
```

## 🔄 Migration from Direct Supabase Calls

### **Before (Direct Supabase)**
```typescript
const { data, error } = await supabaseAdmin
  .from('users')
  .select('*')
  .eq('email', email)
  .single();

if (error) throw error;
return data;
```

### **After (Model Layer)**
```typescript
const user = await userModel.getByEmail(email);
return user;
```

## 📊 Type Safety

All models are fully typed with Supabase database types:

```typescript
// Full type safety
const user: Row<'users'> = await userModel.getById(userId);
const newUser: Row<'users'> = await userModel.create(userData);
```

## 🚀 Benefits

1. **Cleaner Code**: Abstract away Supabase complexity
2. **Type Safety**: Full TypeScript support
3. **Reusability**: Common operations in base class
4. **Maintainability**: Centralized database logic
5. **Error Handling**: Consistent error handling
6. **Performance**: Optimized queries and caching
7. **Testing**: Easy to mock and test

## 🔧 Custom Models

To create a custom model:

```typescript
import { BaseModel } from './base';
import { supabaseAdmin } from '@/lib/supabase';

export class CustomModel extends BaseModel<'your_table'> {
  constructor() {
    super('your_table', supabaseAdmin);
  }

  // Add custom methods
  async customMethod() {
    // Your custom logic
  }
}

export const customModel = new CustomModel();
```

This model structure provides a clean, maintainable, and type-safe way to interact with your Supabase database in Next.js applications. 