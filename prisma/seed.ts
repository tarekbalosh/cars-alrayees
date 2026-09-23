import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.carPricing.deleteMany();
  await prisma.car.deleteMany();
  await prisma.category.deleteMany();

  // ─── Categories ───────────────────────────────────────
  const economy = await prisma.category.create({
    data: {
      nameAr: 'اقتصادية',
      nameEn: 'Economy',
      slug: 'economy',
      descriptionAr: 'سيارات اقتصادية موفرة للوقود ومناسبة للميزانية',
      descriptionEn: 'Fuel-efficient and budget-friendly vehicles',
      icon: 'Fuel',
    },
  });

  const sedan = await prisma.category.create({
    data: {
      nameAr: 'سيدان',
      nameEn: 'Sedan',
      slug: 'sedan',
      descriptionAr: 'سيارات سيدان مريحة وعملية للاستخدام اليومي',
      descriptionEn: 'Comfortable and practical sedans for daily use',
      icon: 'Car',
    },
  });

  const suv = await prisma.category.create({
    data: {
      nameAr: 'دفع رباعي',
      nameEn: 'SUV',
      slug: 'suv',
      descriptionAr: 'سيارات دفع رباعي واسعة ومناسبة للعائلات والمغامرات',
      descriptionEn: 'Spacious SUVs perfect for families and adventures',
      icon: 'Mountain',
    },
  });

  const luxury = await prisma.category.create({
    data: {
      nameAr: 'فاخرة',
      nameEn: 'Luxury',
      slug: 'luxury',
      descriptionAr: 'سيارات فاخرة للتجربة المتميزة',
      descriptionEn: 'Premium luxury vehicles for an exceptional experience',
      icon: 'Crown',
    },
  });

  const sports = await prisma.category.create({
    data: {
      nameAr: 'رياضية',
      nameEn: 'Sports',
      slug: 'sports',
      descriptionAr: 'سيارات رياضية عالية الأداء',
      descriptionEn: 'High-performance sports cars',
      icon: 'Zap',
    },
  });

  console.log('✅ Categories created');

  // ─── Cars with Images and Pricing ────────────────────
  const carsData = [
    {
      brand: 'Toyota',
      model: 'Vios',
      year: 2024,
      slug: 'toyota-vios-2024',
      descriptionAr: 'تويوتا فيوس 2024 - سيارة اقتصادية موثوقة ومثالية للتنقل اليومي في المدينة. تتميز بكفاءة عالية في استهلاك الوقود وصيانة منخفضة التكلفة.',
      descriptionEn: 'Toyota Vios 2024 - A reliable economy car ideal for daily city commuting. Features excellent fuel efficiency and low maintenance costs.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '1.5L 4-Cylinder',
      luggageCapacity: 2,
      features: ['Bluetooth', 'Backup Camera', 'USB Charging', 'ABS', 'Airbags', 'Air Conditioning'],
      isFeatured: false,
      isAvailable: true,
      categoryId: economy.id,
      pricing: { dailyRate: 120, weeklyRate: 750, monthlyRate: 2800, securityDeposit: 500 },
      images: [
        { url: '/images/seed/toyota-vios-1.jpg', altAr: 'تويوتا فيوس 2024 - منظر أمامي', altEn: 'Toyota Vios 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/toyota-vios-2.jpg', altAr: 'تويوتا فيوس 2024 - منظر جانبي', altEn: 'Toyota Vios 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/toyota-vios-3.jpg', altAr: 'تويوتا فيوس 2024 - الداخلية', altEn: 'Toyota Vios 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Honda',
      model: 'City',
      year: 2024,
      slug: 'honda-city-2024',
      descriptionAr: 'هوندا سيتي 2024 - سيدان أنيقة وعملية بتصميم حديث ومحرك فعال. خيار مثالي لمن يبحث عن التوازن بين الراحة والاقتصاد.',
      descriptionEn: 'Honda City 2024 - An elegant and practical sedan with modern design and efficient engine. Perfect for those seeking a balance between comfort and economy.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '1.5L i-VTEC',
      luggageCapacity: 3,
      features: ['Honda SENSING', 'Apple CarPlay', 'Android Auto', 'Lane Keep Assist', 'LED Headlights', 'Cruise Control'],
      isFeatured: true,
      isAvailable: true,
      categoryId: sedan.id,
      pricing: { dailyRate: 150, weeklyRate: 900, monthlyRate: 3200, securityDeposit: 600 },
      images: [
        { url: '/images/seed/honda-city-1.jpg', altAr: 'هوندا سيتي 2024 - منظر أمامي', altEn: 'Honda City 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/honda-city-2.jpg', altAr: 'هوندا سيتي 2024 - منظر خلفي', altEn: 'Honda City 2024 - Rear View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/honda-city-3.jpg', altAr: 'هوندا سيتي 2024 - الداخلية', altEn: 'Honda City 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      slug: 'toyota-camry-2024',
      descriptionAr: 'تويوتا كامري 2024 - سيدان متوسطة الحجم بأداء متميز وراحة فائقة. تصميم أنيق مع تقنيات أمان متقدمة ومحرك هايبرد اختياري.',
      descriptionEn: 'Toyota Camry 2024 - A mid-size sedan with outstanding performance and superior comfort. Elegant design with advanced safety features and optional hybrid engine.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'HYBRID' as const,
      seats: 5,
      doors: 4,
      engine: '2.5L Hybrid',
      luggageCapacity: 3,
      features: ['Toyota Safety Sense', 'Wireless Charging', 'JBL Audio', 'Sunroof', 'Leather Seats', 'Navigation', 'Blind Spot Monitor'],
      isFeatured: true,
      isAvailable: true,
      categoryId: sedan.id,
      pricing: { dailyRate: 220, weeklyRate: 1400, monthlyRate: 5000, securityDeposit: 1000 },
      images: [
        { url: '/images/seed/toyota-camry-1.jpg', altAr: 'تويوتا كامري 2024 - منظر أمامي', altEn: 'Toyota Camry 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/toyota-camry-2.jpg', altAr: 'تويوتا كامري 2024 - منظر جانبي', altEn: 'Toyota Camry 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/toyota-camry-3.jpg', altAr: 'تويوتا كامري 2024 - الداخلية', altEn: 'Toyota Camry 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Proton',
      model: 'X50',
      year: 2024,
      slug: 'proton-x50-2024',
      descriptionAr: 'بروتون X50 2024 - كروس أوفر عصرية بتقنيات متقدمة من جيلي. توفر تجربة قيادة ممتعة مع مميزات ذكية وتصميم جذاب.',
      descriptionEn: 'Proton X50 2024 - A modern crossover with advanced Geely technology. Offers an enjoyable driving experience with smart features and attractive design.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '1.5L Turbo',
      luggageCapacity: 3,
      features: ['GKUI Smart System', 'Level 2 ADAS', 'Panoramic Sunroof', '360° Camera', 'Power Tailgate', 'LED Matrix Headlights'],
      isFeatured: true,
      isAvailable: true,
      categoryId: suv.id,
      pricing: { dailyRate: 180, weeklyRate: 1100, monthlyRate: 4000, securityDeposit: 800 },
      images: [
        { url: '/images/seed/proton-x50-1.jpg', altAr: 'بروتون X50 2024 - منظر أمامي', altEn: 'Proton X50 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/proton-x50-2.jpg', altAr: 'بروتون X50 2024 - منظر خلفي', altEn: 'Proton X50 2024 - Rear View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/proton-x50-3.jpg', altAr: 'بروتون X50 2024 - الداخلية', altEn: 'Proton X50 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Toyota',
      model: 'Fortuner',
      year: 2024,
      slug: 'toyota-fortuner-2024',
      descriptionAr: 'تويوتا فورتشنر 2024 - سيارة SUV قوية ومتعددة الاستخدامات مع دفع رباعي. مثالية للعائلات الكبيرة والرحلات الطويلة.',
      descriptionEn: 'Toyota Fortuner 2024 - A powerful and versatile SUV with 4WD capability. Perfect for large families and long trips.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'DIESEL' as const,
      seats: 7,
      doors: 4,
      engine: '2.8L Turbo Diesel',
      luggageCapacity: 5,
      features: ['4WD', 'Hill Descent Control', '3rd Row Seats', 'Traction Control', 'Rear AC', 'Power Seats', 'Terrain Management'],
      isFeatured: true,
      isAvailable: true,
      categoryId: suv.id,
      pricing: { dailyRate: 300, weeklyRate: 1900, monthlyRate: 7000, securityDeposit: 1500 },
      images: [
        { url: '/images/seed/toyota-fortuner-1.jpg', altAr: 'تويوتا فورتشنر 2024 - منظر أمامي', altEn: 'Toyota Fortuner 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/toyota-fortuner-2.jpg', altAr: 'تويوتا فورتشنر 2024 - منظر جانبي', altEn: 'Toyota Fortuner 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/toyota-fortuner-3.jpg', altAr: 'تويوتا فورتشنر 2024 - الداخلية', altEn: 'Toyota Fortuner 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      slug: 'mercedes-c-class-2024',
      descriptionAr: 'مرسيدس بنز الفئة C 2024 - سيدان فاخرة بتصميم ألماني راقٍ ومحرك قوي. تجربة قيادة استثنائية مع أحدث التقنيات.',
      descriptionEn: 'Mercedes-Benz C-Class 2024 - A luxury sedan with refined German design and powerful engine. An exceptional driving experience with the latest technology.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '2.0L Turbo',
      luggageCapacity: 3,
      features: ['MBUX System', 'Burmester Audio', 'Ambient Lighting', 'Digital Cockpit', 'Heated Seats', 'Parking Assist', 'Head-Up Display'],
      isFeatured: true,
      isAvailable: true,
      categoryId: luxury.id,
      pricing: { dailyRate: 450, weeklyRate: 2800, monthlyRate: 10000, securityDeposit: 3000 },
      images: [
        { url: '/images/seed/mercedes-c-class-1.jpg', altAr: 'مرسيدس C-Class 2024 - منظر أمامي', altEn: 'Mercedes C-Class 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/mercedes-c-class-2.jpg', altAr: 'مرسيدس C-Class 2024 - منظر جانبي', altEn: 'Mercedes C-Class 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/mercedes-c-class-3.jpg', altAr: 'مرسيدس C-Class 2024 - الداخلية', altEn: 'Mercedes C-Class 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'BMW',
      model: '3 Series',
      year: 2024,
      slug: 'bmw-3-series-2024',
      descriptionAr: 'بي إم دبليو الفئة 3 2024 - سيدان رياضية فاخرة تجمع بين الأداء العالي والراحة. تصميم ديناميكي مع تقنيات القيادة المتقدمة.',
      descriptionEn: 'BMW 3 Series 2024 - A sporty luxury sedan that combines high performance with comfort. Dynamic design with advanced driving technologies.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '2.0L TwinPower Turbo',
      luggageCapacity: 3,
      features: ['iDrive 8', 'Harman Kardon Audio', 'Sport Mode', 'Adaptive Suspension', 'Wireless CarPlay', 'Gesture Control', 'M Sport Package'],
      isFeatured: false,
      isAvailable: true,
      categoryId: luxury.id,
      pricing: { dailyRate: 480, weeklyRate: 3000, monthlyRate: 11000, securityDeposit: 3000 },
      images: [
        { url: '/images/seed/bmw-3-series-1.jpg', altAr: 'بي إم دبليو 3 Series 2024 - منظر أمامي', altEn: 'BMW 3 Series 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/bmw-3-series-2.jpg', altAr: 'بي إم دبليو 3 Series 2024 - منظر خلفي', altEn: 'BMW 3 Series 2024 - Rear View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/bmw-3-series-3.jpg', altAr: 'بي إم دبليو 3 Series 2024 - الداخلية', altEn: 'BMW 3 Series 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Perodua',
      model: 'Myvi',
      year: 2024,
      slug: 'perodua-myvi-2024',
      descriptionAr: 'بيرودوا مايفي 2024 - السيارة الأكثر شعبية في ماليزيا. اقتصادية في استهلاك الوقود وسهلة القيادة ومثالية للمدينة.',
      descriptionEn: 'Perodua Myvi 2024 - Malaysia\'s most popular car. Fuel-efficient, easy to drive, and perfect for city use.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'PETROL' as const,
      seats: 5,
      doors: 4,
      engine: '1.5L Dual VVT-i',
      luggageCapacity: 2,
      features: ['ASA 3.0 Safety', 'Smart Key', 'Push Start', 'Touchscreen Infotainment', 'Rear Camera', 'VSC'],
      isFeatured: false,
      isAvailable: true,
      categoryId: economy.id,
      pricing: { dailyRate: 100, weeklyRate: 600, monthlyRate: 2200, securityDeposit: 400 },
      images: [
        { url: '/images/seed/perodua-myvi-1.jpg', altAr: 'بيرودوا مايفي 2024 - منظر أمامي', altEn: 'Perodua Myvi 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/perodua-myvi-2.jpg', altAr: 'بيرودوا مايفي 2024 - منظر جانبي', altEn: 'Perodua Myvi 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/perodua-myvi-3.jpg', altAr: 'بيرودوا مايفي 2024 - الداخلية', altEn: 'Perodua Myvi 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Mazda',
      model: 'MX-5',
      year: 2024,
      slug: 'mazda-mx5-2024',
      descriptionAr: 'مازدا MX-5 2024 - سيارة رياضية مكشوفة أيقونية. متعة القيادة في أنقى صورها مع محرك قوي وتصميم أنيق.',
      descriptionEn: 'Mazda MX-5 2024 - An iconic convertible sports car. Pure driving pleasure with a powerful engine and elegant design.',
      transmission: 'MANUAL' as const,
      fuelType: 'PETROL' as const,
      seats: 2,
      doors: 2,
      engine: '2.0L SKYACTIV-G',
      luggageCapacity: 1,
      features: ['Bose Audio', 'Convertible Top', 'Sport Suspension', 'Limited Slip Diff', 'Bilstein Dampers', 'Recaro Seats'],
      isFeatured: true,
      isAvailable: true,
      categoryId: sports.id,
      pricing: { dailyRate: 350, weeklyRate: 2200, monthlyRate: 8000, securityDeposit: 2000 },
      images: [
        { url: '/images/seed/mazda-mx5-1.jpg', altAr: 'مازدا MX-5 2024 - منظر أمامي', altEn: 'Mazda MX-5 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/mazda-mx5-2.jpg', altAr: 'مازدا MX-5 2024 - مكشوفة', altEn: 'Mazda MX-5 2024 - Convertible', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/mazda-mx5-3.jpg', altAr: 'مازدا MX-5 2024 - الداخلية', altEn: 'Mazda MX-5 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
    {
      brand: 'Honda',
      model: 'CR-V',
      year: 2024,
      slug: 'honda-crv-2024',
      descriptionAr: 'هوندا CR-V 2024 - سيارة SUV عائلية واسعة بمحرك هايبرد. تجمع بين الكفاءة والراحة مع مساحة داخلية كبيرة.',
      descriptionEn: 'Honda CR-V 2024 - A spacious family SUV with hybrid engine. Combines efficiency and comfort with generous interior space.',
      transmission: 'AUTOMATIC' as const,
      fuelType: 'HYBRID' as const,
      seats: 5,
      doors: 4,
      engine: '2.0L e:HEV Hybrid',
      luggageCapacity: 4,
      features: ['Honda SENSING', 'Wireless Apple CarPlay', 'Hands-Free Tailgate', 'Panoramic Sunroof', 'Heated Seats', 'Adaptive Cruise Control'],
      isFeatured: false,
      isAvailable: true,
      categoryId: suv.id,
      pricing: { dailyRate: 250, weeklyRate: 1600, monthlyRate: 5800, securityDeposit: 1200 },
      images: [
        { url: '/images/seed/honda-crv-1.jpg', altAr: 'هوندا CR-V 2024 - منظر أمامي', altEn: 'Honda CR-V 2024 - Front View', isPrimary: true, orderIndex: 0 },
        { url: '/images/seed/honda-crv-2.jpg', altAr: 'هوندا CR-V 2024 - منظر جانبي', altEn: 'Honda CR-V 2024 - Side View', isPrimary: false, orderIndex: 1 },
        { url: '/images/seed/honda-crv-3.jpg', altAr: 'هوندا CR-V 2024 - الداخلية', altEn: 'Honda CR-V 2024 - Interior', isPrimary: false, orderIndex: 2 },
      ],
    },
  ];

  for (const carData of carsData) {
    const { pricing, images, ...carFields } = carData;

    const car = await prisma.car.create({ data: carFields });

    await prisma.carPricing.create({
      data: {
        carId: car.id,
        dailyRate: pricing.dailyRate,
        weeklyRate: pricing.weeklyRate,
        monthlyRate: pricing.monthlyRate,
        currency: 'MYR',
        securityDeposit: pricing.securityDeposit,
      },
    });

    await prisma.carImage.createMany({
      data: images.map((img) => ({
        carId: car.id,
        url: img.url,
        altAr: img.altAr,
        altEn: img.altEn,
        isPrimary: img.isPrimary,
        orderIndex: img.orderIndex,
      })),
    });

    console.log(`  ✅ ${car.brand} ${car.model} ${car.year}`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log(`   📦 ${carsData.length} cars created`);
  console.log(`   📂 5 categories created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
