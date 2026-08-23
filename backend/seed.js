require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/db');

async function seed() {
  console.log('Seeding database...');

  // Admin user — credentials stored only in .env, not printed
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 10);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@autodealer.com';
  await pool.query('DELETE FROM users WHERE email = ?', [adminEmail]);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Admin', adminEmail, hash, 'ADMIN']
  );
  console.log('✓ Admin user created');

  const vehicles = [
    // BMW
    { make: 'BMW', model: 'M4 Competition', category: 'Coupe', year: 2024, price: 7050000, quantity: 3, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '10 kmpl', description: 'The BMW M4 Competition is a high-performance coupe with a 3.0L twin-turbo inline-6 producing 503 hp. Features M-specific chassis tuning, carbon fibre roof and aggressive aerodynamics.', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80' },
    { make: 'BMW', model: 'X5 M', category: 'SUV', year: 2024, price: 9800000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '8 kmpl', description: 'The BMW X5 M is a performance SUV powered by a 4.4L V8 twin-turbo engine producing 617 hp. Combines luxury with track-ready performance and all-wheel drive.', image_url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80' },
    { make: 'BMW', model: '7 Series', category: 'Sedan', year: 2024, price: 11500000, quantity: 4, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '12 kmpl', description: 'The BMW 7 Series is the flagship luxury sedan featuring a 3.0L inline-6 engine, executive lounge rear seating, panoramic sky lounge LED roof and advanced driver assistance.', image_url: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80' },

    // Mercedes
    { make: 'Mercedes', model: 'AMG GT 63', category: 'Coupe', year: 2024, price: 14500000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Mercedes-AMG GT 63 is a 4-door performance coupe with a 4.0L V8 biturbo producing 630 hp. Features AMG RIDE CONTROL+ suspension and drift mode.', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80' },
    { make: 'Mercedes', model: 'GLE 63 AMG', category: 'SUV', year: 2023, price: 12000000, quantity: 3, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Mercedes-AMG GLE 63 S is a performance SUV with a 4.0L V8 biturbo producing 603 hp, 48V mild hybrid system and E-ACTIVE BODY CONTROL suspension.', image_url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80' },
    { make: 'Mercedes', model: 'S-Class', category: 'Sedan', year: 2024, price: 16000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '11 kmpl', description: 'The Mercedes S-Class is the pinnacle of luxury sedans featuring a 3.0L inline-6 with EQ Boost, MBUX Hyperscreen, rear-axle steering and executive rear suite.', image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80' },

    // Porsche
    { make: 'Porsche', model: 'Cayenne Turbo', category: 'SUV', year: 2024, price: 13500000, quantity: 3, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '10 kmpl', description: 'The Porsche Cayenne Turbo features a 4.0L V8 twin-turbo producing 541 hp. Combines sports car performance with SUV practicality and Porsche Active Suspension Management.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
    { make: 'Porsche', model: '911 GT3', category: 'Coupe', year: 2024, price: 18000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Manual', mileage: '8 kmpl', description: 'The Porsche 911 GT3 is a track-focused sports car with a naturally aspirated 4.0L flat-six producing 510 hp. Features rear-wheel steering and a motorsport-derived suspension.', image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80' },
    { make: 'Porsche', model: 'Panamera', category: 'Sedan', year: 2024, price: 11000000, quantity: 4, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '11 kmpl', description: 'The Porsche Panamera is a luxury sports sedan with a 2.9L V6 twin-turbo producing 330 hp. Offers sports car dynamics with four-door practicality and executive comfort.', image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80' },

    // Audi
    { make: 'Audi', model: 'RS7 Sportback', category: 'Sedan', year: 2024, price: 12500000, quantity: 3, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '10 kmpl', description: 'The Audi RS7 Sportback features a 4.0L V8 TFSI producing 591 hp with mild hybrid technology. Combines fastback styling with quattro all-wheel drive and adaptive air suspension.', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' },
    { make: 'Audi', model: 'Q8 RS', category: 'SUV', year: 2024, price: 14000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Audi RS Q8 is the most powerful Audi SUV with a 4.0L V8 TFSI producing 591 hp. Features quattro sport differential, carbon ceramic brakes and RS-specific chassis tuning.', image_url: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80' },
    { make: 'Audi', model: 'e-tron GT', category: 'Sedan', year: 2024, price: 10500000, quantity: 5, fuel_type: 'Electric', transmission: 'Automatic', mileage: '350 km range', description: 'The Audi e-tron GT is a fully electric grand tourer producing 476 hp with 800V charging architecture. Features quattro all-wheel drive and a 93.4 kWh battery pack.', image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80' },

    // Tesla
    { make: 'Tesla', model: 'Model S Plaid', category: 'Sedan', year: 2024, price: 9500000, quantity: 5, fuel_type: 'Electric', transmission: 'Automatic', mileage: '600 km range', description: 'The Tesla Model S Plaid is the world\'s fastest production sedan with tri-motor all-wheel drive producing 1,020 hp. Features a 17-inch cinematic display and 0-100 in 2.1 seconds.', image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80' },
    { make: 'Tesla', model: 'Model X', category: 'SUV', year: 2024, price: 8500000, quantity: 4, fuel_type: 'Electric', transmission: 'Automatic', mileage: '560 km range', description: 'The Tesla Model X features falcon-wing doors, a 670 hp dual-motor setup and seating for up to 7. Includes Autopilot, a 17-inch touchscreen and over-the-air software updates.', image_url: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80' },

    // Lamborghini
    { make: 'Lamborghini', model: 'Urus Performante', category: 'SUV', year: 2024, price: 25000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '7 kmpl', description: 'The Lamborghini Urus Performante is the world\'s fastest SUV with a 4.0L V8 twin-turbo producing 657 hp. Features carbon fibre body parts, titanium exhaust and track-focused suspension.', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80' },
    { make: 'Lamborghini', model: 'Huracan EVO', category: 'Coupe', year: 2023, price: 22000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '7 kmpl', description: 'The Lamborghini Huracan EVO features a naturally aspirated 5.2L V10 producing 631 hp. Includes Lamborghini Dinamica Veicolo Integrata system for real-time vehicle dynamics control.', image_url: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80' },

    // Ferrari
    { make: 'Ferrari', model: 'Roma', category: 'Coupe', year: 2024, price: 24000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '8 kmpl', description: 'The Ferrari Roma is a front-engined grand tourer with a 3.9L V8 twin-turbo producing 612 hp. Combines classic Italian elegance with modern Ferrari performance and an 8-speed DCT gearbox.', image_url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80' },
    { make: 'Ferrari', model: 'SF90 Stradale', category: 'Coupe', year: 2024, price: 55000000, quantity: 1, fuel_type: 'Hybrid', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Ferrari SF90 Stradale is a plug-in hybrid hypercar producing 986 hp from a 4.0L V8 and three electric motors. Features eManettino selector and 25 km all-electric range.', image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' },

    // Toyota
    { make: 'Toyota', model: 'GR Supra', category: 'Coupe', year: 2024, price: 5500000, quantity: 6, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '12 kmpl', description: 'The Toyota GR Supra features a 3.0L inline-6 turbocharged engine producing 382 hp. Developed with BMW, it offers a perfect 50:50 weight distribution and rear-wheel drive dynamics.', image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80' },
    { make: 'Toyota', model: 'Land Cruiser 300', category: 'SUV', year: 2024, price: 8500000, quantity: 5, fuel_type: 'Diesel', transmission: 'Automatic', mileage: '10 kmpl', description: 'The Toyota Land Cruiser 300 is the ultimate off-road SUV with a 3.3L V6 twin-turbo diesel producing 309 hp. Features Multi-Terrain Select, Crawl Control and a new TNGA-F platform.', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80' },

    // Ford
    { make: 'Ford', model: 'Mustang Shelby GT500', category: 'Coupe', year: 2024, price: 6500000, quantity: 4, fuel_type: 'Petrol', transmission: 'Manual', mileage: '9 kmpl', description: 'The Ford Mustang Shelby GT500 is powered by a supercharged 5.2L V8 producing 760 hp — the most powerful street-legal Ford ever. Features Tremec 7-speed dual-clutch transmission.', image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80' },
    { make: 'Ford', model: 'Bronco Raptor', category: 'SUV', year: 2024, price: 4500000, quantity: 6, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Ford Bronco Raptor is an extreme off-road SUV with a 3.0L EcoBoost V6 producing 418 hp. Features 37-inch tyres, Live Valve FOX Racing Shox and Baja Mode.', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },

    // Range Rover
    { make: 'Range Rover', model: 'Sport SVR', category: 'SUV', year: 2024, price: 11000000, quantity: 3, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '8 kmpl', description: 'The Range Rover Sport SVR features a supercharged 5.0L V8 producing 575 hp. Combines luxury with performance, featuring Dynamic Response Pro and Electronic Active Rear Differential.', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80' },
    { make: 'Range Rover', model: 'Autobiography', category: 'SUV', year: 2024, price: 18000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Range Rover Autobiography is the ultimate luxury SUV with a 4.4L BMW V8 producing 530 hp. Features executive rear seating, Meridian Signature sound system and SV Bespoke options.', image_url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80' },

    // Chevrolet
    { make: 'Chevrolet', model: 'Corvette Z06', category: 'Coupe', year: 2024, price: 7500000, quantity: 4, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Chevrolet Corvette Z06 features a flat-plane crank 5.5L V8 producing 670 hp — the most powerful naturally aspirated V8 in a production car. Mid-engine layout for perfect balance.', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80' },

    // Rolls Royce
    { make: 'Rolls Royce', model: 'Ghost Black Badge', category: 'Sedan', year: 2024, price: 38000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '7 kmpl', description: 'The Rolls-Royce Ghost Black Badge is the alter ego of Ghost, featuring a 6.75L twin-turbo V12 producing 591 hp. Designed for those who prefer to drive rather than be driven.', image_url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80' },
    { make: 'Rolls Royce', model: 'Cullinan', category: 'SUV', year: 2024, price: 42000000, quantity: 1, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '6 kmpl', description: 'The Rolls-Royce Cullinan is the world\'s most luxurious SUV with a 6.75L twin-turbo V12 producing 563 hp. Features the iconic Spirit of Ecstasy, all-terrain capability and bespoke interior.', image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80' },

    // Bentley
    { make: 'Bentley', model: 'Continental GT', category: 'Coupe', year: 2024, price: 22000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '8 kmpl', description: 'The Bentley Continental GT features a 6.0L W12 twin-turbo producing 626 hp. Handcrafted in Crewe, England, it combines grand touring capability with unmatched luxury and 48V active anti-roll.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
    { make: 'Bentley', model: 'Bentayga EWB', category: 'SUV', year: 2024, price: 28000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '8 kmpl', description: 'The Bentley Bentayga Extended Wheelbase is the world\'s most luxurious SUV with airline-style rear seating, a 4.0L V8 producing 542 hp and Bentley Dynamic Ride system.', image_url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80' },

    // Maserati
    { make: 'Maserati', model: 'MC20', category: 'Coupe', year: 2024, price: 19000000, quantity: 2, fuel_type: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', description: 'The Maserati MC20 is a mid-engine supercar with the new Nettuno 3.0L twin-turbo V6 producing 621 hp. Features butterfly doors, carbon fibre monocoque and 0-100 in 2.9 seconds.', image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80' },
  ];

  await pool.query('DELETE FROM vehicles');
  for (const v of vehicles) {
    await pool.query(
      `INSERT INTO vehicles (make, model, category, year, price, quantity, fuel_type, transmission, mileage, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [v.make, v.model, v.category, v.year, v.price, v.quantity,
       v.fuel_type, v.transmission, v.mileage, v.description, v.image_url]
    );
    console.log(`✓ ${v.make} ${v.model}`);
  }

  console.log(`\n✓ ${vehicles.length} vehicles seeded`);
  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
