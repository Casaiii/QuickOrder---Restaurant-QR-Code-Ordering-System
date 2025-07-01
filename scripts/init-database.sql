-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR(50),
  is_open BOOLEAN DEFAULT true,
  business_hours_open TIME,
  business_hours_close TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number VARCHAR(10) NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  customer_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO restaurants (id, name, description, address, phone, business_hours_open, business_hours_close) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '美味小館',
  '提供道地台式料理，新鮮食材，用心烹調',
  '台北市大安區復興南路一段100號',
  '02-2345-6789',
  '11:00:00',
  '21:00:00'
) ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO categories (id, name, description, order_index, restaurant_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '主餐', '精選主餐料理', 1, '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440002', '湯品', '暖心湯品', 2, '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440003', '飲料', '清涼飲品', 3, '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (id, name, description, price, category_id, restaurant_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', '滷肉飯', '香濃滷肉配白飯，經典台式美味', 80.00, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440011', '牛肉麵', '清燉牛肉湯頭，軟嫩牛肉塊', 150.00, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440012', '炒飯', '蛋炒飯配時蔬，香氣四溢', 90.00, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440013', '味噌湯', '日式味噌湯，溫暖心房', 30.00, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440014', '玉米濃湯', '香濃玉米湯，營養豐富', 40.00, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440015', '珍珠奶茶', '經典台式珍珠奶茶', 60.00, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440016', '檸檬汁', '新鮮檸檬汁，酸甜解膩', 50.00, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Insert tables
INSERT INTO tables (id, number, restaurant_id, qr_code) VALUES
('550e8400-e29b-41d4-a716-446655440020', '1', '550e8400-e29b-41d4-a716-446655440000', 'table-1-qr'),
('550e8400-e29b-41d4-a716-446655440021', '2', '550e8400-e29b-41d4-a716-446655440000', 'table-2-qr'),
('550e8400-e29b-41d4-a716-446655440022', '3', '550e8400-e29b-41d4-a716-446655440000', 'table-3-qr'),
('550e8400-e29b-41d4-a716-446655440023', '4', '550e8400-e29b-41d4-a716-446655440000', 'table-4-qr')
ON CONFLICT DO NOTHING;
