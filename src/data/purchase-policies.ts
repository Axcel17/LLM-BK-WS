/**
 * Purchase Policies Database
 * Static information about company policies, procedures, and guidelines
 */

export interface PurchasePolicy {
  id: string;
  category: 'returns' | 'discounts' | 'shipping' | 'payments' | 'warranties' | 'corporate' | 'general';
  title: string;
  question: string;
  answer: string;
  keywords: string[];
  last_updated: string;
}

export const PURCHASE_POLICIES: PurchasePolicy[] = [
  {
    id: 'POL-001',
    category: 'returns',
    title: 'Política General de Devoluciones',
    question: '¿Cuál es la política de devoluciones?',
    answer: 'Aceptamos devoluciones dentro de 30 días calendario desde la fecha de compra. El producto debe estar en condiciones originales, sin uso, con empaque original y etiquetas. Se requiere comprobante de compra. Las devoluciones se procesan en 5-7 días hábiles una vez recibido el producto.',
    keywords: ['devolucion', 'regresar', 'cambio', 'retorno', 'politica', 'dias', 'plazo'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-002',
    category: 'returns',
    title: 'Productos No Retornables',
    question: '¿Qué productos no se pueden devolver?',
    answer: 'Los siguientes productos NO son retornables: productos personalizados, software descargado, productos de higiene personal abiertos, productos perecederos, tarjetas de regalo, y productos dañados por mal uso del cliente.',
    keywords: ['no retornable', 'no devolucion', 'excluido', 'personalizado', 'software', 'higiene'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-003',
    category: 'returns',
    title: 'Proceso de Devolución Paso a Paso',
    question: '¿Cómo hago una devolución?',
    answer: '1) Contacta servicio al cliente en returns@company.com, 2) Proporciona número de orden y motivo, 3) Recibe etiqueta de envío prepagada, 4) Empaca el producto en caja original, 5) Envía usando la etiqueta proporcionada, 6) Recibe confirmación y reembolso en 5-7 días.',
    keywords: ['como devolver', 'proceso', 'pasos', 'etiqueta', 'envio', 'reembolso'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-004',
    category: 'discounts',
    title: 'Descuentos por Volumen',
    question: '¿Hay descuentos por comprar en cantidad?',
    answer: 'Sí, ofrecemos descuentos por volumen: 5% de descuento en compras de 3-5 productos del mismo tipo, 10% en compras de 6-10 productos, y 15% en compras de más de 10 productos. Los descuentos se aplican automáticamente al carrito.',
    keywords: ['descuento', 'volumen', 'cantidad', 'mayoreo', 'bulk', 'automatico'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-005',
    category: 'discounts',
    title: 'Códigos de Descuento y Promociones',
    question: '¿Cómo funcionan los códigos de descuento?',
    answer: 'Los códigos de descuento se ingresan durante el checkout. Solo se puede usar un código por compra. No son acumulables con otros descuentos. Los códigos tienen fecha de expiración y términos específicos. Revisa los términos de cada promoción en nuestro sitio web.',
    keywords: ['codigo', 'cupon', 'promocion', 'checkout', 'expiracion', 'terminos'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-006',
    category: 'shipping',
    title: 'Opciones de Envío Disponibles',
    question: '¿Qué opciones de envío tienen?',
    answer: 'Ofrecemos: Envío estándar (5-7 días, $9.99), Envío express (2-3 días, $19.99), Envío overnight (1 día, $39.99). Envío gratis en compras superiores a $100. Los tiempos son días hábiles y pueden variar según ubicación.',
    keywords: ['envio', 'shipping', 'tiempos', 'costo', 'gratis', 'express', 'overnight'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-007',
    category: 'shipping',
    title: 'Áreas de Cobertura de Envío',
    question: '¿A dónde hacen envíos?',
    answer: 'Realizamos envíos a todo el territorio nacional. Para envíos internacionales, contacta servicio al cliente. Algunas zonas remotas pueden tener costos adicionales o tiempos extendidos. Verificamos disponibilidad durante el checkout.',
    keywords: ['cobertura', 'nacional', 'internacional', 'zonas', 'remoto', 'disponibilidad'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-008',
    category: 'payments',
    title: 'Métodos de Pago Aceptados',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos: tarjetas de crédito (Visa, MasterCard, American Express), tarjetas de débito, PayPal, transferencias bancarias, y pagos en efectivo en tiendas afiliadas. Todos los pagos son procesados de forma segura.',
    keywords: ['pago', 'tarjeta', 'credito', 'debito', 'paypal', 'transferencia', 'efectivo'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-009',
    category: 'payments',
    title: 'Seguridad en Pagos',
    question: '¿Qué tan seguro es pagar en línea?',
    answer: 'Utilizamos encriptación SSL de 256 bits y cumplimos con estándares PCI DSS. No almacenamos información de tarjetas de crédito. Todos los pagos son procesados por pasarelas certificadas. Tu información financiera está completamente protegida.',
    keywords: ['seguridad', 'ssl', 'encriptacion', 'pci', 'proteccion', 'certificado'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-010',
    category: 'warranties',
    title: 'Garantías de Productos',
    question: '¿Qué garantías ofrecen?',
    answer: 'Todos los productos tienen garantía del fabricante. Electrónicos: 1-2 años según marca, Ropa: 6 meses por defectos de fabricación, Productos para el hogar: 1 año. La garantía cubre defectos de fábrica, no daños por uso inadecuado.',
    keywords: ['garantia', 'warranty', 'fabricante', 'defectos', 'electronico', 'ropa', 'hogar'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-011',
    category: 'warranties',
    title: 'Extensión de Garantía',
    question: '¿Puedo extender la garantía de mis productos?',
    answer: 'Sí, ofrecemos extensión de garantía para smartphones, laptops, tablets y electrodomésticos. Debes solicitarla dentro de los primeros 30 días de compra. Costo: 15% del valor del producto por año adicional. Máximo 2 años de extensión.',
    keywords: ['extension', 'garantia extendida', 'smartphone', 'laptop', 'tablet', 'electrodomestico'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-012',
    category: 'corporate',
    title: 'Compras Corporativas',
    question: '¿Ofrecen descuentos para empresas?',
    answer: 'Sí, tenemos programa corporativo con descuentos del 10-20% según volumen. Incluye facturación empresarial, crédito neto 30 días, y gestor de cuenta dedicado. Aplica para pedidos mínimos de $5,000. Contacta corporate@company.com.',
    keywords: ['corporativo', 'empresa', 'descuento empresarial', 'facturacion', 'credito', 'gestor'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-013',
    category: 'corporate',
    title: 'Proceso de Aprobación Empresarial',
    question: '¿Cómo funciona la aprobación para compras empresariales?',
    answer: 'Compras hasta $1,000: aprobación automática. $1,001-$5,000: requiere aprobación de supervisor. Más de $5,000: aprobación gerencial y 3 cotizaciones. Productos Apple y gaming siempre requieren justificación de negocio.',
    keywords: ['aprobacion', 'empresarial', 'supervisor', 'gerencial', 'apple', 'gaming', 'justificacion'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-014',
    category: 'general',
    title: 'Política de Privacidad de Datos',
    question: '¿Cómo manejan mi información personal?',
    answer: 'Cumplimos con GDPR y normativas locales. Usamos tus datos solo para procesar pedidos, comunicación y mejorar servicios. No vendemos información a terceros. Puedes solicitar eliminación de datos contactando privacy@company.com.',
    keywords: ['privacidad', 'datos', 'gdpr', 'informacion personal', 'terceros', 'eliminacion'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-015',
    category: 'general',
    title: 'Horarios de Atención al Cliente',
    question: '¿Cuáles son los horarios de atención?',
    answer: 'Atención telefónica: Lunes a Viernes 8:00-20:00, Sábados 9:00-17:00. Chat en vivo: 24/7. Email: respuesta en 24 horas. WhatsApp: Lunes a Domingo 9:00-22:00. Emergencias: support@company.com.',
    keywords: ['horarios', 'atencion', 'telefono', 'chat', 'email', 'whatsapp', 'emergencia'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-016',
    category: 'shipping',
    title: 'Seguimiento de Envíos',
    question: '¿Cómo puedo rastrear mi pedido?',
    answer: 'Recibirás número de seguimiento por email 24-48 horas después del envío. Rastrea en nuestro sitio web o directamente con la paquetería. Notificaciones automáticas en cada etapa: procesado, enviado, en tránsito, entregado.',
    keywords: ['seguimiento', 'rastreo', 'numero', 'email', 'notificaciones', 'entregado'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-017',
    category: 'shipping',
    title: 'Problemas con Entregas',
    question: '¿Qué pasa si no recibo mi pedido?',
    answer: 'Si no recibes tu pedido en el tiempo estimado, contactanos inmediatamente. Investigamos con la paquetería. Si se confirma pérdida, reponemos el producto sin costo o reembolsamos completo. Cobertura total en envíos.',
    keywords: ['problemas', 'entrega', 'no recibido', 'perdida', 'reposicion', 'reembolso'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-018',
    category: 'returns',
    title: 'Cambios por Talla o Color',
    question: '¿Puedo cambiar por diferente talla o color?',
    answer: 'Sí, para ropa y calzado aceptamos cambios por talla dentro de 15 días. Para cambios de color en cualquier producto: 30 días. El producto debe estar sin uso. Cambios gratuitos, solo pagas envío de retorno ($5.99).',
    keywords: ['cambio', 'talla', 'color', 'ropa', 'calzado', 'sin uso', 'envio retorno'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-019',
    category: 'discounts',
    title: 'Precio Mínimo Garantizado',
    question: '¿Igualan precios de la competencia?',
    answer: 'Sí, igualamos precios de competidores autorizados en productos idénticos. Aplica para smartphones, laptops, tablets y electrodomésticos. Debes presentar evidencia del precio antes de la compra. No aplica para ofertas flash o liquidaciones.',
    keywords: ['precio minimo', 'igualar', 'competencia', 'smartphone', 'laptop', 'evidencia'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-020',
    category: 'general',
    title: 'Política de Productos Defectuosos',
    question: '¿Qué hago si mi producto llega defectuoso?',
    answer: 'Contactanos dentro de 48 horas de recibir el producto. Tomaremos fotos del defecto. Reemplazo inmediato sin costo de envío. Para electrónicos: diagnóstico técnico. Si no se puede reparar, reembolso completo o producto nuevo.',
    keywords: ['defectuoso', 'dañado', 'reemplazo', 'fotos', 'diagnostico', 'reembolso completo'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-021',
    category: 'discounts',
    title: 'Descuentos para Estudiantes',
    question: '¿Hay descuentos para estudiantes?',
    answer: 'Sí, ofrecemos 10% de descuento para estudiantes verificados en laptops, tablets y auriculares. Debes registrarte con email institucional (.edu) y presentar credencial vigente. Válido solo para uso educativo, no comercial.',
    keywords: ['estudiante', 'descuento educativo', 'laptop', 'tablet', 'auricular', 'edu', 'credencial'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-022',
    category: 'payments',
    title: 'Planes de Financiamiento',
    question: '¿Ofrecen pagos a meses sin intereses?',
    answer: 'Sí, para compras mayores a $500 ofrecemos: 3 meses sin intereses (compras $500-$1,499), 6 meses (compras $1,500-$2,999), 12 meses (compras $3,000+). Aplica para smartphones, laptops y electrodomésticos. Sujeto a aprobación crediticia.',
    keywords: ['financiamiento', 'meses', 'sin intereses', 'crediticia', 'smartphone', 'laptop'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-023',
    category: 'general',
    title: 'Programa de Lealtad',
    question: '¿Tienen programa de puntos o recompensas?',
    answer: 'Sí, nuestro programa VIP otorga: 1 punto por cada $1 gastado, 100 puntos = $5 de descuento. Niveles: Bronce (0-999 puntos), Plata (1,000-4,999), Oro (5,000+). Beneficios adicionales: envío gratis, acceso anticipado a ofertas.',
    keywords: ['lealtad', 'puntos', 'recompensas', 'vip', 'bronce', 'plata', 'oro', 'envio gratis'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-024',
    category: 'returns',
    title: 'Devoluciones de Productos Personalizados',
    question: '¿Puedo devolver productos con grabado o personalización?',
    answer: 'Los productos personalizados (grabados, bordados, impresiones) NO son retornables, excepto por defectos de fabricación. Para ropa personalizada: cambios solo por error en especificaciones. Verifica bien tu orden antes de confirmar.',
    keywords: ['personalizado', 'grabado', 'bordado', 'impresion', 'no retornable', 'especificaciones'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-025',
    category: 'warranties',
    title: 'Servicio Técnico Autorizado',
    question: '¿Dónde puedo llevar mi producto para reparación?',
    answer: 'Tenemos centros de servicio autorizados en principales ciudades. Para smartphones y laptops: servicio en 24-48 horas. Diagnóstico gratuito. Si está en garantía, reparación sin costo. Consulta ubicaciones en servicio@company.com.',
    keywords: ['servicio tecnico', 'reparacion', 'centros autorizados', 'smartphone', 'laptop', 'diagnostico'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-026',
    category: 'shipping',
    title: 'Entrega en Día Específico',
    question: '¿Puedo programar la entrega para un día específico?',
    answer: 'Sí, ofrecemos entrega programada por $15 adicionales. Elige fecha y horario (9AM-1PM, 1PM-5PM, 5PM-8PM). Disponible en zonas metropolitanas. Confirmaremos disponibilidad 24 horas antes. Solo días hábiles.',
    keywords: ['entrega programada', 'dia especifico', 'horario', 'metropolitana', 'dias habiles'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-027',
    category: 'general',
    title: 'Política de Precios Dinámicos',
    question: '¿Por qué cambian los precios de los productos?',
    answer: 'Nuestros precios se actualizan por: fluctuaciones de proveedores, demanda del mercado, ofertas especiales y disponibilidad de stock. Los precios se respetan desde que agregas al carrito hasta completar la compra (máximo 2 horas).',
    keywords: ['precios dinamicos', 'fluctuaciones', 'demanda', 'ofertas', 'stock', 'carrito'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-028',
    category: 'corporate',
    title: 'Facturación y Comprobantes',
    question: '¿Cómo obtengo mi factura fiscal?',
    answer: 'Facturación automática para compras corporativas. Para usuarios individuales: solicita factura dentro de 30 días con RFC válido. Enviamos PDF por email en 24 horas. Para facturas de meses anteriores, contacta billing@company.com.',
    keywords: ['facturacion', 'factura fiscal', 'rfc', 'corporativa', 'comprobante', 'billing'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-029',
    category: 'general',
    title: 'Productos Reacondicionados',
    question: '¿Venden productos reacondicionados o usados?',
    answer: 'Sí, ofrecemos smartphones y laptops reacondicionados con 30% de descuento. Pasan por inspección técnica rigurosa, incluyen garantía de 6 meses. Condición: como nuevo, con empaque retail. Stock limitado, consulta disponibilidad.',
    keywords: ['reacondicionado', 'usado', 'smartphone', 'laptop', 'inspeccion', 'garantia limitada'],
    last_updated: '2024-09-01'
  },
  {
    id: 'POL-030',
    category: 'general',
    title: 'Política de Sostenibilidad',
    question: '¿Qué hacen por el medio ambiente?',
    answer: 'Programas eco-friendly: reciclaje de electrónicos viejos (descuento 5%), empaque biodegradable, envíos carbono-neutral. Para ropa: línea sustentable con materiales reciclados. Devuelve tu dispositivo viejo al comprar nuevo.',
    keywords: ['sostenibilidad', 'reciclaje', 'eco-friendly', 'biodegradable', 'carbono-neutral', 'sustentable'],
    last_updated: '2024-09-01'
  }
];