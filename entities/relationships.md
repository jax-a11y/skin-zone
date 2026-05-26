# Entity Relationships

This document maps the relationships between the key entities in our multi-tenant beauty marketplace.

## Primary Relationships

### Ingredient → Product
- **Relationship Type**: Many-to-Many
- **Description**: Products contain multiple ingredients, and ingredients can be used in multiple products
- **Attributes**:
  - concentration: Percentage or amount of ingredient in product
  - purpose: Purpose of ingredient in the specific product (e.g., active, preservative, fragrance)

### Product → Brand
- **Relationship Type**: Many-to-One
- **Description**: Products are created and owned by brands
- **Attributes**:
  - product_line: Product line within the brand
  - flagship_status: Whether product is a flagship product for the brand

### Brand → Salon
- **Relationship Type**: Many-to-Many
- **Description**: Salons carry multiple brands, and brands are carried by multiple salons
- **Attributes**:
  - partnership_level: Level of partnership (e.g., authorized retailer, premium partner)
  - start_date: When salon began carrying the brand

### Salon → Treatment
- **Relationship Type**: Many-to-Many
- **Description**: Salons offer multiple treatments, and treatments can be offered by multiple salons
- **Attributes**:
  - price: Salon-specific price for the treatment
  - duration: Salon-specific duration for the treatment
  - availability: When treatment is available at the salon

### Treatment → Product
- **Relationship Type**: Many-to-Many
- **Description**: Treatments use multiple products, and products can be used in multiple treatments
- **Attributes**:
  - quantity_used: Typical amount of product used in treatment
  - application_method: How product is applied during treatment

### Treatment → Ingredient
- **Relationship Type**: Many-to-Many
- **Description**: Treatments may directly use specific ingredients, and ingredients can be used in multiple treatments
- **Attributes**:
  - concentration: Concentration of ingredient in treatment
  - preparation_method: How ingredient is prepared for treatment

### Therapist → Salon
- **Relationship Type**: Many-to-One (primarily) or Many-to-Many (for freelancers)
- **Description**: Therapists work at salons, either exclusively or across multiple locations
- **Attributes**:
  - employment_type: Full-time, part-time, contractor
  - start_date: When therapist began working at salon

### Therapist → Treatment
- **Relationship Type**: Many-to-Many
- **Description**: Therapists are qualified to perform multiple treatments, and treatments can be performed by multiple therapists
- **Attributes**:
  - certification_date: When therapist was certified for treatment
  - expertise_level: Novice, intermediate, expert
  - client_rating: Average client rating for this therapist performing this treatment

### Brand → Treatment
- **Relationship Type**: One-to-Many
- **Description**: Brands may develop signature treatments
- **Attributes**:
  - is_proprietary: Whether treatment is proprietary to the brand
  - training_required: Whether special training is required

## Secondary Relationships

### Ingredient → Ingredient
- **Relationship Type**: Many-to-Many
- **Description**: Ingredients may complement or conflict with other ingredients
- **Attributes**:
  - relationship_type: Complementary, conflicting, enhancing
  - scientific_basis: Scientific explanation for the relationship

### Salon → Salon
- **Relationship Type**: Many-to-Many
- **Description**: Salons may have branch relationships or partnerships
- **Attributes**:
  - relationship_type: Branch, affiliate, partner
  - revenue_sharing: Whether revenue sharing exists between locations

### Product → Treatment
- **Relationship Type**: Many-to-Many
- **Description**: Products are recommended for use with specific treatments
- **Attributes**:
  - usage_phase: Before, during, or after treatment
  - recommendation_strength: Required, strongly recommended, optional

### Therapist → Brand
- **Relationship Type**: Many-to-Many
- **Description**: Therapists may be certified by specific brands
- **Attributes**:
  - certification_level: Level of brand certification
  - certification_date: When certification was obtained

## Multi-tenant Considerations

### Tenant → All Entities
- **Relationship Type**: One-to-Many
- **Description**: Each tenant (marketplace operator) may have their own set of entities or share from a common pool
- **Attributes**:
  - visibility: Public, private, or shared
  - customization_level: How much the tenant has customized the entity

### Supply Chain Relationships

### Ingredient Supplier → Ingredient
- **Relationship Type**: Many-to-Many
- **Description**: Ingredients are sourced from suppliers
- **Attributes**:
  - quality_grade: Grade of ingredient quality
  - sustainability_rating: Environmental sustainability rating
  - ethical_sourcing: Ethical sourcing certification

### Manufacturer → Product
- **Relationship Type**: Many-to-Many
- **Description**: Products are produced by manufacturers (may be the brand itself or contract manufacturers)
- **Attributes**:
  - production_location: Where product is manufactured
  - batch_size: Typical production batch size
  - quality_control: Quality control processes

### Distributor → Product/Brand
- **Relationship Type**: Many-to-Many
- **Description**: Distributors handle logistics between manufacturers and salons/retailers
- **Attributes**:
  - territory: Geographic territory covered
  - exclusivity: Whether distributor has exclusive rights
  - lead_time: Typical lead time for delivery
