import { VectorItem } from '../types/rag';

/**
 * Catálogo de Productos para RAG
 * Contenido optimizado para embeddings y búsqueda semántica
 */
export const PRODUCTS_CATALOG: VectorItem[] = [
  {
    id: 'prod-001',
    title: 'iPhone 15 Pro',
    content: 'iPhone 15 Pro smartphone premium Apple. Chip A17 Pro, cámara de 48MP, pantalla Super Retina XDR 6.1 pulgadas, construcción titanio. Ideal fotografía profesional, gaming, productividad avanzada. Características: 5G, carga inalámbrica, resistente agua, Face ID, cámara premium.',
    category: 'electronics',
    price: 999,
    brand: 'Apple',
    date: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-002', 
    title: 'Samsung Galaxy Buds Pro 3',
    content: 'Samsung Galaxy Buds Pro 3 auriculares inalámbricos. Cancelación activa ruido, audio espacial, batería 8 horas. Perfectos trabajo remoto, ejercicio, entretenimiento. Características: inalámbricos, cancelación ruido, resistentes sudor, carga rápida.',
    category: 'electronics',
    price: 179,
    brand: 'Samsung',
    date: '2024-01-10T15:30:00Z',
  },
  {
    id: 'prod-003',
    title: 'MacBook Air M3',
    content: 'MacBook Air M3 laptop ultraligera Apple. Chip M3, pantalla Liquid Retina 13.6 pulgadas, 18 horas batería. Ideal estudiantes, profesionales creativos, trabajo remoto. Características: ultraligero, batería larga duración, pantalla retina, operación silenciosa.',
    category: 'electronics',
    price: 1199,
    brand: 'Apple',
    date: '2024-01-12T09:15:00Z',
  },
  {
    id: 'prod-004',
    title: 'Bandas Elásticas Premium Set',
    content: 'Bandas elásticas premium set 5 bandas resistencia FitPro. Diferentes niveles, manijas ergonómicas, guía ejercicios. Perfecto entrenamiento casa, fisioterapia, ejercicio funcional. Características: portátil, versátil, ahorro espacio, resistencia múltiple, ejercicio hogar.',
    category: 'sports',
    price: 29.99,
    brand: 'FitPro',
    date: '2024-01-08T14:20:00Z',
  },
  {
    id: 'prod-005',
    title: 'Colchoneta Yoga Antideslizante',
    content: 'Colchoneta yoga premium ZenFit 6mm grosor. Material TPE ecológico, superficie antideslizante. Ideal yoga, pilates, estiramientos, meditación casa. Características: antideslizante, ecológico, acolchado grueso, portátil, fácil limpiar.',
    category: 'sports',
    price: 45,
    brand: 'ZenFit',
    date: '2024-01-05T11:45:00Z',
  },
  {
    id: 'prod-006',
    title: 'Set Cuchillos Profesional',
    content: 'Set cuchillos chef profesional ChefMaster acero inoxidable. 8 cuchillos alta calidad bloque madera. Incluye cuchillo chef, santoku, deshuesador, chaira. Perfecto cocineros profesionales aficionados. Características: grado profesional, acero inoxidable, filo afilado, ergonómico.',
    category: 'kitchen',
    price: 189,
    brand: 'ChefMaster',
    date: '2024-01-03T16:30:00Z',
  },
  {
    id: 'prod-007',
    title: 'Cafetera Espresso Automática',
    content: 'Cafetera espresso automática BrewMaster molinillo integrado. 15 bares presión, sistema espuma automático. Prepara café, cappuccino, latte un toque. Ideal amantes café. Características: automática, molinillo integrado, espumador leche, programable, calidad profesional.',
    category: 'kitchen',
    price: 599,
    brand: 'BrewMaster',
    date: '2024-01-01T08:00:00Z',
  },
  {
    id: 'prod-008',
    title: 'Reloj Inteligente Deportivo',
    content: 'Smartwatch deportivo SportTech GPS, monitor cardíaco, seguimiento sueño. Resistente agua 50m, más 100 modos deportivos, 7 días batería. Características: GPS, monitor ritmo cardíaco, resistente agua, batería larga, modos deportivos.',
    category: 'accessories',
    price: 249,
    brand: 'SportTech',
    date: '2023-12-28T12:15:00Z',
  },
  {
    id: 'prod-009',
    title: 'Set Spa Casa Aromaterapia',
    content: 'Set spa casa completo RelaxSpa aceites esenciales, velas aromáticas, sales baño, mascarillas faciales, guía relajación. Regalo perfecto bienestar autocuidado. Características: aromaterapia, ingredientes naturales, set completo, relajante, listo regalo.',
    category: 'beauty',
    price: 79,
    brand: 'RelaxSpa',
    date: '2023-12-25T10:30:00Z',
  },
  {
    id: 'prod-010',
    title: 'Botella Agua Térmica',
    content: 'Botella térmica HydroLife acero inoxidable. Mantiene bebidas frías 24h calientes 12h. Diseño ergonómico, libre BPA, tapa anti-goteo. Perfecta oficina, gym, viajes. Características: aislamiento térmico, libre BPA, anti-goteo, ergonómica, duradera.',
    category: 'accessories',
    price: 24.99,
    brand: 'HydroLife',
    date: '2023-12-20T14:45:00Z',
  },
  {
    id: 'prod-011',
    title: 'Auriculares Gaming RGB',
    content: 'Auriculares gaming profesional GameZone RGB iluminación personalizable. Audio surround 7.1, micrófono cancelación ruido, almohadillas memoria. Perfecto gaming competitivo, streaming, comunicación online. Características: audio surround, micrófono profesional, RGB personalizable, cómodos.',
    category: 'electronics',
    price: 89,
    brand: 'GameZone',
    date: '2024-01-20T16:45:00Z',
  },
  {
    id: 'prod-012',
    title: 'Mancuernas Ajustables 20kg',
    content: 'Mancuernas ajustables PowerFlex 5-20kg por mancuerna. Sistema cambio rápido, ahorra espacio, equivalente 10 pares mancuernas tradicionales. Ideal entrenamiento fuerza casa. Características: ajustables, ahorra espacio, cambio rápido, duraderas, versatiles.',
    category: 'sports',
    price: 159,
    brand: 'PowerFlex',
    date: '2024-01-18T09:30:00Z',
  }
];

// Helper function to get products by category
export const getProductsByCategory = (category: string): VectorItem[] => {
  return PRODUCTS_CATALOG.filter(product => product.category === category);
};

// Helper function to get products by price range
export const getProductsByPriceRange = (minPrice: number, maxPrice: number): VectorItem[] => {
  return PRODUCTS_CATALOG.filter(product => 
    product.price && product.price >= minPrice && product.price <= maxPrice
  );
};

// Available categories
export const AVAILABLE_CATEGORIES = [
  'electronics',
  'sports', 
  'kitchen',
  'accessories',
  'beauty'
] as const;