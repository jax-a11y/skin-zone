# HGNN Database Schema for Beauty Marketplace

## 1. Introduction to HGNN Database

A Hyper-Graph Neural Network (HGNN) database extends traditional graph databases by supporting hyperedges that can connect more than two nodes simultaneously. This capability is particularly valuable for modeling complex relationships in the beauty industry supply chain, where multiple entities often interact in a single relationship (e.g., a treatment using multiple products containing various ingredients performed by a specific therapist at a particular salon).

## 2. Core Schema Components

### 2.1 Node Types

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Ingredient   │     │     Product     │     │      Brand      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ name            │     │ name            │     │ name            │
│ scientific_name │     │ description     │     │ description     │
│ category        │     │ category        │     │ website         │
│ description     │     │ subcategory     │     │ logo_url        │
│ benefits        │     │ price           │     │ product_categories│
│ properties      │     │ image_url       │     │ target_market   │
│ source          │     │ usage_instructions│   │ price_range     │
│ image_url       │     │ benefits        │     │ country_of_origin│
│ safety_rating   │     │ target_concerns │     │ year_founded    │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Salon      │     │    Treatment    │     │    Therapist    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ name            │     │ name            │     │ name            │
│ address         │     │ category        │     │ specialties     │
│ city            │     │ description     │     │ qualifications  │
│ postal_code     │     │ duration        │     │ experience_years│
│ country         │     │ price_range     │     │ bio             │
│ phone           │     │ benefits        │     │ image_url       │
│ email           │     │ contraindications│    │ languages       │
│ website         │     │ image_url       │     │ availability    │
│ description     │     │                 │     │ rating          │
│ operating_hours │     │                 │     │ review_count    │
│ rating          │     │                 │     │                 │
│ review_count    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Supplier    │     │    Customer     │     │     Tenant      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ name            │     │ name            │     │ name            │
│ type            │     │ email           │     │ type            │
│ address         │     │ phone           │     │ subscription_plan│
│ contact_info    │     │ preferences     │     │ branding        │
│ certifications  │     │ skin_type       │     │ domain          │
│ sustainability_rating│ │ hair_type      │     │ settings        │
│ quality_rating  │     │ concerns        │     │ created_at      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.2 Edge Types

```
┌─────────────────────┐     ┌─────────────────────┐
│  CONTAINS_INGREDIENT │     │    MANUFACTURED_BY  │
├─────────────────────┤     ├─────────────────────┤
│ from: Product       │     │ from: Product       │
│ to: Ingredient      │     │ to: Brand           │
│ concentration       │     │ product_line        │
│ purpose             │     │ flagship_status     │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│    CARRIES_BRAND    │     │    OFFERS_TREATMENT │
├─────────────────────┤     ├─────────────────────┤
│ from: Salon         │     │ from: Salon         │
│ to: Brand           │     │ to: Treatment       │
│ partnership_level   │     │ price               │
│ start_date          │     │ duration            │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│    USES_PRODUCT     │     │    USES_INGREDIENT  │
├─────────────────────┤     ├─────────────────────┤
│ from: Treatment     │     │ from: Treatment     │
│ to: Product         │     │ to: Ingredient      │
│ quantity_used       │     │ concentration       │
│ application_method  │     │ preparation_method  │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│    EMPLOYS          │     │    CAN_PERFORM      │
├─────────────────────┤     ├─────────────────────┤
│ from: Salon         │     │ from: Therapist     │
│ to: Therapist       │     │ to: Treatment       │
│ employment_type     │     │ certification_date  │
│ start_date          │     │ expertise_level     │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│    SUPPLIES         │     │    CERTIFIED_BY     │
├─────────────────────┤     ├─────────────────────┤
│ from: Supplier      │     │ from: Therapist     │
│ to: Ingredient      │     │ to: Brand           │
│ quality_grade       │     │ certification_level │
│ sustainability_rating│    │ certification_date  │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│    BOOKS            │     │    BELONGS_TO       │
├─────────────────────┤     ├─────────────────────┤
│ from: Customer      │     │ from: Any Entity    │
│ to: Treatment       │     │ to: Tenant          │
│ booking_date        │     │ visibility          │
│ status              │     │ customization_level │
└─────────────────────┘     └─────────────────────┘
```

### 2.3 Hyperedge Types

```
┌───────────────────────────────────────────────────────────────┐
│                      TREATMENT_INSTANCE                       │
├───────────────────────────────────────────────────────────────┤
│ Nodes:                                                        │
│   - Customer (who received the treatment)                     │
│   - Therapist (who performed the treatment)                   │
│   - Treatment (what was performed)                            │
│   - Salon (where it was performed)                            │
│   - Products (what was used)                                  │
│                                                               │
│ Attributes:                                                   │
│   - datetime: When the treatment was performed                │
│   - duration: How long it took                                │
│   - price: What was charged                                   │
│   - outcome_rating: Customer satisfaction                     │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      PRODUCT_FORMULATION                      │
├───────────────────────────────────────────────────────────────┤
│ Nodes:                                                        │
│   - Product (the finished product)                            │
│   - Brand (who created it)                                    │
│   - Ingredients (what it contains)                            │
│   - Supplier (who supplied key ingredients)                   │
│                                                               │
│ Attributes:                                                   │
│   - formulation_date: When it was formulated                  │
│   - batch_number: Production batch                            │
│   - quality_score: Quality assessment                         │
│   - sustainability_score: Environmental impact                │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      SUPPLY_CHAIN_EVENT                       │
├───────────────────────────────────────────────────────────────┤
│ Nodes:                                                        │
│   - Supplier (source)                                         │
│   - Ingredient (what was supplied)                            │
│   - Brand (recipient for manufacturing)                       │
│   - Product (what was produced)                               │
│   - Salon (final destination)                                 │
│                                                               │
│ Attributes:                                                   │
│   - event_date: When the event occurred                       │
│   - event_type: Type of supply chain event                    │
│   - quantity: Amount involved                                 │
│   - quality_check: Quality verification results               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      CUSTOMER_JOURNEY                         │
├───────────────────────────────────────────────────────────────┤
│ Nodes:                                                        │
│   - Customer                                                  │
│   - Treatments (received over time)                           │
│   - Products (purchased or used)                              │
│   - Salons (visited)                                          │
│   - Therapists (who provided services)                        │
│                                                               │
│ Attributes:                                                   │
│   - start_date: When the journey began                        │
│   - touchpoints: Number of interactions                       │
│   - lifetime_value: Total customer spend                      │
│   - satisfaction_trend: Change in satisfaction over time      │
└───────────────────────────────────────────────────────────────┘
```

## 3. HGNN Schema Implementation

### 3.1 Node Properties and Embeddings

Each node type in the HGNN will have:

1. **Static Properties**: The attributes listed in the node type definitions
2. **Dynamic Properties**: Calculated or aggregated values that change over time
3. **Embeddings**: Vector representations learned by the neural network component

Example for Ingredient node:
```json
{
  "id": "ing-12345",
  "name": "Hyaluronic Acid",
  "scientific_name": "Sodium Hyaluronate",
  "category": "Humectant",
  "description": "Powerful moisturizing ingredient that can hold up to 1000x its weight in water",
  "benefits": ["Hydration", "Plumping", "Anti-aging"],
  "properties": {
    "molecular_weight": "Low",
    "solubility": "Water-soluble",
    "pH": 5.5
  },
  "source": "Biotechnology",
  "image_url": "https://example.com/images/hyaluronic-acid.jpg",
  "safety_rating": 1,
  
  "dynamic_properties": {
    "popularity_score": 0.87,
    "trend_direction": "increasing",
    "supply_risk": "low"
  },
  
  "embedding": [0.23, 0.45, -0.12, 0.78, ...]
}
```

### 3.2 Edge Properties and Weights

Edges in the HGNN will have:

1. **Static Properties**: The attributes listed in the edge type definitions
2. **Weights**: Learned or calculated importance of the relationship
3. **Temporal Features**: Time-based aspects of the relationship

Example for CONTAINS_INGREDIENT edge:
```json
{
  "from": "prod-78901",
  "to": "ing-12345",
  "concentration": "2%",
  "purpose": "Active ingredient",
  
  "weight": 0.85,
  "temporal_features": {
    "first_used": "2023-06-15",
    "formulation_changes": 2,
    "stability_score": 0.92
  }
}
```

### 3.3 Hyperedge Implementation

Hyperedges will be implemented as special nodes that connect to all participating nodes:

```json
{
  "id": "treatment-instance-56789",
  "type": "TREATMENT_INSTANCE",
  "datetime": "2025-05-15T14:30:00Z",
  "duration": 60,
  "price": 120.00,
  "outcome_rating": 4.8,
  
  "connections": [
    {"node_id": "cust-34567", "role": "customer"},
    {"node_id": "ther-23456", "role": "therapist"},
    {"node_id": "treat-45678", "role": "treatment"},
    {"node_id": "salon-12345", "role": "salon"},
    {"node_id": "prod-78901", "role": "product", "quantity_used": "15ml"},
    {"node_id": "prod-78902", "role": "product", "quantity_used": "5ml"}
  ],
  
  "embedding": [0.34, -0.21, 0.67, 0.12, ...]
}
```

## 4. HGNN Neural Network Architecture

### 4.1 Node Embedding Layer

```
┌─────────────────────────────────────────────────────────────┐
│                   Node Embedding Layer                      │
├─────────────────────────────────────────────────────────────┤
│ Input: Node features (attributes)                           │
│ Output: Initial node embeddings                             │
│                                                             │
│ Components:                                                 │
│   - Feature transformation networks                         │
│   - Type-specific embedding generators                      │
│   - Categorical feature encoders                            │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Message Passing Layers

```
┌─────────────────────────────────────────────────────────────┐
│                 Message Passing Layers                      │
├─────────────────────────────────────────────────────────────┤
│ Input: Node embeddings, edge properties                     │
│ Output: Updated node embeddings                             │
│                                                             │
│ Components:                                                 │
│   - Edge-conditioned convolution                            │
│   - Attention mechanisms                                    │
│   - Skip connections                                        │
│   - Hyperedge aggregation functions                         │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Readout Layer

```
┌─────────────────────────────────────────────────────────────┐
│                      Readout Layer                          │
├─────────────────────────────────────────────────────────────┤
│ Input: Final node embeddings                                │
│ Output: Task-specific predictions                           │
│                                                             │
│ Components:                                                 │
│   - Graph pooling operations                                │
│   - Task-specific heads                                     │
│   - Multi-task learning components                          │
└─────────────────────────────────────────────────────────────┘
```

## 5. Supply Chain Insights Schema

### 5.1 Supply Chain Events

```json
{
  "event_id": "sce-123456",
  "event_type": "ingredient_shipment",
  "timestamp": "2025-04-10T08:30:00Z",
  "entities": [
    {"id": "supplier-345", "role": "sender", "type": "Supplier"},
    {"id": "brand-567", "role": "receiver", "type": "Brand"},
    {"id": "ing-12345", "role": "item", "type": "Ingredient"}
  ],
  "attributes": {
    "quantity": "500kg",
    "batch_number": "LOT-2025-04-10-A",
    "quality_check": {
      "performed_by": "QA-Team-B",
      "date": "2025-04-10T10:15:00Z",
      "result": "passed",
      "metrics": {
        "purity": 0.985,
        "contamination": 0.002
      }
    },
    "transportation": {
      "method": "refrigerated_truck",
      "carrier": "ExpressCold Logistics",
      "tracking_number": "ECL-987654321",
      "conditions": {
        "temperature_range": "2-8°C",
        "humidity_range": "30-40%"
      }
    }
  }
}
```

### 5.2 Supply Chain Metrics

```json
{
  "metric_id": "scm-789012",
  "entity_id": "ing-12345",
  "entity_type": "Ingredient",
  "metric_type": "supply_risk",
  "timestamp": "2025-05-20T00:00:00Z",
  "value": 0.35,
  "components": [
    {"name": "supplier_diversity", "value": 0.6, "weight": 0.3},
    {"name": "geopolitical_risk", "value": 0.2, "weight": 0.2},
    {"name": "price_volatility", "value": 0.3, "weight": 0.25},
    {"name": "lead_time_reliability", "value": 0.25, "weight": 0.25}
  ],
  "trend": {
    "direction": "decreasing",
    "rate": -0.05,
    "period": "monthly"
  },
  "forecast": {
    "next_month": 0.32,
    "next_quarter": 0.28,
    "confidence": 0.85
  }
}
```

### 5.3 Demand Forecasting Schema

```json
{
  "forecast_id": "df-345678",
  "entity_id": "prod-78901",
  "entity_type": "Product",
  "timestamp": "2025-05-20T00:00:00Z",
  "forecast_period": "monthly",
  "forecast_horizon": 6,
  "values": [
    {"period": "2025-06", "mean": 1250, "lower_bound": 1100, "upper_bound": 1400},
    {"period": "2025-07", "mean": 1320, "lower_bound": 1150, "upper_bound": 1490},
    {"period": "2025-08", "mean": 1450, "lower_bound": 1250, "upper_bound": 1650},
    {"period": "2025-09", "mean": 1380, "lower_bound": 1180, "upper_bound": 1580},
    {"period": "2025-10", "mean": 1420, "lower_bound": 1200, "upper_bound": 1640},
    {"period": "2025-11", "mean": 1650, "lower_bound": 1400, "upper_bound": 1900}
  ],
  "factors": [
    {"name": "seasonality", "impact": 0.25},
    {"name": "marketing_campaigns", "impact": 0.35},
    {"name": "treatment_bookings_trend", "impact": 0.20},
    {"name": "competitor_activity", "impact": 0.10},
    {"name": "price_changes", "impact": 0.10}
  ],
  "model_metadata": {
    "algorithm": "HGNN-LSTM",
    "features_used": 24,
    "training_data_end": "2025-05-15",
    "accuracy_metrics": {
      "MAPE": 0.08,
      "RMSE": 85.3
    }
  }
}
```

## 6. HGNN Query Patterns

### 6.1 Supply Chain Traceability Query

```cypher
// Trace a product's ingredients back to their suppliers
MATCH path = (product:Product {id: 'prod-78901'})-[:CONTAINS_INGREDIENT]->(ingredient:Ingredient)<-[:SUPPLIES]-(supplier:Supplier)
RETURN path, 
       ingredient.name, 
       supplier.name, 
       supplier.sustainability_rating
```

### 6.2 Treatment Recommendation Query

```cypher
// Recommend treatments for a customer based on their profile and history
MATCH (customer:Customer {id: 'cust-34567'})
MATCH (customer)-[:HAS_CONCERN]->(concern)
MATCH (treatment:Treatment)-[:ADDRESSES_CONCERN]->(concern)
MATCH (treatment)-[:USES_INGREDIENT]->(ingredient)
WHERE NOT (ingredient)-[:CAUSES_REACTION]->(customer)
WITH treatment, count(DISTINCT concern) as relevance
MATCH (treatment)<-[:OFFERS_TREATMENT]-(salon:Salon)
WHERE distance(customer.location, salon.location) < 10000 // 10km radius
RETURN treatment.name, salon.name, relevance
ORDER BY relevance DESC, salon.rating DESC
LIMIT 5
```

### 6.3 Supply Chain Risk Query

```cypher
// Identify products at risk due to supply chain issues
MATCH (product:Product)-[:CONTAINS_INGREDIENT]->(ingredient:Ingredient)<-[:SUPPLIES]-(supplier:Supplier)
WITH product, 
     avg(supplier.reliability_score) as avg_reliability,
     count(DISTINCT supplier) as supplier_count
MATCH (product)<-[:USES_PRODUCT]-(treatment:Treatment)<-[:OFFERS_TREATMENT]-(salon:Salon)
WITH product, 
     avg_reliability,
     supplier_count,
     count(DISTINCT treatment) as treatment_count,
     count(DISTINCT salon) as salon_count
WHERE avg_reliability < 0.7 OR supplier_count < 2
RETURN product.name, 
       avg_reliability, 
       supplier_count,
       treatment_count,
       salon_count,
       (treatment_count * salon_count) as business_impact
ORDER BY business_impact DESC
```

### 6.4 Hyperedge Query

```cypher
// Find patterns in successful treatments
MATCH (he:TREATMENT_INSTANCE)
WHERE he.outcome_rating > 4.5
MATCH (he)-[:CONNECTS {role: 'customer'}]->(customer:Customer)
MATCH (he)-[:CONNECTS {role: 'treatment'}]->(treatment:Treatment)
MATCH (he)-[:CONNECTS {role: 'product'}]->(product:Product)
MATCH (he)-[:CONNECTS {role: 'therapist'}]->(therapist:Therapist)
WITH treatment, product, therapist, count(DISTINCT he) as success_count
WHERE success_count > 10
RETURN treatment.name, 
       product.name, 
       therapist.name,
       success_count
ORDER BY success_count DESC
```

## 7. HGNN Learning Tasks

### 7.1 Node Classification

```
Task: Predict product popularity category
Input: Product node features and neighborhood
Output: Popularity class (High, Medium, Low)
Evaluation: F1-score, Precision, Recall
```

### 7.2 Link Prediction

```
Task: Predict which ingredients work well together
Input: Pairs of ingredient nodes and their features
Output: Compatibility score (0-1)
Evaluation: AUC-ROC, Precision@K
```

### 7.3 Graph Classification

```
Task: Identify high-risk supply chains
Input: Subgraphs representing product supply chains
Output: Risk level classification
Evaluation: Accuracy, F1-score
```

### 7.4 Node Regression

```
Task: Predict treatment pricing
Input: Treatment node features and relationships
Output: Optimal price point
Evaluation: RMSE, MAE
```

## 8. Multi-Tenant Considerations

### 8.1 Tenant Isolation

Each tenant's data will be isolated through:

1. **Node Tagging**: All nodes will have a tenant_id property
2. **Query Filtering**: All queries automatically filter by tenant_id
3. **Access Control**: Tenant-specific access policies

### 8.2 Shared Knowledge

Certain nodes and relationships can be marked as shared across tenants:

```json
{
  "id": "ing-12345",
  "name": "Hyaluronic Acid",
  "tenant_id": "global",
  "sharing_policy": {
    "visibility": "public",
    "modification_rights": "platform_only"
  }
}
```

### 8.3 Cross-Tenant Analytics

Platform owners can perform cross-tenant analytics with:

1. **Aggregated Views**: Statistical aggregations across tenants
2. **Anonymized Patterns**: Behavioral patterns without identifying data
3. **Benchmark Reports**: Comparative performance metrics

## 9. Integration with Relational Data

### 9.1 Hybrid Query Approach

```
1. Start query in HGNN for relationship traversal
2. Join with relational data for transactional details
3. Return combined results
```

### 9.2 Data Synchronization

```
1. Change Data Capture (CDC) from relational databases
2. Event-driven updates to HGNN
3. Batch synchronization for historical data
```

## 10. Performance Optimization

### 10.1 Indexing Strategy

```
1. Primary indices on all node IDs
2. Composite indices on frequently queried properties
3. Full-text indices on descriptive fields
4. Spatial indices for location-based queries
```

### 10.2 Caching Strategy

```
1. Query result caching
2. Embedding vector caching
3. Frequently accessed subgraph caching
4. Tenant-specific cache partitioning
```

### 10.3 Partitioning Strategy

```
1. Tenant-based partitioning
2. Geographic partitioning for location-specific data
3. Time-based partitioning for historical data
4. Hybrid partitioning for optimal query performance
```

## 11. Conclusion

This HGNN database schema provides a comprehensive foundation for modeling the complex relationships in the beauty industry supply chain. The hypergraph structure allows for capturing multi-entity relationships that would be difficult to model in traditional relational or graph databases. The neural network component enables advanced analytics, recommendations, and predictions based on the rich interconnected data.

The schema is designed to support multi-tenancy while allowing for shared knowledge and cross-tenant analytics. Performance optimization strategies ensure that the system can scale to handle large volumes of data and complex queries.
