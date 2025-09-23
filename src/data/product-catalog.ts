import { VectorItem } from '../types/rag';

/**
 * Catálogo de Productos para RAG
 * Contenido optimizado para embeddings y búsqueda semántica
 */
export const PRODUCTS_CATALOG: VectorItem[] = [
  {
    id: 'prod-001',
    title: 'iPhone 15 Pro',
    content: 'iPhone 15 Pro smartphone premium Apple. Chip A17 Pro, cámara de 48MP, pantalla Super Retina XDR 6.1 pulgadas, construcción titanio. Ideal fotografía profesional, gaming, productividad avanzada. Características: 5G, carga inalámbrica, resistente agua, Face ID, cámara premium. Precio $999. Marca Apple. Categoría electrónicos.',
    category: 'electronics',
    date: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-002', 
    title: 'Samsung Galaxy Buds Pro 3',
    content: 'Samsung Galaxy Buds Pro 3 auriculares inalámbricos. Cancelación activa ruido, audio espacial, batería 8 horas. Perfectos trabajo remoto, ejercicio, entretenimiento. Características: inalámbricos, cancelación ruido, resistentes sudor, carga rápida. Precio $179. Marca Samsung. Categoría electrónicos.',
    category: 'electronics',
    date: '2024-01-10T15:30:00Z',
  },
  {
    id: 'prod-003',
    title: 'MacBook Air M3',
    content: 'MacBook Air M3 laptop ultraligera Apple. Chip M3, pantalla Liquid Retina 13.6 pulgadas, 18 horas batería. Ideal estudiantes, profesionales creativos, trabajo remoto. Características: ultraligero, batería larga duración, pantalla retina, operación silenciosa. Precio $1199. Marca Apple. Categoría electrónicos.',
    category: 'electronics',
    date: '2024-01-12T09:15:00Z',
  },
  {
    id: 'prod-004',
    title: 'Bandas Elásticas Premium Set',
    content: 'Bandas elásticas premium set 5 bandas resistencia FitPro. Diferentes niveles, manijas ergonómicas, guía ejercicios. Perfecto entrenamiento casa, fisioterapia, ejercicio funcional. Características: portátil, versátil, ahorro espacio, resistencia múltiple, ejercicio hogar. Precio $29.99. Marca FitPro. Categoría deportes.',
    category: 'sports',
    date: '2024-01-08T14:20:00Z',
  },
  {
    id: 'prod-005',
    title: 'Colchoneta Yoga Antideslizante',
    content: 'Colchoneta yoga premium ZenFit 6mm grosor. Material TPE ecológico, superficie antideslizante. Ideal yoga, pilates, estiramientos, meditación casa. Características: antideslizante, ecológico, acolchado grueso, portátil, fácil limpiar. Precio $45. Marca ZenFit. Categoría deportes.',
    category: 'sports',
    date: '2024-01-05T11:45:00Z',
  },
  {
    id: 'prod-006',
    title: 'Set Cuchillos Profesional',
    content: 'Set cuchillos chef profesional ChefMaster acero inoxidable. 8 cuchillos alta calidad bloque madera. Incluye cuchillo chef, santoku, deshuesador, chaira. Perfecto cocineros profesionales aficionados. Características: grado profesional, acero inoxidable, filo afilado, ergonómico. Precio $189. Marca ChefMaster. Categoría cocina.',
    category: 'kitchen',
    date: '2024-01-03T16:30:00Z',
  },
  {
    id: 'prod-007',
    title: 'Cafetera Espresso Automática',
    content: 'Cafetera espresso automática BrewMaster molinillo integrado. 15 bares presión, sistema espuma automático. Prepara café, cappuccino, latte un toque. Ideal amantes café. Características: automática, molinillo integrado, espumador leche, programable, calidad profesional. Precio $599. Marca BrewMaster. Categoría cocina.',
    category: 'kitchen',
    date: '2024-01-01T08:00:00Z',
  },
  {
    id: 'prod-008',
    title: 'Reloj Inteligente Deportivo',
    content: 'Smartwatch deportivo SportTech GPS, monitor cardíaco, seguimiento sueño. Resistente agua 50m, más 100 modos deportivos, 7 días batería. Características: GPS, monitor ritmo cardíaco, resistente agua, batería larga, modos deportivos. Precio $249. Marca SportTech. Categoría accesorios.',
    category: 'accessories',
    date: '2023-12-28T12:15:00Z',
  },
  {
    id: 'prod-009',
    title: 'Set Spa Casa Aromaterapia',
    content: 'Set spa casa completo RelaxSpa aceites esenciales, velas aromáticas, sales baño, mascarillas faciales, guía relajación. Regalo perfecto bienestar autocuidado. Características: aromaterapia, ingredientes naturales, set completo, relajante, listo regalo. Precio $79. Marca RelaxSpa. Categoría belleza.',
    category: 'beauty',
    date: '2023-12-25T10:30:00Z',
  },
  {
    id: 'prod-010',
    title: 'Botella Agua Térmica',
    content: 'Botella térmica HydroLife acero inoxidable. Mantiene bebidas frías 24h calientes 12h. Diseño ergonómico, libre BPA, tapa anti-goteo. Perfecta oficina, gym, viajes. Características: aislamiento térmico, libre BPA, anti-goteo, ergonómica, duradera. Precio $24.99. Marca HydroLife. Categoría accesorios.',
    category: 'accessories',
    date: '2023-12-20T14:45:00Z',
  }
];