
USE employee_portal;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NULL,

    action VARCHAR(255) NOT NULL,

    ip_address VARCHAR(100),

    metadata JSON NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE zoho_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,

    service VARCHAR(50) NOT NULL UNIQUE,

    access_token TEXT NULL,

    refresh_token TEXT NOT NULL,

    api_domain VARCHAR(255),

    expires_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE zoho_services (
    id INT PRIMARY KEY AUTO_INCREMENT,

    service_name VARCHAR(100) NOT NULL UNIQUE,

    display_name VARCHAR(100) NOT NULL,

    description VARCHAR(255),

    url VARCHAR(500),

    permission_name VARCHAR(150) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE
);


INSERT INTO roles (name, description)
VALUES
('Admin', 'Full access to employee portal'),
('HR', 'Human Resources'),
('Sales', 'Sales team'),
('Support', 'Customer support'),
('Finance', 'Finance and accounting');


INSERT INTO permissions (name, description)
VALUES
('VIEW_ZOHO_PEOPLE', 'Access Zoho People'),
('VIEW_ZOHO_CRM', 'Access Zoho CRM'),
('VIEW_ZOHO_DESK', 'Access Zoho Desk'),
('VIEW_ZOHO_BOOKS', 'Access Zoho Books'),

('MANAGE_USERS', 'Create, update and delete users'),
('MANAGE_ROLES', 'Create and manage roles'),
('MANAGE_PERMISSIONS', 'Manage role permissions'),
('VIEW_AUDIT_LOGS', 'View activity logs');



INSERT INTO zoho_services
(service_name, display_name, description, url, permission_name)
VALUES
(
    'people',
    'Zoho People',
    'HR management',
    'https://people.zoho.in',
    'VIEW_ZOHO_PEOPLE'
),
(
    'crm',
    'Zoho CRM',
    'Sales and customer relationship management',
    'https://crm.zoho.in',
    'VIEW_ZOHO_CRM'
),
(
    'desk',
    'Zoho Desk',
    'Customer support and ticket management',
    'https://desk.zoho.in',
    'VIEW_ZOHO_DESK'
),
(
    'books',
    'Zoho Books',
    'Financial and accounting operations',
    'https://books.zoho.in',
    'VIEW_ZOHO_BOOKS'
);