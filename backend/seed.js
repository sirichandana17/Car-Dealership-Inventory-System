require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/db');

async function seed() {
  console.log('Seeding database...');

  // Admin user
  const hash = await bcrypt.hash('Admin@1234', 10);
  await pool.query('DELETE FROM users WHERE email = ?', ['admin@autodealer.com']);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Admin', 'admin@autodealer.com', hash, 'ADMIN']
  );
  console.log('✓ Admin user created');
  console.log('  Email:    admin@autodealer.com');
  console.log('  Password: Admin@1234');

  // Vehicles with Unsplash images
  const vehicles = [
    { make: 'BMW',        model: 'M4 Competition', category: 'Coupe',   price: 84900,  quantity: 3,  image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80' },
    { make: 'Mercedes',   model: 'AMG GT',          category: 'Coupe',   price: 118000, quantity: 2,  image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80' },
    { make: 'Porsche',    model: 'Cayenne',          category: 'SUV',     price: 96000,  quantity: 5,  image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
    { make: 'Audi',       model: 'RS7',              category: 'Sedan',   price: 115000, quantity: 4,  image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' },
    { make: 'Tesla',      model: 'Model S',          category: 'Sedan',   price: 89990,  quantity: 6,  image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80' },
    { make: 'Lamborghini',model: 'Urus',             category: 'SUV',     price: 229000, quantity: 1,  image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80' },
    { make: 'Ferrari',    model: 'Roma',             category: 'Coupe',   price: 222000, quantity: 1,  image_url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80' },
    { make: 'Toyota',     model: 'Supra',            category: 'Coupe',   price: 56000,  quantity: 7,  image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80' },
    { make: 'Ford',       model: 'Mustang GT500',    category: 'Coupe',   price: 74995,  quantity: 4,  image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80' },
    { make: 'Range Rover',model: 'Sport',            category: 'SUV',     price: 92000,  quantity: 3,  image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80' },
    { make: 'Chevrolet',  model: 'Corvette C8',      category: 'Coupe',   price: 67295,  quantity: 5,  image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80' },
    { make: 'Rolls Royce',model: 'Ghost',            category: 'Sedan',   price: 332500, quantity: 1,  image_url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80' },
  ];

  await pool.query('DELETE FROM vehicles');
  for (const v of vehicles) {
    await pool.query(
      'INSERT INTO vehicles (make, model, category, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [v.make, v.model, v.category, v.price, v.quantity, v.image_url]
    );
    console.log(`✓ ${v.make} ${v.model}`);
  }

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
