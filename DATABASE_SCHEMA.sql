-- ============================================================
-- DATABASE SCHEMA FOR LIT-SPA APPLICATION
-- Enterprise B2B/B2C Multi-Module Platform
-- Generated: 2025-01-05
-- Database: PostgreSQL 14+
-- ============================================================

-- ============================================================
-- SECTION 1: CORE ORGANIZATION & HIERARCHY
-- ============================================================

CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    tier VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 2: USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar VARCHAR(500),
    organization_id INTEGER REFERENCES organizations(id),
    manager_id INTEGER REFERENCES users(id),
    permission_scope VARCHAR(50) DEFAULT 'own',
    status VARCHAR(50) DEFAULT 'Active',
    account_locked BOOLEAN DEFAULT false,
    lock_reason TEXT,
    must_change_password BOOLEAN DEFAULT false,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    failed_login_attempts INTEGER DEFAULT 0,
    password_expires_at TIMESTAMP,
    attributes JSONB DEFAULT '{}',
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    session_token VARCHAR(500) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 3: ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'custom',
    priority INTEGER DEFAULT 100,
    parent_role_id INTEGER REFERENCES roles(id),
    inherit_permissions BOOLEAN DEFAULT false,
    is_system_role BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '{}',
    field_permissions JSONB DEFAULT '{}',
    data_scope VARCHAR(50) DEFAULT 'own',
    scope_rules JSONB DEFAULT '{}',
    constraints JSONB DEFAULT '{}',
    user_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

CREATE TABLE permissions (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    level VARCHAR(50) DEFAULT 'entity',
    scope VARCHAR(100),
    risk_level VARCHAR(50) DEFAULT 'low',
    requires_approval BOOLEAN DEFAULT false,
    requires_mfa BOOLEAN DEFAULT false,
    audit_log BOOLEAN DEFAULT true,
    is_system_permission BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(role_id, permission_id)
);

-- ============================================================
-- SECTION 4: SLA & INCIDENTS
-- ============================================================

CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'medium',
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'open',
    reported_by VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255),
    client_email VARCHAR(255),
    account VARCHAR(255),
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    resolved_date TIMESTAMP,
    sla_target INTEGER,
    sla_met BOOLEAN,
    impacted_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 5: GDOCS - INVOICES
-- ============================================================

CREATE TABLE invoices_inbound (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255),
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    po_reference VARCHAR(100),
    account VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices_outbound (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'sent',
    po_reference VARCHAR(100),
    account VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 6: GDOCS - PURCHASE ORDERS
-- ============================================================

CREATE TABLE purchase_orders_inbound (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(100) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255),
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    po_date DATE NOT NULL,
    delivery_date DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    items INTEGER DEFAULT 0,
    account VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders_outbound (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    po_date DATE NOT NULL,
    delivery_date DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'sent',
    items INTEGER DEFAULT 0,
    account VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acknowledgements_outbound (
    id SERIAL PRIMARY KEY,
    ack_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    po_reference VARCHAR(100),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ack_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 7: COMMERCE / E-COMMERCE
-- ============================================================

CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id),
    image VARCHAR(500),
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    compare_at_price DECIMAL(15,2),
    cost DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    taxable BOOLEAN DEFAULT true,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    allow_backorder BOOLEAN DEFAULT false,
    category_id INTEGER REFERENCES product_categories(id),
    subcategory VARCHAR(255),
    brand VARCHAR(255),
    tags TEXT[],
    images JSONB DEFAULT '[]',
    featured_image VARCHAR(500),
    videos JSONB DEFAULT '[]',
    has_variants BOOLEAN DEFAULT false,
    variants JSONB DEFAULT '[]',
    options JSONB DEFAULT '[]',
    weight DECIMAL(10,2),
    weight_unit VARCHAR(10) DEFAULT 'kg',
    dimensions JSONB,
    dimension_unit VARCHAR(10) DEFAULT 'cm',
    requires_shipping BOOLEAN DEFAULT true,
    shipping_class VARCHAR(100) DEFAULT 'standard',
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    visibility VARCHAR(50) DEFAULT 'visible',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

CREATE TABLE shopping_carts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES users(id),
    items JSONB DEFAULT '[]',
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax DECIMAL(15,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    shipping DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    discount_code VARCHAR(100),
    total DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES users(id),
    customer_email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    tax DECIMAL(15,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    shipping DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    discount_code VARCHAR(100),
    total DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSONB,
    billing_address JSONB,
    billing_same_as_shipping BOOLEAN DEFAULT true,
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    tracking_url VARCHAR(500),
    carrier VARCHAR(100),
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    estimated_delivery TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    customer_notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE TABLE discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    min_purchase DECIMAL(15,2),
    max_discount DECIMAL(15,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER,
    applies_to VARCHAR(50) DEFAULT 'all',
    product_ids JSONB,
    category_ids JSONB,
    customer_ids JSONB,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 8: AUDIT & LOGGING
-- ============================================================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SECTION 9: INDEXES
-- ============================================================

-- User & Auth Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);

-- RBAC Indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm ON role_permissions(permission_id);

-- SLA Indexes
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_number ON incidents(incident_number);

-- Gdocs Indexes
CREATE INDEX idx_invoices_in_status ON invoices_inbound(status);
CREATE INDEX idx_invoices_out_status ON invoices_outbound(status);
CREATE INDEX idx_po_in_status ON purchase_orders_inbound(status);
CREATE INDEX idx_po_out_status ON purchase_orders_outbound(status);

-- Commerce Indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_parent ON product_categories(parent_id);
CREATE INDEX idx_carts_session ON shopping_carts(session_id);
CREATE INDEX idx_carts_customer ON shopping_carts(customer_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);

-- Audit Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
