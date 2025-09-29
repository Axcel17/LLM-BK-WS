import { VectorItem } from '../types/search';

/**
 * Catálogo de Productos para RAG
 */
export const PRODUCTS_CATALOG: VectorItem[] = [
  // ============================================================================
  // ELECTRONICS
  // ============================================================================
  {
    id: 'prod-001',
    title: 'iPhone 15 Pro',
    content: 'iPhone 15 Pro smartphone premium Apple. Chip A17 Pro procesamiento avanzado, cámara profesional 48MP sistema triple lente, pantalla Super Retina XDR 6.1 pulgadas brillante, construcción titanio resistente durable. Perfecto trabajo remoto productividad oficina móvil, fotografía profesional content creator influencer, gaming móvil videojuegos, comunicación empresarial videollamadas. Ideal profesionales creativos artistas digitales, estudiantes universitarios tecnología, ejecutivos movilidad, regalo premium tecnología. Características: conectividad 5G ultra rápida, carga inalámbrica MagSafe conveniente, resistente agua IP68, Face ID seguridad biométrica, cámara cinematográfica 4K, batería larga duración.',
    category: 'electronics',
    price: 999,
    brand: 'Apple',
    date: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-002', 
    title: 'Samsung Galaxy Buds Pro 3',
    content: 'Samsung Galaxy Buds Pro 3 auriculares inalámbricos premium cancelación activa ruido inteligente ANC. Drivers de 11mm audio espacial 360, tecnología Bluetooth 5.3 conexión estable, estuche carga inalámbrica Qi 30 horas batería total. Resistencia agua IPX7 ejercicio intenso sudor lluvia, micrófonos duales llamadas cristalinas cancelación eco viento. Controles táctiles personalizables reproducción volumen asistente, ajuste ergonómico 3 tamaños almohadillas incluidas comodidad prolongada. Perfecto trabajo remoto videollamadas nitidez, ejercicio running gym resistente sudor, entretenimiento música podcasts calidad audiófila, viajes cancelación ruido ambiente. Ideal profesionales calls frecuentes, atletas entrenamientos diarios, estudiantes concentración estudio, viajeros frecuentes transporte público. Compatibilidad universal Android iOS Windows, app Samsung Wearable personalización ecualizador, modo transparencia ambiente consciente. Características: cancelación ruido adaptativa inteligente, audio espacial inmersivo envolvente, resistente agua sudor IPX7, batería extendida 30h total, controles táctiles intuitivos.',
    category: 'electronics',
    price: 179,
    brand: 'Samsung',
    date: '2024-01-10T15:30:00Z',
  },
  {
    id: 'prod-003',
    title: 'MacBook Air M3',
    content: 'MacBook Air M3 laptop ultraligera premium Apple. Chip M3 rendimiento excepcional eficiencia energética, pantalla Liquid Retina 13.6 pulgadas colores vibrantes precisos, batería increíble 18 horas productividad sin interrupciones. Perfecto estudiantes universitarios tesis investigación programación, profesionales creativos diseño gráfico video fotografía, trabajo remoto home office nómadas digitales, escritores redactores bloggers contenido, programadores desarrolladores código. Ideal regalo graduación universidad, profesional emprendedor startup, freelancer independiente. Características: ultraligero portátil viajes, batería excepcional larga duración, pantalla retina nítida, operación completamente silenciosa, macOS optimizado productividad.',
    category: 'electronics',
    price: 1199,
    brand: 'Apple',
    date: '2024-01-12T09:15:00Z',
  },
  {
    id: 'prod-011',
    title: 'Auriculares Gaming RGB GameZone Pro',
    content: 'Auriculares gaming profesionales GameZone RGB iluminación personalizable 16.8 millones colores sincronización. Audio surround virtual 7.1 drivers 50mm posicionamiento preciso enemigos, micrófono bidireccional cancelación ruido ambiental comunicación clara equipo. Almohadillas memory foam premium comodidad sesiones largas 8+ horas, diadema acolchada distribución peso equilibrado, construcción aluminio resistente. Controles volumen micrófono cable, compatible PC PlayStation Xbox Nintendo Switch móviles. Perfecto gaming competitivo FPS MOBA RTS, streaming Twitch YouTube calidad profesional, comunicación online Discord TeamSpeak, entretenimiento películas música inmersivo. Ideal gamers competitivos torneos, streamers content creators, estudiantes gaming universidad, regalo gamer enthusiast. Software personalización perfiles juegos, ecualizador avanzado frecuencias, efectos sonido envolvente teatro. Características: audio surround 7.1 posicionamiento preciso, micrófono profesional cancelación ruido, iluminación RGB 16.8M colores personalizable, almohadillas memory foam comodidad extrema, compatibilidad universal multiplataforma.',
    category: 'electronics',
    price: 89,
    brand: 'GameZone',
    date: '2024-01-20T16:45:00Z',
  },
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
    content: 'iPad Pro 12.9 M2 tablet profesional Apple. Chip M2, pantalla Liquid Retina XDR, soporte Apple Pencil Magic Keyboard. Perfecto para escritura digital, tomar notas, dibujo, reemplazar cuadernos tradicionales. Ideal artistas digitales, profesionales, estudiantes que buscan escribir digitalmente. Características: chip M2 potente, pantalla XDR, versatilidad, Apple Pencil para escritura natural, alternativa moderna a cuadernos.',
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
    content: 'Teclado mecánico gaming MechPro switches Cherry MX Blue. Iluminación RGB personalizable, construcción aluminio, anti-ghosting. Perfecto gaming, programación, escritura profesional, escritores, reemplazar escritura manual. Excelente para escribir largos textos, alternativa cómoda para quien no quiere escribir a mano. Características: switches mecánicos táctiles, RGB personalizable, duradero, cómodo para escribir por horas.',
    category: 'electronics',
    price: 159,
    brand: 'MechPro',
    date: '2024-01-14T12:30:00Z',
  },

  // ============================================================================
  // HOME
  // ============================================================================
  {
    id: 'prod-020',
    title: 'Aspiradora Robot Inteligente CleanBot Pro',
    content: 'Aspiradora robot CleanBot Pro mapeo láser LiDAR navegación inteligente, succión potente 4000Pa alfombras pisos duros. Programable app móvil horarios personalizados, estación auto-vaciado 60 días autonomía, función trapeado híbrido aspirado húmedo. Sensores anti-caída escaleras, detección obstáculos tiempo real, batería 5200mAh autonomía 180 minutos limpieza completa. Compatible Alexa Google Assistant control voz, mapas virtuales zonas restringidas limpieza dirigida, filtro HEPA captura alérgenos mascotas. Perfecto hogares ocupados familias, propietarios mascotas pelo constante, personas mayores movilidad limitada, profesionales tiempo limitado limpieza. Ideal regalo padres nuevos, moving house warming, personas alérgicas, trabajadores home office. Incluye accesorios repuesto cepillos laterales centrales, mopas microfibra lavables, manual instrucciones garantía 2 años. Características: mapeo láser precisión milimétrica, succión 4000Pa potente versátil, app control programación inteligente, auto-vaciado 60 días sin mantenimiento, limpieza híbrida aspirado trapeado.',
    category: 'home',
    price: 499,
    brand: 'CleanBot',
    date: '2024-01-26T10:30:00Z',
  },
  {
    id: 'prod-021',
    title: 'Purificador Aire HEPA AirPure Max',
    content: 'Purificador aire AirPure Max filtro HEPA H13 médico cobertura 50m² habitaciones grandes salas. Sensor calidad aire tiempo real PM2.5 PM10, display LED colores calidad, modo automático ajusta velocidad contaminación detectada. Elimina 99.97% partículas 0.3 micrones alérgenos polen ácaros, virus bacterias humo tabaco, olores cocina mascotas químicos VOC. 5 velocidades ventilador ultra-silencioso 23dB modo nocturno, temporizador 8 horas, indicador reemplazo filtro. Compatible app smartphone control remoto, Alexa Google Assistant integración smart home. Perfecto alérgicos asma respiración sensible, hogares mascotas caspa pelo, fumadores humo residual, cocinas olores persistentes, habitaciones bebés aire puro. Ideal regalo salud bienestar, personas enfermedades respiratorias, hogares urbanos contaminación, oficinas aire viciado. Incluye filtro HEPA repuesto, filtro carbón activado, manual usuario garantía 3 años. Características: filtro HEPA H13 grado médico, sensor calidad aire tiempo real, cobertura 50m² espacios grandes, ultra-silencioso 23dB nocturno, app control smart home integration.',
    category: 'home',
    price: 299,
    brand: 'AirPure',
    date: '2024-01-24T14:15:00Z',
  },
  {
    id: 'prod-022',
    title: 'Humidificador Ultrasónico MistMaker Elite',
    content: 'Humidificador ultrasónico MistMaker Elite capacidad 6L tanque grande autonomía 24 horas continuas. Tecnología ultrasónica silenciosa vibración alta frecuencia, nebulización fina uniforme sin ruido molesto sueño. Control remoto inalámbrico todas funciones, display LED humedad temperatura ambiente, 3 velocidades nebulización ajustables según necesidad. Función aromaterapia compartimento aceites esenciales, auto-apagado seguridad tanque vacío, boquilla rotativa 360° distribución homogénea. Mejora calidad aire seco calefacción aire acondicionado, ideal climas secos invierno verano, habitaciones bebés piel sensible, oficinas ambiente controlado. Perfecto problemas respiratorios sequedad nasal, piel seca agrietada deshidratación, plantas interior humedad óptima, hogares calefacción central. Ideal regalo bienestar salud, padres recién nacidos, personas piel atópica, oficinas corporativas ambiente. Incluye cepillo limpieza, manual instrucciones, aceites esenciales muestra, garantía 2 años. Características: capacidad 6L autonomía 24h, tecnología ultrasónica ultra-silenciosa, control remoto funciones completas, aromaterapia aceites esenciales, auto-apagado seguridad tanque vacío.',
    category: 'home',
    price: 89,
    brand: 'MistMaker',
    date: '2024-01-22T11:20:00Z',
  },
  {
    id: 'prod-023',
    title: 'Lámpara LED Escritorio LightPro Smart',
    content: 'Lámpara escritorio LightPro Smart LED regulable 3 temperaturas color blanco frío cálido neutro. Base carga inalámbrica Qi smartphones tablets, control táctil sensible intensidad temperatura, brazo articulado aluminio ajustable múltiples ángulos. Tecnología cuidado ojos sin parpadeo flicker-free, iluminación uniforme sin sombras molestas, memoria configuración anterior encendido automático. USB puerto carga adicional dispositivos, timer auto-apagado 1-4 horas, consumo energía eficiente LED larga vida 50000 horas. Perfecta estudio concentración lectura prolongada, trabajo escritorio oficina home office, lectura nocturna cama sin molestar pareja, tareas precisas costura artesanías. Ideal estudiantes universitarios examenes, profesionales trabajo nocturno, lectores ávidos bibliófílos, artistas trabajo detalle precision. Compatible carga inalámbrica iPhone Samsung Google Pixel, diseño minimalista moderno cualquier decoración. Características: LED regulable 3 temperaturas color, carga inalámbrica Qi integrada base, control táctil ajuste preciso, brazo articulado aluminio flexible, tecnología cuidado ojos flicker-free.',
    category: 'home',
    price: 79,
    brand: 'LightPro',
    date: '2024-01-20T13:45:00Z',
  },
  {
    id: 'prod-024',
    title: 'Organizador Closet Modular ModularSpace Pro',
    content: 'Sistema organizador closet ModularSpace Pro componentes modulares ajustables personalización total. Incluye estantes regulables altura, cajones deslizables suaves, barras colgado diferentes longitudes, divisores cajones ropa interior. Construcción metal resistente pintura polvo antioxidante, capacidad peso 50kg por estante, instalación herramientas incluidas sin taladro. Maximiza espacio vertical closets pequeños apartamentos, configuración personalizable necesidades específicas, cajones transparentes visibilidad completa contenido. Perfecto departamentos espacios reducidos, personas organizadas optimización, familias ropa abundante niños creciendo, mudanzas casas nuevas organización. Ideal regalo mudanza house warming, estudiantes universitarios dormitorios, minimalistas orden extremo, profesionales imagen personal. Incluye manual instrucciones ilustradas, etiquetas identificación, bolsas lavandería, garantía 5 años componentes. Características: sistema modular completamente personalizable, instalación sin herramientas taladro, cajones transparentes visibilidad total, construcción metal resistente durable, maximización espacio vertical eficiente.',
    category: 'home',
    price: 149,
    brand: 'ModularSpace',
    date: '2024-01-18T10:00:00Z',
  },
  {
    id: 'home-025',
    title: 'Cafetera Espresso Automática BrewMaster Pro',
    content: 'Cafetera espresso automática BrewMaster Pro molinillo integrado granos frescos, presión perfecta 15 bares extracción óptima. Sistema espuma leche automático cremosa perfecta cappuccinos lattes, pantalla táctil programable recetas personalizadas favoritas. Prepara espresso intenso, americano suave, cappuccino cremoso, latte artístico un toque botón, limpieza automática ciclo descalcificación. Depósito agua 1.8L removible fácil llenado, tolva granos 250g hermética frescura, bandeja goteo extraíble lavable lavavajillas. Perfecta amantes café exigentes calidad barista casero, oficinas ejecutivas impresionar clientes visitas, hogares familiares café perfecto diario rutina, profesionales madrugadores energía productividad. Ideal regalo día padre coffee lover entusiasta, bodas lista regalos nueva casa, cumpleaños jefe boss appreciation, navidad familia cafetera. Compatible granos cualquier tostado origen, configuración molienda 5 niveles, temperatura agua ajustable, modo eco ahorro energía. Características: molinillo integrado granos frescos diario, presión 15 bares calidad barista, espumador automático leche cremosa, pantalla táctil recetas programables, limpieza automática mantenimiento fácil.',
    category: 'home',
    price: 599,
    brand: 'BrewMaster',
    date: '2024-01-28T08:00:00Z',
  },
  {
    id: 'home-026',
    title: 'Difusor Aromas Ultrasónico ZenScent',
    content: 'Difusor aromas ZenScent ultrasónico nebulización fina aceites esenciales terapéuticos, capacidad 300ml autonomía 10 horas continuas. 7 colores LED intercambiables ambiente relajante, timer automático 1-3-6 horas, 2 modos nebulización intermitente continua. Tecnología ultrasónica preserva propiedades aceites naturales, funcionamiento silencioso 35dB meditación sueño, auto-apagado seguridad agua agotada protección motor. Material BPA-free seguro salud, diseño elegante madera bambú decoración natural cualquier ambiente, fácil limpieza mantenimiento agua jabón. Perfecto relajación estrés ansiedad aromaterapia natural, meditación yoga ambiente tranquilo, habitaciones bebés sueño reparador, oficinas productividad concentración. Ideal regalo spa casa wellness, personas estrés trabajo, practicantes yoga meditación, madres relajación postparto. Compatible todos aceites esenciales puros naturales, incluye manual aromaterapia, recetas mezclas relajantes, garantía 1 año. Características: tecnología ultrasónica preserva aceites naturales, 7 colores LED ambiente personalizable, timer automático 1-6 horas, auto-apagado seguridad protección, diseño bambú elegante decorativo natural.',
    category: 'home',
    price: 45,
    brand: 'ZenScent',
    date: '2024-01-25T16:30:00Z',
  },
  {
    id: 'home-027',
    title: 'Termostato Inteligente SmartTemp WiFi',
    content: 'Termostato inteligente SmartTemp WiFi control temperatura remoto smartphone, programación semanal automática, aprendizaje patrones uso ahorro energía hasta 23%. Pantalla táctil color meteorología, compatibilidad Alexa Google Assistant Siri control voz, geofencing detección presencia ajuste automático. Instalación fácil cables existentes sin electricista, configuración app intuitiva paso paso, alertas mantenimiento sistema HVAC. Monitoreo consumo energético tiempo real gráficos detallados, modo vacaciones temperatura económica, sensores múltiples habitaciones temperatura equilibrada. Perfecto hogares modernos automatización inteligente, personas conscientes ahorro energético, familias horarios variables trabajo, propietarios casas grandes control zonal. Ideal regalo tecnología práctica útil, nuevos propietarios eficiencia energética, personas mayores simplicidad uso, profesionales optimización costos. Compatible sistemas calefacción refrigeración gas eléctrico, actualizaciones firmware automáticas, soporte técnico 24/7, garantía 5 años. Características: control remoto WiFi smartphone app, programación inteligente aprendizaje automático, ahorro energía hasta 23% facturas, compatibilidad asistentes voz populares, instalación fácil cables existentes.',
    category: 'home',
    price: 179,
    brand: 'SmartTemp',
    date: '2024-01-23T11:45:00Z',
  },
  {
    id: 'home-028',
    title: 'Set Sartenes Antiadherentes CookMaster Pro',
    content: 'Set sartenes antiadherentes CookMaster Pro 3 piezas tamaños 20-24-28cm, recubrimiento cerámico titanio ultra-resistente sin PFOA PTFE. Base aluminio forjado distribución calor uniforme, mango ergonómico acero inoxidable resistente calor 200°C horno. Compatible todas cocinas incluyendo inducción, limpieza fácil agua jabón sin esfuerzo, superficie lisa sin rayaduras espátulas metal. Cocción saludable sin aceite grasa excesiva, liberación fácil alimentos sin pegado, conserva nutrientes sabores naturales cocción uniforme. Perfectas cocina diaria familiar saludable, chefs caseros exigentes calidad, personas dieta control peso grasa, estudiantes apartamentos cocina básica. Ideal regalo bodas lista kitchen essentials, día madre cocinera familia, mudanza nueva casa equipamiento, navidad amantes cocina. Resistente lavavajillas aunque recomendada limpieza manual conservación, almacenamiento apilable ahorro espacio, manual recetas saludables incluido. Características: recubrimiento cerámico titanio antiadherente duradero, base aluminio forjado distribución calor perfecta, compatible todas cocinas incluyendo inducción, mangos ergonómicos resistentes calor horno, limpieza effortless sin pegado alimentos.',
    category: 'home',
    price: 129,
    brand: 'CookMaster',
    date: '2024-01-21T14:20:00Z',
  },
  {
    id: 'home-029',
    title: 'Báscula Cocina Digital SmartScale',
    content: 'Báscula cocina digital SmartScale precisión 1g capacidad máxima 5kg, pantalla LCD grande números claros visibles cualquier ángulo. Función tara peso recipientes, conversión unidades automática gramos onzas libras ml, superficie vidrio templado resistente fácil limpieza. App móvil conectividad Bluetooth análisis nutricional alimentos, base datos 8000+ ingredientes información calories proteínas carbohidratos, recetas proporcionales escalado automático porciones. Auto-apagado ahorro batería, calibración automática precisión constante, superficie lisa sin rendijas acumulación suciedad bacteria. Perfecta cocina precisión repostería bread making, control porciones dietas weight watchers, meal prep preparación semanal, profesionales nutrición exact measurements. Ideal regalo cocineros meticulosos precisión, personas dietas específicas control, reposteros profesionales exact ratios, estudiantes nutrición dietética. Compatible iOS Android sincronización datos, historial pesajes tracking progress, alertas recordatorio meal times, backup cloud seguridad. Características: precisión profesional 1g hasta 5kg, app móvil análisis nutricional conectividad, conversión unidades automática múltiples, superficie vidrio templado fácil limpieza, función tara peso recipientes containers.',
    category: 'home',
    price: 39,
    brand: 'SmartScale',
    date: '2024-01-19T09:30:00Z',
  },

  // ============================================================================
  // CLOTHING
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
  {
    id: 'cloth-029',
    title: 'Jeans Denim Clásico Azul Oscuro',
    content: 'Jeans denim clásico azul oscuro DenimCraft 100% algodón premium mezclilla resistente. Corte straight fit tradicional favorecedor todas figuras, tiro medio cómodo sin restricción movimiento, 5 bolsillos funcionales diseño atemporal icónico. Lavado stone wash suave textura natural envejecimiento elegante, color azul oscuro versátil combinaciones infinitas formal casual, costuras dobles reforzadas resistencia uso diario intensivo lavados frecuentes. Perfecto guardarropa básico esencial masculino femenino, oficina casual Friday ambiente relajado profesional, salidas nocturnas elegante cómodo versátil, fines semana actividades casuales deportes ligeros, viajes durabilidad comodidad estilo. Ideal regalo cumpleaños estudiantes universitarios, profesionales jóvenes moderno atemporal, padres día practicidad durabilidad, back to school regreso clases básicos. Disponible tallas 28-42 cintura múltiples largos personalización, tratamiento pre-lavado anti-encogimiento sorpresas, botones metal YKK zippers calidad superior, etiqueta cuero genuino marca prestigio. Características: 100% algodón mezclilla premium calidad, corte straight clásico favorecedor atemporal, costuras dobles reforzadas máxima durabilidad, 5 bolsillos funcionales tradicionales prácticos, lavado stone wash textura suave natural.',
    category: 'clothing',
    price: 79.99,
    brand: 'DenimCraft',
    date: '2024-01-29T10:15:00Z',
  },
  {
    id: 'cloth-030', 
    title: 'Sudadera Capucha Gris Melange Unisex',
    content: 'Sudadera hoodie capucha gris melange ComfortZone 80% algodón orgánico 20% poliéster reciclado mezcla sostenible perfecta. Interior fleece polar suave cálido protección temperaturas bajas, capucha amplia ajustable cordones planos resistentes, bolsillo canguro frontal espacioso manos objetos personales teléfono llaves. Puños costillas elásticos ajuste perfecto muñecas sin aflojamiento, dobladillo inferior elástico silueta favorecedora sin deformación, costuras reforzadas flatlock resistencia lavados uso intensivo. Perfecta clima frío otoño invierno primavera fresca, actividades outdoor casuales senderismo parques, hogar relajación comodidad máxima televisión lectura, ejercicio ligero yoga caminatas matutinas, campus universitario estudiantes estilo relajado. Ideal regalo navidad cumpleaños jóvenes adolescentes, estudiantes regreso clases universidad comodidad, trabajadores home office ambiente relajado, deportistas calentamiento post-entrenamiento recuperación. Disponible tallas XS-XXL unisex inclusivas, lavado máquina agua fría fácil cuidado, diseño minimalista versátil combinaciones múltiples, certificación GOTS algodón orgánico responsable. Características: mezcla algodón orgánico poliéster reciclado sostenible, interior fleece polar suave cálido, capucha ajustable cordones resistentes funcional, bolsillo canguro espacioso conveniente seguro, diseño unisex tallas inclusivas modernas.',
    category: 'clothing',
    price: 45.99,
    brand: 'ComfortZone',
    date: '2024-01-28T14:30:00Z',
  },
  {
    id: 'cloth-031',
    title: 'Vestido Casual Midi Flores Primavera',
    content: 'Vestido casual midi estampado flores primavera FloralStyle 100% rayón viscosa fluida suave tacto sedoso natural. Largo midi elegante altura rodillas tobillos versátil, manga corta cómoda temperaturas cálidas verano, escote V favorecedor neckline femenino delicado, cintura elástica smocked ajustable favorecedora todas figuras corporales. Estampado floral romántico colores pastel suaves azules rosas blancos, diseño bohemio chic moderno vintage inspiración, forro interior parcial comodidad privacidad, botones frontales decorativos funcionales acceso fácil. Perfecto primavera verano ocasiones especiales eventos, oficina ambiente trabajo dress code business casual, brunch almuerzo amigas elegante femenino, citas románticas dinner dates encantador, vacaciones destinos cálidos playa resort tropical estilo. Ideal regalo día madre cumpleaños esposa novia, San Valentín romántico femenino delicado, graduación estudiante universitaria celebración, baby shower guest outfit elegante apropiado. Disponible tallas XS-XL sizing inclusivo curvas, lavado delicado máquina agua fría gentle cycle, plancha temperatura baja steam cuidado tejido, almacenamiento colgado evitar arrugas plegado. Características: rayón viscosa fluida cómoda fresca, estampado floral romántico primaveral delicado, largo midi versátil elegante apropiado, cintura elástica favorecedora ajustable cómoda, diseño bohemio chic moderno femenino.',
    category: 'clothing',
    price: 89.99,
    brand: 'FloralStyle',
    date: '2024-01-27T11:45:00Z',
  },
  {
    id: 'cloth-032',
    title: 'Chaqueta Cuero Sintético Negro Biker',
    content: 'Chaqueta cuero sintético negro UrbanRider estilo biker motociclista diseño edgy moderno. Material PU leather premium tacto suave resistente desgaste, forro interior suave cómodo temperaturas medias, múltiples cremalleras funcionales decorativas estilo auténtico motociclista. Corte ajustado figura favorecedora cintura definida, solapas asimétricas diseño angular moderno, bolsillos exteriores interiores funcionalidad práctica, cremalleras YKK resistentes suaves deslizamiento. Perfecta look urbano moderno city style, salidas nocturnas eventos sociales concerts, motociclistas estilo auténtico protección ligera, transiciones estaciones otoño primavera versatilidad. Ideal regalo cumpleaños jóvenes adultos style conscious, amantes moda trends actuales, motociclistas urban riders estilo, estudiantes universitarios personal style. Disponible tallas S-XL fit ajustado favorecedor, limpieza profesional dry clean recomendada, almacenamiento colgado forma estructura, cuidado conditioning leather ocasional mantenimiento. Compatible múltiples estilos casual formal edgy, resistente viento protección ligera, diseño atemporal inversión wardrobe, calidad construcción durabilidad años uso. Características: PU leather premium tacto auténtico, diseño biker motociclista edgy moderno, múltiples cremalleras funcionales decorativas estilo, corte ajustado favorecedor figura definida, versatilidad styling múltiples ocasiones urbanas.',
    category: 'clothing',
    price: 129.99,
    brand: 'UrbanRider',
    date: '2024-01-26T16:20:00Z',
  },
  {
    id: 'cloth-033',
    title: 'Camiseta Básica Algodón Orgánico Blanca',
    content: 'Camiseta básica premium EcoBasics 100% algodón orgánico certificado GOTS blanca unisex. Tejido suave transpirable alta calidad tacto sedoso natural piel, corte clásico favorecedor figuras diversas cómodo, peso medio 180gsm durabilidad excepcional uso diario múltiples lavados. Cuello redondo cómodo reforzado sin deformación estiramientos, manga corta versátil apropiada todas estaciones, costuras laterales eliminan torsión lavado mantienen forma original. Perfecta guardarrobe básico esencial todas edades géneros, layering base combinaciones infinitas outfits, trabajo oficina casual professional appropriate, ejercicio ligero yoga comfortable breathable, dormir ropa interior cómoda natural. Ideal regalo práctico útil uso diario, estudiantes universitarios presupuesto conscious básicos, profesionales múltiples camisetas rotation work, familias ropa básica calidad investment, minimalistas capsule wardrobe esenciales. Disponible tallas XS-XXL unisex sizing inclusivo, pre-encogido pre-shrunk sin sorpresas lavado, proceso fabricación sostenible eco-friendly responsable, empaque reciclable biodegradable packaging. Certificaciones GOTS organic cotton, Fair Trade comercio justo ético, carbon neutral shipping sostenible. Características: algodón orgánico certificado GOTS premium, corte unisex clásico favorecedor atemporal, peso medio 180gsm durabilidad excepcional, pre-encogido sin sorpresas dimensiones, certificación Fair Trade comercio justo.',
    category: 'clothing',
    price: 24.99,
    brand: 'EcoBasics',
    date: '2024-01-25T09:00:00Z',
  },
  {
    id: 'cloth-034',
    title: 'Blazer Formal Negro Slim Fit',
    content: 'Blazer formal negro BusinessPro corte slim fit moderno profesional elegante. Tejido mezcla lana poliéster wrinkle-resistant anti-arrugas, forro interior suave deslizamiento fácil, construcción half-canvassed estructura professional shape retention. Solapa notched clásica atemporal, dos botones frontales proporción perfecta, bolsillos exteriores chest pocket funcionales, vents posteriores movilidad comfort sitting. Perfecto ambiente trabajo business formal professional, presentaciones meetings importantes client facing, eventos formales ceremonias graduaciones, interviews trabajo primera impresión positive. Ideal regalo profesionales career advancement, graduados universitarios job hunting, ejecutivos wardrobe upgrade investment, padres día success celebration. Disponible tallas 36-50 regular long short fitting, tailoring alterations available perfect fit, dry cleaning professional recommended care, hanging storage maintain structure shape. Compatible pantalones dress pants chinos, camisas dress shirts business casual, zapatos dress shoes professional footwear, accessories ties pocket squares finishing touches. Características: corte slim fit moderno favorecedor, mezcla lana anti-arrugas wrinkle-resistant, construcción half-canvassed estructura profesional, solapa notched clásica atemporal elegante, versatilidad business formal smart casual.',
    category: 'clothing',
    price: 199.99,
    brand: 'BusinessPro',
    date: '2024-01-24T13:15:00Z',
  },
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
  'home',
  'clothing',
] as const;