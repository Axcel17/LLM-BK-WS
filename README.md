# Product Semantic Search Workshop v2 - OpenAI API Practitioner Certification

Este proyecto está diseñado como un workshop progresivo que cubre todos los aspectos requeridos para la certificación **OpenAI API Practitioner**. Utilizamos el concepto de búsqueda semántica de productos multimodal para demostrar técnicas avanzadas de IA.

## 🎯 Objetivo del Workshop

Construir un sistema inteligente de búsqueda de productos que entiende voz, texto e imágenes, evolucionando a través de 5 ramas progresivas desde conceptos básicos hasta implementaciones avanzadas con RAG, tool calling, fine-tuning y moderación.

## 📚 Estructura de Ramas Progresivas

### Rama 1: `1-initial-project`
- ✅ Setup básico del proyecto multimodal
- ✅ Configuración de OpenAI SDK (GPT-4o, GPT-4o-mini)
- ✅ Estructura base con Express y TypeScript
- ✅ Endpoints de documentación y demostración

### Rama 2: `2-rag-implementation`
- 🔄 Implementación de RAG con catálogo de productos
- 🔄 Vector store con text-embedding-3-large
- 🔄 Búsqueda semántica híbrida (texto + imagen)
- 🔄 Scoring de similitud y filtros inteligentes

### Rama 3: `3-tool-calling`
- 📋 Tool calling inteligente con GPT-4o-mini
- 📋 Funciones especializadas: search_products, compare_products
- 📋 Optimización de costos y eficiencia
- 📋 Manejo contextual de consultas

### Rama 4: `4-fine-tuning`
- 📋 Fine-tuning de gpt-4o-mini para extracción de filtros mejorada
- 📋 Dataset de entrenamiento de consultas de productos
- 📋 Comparación modelo base vs fine-tuned
- 📋 Parsing estructurado de filtros

### Rama 5: `5-moderation-production`
- 📋 Integración de omni-moderation-latest
- 📋 Rate limiting y manejo de errores
- 📋 Métricas y monitoreo
- 📋 Sistema robusto y production-ready

## 🚀 Instalación y Setup

```bash
# 1. Clonar y navegar al proyecto
cd product-semantic-search-ws-v2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu OPENAI_API_KEY

# 4. Ejecutar en modo desarrollo
npm run dev
```

## 🌟 Características del Workshop

- **Multimodal**: Soporta voz, texto e imágenes
- **Didáctico**: Cada rama construye sobre la anterior
- **Práctico**: Ejemplos reales con casos de uso comerciales
- **Progresivo**: De conceptos simples a implementaciones complejas
- **Certificación-aligned**: Cubre todos los temas de OpenAI API Practitioner
- **Cost-effective**: Estrategias de optimización de costos integradas

## 📖 Guía de Uso

1. **Empezar en rama `main`** (rama 1) para el setup básico
2. **Avanzar secuencialmente** por cada rama
3. **Cada rama incluye**: código, documentación y ejercicios prácticos
4. **Demostración final**: sistema completo de búsqueda de productos
5. **Testing**: archivos JSON en `/inputs/basic/` para probar endpoints

## 🔧 Tecnologías Utilizadas

- **TypeScript** para tipado fuerte
- **Express.js** para API REST
- **OpenAI SDK** para todas las integraciones (GPT-4o, GPT-4o-mini, text-embedding-3-large)
- **Zod** para validación de esquemas
- **Vector Store** en memoria optimizado
- **Multimodal AI**: Chat, speech-to-text, text-to-speech, vision

## 🎯 Casos de Uso

- **Búsqueda por voz**: "Necesito algo para ejercicio en casa"
- **Búsqueda por imagen**: Sube una foto y encuentra productos similares
- **Consultas contextuales**: "Regalo $100 para mi mamá cocinera"
- **Comparaciones inteligentes**: "Compare iPhone vs Samsung"

---

*Este workshop transforma la comprensión de búsqueda de productos tradicional hacia sistemas inteligentes multimodales basados en IA, preparando para la certificación OpenAI API Practitioner.*
