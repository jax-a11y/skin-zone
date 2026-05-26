# User Roles and Permissions for Beauty Marketplace

## 1. Introduction

This document defines the comprehensive user roles and permissions framework for our multi-tenant beauty marketplace. The system implements a role-based access control (RBAC) model with tenant isolation to ensure secure and appropriate access to functionality and data across the platform.

## 2. Multi-Tenant Access Control Architecture

### 2.1 Access Control Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Multi-Tenant Access Control Model                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐                                                   │
│  │ Authentication│                                                   │
│  │   Service    │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │ Authorization│     │  Tenant      │     │  Role        │        │
│  │   Service    │────>│  Context     │────>│  Definitions │        │
│  └──────┬───────┘     └──────────────┘     └──────────────┘        │
│         │                                          │               │
│         ▼                                          ▼               │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │ Permission   │     │  Resource    │     │  Policy      │        │
│  │  Evaluation  │<────│  Registry    │<────│  Engine      │        │
│  └──────┬───────┘     └──────────────┘     └──────────────┘        │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │ Access       │                                                   │
│  │ Decision     │                                                   │
│  └──────────────┘                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Components

1. **Authentication Service**: Verifies user identity through credentials or SSO
2. **Authorization Service**: Determines user permissions based on roles and context
3. **Tenant Context**: Establishes the tenant scope for all operations
4. **Role Definitions**: Defines capabilities and responsibilities for each role
5. **Policy Engine**: Applies access control rules based on roles and resources
6. **Resource Registry**: Catalogs all protected resources in the system
7. **Permission Evaluation**: Determines if a specific action is allowed
8. **Access Decision**: Final determination of whether access is granted or denied

### 2.3 Multi-Tenancy Implementation

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Multi-Tenant Implementation                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Platform Tenant                         │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ Platform     │  │ Global       │  │ System       │       │   │
│  │  │ Admin        │  │ Settings     │  │ Monitoring   │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐         │
│  │      Tenant A            │  │      Tenant B            │         │
│  │                          │  │                          │         │
│  │  ┌────────┐  ┌────────┐  │  │  ┌────────┐  ┌────────┐  │         │
│  │  │ Users  │  │ Data   │  │  │  │ Users  │  │ Data   │  │         │
│  │  └────────┘  └────────┘  │  │  └────────┘  └────────┘  │         │
│  │                          │  │                          │         │
│  │  ┌────────┐  ┌────────┐  │  │  ┌────────┐  ┌────────┐  │         │
│  │  │ Roles  │  │Settings│  │  │  │ Roles  │  │Settings│  │         │
│  │  └────────┘  └────────┘  │  │  └────────┘  └────────┘  │         │
│  └──────────────────────────┘  └──────────────────────────┘         │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Shared Resources                          │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ Reference    │  │ Marketplace  │  │ Knowledge    │       │   │
│  │  │ Data         │  │ Listings     │  │ Base         │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Core Role Types

### 3.1 Platform Roles

| Role | Description | Scope |
|------|-------------|-------|
| Platform Administrator | Manages the entire platform, all tenants, and global settings | Global |
| Platform Support | Provides technical support across tenants with limited administrative access | Global |
| Platform Analyst | Accesses cross-tenant analytics and reporting with no administrative capabilities | Global |
| Platform Content Manager | Manages shared content, knowledge base, and reference data | Global |

### 3.2 Tenant Roles

| Role | Description | Scope |
|------|-------------|-------|
| Tenant Administrator | Manages all aspects of a specific tenant | Tenant |
| Tenant Manager | Manages operational aspects of a tenant with limited administrative access | Tenant |
| Tenant Support | Provides support for users within a tenant | Tenant |
| Tenant Analyst | Accesses analytics and reporting for a specific tenant | Tenant |

### 3.3 Business Entity Roles

| Role | Description | Scope |
|------|-------------|-------|
| Brand Administrator | Manages all aspects of a brand within a tenant | Brand |
| Brand Manager | Manages products, formulations, and marketing for a brand | Brand |
| Salon Owner | Manages all aspects of a salon within a tenant | Salon |
| Salon Manager | Manages day-to-day operations of a salon | Salon |
| Therapist | Provides treatments and services to customers | Salon |
| Supplier Administrator | Manages ingredient supply and quality information | Supplier |

### 3.4 Customer Roles

| Role | Description | Scope |
|------|-------------|-------|
| Customer | Accesses marketplace, books appointments, and purchases products | Personal |
| VIP Customer | Premium customer with additional privileges and personalized service | Personal |
| Guest | Limited access to public information and basic functionality | Public |

## 4. Detailed Role Permissions

### 4.1 Platform Administrator

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Platform Administrator                          │
├─────────────────────────────────────────────────────────────────────┤
│ Tenant Management:                                                  │
│ - Create, update, and delete tenants                                │
│ - Configure tenant settings and subscription plans                  │
│ - Monitor tenant usage and performance                              │
│ - Access all tenant data for support purposes                       │
│                                                                     │
│ User Management:                                                    │
│ - Create and manage platform-level users                            │
│ - Reset passwords and manage access for any user                    │
│ - Define and assign platform roles                                  │
│                                                                     │
│ System Configuration:                                               │
│ - Configure global system settings                                  │
│ - Manage AppDirect integration settings                             │
│ - Configure HGNN database parameters                                │
│ - Manage system-wide security policies                              │
│                                                                     │
│ Analytics and Reporting:                                            │
│ - Access platform-wide analytics and reporting                      │
│ - Configure analytics settings and dashboards                       │
│ - Export system-wide reports                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tenant Administrator

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Tenant Administrator                           │
├─────────────────────────────────────────────────────────────────────┤
│ User Management:                                                    │
│ - Create, update, and delete users within the tenant                │
│ - Define and assign tenant-specific roles                           │
│ - Manage user permissions and access controls                       │
│ - Reset passwords for tenant users                                  │
│                                                                     │
│ Entity Management:                                                  │
│ - Create and manage brands, salons, and suppliers                   │
│ - Approve or reject entity registration requests                    │
│ - Configure entity-specific settings                                │
│                                                                     │
│ Tenant Configuration:                                               │
│ - Configure tenant-specific settings                                │
│ - Manage subscription and billing information                       │
│ - Configure integration settings                                    │
│ - Customize branding and appearance                                 │
│                                                                     │
│ Analytics and Reporting:                                            │
│ - Access tenant-wide analytics and reporting                        │
│ - Configure tenant-specific dashboards                              │
│ - Export tenant-wide reports                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Brand Administrator

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Brand Administrator                           │
├─────────────────────────────────────────────────────────────────────┤
│ Product Management:                                                 │
│ - Create, update, and delete products                               │
│ - Manage product formulations and ingredients                       │
│ - Configure product pricing and availability                        │
│ - Manage product categories and attributes                          │
│                                                                     │
│ User Management:                                                    │
│ - Create and manage brand-specific users                            │
│ - Assign roles within the brand context                             │
│                                                                     │
│ Marketing and Content:                                              │
│ - Manage brand profile and information                              │
│ - Create and publish marketing content                              │
│ - Configure brand-specific promotions                               │
│                                                                     │
│ Analytics and Reporting:                                            │
│ - Access brand-specific analytics and reporting                     │
│ - Monitor product performance and sales                             │
│ - Export brand-specific reports                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Salon Owner

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Salon Owner                                │
├─────────────────────────────────────────────────────────────────────┤
│ Salon Management:                                                   │
│ - Configure salon profile and information                           │
│ - Manage salon operating hours and availability                     │
│ - Configure service menu and pricing                                │
│ - Manage salon facilities and amenities                             │
│                                                                     │
│ Staff Management:                                                   │
│ - Create and manage salon staff accounts                            │
│ - Assign roles and permissions to staff                             │
│ - Configure therapist profiles and specialties                      │
│ - Manage staff schedules and availability                           │
│                                                                     │
│ Inventory Management:                                               │
│ - Manage product inventory and ordering                             │
│ - Configure product usage for treatments                            │
│ - Set up automatic reordering rules                                 │
│                                                                     │
│ Customer Management:                                                │
│ - Access and manage customer information                            │
│ - Configure customer loyalty programs                               │
│ - Manage customer communications                                    │
│                                                                     │
│ Analytics and Reporting:                                            │
│ - Access salon-specific analytics and reporting                     │
│ - Monitor appointment bookings and revenue                          │
│ - Export salon-specific reports                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.5 Therapist

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Therapist                                 │
├─────────────────────────────────────────────────────────────────────┤
│ Appointment Management:                                             │
│ - View and manage personal appointment schedule                     │
│ - Update appointment status and notes                               │
│ - Record treatment details and outcomes                             │
│                                                                     │
│ Customer Interaction:                                               │
│ - View customer profiles and history                                │
│ - Record customer preferences and notes                             │
│ - Recommend products and treatments                                 │
│                                                                     │
│ Treatment Execution:                                                │
│ - Access treatment protocols and instructions                       │
│ - Record product usage during treatments                            │
│ - Document treatment results and feedback                           │
│                                                                     │
│ Personal Performance:                                               │
│ - View personal performance metrics                                 │
│ - Access training materials and protocols                           │
│ - Manage personal profile and qualifications                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.6 Supplier Administrator

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Supplier Administrator                          │
├─────────────────────────────────────────────────────────────────────┤
│ Ingredient Management:                                              │
│ - Create and manage ingredient catalog                              │
│ - Update ingredient specifications and documentation                │
│ - Manage ingredient batches and quality information                 │
│ - Configure ingredient pricing and availability                     │
│                                                                     │
│ Quality Management:                                                 │
│ - Upload and manage quality certifications                          │
│ - Record and track quality test results                             │
│ - Manage compliance documentation                                   │
│                                                                     │
│ Order Management:                                                   │
│ - View and process incoming orders                                  │
│ - Manage order fulfillment and shipping                             │
│ - Configure order settings and policies                             │
│                                                                     │
│ Analytics and Reporting:                                            │
│ - Access supplier-specific analytics                                │
│ - Monitor ingredient performance and demand                         │
│ - Export supplier-specific reports                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.7 Customer

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Customer                                 │
├─────────────────────────────────────────────────────────────────────┤
│ Account Management:                                                 │
│ - Manage personal profile and preferences                           │
│ - Update contact information and settings                           │
│ - View order history and appointments                               │
│ - Manage payment methods and billing information                    │
│                                                                     │
│ Marketplace Interaction:                                            │
│ - Browse and search products and services                           │
│ - View salon profiles and therapist information                     │
│ - Read and submit reviews and ratings                               │
│ - Receive personalized recommendations                              │
│                                                                     │
│ Booking and Purchasing:                                             │
│ - Book salon appointments and treatments                            │
│ - Purchase products through the marketplace                         │
│ - Manage shopping cart and wishlist                                 │
│ - Track orders and appointments                                     │
│                                                                     │
│ Communication:                                                      │
│ - Receive notifications and reminders                               │
│ - Communicate with salons and therapists                            │
│ - Provide feedback and treatment preferences                        │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Permission Categories

### 5.1 Data Access Permissions

| Permission Category | Description | Example Permissions |
|---------------------|-------------|---------------------|
| Read | View data without modification | View product details, View appointment schedule |
| Write | Create and modify data | Create product, Update salon profile |
| Delete | Remove data from the system | Delete treatment, Remove customer record |
| Export | Extract data from the system | Export analytics report, Download customer list |

### 5.2 Functional Permissions

| Permission Category | Description | Example Permissions |
|---------------------|-------------|---------------------|
| Administrative | System configuration and management | Configure system settings, Manage roles |
| Operational | Day-to-day business operations | Process orders, Manage appointments |
| Analytical | Reporting and data analysis | View dashboards, Generate reports |
| Communication | User interactions and messaging | Send notifications, Chat with customers |

### 5.3 Resource-Specific Permissions

| Resource Type | Permission Levels | Applicable Roles |
|---------------|-------------------|------------------|
| Tenant | View, Manage, Administer | Platform Admin, Tenant Admin |
| Brand | View, Manage, Administer | Tenant Admin, Brand Admin, Brand Manager |
| Salon | View, Manage, Administer | Tenant Admin, Salon Owner, Salon Manager |
| Product | View, Manage, Administer | Brand Admin, Brand Manager, Salon Owner |
| Treatment | View, Manage, Administer | Salon Owner, Salon Manager, Therapist |
| Ingredient | View, Manage, Administer | Supplier Admin, Brand Admin, Platform Admin |
| Customer | View, Manage | Salon Owner, Salon Manager, Therapist |
| Appointment | View, Manage, Book | Customer, Therapist, Salon Manager |

## 6. Role Assignment and Management

### 6.1 Role Assignment Flow

```
┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│Admin    │     │User         │     │Role           │     │Permission     │
│User     │     │Management   │     │Service        │     │Service        │
└────┬────┘     └──────┬──────┘     └───────┬───────┘     └───────┬───────┘
     │                 │                    │                     │
     │ Assign Role     │                    │                     │
     │ to User         │                    │                     │
     │────────────────>│                    │                     │
     │                 │                    │                     │
     │                 │ Create Role        │                     │
     │                 │ Assignment         │                     │
     │                 │───────────────────>│                     │
     │                 │                    │                     │
     │                 │                    │ Update User         │
     │                 │                    │ Permissions         │
     │                 │                    │────────────────────>│
     │                 │                    │                     │
     │                 │                    │ Permissions         │
     │                 │                    │ Updated             │
     │                 │                    │<────────────────────│
     │                 │                    │                     │
     │                 │ Role Assignment    │                     │
     │                 │ Complete           │                     │
     │                 │<───────────────────│                     │
     │                 │                    │                     │
     │ Assignment      │                    │                     │
     │ Confirmation    │                    │                     │
     │<────────────────│                    │                     │
     │                 │                    │                     │
```

### 6.2 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Role Hierarchy                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌──────────────────┐                             │
│                    │Platform          │                             │
│                    │Administrator     │                             │
│                    └────────┬─────────┘                             │
│                             │                                       │
│              ┌──────────────┴──────────────┐                        │
│              │                             │                        │
│    ┌─────────▼─────────┐         ┌─────────▼─────────┐              │
│    │Platform           │         │Tenant             │              │
│    │Support            │         │Administrator      │              │
│    └───────────────────┘         └─────────┬─────────┘              │
│                                            │                        │
│                  ┌────────────────────┬────┴────┬───────────────┐   │
│                  │                    │         │               │   │
│        ┌─────────▼─────────┐ ┌───────▼───────┐ │    ┌──────────▼──┐ │
│        │Brand              │ │Salon          │ │    │Supplier     │ │
│        │Administrator      │ │Owner          │ │    │Administrator│ │
│        └─────────┬─────────┘ └───────┬───────┘ │    └─────────────┘ │
│                  │                   │         │                     │
│        ┌─────────▼─────────┐ ┌───────▼───────┐ │                    │
│        │Brand              │ │Salon          │ │                    │
│        │Manager            │ │Manager        │ │                    │
│        └───────────────────┘ └───────┬───────┘ │                    │
│                                      │         │                    │
│                              ┌───────▼───────┐ │                    │
│                              │Therapist      │ │                    │
│                              └───────────────┘ │                    │
│                                                │                    │
│                                      ┌─────────▼─────────┐          │
│                                      │Customer           │          │
│                                      └───────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Role Templates

| Template | Description | Included Roles |
|----------|-------------|----------------|
| Salon Basic | Standard setup for small salons | Salon Owner, Therapist |
| Salon Professional | Enhanced setup for medium salons | Salon Owner, Salon Manager, Therapist |
| Salon Enterprise | Comprehensive setup for large salon chains | Salon Owner, Salon Manager, Therapist, Salon Analyst |
| Brand Basic | Standard setup for small brands | Brand Administrator |
| Brand Professional | Enhanced setup for medium brands | Brand Administrator, Brand Manager |
| Brand Enterprise | Comprehensive setup for large brands | Brand Administrator, Brand Manager, Brand Analyst, Brand Content Manager |

## 7. Permission Enforcement

### 7.1 API-Level Enforcement

```java
// Example API-level permission enforcement
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private AuthorizationService authService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable("id") String id) {
        // Check if user has permission to view this product
        if (!authService.hasPermission("product:read", id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Product product = productService.getProduct(id);
        return ResponseEntity.ok(product);
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Check if user has permission to create products
        if (!authService.hasPermission("product:create", null)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Check if user has permission to create products for this brand
        if (!authService.hasPermission("brand:manage", product.getBrandId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    // Other endpoints with similar permission checks
}
```

### 7.2 Database-Level Enforcement

```sql
-- Example of row-level security in PostgreSQL
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    brand_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    -- other fields
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Create policy for row-level security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for platform administrators (can see all products)
CREATE POLICY platform_admin_policy ON products
    USING (current_user_role() = 'platform_admin');

-- Policy for tenant administrators (can see all products in their tenant)
CREATE POLICY tenant_admin_policy ON products
    USING (tenant_id = current_tenant_id());

-- Policy for brand administrators (can see all products in their brand)
CREATE POLICY brand_admin_policy ON products
    USING (brand_id = current_brand_id());

-- Policy for salon owners (can see products they have purchased)
CREATE POLICY salon_owner_policy ON products
    USING (id IN (SELECT product_id FROM salon_inventory WHERE salon_id = current_salon_id()));
```

### 7.3 UI-Level Enforcement

```javascript
// Example of UI-level permission enforcement in React
function ProductManagement({ user }) {
  const [products, setProducts] = useState([]);
  const permissions = usePermissions(user);
  
  useEffect(() => {
    // Fetch products
    fetchProducts().then(setProducts);
  }, []);
  
  return (
    <div className="product-management">
      <h1>Product Management</h1>
      
      {/* Only show create button if user has permission */}
      {permissions.has('product:create') && (
        <button className="create-button">Create New Product</button>
      )}
      
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.price}</td>
              <td>
                {/* Only show edit button if user has permission */}
                {permissions.has('product:update', product.id) && (
                  <button className="edit-button">Edit</button>
                )}
                
                {/* Only show delete button if user has permission */}
                {permissions.has('product:delete', product.id) && (
                  <button className="delete-button">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 8. Integration with AppDirect

### 8.1 Role Mapping

| AppDirect Role | Beauty Marketplace Role |
|----------------|-------------------------|
| Company Administrator | Tenant Administrator |
| Technical Contact | Tenant Manager |
| Billing Contact | Tenant Billing Manager |
| User | Determined by assignment |

### 8.2 Permission Synchronization

```
┌─────────┐     ┌─────────────┐     ┌───────────────┐
│AppDirect│     │AD Connector │     │Role Service   │
└────┬────┘     └──────┬──────┘     └───────┬───────┘
     │                 │                    │
     │ User           │                    │
     │ Assignment     │                    │
     │ Event          │                    │
     │────────────────>│                    │
     │                 │                    │
     │                 │ Map AppDirect      │
     │                 │ Role to Platform   │
     │                 │ Role              │
     │                 │───────────────────>│
     │                 │                    │
     │                 │ Role Mapped        │
     │                 │<───────────────────│
     │                 │                    │
     │                 │ Assign Role        │
     │                 │ to User            │
     │                 │───────────────────>│
     │                 │                    │
     │                 │ Role Assigned      │
     │                 │<───────────────────│
     │                 │                    │
     │ Assignment      │                    │
     │ Successful      │                    │
     │<────────────────│                    │
     │                 │                    │
```

### 8.3 Single Sign-On (SSO)

```
┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│AppDirect│     │AD Connector │     │Auth Service   │     │Role Service   │
└────┬────┘     └──────┬──────┘     └───────┬───────┘     └───────┬───────┘
     │                 │                    │                     │
     │ SSO Request    │                    │                     │
     │ with Token     │                    │                     │
     │────────────────>│                    │                     │
     │                 │                    │                     │
     │                 │ Validate Token     │                     │
     │                 │───────────────────>│                     │
     │                 │                    │                     │
     │                 │ Token Valid        │                     │
     │                 │<───────────────────│                     │
     │                 │                    │                     │
     │                 │ Get User Roles     │                     │
     │                 │────────────────────────────────────────>│
     │                 │                    │                     │
     │                 │ User Roles         │                     │
     │                 │<────────────────────────────────────────│
     │                 │                    │                     │
     │                 │ Create Session     │                     │
     │                 │───────────────────>│                     │
     │                 │                    │                     │
     │                 │ Session Created    │                     │
     │                 │<───────────────────│                     │
     │                 │                    │                     │
     │ Redirect to     │                    │                     │
     │ Application     │                    │                     │
     │ with Session    │                    │                     │
     │<────────────────│                    │                     │
     │                 │                    │                     │
```

## 9. HGNN Data Access Control

### 9.1 Data Access Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                       HGNN Data Access Layers                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Public Layer                            │   │
│  │                                                              │   │
│  │  - Reference data (ingredients, regulations)                 │   │
│  │  - Published marketplace listings                            │   │
│  │  - Aggregated anonymous insights                             │   │
│  │  - Public knowledge base                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Tenant Layer                            │   │
│  │                                                              │   │
│  │  - Tenant-specific data                                      │   │
│  │  - Cross-entity insights within tenant                       │   │
│  │  - Tenant performance analytics                              │   │
│  │  - Tenant-wide customer data                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Entity Layer                            │   │
│  │                                                              │   │
│  │  - Brand-specific data                                       │   │
│  │  - Salon-specific data                                       │   │
│  │  - Supplier-specific data                                    │   │
│  │  - Entity performance analytics                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Restricted Layer                        │   │
│  │                                                              │   │
│  │  - Proprietary formulations                                  │   │
│  │  - Sensitive customer data                                   │   │
│  │  - Financial information                                     │   │
│  │  - Confidential business metrics                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Graph Traversal Restrictions

```python
# Example of graph traversal restrictions in Python
def get_product_recommendations(user_id, tenant_id, context):
    """
    Get personalized product recommendations with permission-aware graph traversal
    """
    # Get user permissions
    user_permissions = get_user_permissions(user_id)
    
    # Create permission-aware graph traversal
    traversal = HGNNTraversal(
        tenant_context=tenant_id,
        permission_context=user_permissions
    )
    
    # Define traversal query with permission filters
    if "admin:view_all_data" in user_permissions:
        # Administrators can see all data
        query = """
        MATCH (customer)-[purchased]->(product)-[contains]->(ingredient)
        WHERE customer.context = $context
        RETURN ingredient, count(customer) as popularity
        ORDER BY popularity DESC
        LIMIT 10
        """
    elif "salon:view_customer_data" in user_permissions:
        # Salon staff can see their customer data
        query = """
        MATCH (customer)-[purchased]->(product)-[contains]->(ingredient)
        WHERE customer.salon_id IN $authorized_salons
        AND customer.context = $context
        RETURN ingredient, count(customer) as popularity
        ORDER BY popularity DESC
        LIMIT 10
        """
    else:
        # Regular users can only see public data
        query = """
        MATCH (customer)-[purchased]->(product)-[contains]->(ingredient)
        WHERE product.is_public = true
        AND customer.context = $context
        RETURN ingredient, count(customer) as popularity
        ORDER BY popularity DESC
        LIMIT 10
        """
    
    # Execute query with context
    results = traversal.execute(query, {
        "context": context,
        "authorized_salons": get_user_authorized_salons(user_id)
    })
    
    return results
```

### 9.3 Analytical Access Controls

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Analytical Access Controls                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Data Masking:                                                       │
│ - PII anonymization for analytics                                   │
│ - Aggregation of sensitive metrics                                  │
│ - Differential privacy implementation                               │
│ - Randomized response techniques                                    │
│                                                                     │
│ Access Patterns:                                                    │
│ - Role-based dashboard access                                       │
│ - Metric-level permissions                                          │
│ - Contextual filtering of results                                   │
│ - Time-based access restrictions                                    │
│                                                                     │
│ Audit Controls:                                                     │
│ - Logging of analytical queries                                     │
│ - Usage pattern monitoring                                          │
│ - Anomaly detection for access patterns                             │
│ - Regular access review process                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 10. Implementation Considerations

### 10.1 Technical Implementation

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Technical Implementation                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Authentication:                                                     │
│ - OAuth 2.0 / OpenID Connect                                        │
│ - JWT token-based authentication                                    │
│ - Multi-factor authentication                                       │
│ - SSO integration with AppDirect                                    │
│                                                                     │
│ Authorization:                                                      │
│ - RBAC implementation with Spring Security                          │
│ - Custom permission evaluators                                      │
│ - Tenant context propagation                                        │
│ - Database row-level security                                       │
│                                                                     │
│ Caching:                                                            │
│ - Permission cache with time-based invalidation                     │
│ - Role hierarchy cache                                              │
│ - User context cache                                                │
│                                                                     │
│ Auditing:                                                           │
│ - Comprehensive access logs                                         │
│ - Permission change history                                         │
│ - Role assignment audit trail                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Performance Optimization

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Performance Optimization                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Permission Evaluation:                                              │
│ - Pre-computed permission matrices                                  │
│ - Hierarchical permission caching                                   │
│ - Lazy permission loading                                           │
│ - Batch permission checks                                           │
│                                                                     │
│ Database Access:                                                    │
│ - Optimized tenant filtering indexes                                │
│ - Denormalized permission tables                                    │
│ - Materialized permission views                                     │
│ - Query optimization for role checks                                │
│                                                                     │
│ API Optimization:                                                   │
│ - Permission-aware API responses                                    │
│ - Field-level filtering based on permissions                        │
│ - Compressed permission tokens                                      │
│ - Stateless permission verification                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.3 Scalability Considerations

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Scalability Considerations                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Horizontal Scaling:                                                 │
│ - Stateless authorization services                                  │
│ - Distributed permission caching                                    │
│ - Sharded permission databases                                      │
│ - Load-balanced authorization endpoints                             │
│                                                                     │
│ Multi-Tenancy Scaling:                                              │
│ - Tenant-specific permission caches                                 │
│ - Tenant isolation in permission storage                            │
│ - Dynamic tenant routing                                            │
│ - Tenant-aware connection pooling                                   │
│                                                                     │
│ Growth Management:                                                  │
│ - Role template versioning                                          │
│ - Permission migration strategies                                   │
│ - Incremental permission updates                                    │
│ - Backward compatibility support                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## 11. Integration with CEO (JAX-based) Subsystem

### 11.1 CEO Subsystem Overview

The CEO (Cognitive Execution Orchestration) subsystem, powered by JAX, provides advanced machine learning capabilities for the marketplace. This integration ensures that user roles and permissions are properly enforced when accessing the CEO's analytical capabilities.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CEO Subsystem Integration                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │ Permission   │     │ CEO          │     │ HGNN         │        │
│  │ Service      │────>│ Gateway      │────>│ Database     │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                              │                                     │
│                              ▼                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │ Role-Based   │     │ JAX ML       │     │ Insight      │        │
│  │ Analytics    │<────│ Engine       │────>│ Generation   │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                              │                                     │
│                              ▼                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │ Tenant       │     │ Permission   │     │ Audit        │        │
│  │ Isolation    │<────│ Enforcement  │────>│ Logging      │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 CEO Permission Model

| Permission Level | Description | Applicable Roles |
|------------------|-------------|------------------|
| CEO Admin | Full access to all CEO capabilities | Platform Administrator |
| CEO Analyst | Access to advanced analytics and model training | Tenant Administrator, Platform Analyst |
| CEO User | Access to insights and recommendations | Brand Administrator, Salon Owner |
| CEO Basic | Access to basic insights only | Brand Manager, Salon Manager, Therapist |

### 11.3 JAX-Based Permission Enforcement

```python
# Example of JAX-based permission enforcement
import jax
import jax.numpy as jnp
from jax import grad, jit, vmap

class CEOPermissionEnforcer:
    def __init__(self, permission_matrix):
        """
        Initialize with permission matrix
        """
        self.permission_matrix = jnp.array(permission_matrix)
    
    @jit
    def check_permission(self, user_id, resource_id, action):
        """
        Check if user has permission to perform action on resource
        """
        # Convert inputs to indices
        user_idx = self._get_user_index(user_id)
        resource_idx = self._get_resource_index(resource_id)
        action_idx = self._get_action_index(action)
        
        # Get permission value (0 or 1)
        permission = self.permission_matrix[user_idx, resource_idx, action_idx]
        
        return permission == 1
    
    @jit
    def batch_check_permissions(self, user_ids, resource_ids, actions):
        """
        Vectorized permission check for multiple requests
        """
        # Vectorize the permission check function
        vectorized_check = vmap(self.check_permission)
        
        # Perform batch permission check
        return vectorized_check(user_ids, resource_ids, actions)
    
    def update_permission_matrix(self, updates):
        """
        Update permission matrix with new values
        """
        # Convert updates to indices and values
        indices = jnp.array([
            [self._get_user_index(u), self._get_resource_index(r), self._get_action_index(a)]
            for u, r, a, _ in updates
        ])
        values = jnp.array([v for _, _, _, v in updates])
        
        # Update permission matrix
        self.permission_matrix = self.permission_matrix.at[indices[:, 0], indices[:, 1], indices[:, 2]].set(values)
```

## 12. Conclusion

This user roles and permissions framework provides a comprehensive approach to access control in the multi-tenant beauty marketplace. By implementing role-based access control with tenant isolation, the system ensures that users can only access the data and functionality appropriate for their role and context.

The integration with AppDirect enables seamless user provisioning and single sign-on, while the HGNN database access controls ensure that data insights are properly protected. The CEO subsystem integration provides advanced analytical capabilities with appropriate permission enforcement.

This framework is designed to be scalable, performant, and secure, supporting the diverse needs of all marketplace participants while maintaining strict data privacy and security standards.
