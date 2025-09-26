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
  },

  // ============================================================================
  // ELECTRONICS - Expanded
  // ============================================================================
  {
    id: 'prod-013',
    title: 'Samsung Galaxy S24 Ultra',
    content: 'Samsung Galaxy S24 Ultra smartphone flagship Android. Snapdragon 8 Gen 3, cámara 200MP, S Pen integrado, pantalla AMOLED 6.8 pulgadas. Perfecto productividad, fotografía profesional, gaming. Características: cámara zoom 100x, S Pen, batería 5000mAh, resistente agua.',
    category: 'electronics',
    price: 1299,
    brand: 'Samsung',
    date: '2024-01-25T10:00:00Z',
  },
  {
    id: 'prod-014',
    title: 'Sony WH-1000XM5',
    content: 'Sony WH-1000XM5 auriculares premium cancelación ruido líder industria. 30 horas batería, audio Hi-Res, llamadas cristalinas. Ideal viajes, trabajo, música audiófila. Características: cancelación ruido superior, cómodos, calidad audio excepcional, batería larga.',
    category: 'electronics',
    price: 399,
    brand: 'Sony',
    date: '2024-01-22T14:30:00Z',
  },
  {
    id: 'prod-015',
    title: 'Dell XPS 13 Plus',
    content: 'Dell XPS 13 Plus laptop ultrabook Intel 13th Gen. Pantalla InfinityEdge 13.4 pulgadas, diseño premium, teclado capacitivo. Perfecto profesionales, estudiantes, creativos. Características: ultraligero, pantalla bordes mínimos, rendimiento alto, portabilidad.',
    category: 'electronics',
    price: 1399,
    brand: 'Dell',
    date: '2024-01-20T11:15:00Z',
  },
  {
    id: 'prod-016',
    title: 'iPad Pro 12.9 M2',
    content: 'iPad Pro 12.9 M2 tablet profesional Apple. Chip M2, pantalla Liquid Retina XDR, soporte Apple Pencil Magic Keyboard. Ideal artistas digitales, profesionales, estudiantes. Características: chip M2 potente, pantalla XDR, versatilidad, Apple Pencil.',
    category: 'electronics',
    price: 1099,
    brand: 'Apple',
    date: '2024-01-18T09:45:00Z',
  },
  {
    id: 'prod-017',
    title: 'Monitor 4K Gaming 27"',
    content: 'Monitor gaming TechView 27 pulgadas 4K UHD 144Hz. HDR10, tiempo respuesta 1ms, FreeSync Premium. Perfecto gaming competitivo, trabajo creativo, entretenimiento. Características: 4K 144Hz, HDR10, baja latencia, colores vibrantes.',
    category: 'electronics',
    price: 549,
    brand: 'TechView',
    date: '2024-01-16T15:20:00Z',
  },
  {
    id: 'prod-018',
    title: 'Teclado Mecánico RGB',
    content: 'Teclado mecánico gaming MechPro switches Cherry MX Blue. Iluminación RGB personalizable, construcción aluminio, anti-ghosting. Perfecto gaming, programación, escritura. Características: switches mecánicos, RGB personalizable, duradero, táctil.',
    category: 'electronics',
    price: 159,
    brand: 'MechPro',
    date: '2024-01-14T12:30:00Z',
  },
  {
    id: 'prod-019',
    title: 'Webcam 4K Streaming',
    content: 'Webcam StreamCam 4K Ultra HD autoenfoque, corrección luz automática, micrófono dual. Ideal streaming, videollamadas, creación contenido. Características: 4K calidad, autoenfoque rápido, micrófono integrado, plug-and-play.',
    category: 'electronics',
    price: 199,
    brand: 'StreamCam',
    date: '2024-01-12T16:45:00Z',
  },

  // ============================================================================
  // HOME & LIVING - New Category
  // ============================================================================
  {
    id: 'prod-020',
    title: 'Aspiradora Robot Inteligente',
    content: 'Aspiradora robot CleanBot mapeo láser, navegación inteligente, succión 4000Pa. Programable app, auto-vaciado, limpieza húmeda. Ideal hogares ocupados, mascotas. Características: mapeo láser, app control, auto-vaciado, limpieza híbrida.',
    category: 'home',
    price: 499,
    brand: 'CleanBot',
    date: '2024-01-26T10:30:00Z',
  },
  {
    id: 'prod-021',
    title: 'Purificador Aire HEPA',
    content: 'Purificador aire AirPure filtro HEPA H13, cobertura 50m², sensor calidad aire tiempo real. Elimina 99.97% partículas, alergenos, virus. Características: filtro HEPA H13, sensor inteligente, silencioso, cobertura amplia.',
    category: 'home',
    price: 299,
    brand: 'AirPure',
    date: '2024-01-24T14:15:00Z',
  },
  {
    id: 'prod-022',
    title: 'Humidificador Ultrasónico',
    content: 'Humidificador ultrasónico MistMaker 6L capacidad, 24h autonomía, control remoto, aromaterapia. Mejora calidad aire, ideal climas secos, bebés. Características: ultrasónico silencioso, gran capacidad, aromaterapia, control remoto.',
    category: 'home',
    price: 89,
    brand: 'MistMaker',
    date: '2024-01-22T11:20:00Z',
  },
  {
    id: 'prod-023',
    title: 'Lámpara LED Escritorio',
    content: 'Lámpara escritorio LightPro LED ajustable, 3 modos color, carga inalámbrica base, control táctil. Ideal estudio, trabajo, lectura nocturna. Características: LED ajustable, carga inalámbrica, control táctil, cuidado ojos.',
    category: 'home',
    price: 79,
    brand: 'LightPro',
    date: '2024-01-20T13:45:00Z',
  },
  {
    id: 'prod-024',
    title: 'Organizador Closet Modular',
    content: 'Sistema organizador closet ModularSpace componentes ajustables, estantes, cajones, barras colgado. Maximiza espacio, fácil instalación. Características: modular ajustable, ahorra espacio, fácil montaje, versatil.',
    category: 'home',
    price: 149,
    brand: 'ModularSpace',
    date: '2024-01-18T10:00:00Z',
  },

  // ============================================================================
  // CLOTHING - New Category
  // ============================================================================
  {
    id: 'prod-025',
    title: 'Zapatillas Running Nike Air',
    content: 'Zapatillas running Nike Air Zoom Pegasus 40 tecnología Air Zoom, suela React, upper transpirable. Perfectas corredores regulares, entrenamiento diario. Características: tecnología Air Zoom, amortiguación React, transpirable, durabilidad.',
    category: 'clothing',
    price: 130,
    brand: 'Nike',
    date: '2024-01-28T09:15:00Z',
  },
  {
    id: 'prod-026',
    title: 'Chaqueta Deportiva Adidas',
    content: 'Chaqueta deportiva Adidas Ultraboost climaproof resistente viento agua, capucha ajustable, bolsillos seguros. Ideal running, outdoor, entrenamiento. Características: resistente clima, capucha ajustable, transpirable, bolsillos seguros.',
    category: 'clothing',
    price: 85,
    brand: 'Adidas',
    date: '2024-01-26T15:30:00Z',
  },
  {
    id: 'prod-027',
    title: 'Leggings Yoga Premium',
    content: 'Leggings yoga FlexFit tela compresión, cintura alta, bolsillos laterales, material moisture-wicking. Perfectos yoga, pilates, gym, uso diario. Características: compresión suave, cintura alta, moisture-wicking, bolsillos funcionales.',
    category: 'clothing',
    price: 49,
    brand: 'FlexFit',
    date: '2024-01-24T12:45:00Z',
  },
  {
    id: 'prod-028',
    title: 'Camisa Formal Premium',
    content: 'Camisa formal BusinessElite algodón egipcio, corte slim fit, cuello italiano, tratamiento antiarrugas. Ideal oficina, eventos, uso profesional. Características: algodón premium, corte moderno, antiarrugas, cuello elegante.',
    category: 'clothing',
    price: 69,
    brand: 'BusinessElite',
    date: '2024-01-22T14:00:00Z',
  },

  // ============================================================================
  // BOOKS & EDUCATION - New Category  
  // ============================================================================
  {
    id: 'prod-029',
    title: 'Curso Online Programación',
    content: 'Curso completo programación CodeAcademy JavaScript Python, proyectos reales, certificación, soporte instructores. Perfecto principiantes, cambio carrera. Características: proyectos reales, certificación reconocida, soporte personalizado, acceso lifetime.',
    category: 'education',
    price: 299,
    brand: 'CodeAcademy',
    date: '2024-01-30T10:00:00Z',
  },
  {
    id: 'prod-030',
    title: 'Kit Arduino Principiantes',
    content: 'Kit Arduino MakerKit componentes electrónicos, sensores, LEDs, resistencias, guía proyectos paso a paso. Ideal estudiantes, makers, hobbyists. Características: componentes variados, guía detallada, proyectos progresivos, educativo.',
    category: 'education',
    price: 59,
    brand: 'MakerKit',
    date: '2024-01-28T11:30:00Z',
  },

  // ============================================================================
  // SPORTS - Expanded
  // ============================================================================
  {
    id: 'prod-031',
    title: 'Bicicleta Estática Plegable',
    content: 'Bicicleta estática FitCycle plegable, 8 niveles resistencia, monitor LCD, soporte tablet, diseño compacto. Ideal cardio casa, espacios pequeños. Características: plegable, resistencia ajustable, monitor LCD, soporte dispositivos.',
    category: 'sports',
    price: 299,
    brand: 'FitCycle',
    date: '2024-01-26T16:20:00Z',
  },
  {
    id: 'prod-032',
    title: 'Set Pesas Rusas Kettlebells',
    content: 'Set kettlebells IronFit 8kg, 12kg, 16kg hierro fundido, agarre ergonómico, base estable. Perfecto entrenamiento funcional, fuerza, cardio. Características: hierro fundido, agarre cómodo, entrenamiento completo, durabilidad.',
    category: 'sports',
    price: 189,
    brand: 'IronFit',
    date: '2024-01-24T13:15:00Z',
  },
  {
    id: 'prod-033',
    title: 'Caminadora Eléctrica',
    content: 'Caminadora eléctrica RunMaster motor 2.5HP, velocidad 0.8-12km/h, inclinación automática, programas pre-configurados. Ideal cardio, pérdida peso. Características: motor potente, inclinación automática, programas variados, plegable.',
    category: 'sports',
    price: 899,
    brand: 'RunMaster',
    date: '2024-01-22T09:45:00Z',
  },
  {
    id: 'prod-034',
    title: 'Pelota Ejercicio Pilates',
    content: 'Pelota ejercicio PilatesBall 65cm anti-burst, material PVC premium, inflador incluido, guía ejercicios. Ideal pilates, fisioterapia, core training. Características: anti-burst, tamaño profesional, material premium, guía incluida.',
    category: 'sports',
    price: 25,
    brand: 'PilatesBall',
    date: '2024-01-20T15:30:00Z',
  },

  // ============================================================================
  // KITCHEN - Expanded
  // ============================================================================
  {
    id: 'prod-035',
    title: 'Freidora de Aire 5L',
    content: 'Freidora aire AirChef 5L capacidad, tecnología circulación aire caliente, 8 programas pre-configurados, sin aceite. Cocina saludable, fácil limpieza. Características: sin aceite, cocción uniforme, programas automáticos, fácil limpiar.',
    category: 'kitchen',
    price: 129,
    brand: 'AirChef',
    date: '2024-01-25T14:20:00Z',
  },
  {
    id: 'prod-036',
    title: 'Licuadora Alta Potencia',
    content: 'Licuadora NutriBlend 1500W, cuchillas acero inoxidable, jarra cristal 2L, función pulse, tritura hielo. Ideal smoothies, sopas, salsas. Características: alta potencia, cuchillas profesionales, jarra cristal, función pulse.',
    category: 'kitchen',
    price: 179,
    brand: 'NutriBlend',
    date: '2024-01-23T12:00:00Z',
  },
  {
    id: 'prod-037',
    title: 'Sartén Antiadherente Premium',
    content: 'Sartén ChefPan 28cm recubrimiento cerámico antiadherente, base triple, apta inducción, mango ergonómico. Cocina saludable sin químicos. Características: cerámico antiadherente, apta inducción, base triple, mango cómodo.',
    category: 'kitchen',
    price: 69,
    brand: 'ChefPan',
    date: '2024-01-21T10:45:00Z',
  },
  {
    id: 'prod-038',
    title: 'Procesador Alimentos Multifunción',
    content: 'Procesador alimentos FoodPro 12 funciones, motor 800W, 4 discos intercambiables, tazón 3L. Ideal preparación comidas, repostería. Características: multifunción, motor potente, accesorios variados, gran capacidad.',
    category: 'kitchen',
    price: 199,
    brand: 'FoodPro',
    date: '2024-01-19T16:15:00Z',
  },

  // ============================================================================
  // BEAUTY & PERSONAL CARE - Expanded
  // ============================================================================
  {
    id: 'prod-039',
    title: 'Cepillo Facial Sónico',
    content: 'Cepillo facial sónico GlowSkin limpieza profunda, 3 velocidades, resistente agua, batería recargable. Mejora textura piel, anti-edad. Características: tecnología sónica, resistente agua, batería larga, limpieza profunda.',
    category: 'beauty',
    price: 89,
    brand: 'GlowSkin',
    date: '2024-01-27T13:30:00Z',
  },
  {
    id: 'prod-040',
    title: 'Secador Iónico Profesional',
    content: 'Secador cabello ProDry tecnología iónica, motor AC 2200W, 3 temperaturas, boquilla concentradora, difusor. Secado rápido sin daño. Características: tecnología iónica, motor profesional, accesorios incluidos, secado rápido.',
    category: 'beauty',
    price: 149,
    brand: 'ProDry',
    date: '2024-01-25T11:45:00Z',
  },

  // ============================================================================
  // ACCESSORIES - Expanded
  // ============================================================================
  {
    id: 'prod-041',
    title: 'Mochila Laptop Antirrobo',
    content: 'Mochila SecurePack laptop 15.6", puerto USB, cremalleras ocultas, material resistente agua, compartimento antirrobo. Ideal viajes, trabajo, universidad. Características: puerto USB, antirrobo, resistente agua, organizadores.',
    category: 'accessories',
    price: 59,
    brand: 'SecurePack',
    date: '2024-01-29T09:20:00Z',
  },
  {
    id: 'prod-042',
    title: 'Powerbank 20000mAh',
    content: 'Powerbank ChargePro 20000mAh carga rápida QC 3.0, PD 18W, 3 puertos salida, pantalla LED, compatible todos dispositivos. Autonomía extendida viajes. Características: alta capacidad, carga rápida, múltiples puertos, pantalla LED.',
    category: 'accessories',
    price: 45,
    brand: 'ChargePro',
    date: '2024-01-27T14:50:00Z',
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

// Helper function to get products by brand
export const getProductsByBrand = (brand: string): VectorItem[] => {
  return PRODUCTS_CATALOG.filter(product => 
    product.brand?.toLowerCase() === brand.toLowerCase()
  );
};

// Helper function to get random products (for recommendations)
export const getRandomProducts = (count: number, excludeIds: string[] = []): VectorItem[] => {
  const filtered = PRODUCTS_CATALOG.filter(product => !excludeIds.includes(product.id));
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get products by price tier
export const getProductsByPriceTier = (tier: 'budget' | 'mid-range' | 'premium'): VectorItem[] => {
  switch (tier) {
    case 'budget':
      return getProductsByPriceRange(0, 100);
    case 'mid-range':
      return getProductsByPriceRange(100, 500);
    case 'premium':
      return getProductsByPriceRange(500, Infinity);
    default:
      return [];
  }
};

// Get catalog statistics
export const getCatalogStats = () => {
  const totalProducts = PRODUCTS_CATALOG.length;
  const categoryCounts = AVAILABLE_CATEGORIES.reduce((acc, category) => {
    acc[category] = getProductsByCategory(category).length;
    return acc;
  }, {} as Record<string, number>);
  
  const prices = PRODUCTS_CATALOG.filter(p => p.price).map(p => p.price!);
  const priceStats = prices.length > 0 ? {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  } : null;

  const brands = [...new Set(PRODUCTS_CATALOG.map(p => p.brand).filter(Boolean))];

  return {
    totalProducts,
    categoryCounts,
    priceStats,
    brands: brands.sort(),
    totalBrands: brands.length
  };
};

// Available categories
export const AVAILABLE_CATEGORIES = [
  'electronics',
  'sports',
  'kitchen', 
  'home',
  'clothing',
  'education',
  'accessories',
  'beauty'
] as const;