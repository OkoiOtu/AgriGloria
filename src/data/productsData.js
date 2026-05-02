export const productsData = [
  {
    id: 'layer-chicken',
    title: 'Layer Chicken (Point-of-lay)',
    category: 'poultry',
    priceNGN: 4500,
    priceUSD: 8.5,
    unit: 'per bird',
    stock: 120,
    featured: true,
    image: 'Brown_Hen_Near_White_Egg_on_Nest.jpg',
    features: ['Vaccinated', 'High egg yield', 'Adapted to local climate'],
    description: 'Healthy point-of-lay layer chickens for consistent egg production.',
  },
  {
    id: 'broiler-chicken',
    title: 'Broiler Chicken (Meat)',
    category: 'poultry',
    priceNGN: 2200,
    priceUSD: 4.2,
    unit: 'per bird',
    stock: 300,
    featured: false,
    image: 'Close_Up_Shot_of_a_Broiler_Chicken.jpg',
    features: ['Fast-growing', 'High feed conversion', 'Antibiotic-free'],
    description: 'Premium broiler stock raised for tender, flavorful meat.',
  },
  {
    id: 'pig',
    title: 'Weaner Pig',
    category: 'pigs',
    priceNGN: 35000,
    priceUSD: 66,
    unit: 'per pig',
    stock: 40,
    featured: false,
    image: 'Piglets_at_Farm.jpg',
    features: ['Good breeding stock', 'Dewormed', 'Disease-resistant'],
    description: 'Healthy weaner pigs from quality Large White breeds.',
  },
  {
    id: 'snail',
    title: 'Edible Snail',
    category: 'snails',
    priceNGN: 1200,
    priceUSD: 2.3,
    unit: 'per dozen',
    stock: 1000,
    featured: false,
    image: 'Close_Up_Photo_of_a_Snail.jpg',
    features: ['High protein', 'Export quality', 'Low cholesterol'],
    description: 'Fresh heliculture stock — Achatina achatina breed.',
  },
  {
    id: 'fish',
    title: 'Catfish',
    category: 'fish',
    priceNGN: 900,
    priceUSD: 1.8,
    unit: 'per kg',
    stock: 2000,
    featured: false,
    image: 'Fish.jpg',
    features: ['Live delivery', 'Processed option', 'Freshwater raised'],
    description: 'Freshly harvested Clarias catfish from clean water ponds.',
  },
  {
    id: 'goat',
    title: 'Goat (Adult)',
    category: 'goats',
    priceNGN: 55000,
    priceUSD: 105,
    unit: 'per goat',
    stock: 25,
    featured: false,
    image: 'Close_Up_Photo_of_a_Goat_Head.jpg',
    features: ['Dual purpose', 'Healthy breeding stock', 'Wholesale available'],
    description: 'Adult goats suitable for meat and dairy production.',
  },
]

export const deliveryOptions = [
  { value: 'within-akamkpa', label: 'Within Akamkpa' },
  { value: 'cross-river', label: 'Cross River State' },
  { value: 'other-states', label: 'Other States' },
]

export function getDeliveryCost(qty, location) {
  if (location === 'within-akamkpa') return qty >= 50 ? 0 : 2000
  if (location === 'cross-river') return qty >= 100 ? 5000 : 8000
  return 20000
}

export function getDiscountPercent(qty) {
  if (qty >= 500) return 30
  if (qty >= 200) return 25
  if (qty >= 100) return 20
  if (qty >= 50) return 15
  return 0
}
