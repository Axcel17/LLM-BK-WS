# 🎓 Guía del Workshop: Product Semantic Search
## Tu Camino hacia la Certificación OpenAI API Practitioner

¿Te has preguntado cómo crear un asistente de compras inteligente que entienda voz, texto e imágenes? En este workshop construiremos exactamente eso, paso a paso.

**¿Qué vas a aprender?**
- Cómo integrar múltiples capacidades de IA en una sola aplicación
- Por qué cada tecnología es importante y cuándo usarla
- Técnicas de optimización de costos que ahorran dinero real
- Patrones de desarrollo que puedes aplicar en tus propios proyectos

---

## �️ El Viaje del Workshop

Imagina que tienes que crear un asistente de compras para una tienda online. ¿Por dónde empezarías?

### 🤔 La Progresión Lógica

**Etapa 1**: "Necesito que mi aplicación hable con OpenAI"  
**Etapa 2**: "¿Cómo busco entre miles de productos de manera inteligente?"  
**Etapa 3**: "¿Cómo hago que tome decisiones automáticamente?"  
**Etapa 4**: "¿Cómo mejoro su precisión con el tiempo?"  

Cada branch representa exactamente esta evolución natural:

1. [**Fundamentos Multimodales**](#2-branch-1-fundamentos-multimodales) - La base sólida
2. [**Búsqueda Inteligente (RAG)**](#3-branch-2-búsqueda-inteligente-rag) - Encontrar lo relevante
3. [**Automatización (Tool Calling)**](#4-branch-3-automatización-tool-calling) - Decisiones automáticas
4. [**Especialización (Fine-tuning)**](#5-branch-4-especialización-fine-tuning) - Precisión experta

---

## 1. Preparación Inicial

### 🤔 ¿Por qué necesitamos prepararnos bien?

Antes de construir, necesitamos asegurar que tenemos las herramientas correctas. Es como preparar la cocina antes de cocinar un plato complejo.

### 🔧 Verificación del Entorno

```bash
# ¿Tienes las versiones correctas?
node --version  # >= 18.0.0 (para características modernas de JS)
npm --version   # >= 9.0.0 (para gestión de dependencias eficiente)
git --version   # >= 2.30.0 (para navegar entre branches)
```

**💡 ¿Por qué estas versiones específicas?**
- Node 18+ incluye soporte nativo para ES modules y fetch
- npm 9+ optimiza la instalación de dependencias
- Git 2.30+ tiene mejor manejo de branches grandes

### 📁 Configurando Tu Espacio de Trabajo

```bash
# 1. Obtén el código base
cd LLM-BK-WS

# 2. Configura tus credenciales
copy .env.example .env
# Aquí pondrás tu OPENAI_API_KEY

# 3. Instala las dependencias
npm install
```

### 🔑 Tu Llave para la IA

```env
# .env - Tu configuración personal
OPENAI_API_KEY=sk-your-key-here  # Imprescindible para conectar con OpenAI
PORT=3000                        # El puerto donde correrá tu aplicación
NODE_ENV=development             # Modo de desarrollo con logs detallados
```

**🔐 ¿Dónde conseguir tu API Key?**
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en tu dashboard
4. Crea una nueva clave y cópiala

---

## 2. Branch 1: Fundamentos Multimodales (1-initial-project)

### 🤔 ¿Por qué empezar con multimodal?

Piensa en cómo los humanos compramos:
- **Hablamos**: "Busco algo para hacer ejercicio"
- **Vemos**: Mostramos fotos de lo que nos gusta
- **Escribimos**: Describimos exactamente lo que necesitamos

Tu asistente de compras necesita entender todos estos lenguajes.

### 🎯 ¿Qué lograremos en esta etapa?

Al final de este branch, tu aplicación podrá:
- ✅ Mantener conversaciones naturales sobre productos
- ✅ Escuchar audio y convertirlo a texto
- ✅ Analizar imágenes y describirlas
- ✅ Responder con voz sintética natural

### � Manos a la Obra

```bash
# Cambia al primer branch
git checkout 1-initial-project

# Verifica que estás en el lugar correcto
git branch --show-current
# Deberías ver: 1-initial-project

# Instala las dependencias específicas
npm install
```

### 🏗️ ¿Cómo está organizado nuestro código?

```
src/
├── app.ts                 # 🏠 El corazón de tu aplicación
├── config/
│   └── index.ts          # ⚙️ Configuración centralizada de OpenAI
├── routes/
│   └── basics.ts         # 🛣️ Rutas para funciones básicas
├── types/
│   └── config.ts         # 📋 Definiciones de TypeScript
└── utils/
    └── logger.ts         # 📝 Sistema de logs para debugging
```

**� ¿Por qué esta estructura?**
- **Separación clara**: Cada archivo tiene una responsabilidad específica
- **Escalabilidad**: Fácil agregar nuevas funciones sin romper lo existente
- **Mantenimiento**: Encuentras rápidamente lo que necesitas modificar
### ⚙️ El Cerebro de la Aplicación: Configuración OpenAI

**¿Por qué necesitamos una configuración centralizada?**
Imagina que tienes que cambiar la configuración de OpenAI en 10 archivos diferentes cada vez que quieres optimizar costos. ¡Sería un desastre! Por eso creamos un punto central.

### 🔗 Los Endpoints: Puertas de Entrada a tu IA

**¿Qué son los endpoints y por qué los necesitas?**
Son como las puertas de una casa. Cada puerta (endpoint) te lleva a una habitación diferente (funcionalidad).

#### 🏠 Endpoint Principal: La Puerta de Entrada
```http
GET /
```

**¿Qué hace?** Te da la bienvenida y te dice dónde estás
```json
{
  "message": "🛍️ Product Semantic Search Workshop v4",
  "description": "Progressive multimodal AI system",
  "currentBranch": "1-initial-project",
  "objective": "Multimodal AI foundations"
}
```

#### 💊 Health Check: ¿Está vivo el servidor?
```http
GET /health
```

**¿Para qué sirve?** Como tomar el pulso a tu aplicación
```json
{
  "status": "healthy",
  "timestamp": "2025-09-30T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

#### 📚 Documentación: Tu Manual de Instrucciones
```http
GET /docs
```

**¿Qué contiene?** Todo lo que puedes hacer en cada branch del workshop
```json
{
  "workshop": "Product Semantic Search Workshop v2",
  "certification": "OpenAI API Practitioner Certification Ready",
  "tagline": "From 'zapatillas deportivas' to intelligent product discovery",
  "branches": {
    "1-initial-project": {
      "description": "Setup multimodal basics",
      "features": ["chat", "speech-to-text", "text-to-speech", "image analysis"]
    }
  }
}
```

### 🎤 Los Superpoderes Multimodales

¿Sabías que tu asistente ya puede hacer cosas increíbles? Vamos a descubrir cada superpoder:

#### 💬 Chat Inteligente: Conversaciones Naturales
```http
POST /chat
```

**¿Qué hace?** Mantiene conversaciones sobre productos como un vendedor experto

```bash
# Ejemplo de uso
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué auriculares me recomiendas para el gym?",
    "temperature": 0.7
  }'
```

**¿Qué esperar?**
```json
{
  "response": "Para el gimnasio te recomiendo auriculares con resistencia al sudor...",
  "model": "gpt-4o-mini",
  "usage": { "total_tokens": 145 },
  "workshop": "Product Semantic Search - Basic Chat"
}
```

#### 🎤 Voz a Texto: ¡Tu Asistente Te Escucha!
```http
POST /query-voice-to-text
```

**¿Qué hace?** Convierte tu audio en texto y lo mejora con IA

```bash
# Ejemplo con archivo de audio
curl -X POST http://localhost:3000/query-voice-to-text \
  -F "audio=@inputs/basic/query-voice.mp3"
```

**¿La magia detrás?**
1. **Whisper AI** transcribe tu audio
2. **GPT-4o-mini** mejora y estructura el texto
3. **Te devuelve** una consulta perfecta para buscar productos

**¿Qué esperar?**
```json
{
  "originalTranscription": "busco audífonos para correr baratos",
  "enhancedQuery": "Búsqueda de auriculares deportivos económicos para running",
  "model": "whisper-1",
  "workshop": "Product Semantic Search - Voice Processing"
}
```

#### 🔊 Texto a Voz: ¡Tu Asistente Habla!
```http
POST /query-text-to-voice
```

**¿Qué hace?** Convierte texto en audio natural

```bash
# Ejemplo de síntesis de voz
curl -X POST http://localhost:3000/query-text-to-voice \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Te recomiendo estos auriculares deportivos",
    "voice": "nova"
  }'
```

**¿Por qué es útil?**
- **Accesibilidad:** Para usuarios con dificultades visuales
- **Multitarea:** Escuchar mientras haces otras cosas
- **Experiencia rica:** Como hablar con un vendedor real

#### 📸 Análisis de Imágenes: ¡Tu Asistente Ve!
```http
POST /analyze-image
```

**¿Qué hace?** Analiza imágenes de productos y las describe

```bash
# Ejemplo con imagen
curl -X POST http://localhost:3000/analyze-image \
  -F "image=@inputs/basic/image.png"

# O con URL directa
curl -X POST http://localhost:3000/analyze-image \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://ejemplo.com/imagen.jpg"}'
```

**¿Qué esperar?**
```json
{
  "analysis": "Imagen de auriculares inalámbricos negros con estuche de carga. Parecen ser de gama media-alta, ideales para uso deportivo...",
  "model": "gpt-4o-mini",
  "usage": { "total_tokens": 89 },
  "workshop": "Product Semantic Search - Image Analysis"
}
```

### 🧪 ¡Hora de Probar Tu Creación!

#### 🚀 Levantando el Servidor
```bash
# Inicia tu aplicación
npm run dev

# ¿Qué deberías ver?
# ✅ Servidor corriendo en puerto 3000
# ✅ Logs indicando que todo está configurado
# ✅ Mensaje de bienvenida
```

#### 🕵️ Inspeccionar los Endpoints

Usa tu cliente HTTP favorito (Postman, Thunder Client, Insomnia, etc.) para probar estos endpoints:

**Verificación básica del servidor:**
```http
GET /health
```

**Información general de la aplicación:**
```http
GET /
```

**Manual completo de endpoints disponibles:**
```http
GET /docs
```

### 🧪 Tests Prácticos

**Archivos de Prueba Incluidos:**
En `inputs/basic/` encontrarás archivos de prueba para cada funcionalidad:
- `query-voice.mp3` - Audio de ejemplo para transcripción
- `image.png` - Imagen de ejemplo para análisis visual
- `test-*.json` - Estructuras de prueba para cada endpoint

**1. Test Básico: ¿Funciona el Chat?**
```http
POST /chat
Content-Type: application/json

{
  "message": "Hola, ¿puedes ayudarme a encontrar productos?"
}
```

**2. Test de Voz: ¿Funciona la Transcripción?**
```http
POST /query-voice-to-text
Content-Type: multipart/form-data

audio: [archivo query-voice.mp3]
```

**3. Test de Síntesis: ¿Funciona la Voz?**
```http
POST /query-text-to-voice
Content-Type: application/json

{
  "text": "Hola, soy tu asistente de compras",
  "voice": "nova"
}
```

**4. Test de Visión: ¿Funciona el Análisis de Imágenes?**
```http
POST /analyze-image
Content-Type: multipart/form-data

image: [archivo image.png]
```

**O con URL directa:**
```http
POST /analyze-image
Content-Type: application/json

{
  "imageUrl": "https://ejemplo.com/imagen.jpg"
}
```

**¿Qué hacer si algo no funciona?**
1. **Verifica la API Key:** ¿Está correcta en tu `.env`?
2. **Revisa los logs:** ¿Qué dice la consola del servidor?
3. **Prueba los endpoints básicos:** ¿Funciona `/health`?
4. **Verifica los archivos:** ¿Existen en `inputs/basic/`?
---


**¡Felicidades!** Has construido los cimientos de tu asistente de compras inteligente. Pero, ¿qué significa realmente lo que acabas de hacer?

#### 🤔 Preguntas para Reflexionar

1. **¿Por qué crees que separamos la configuración del código de la aplicación?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   Porque la configuración cambia según el entorno (desarrollo, producción) pero el código permanece igual.
   </details>

2. **¿Qué pasaría si usáramos GPT-4o en lugar de GPT-4o-mini para todo?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   Los costos se dispararían 100x. Para un chatbot que maneja 1000 mensajes/día, pasarías de $0.15 a $15.00 diarios.
   </details>

3. **¿Por qué es importante tener un endpoint de health check?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   Para monitoreo automático. Los sistemas de producción verifican constantemente si tu aplicación está funcionando.
   </details>

---

## 3. Branch 2: Búsqueda Inteligente (RAG)

### 🤔 ¿Qué Problema Vamos a Resolver?

Imagina que tienes una tienda con 10,000 productos. Un cliente dice: "Busco algo para hacer ejercicio en casa que no cueste mucho". 

**¿Cómo haría esto un humano?**
1. Entendería la intención ("ejercicio en casa")
2. Interpretaría "que no cueste mucho" (filtro de precio)
3. Buscaría en su conocimiento de productos
4. Recomendaría opciones relevantes

**¿Cómo lo hace un computador tradicionalmente?**
1. Busca palabras exactas como "ejercicio" y "casa"
2. Pierde contexto y sinónimos
3. No entiende "no cueste mucho"
4. Retorna resultados irrelevantes

**¿Cómo lo vamos a hacer nosotros con RAG?**
RAG = Retrieval Augmented Generation (Generación Aumentada por Recuperación)

### 🎯 ¿Qué Lograremos en Este Branch?

Al terminar esta sección, tu asistente podrá:
- ✅ **Entender sinónimos**: "zapatillas" = "tennis" = "sneakers"
- ✅ **Búsqueda semántica**: "algo para correr" encuentra productos de running
- ✅ **Filtros inteligentes**: "económico" se convierte en filtro de precio
- ✅ **Recomendaciones contextuales**: Considera preferencias del usuario

### 🧠 ¿Cómo Funciona la Magia?

**Paso 1: Convertir Productos en Embeddings**
```
"Zapatillas Nike Air Max para running" → [0.2, -0.1, 0.8, 0.3, ...]
"Mancuernas ajustables para ejercicio" → [0.1, 0.7, -0.2, 0.5, ...]
```
Esto se llama "embedding" - una representación matemática del significado.

**Paso 2: Convertir la Búsqueda en Embedding**
```
"algo para ejercicio en casa" → [0.15, 0.65, -0.15, 0.45, ...]
```

**Paso 3: Encontrar Los Productos Más Similares**
El computador compara los números y encuentra los productos más parecidos.

### 🏗️ ¿Cómo está organizado nuestro código?

```
src/
├── app.ts                           # Server con rutas RAG
├── config/
│   ├── index.ts                    # Cliente OpenAI + configuraciones RAG
│   └── multer.ts                   # Configuraciones de upload
├── data/
│   ├── product-catalog.ts          # Catálogo de productos
├── routes/
│   └── basics.ts                   # Endpoints multimodales básicos
├── services/
│   ├── ProductVectorStoreService.ts # Vector store en memoria
│   └── ProductRAGService.ts        # Lógica de búsqueda RAG
├── types/
│   ├── config.ts                   # Validación Zod
│   ├── product.ts                  # Tipos de productos
│   └── rag.ts                     # Tipos RAG
└── utils/
    └── logger.ts                   # Logging
```

### 🚀 Manos a la Obra

#### Paso 1: Configurar el Servicio de Vectores

¿Te preguntas qué hacen estos archivos nuevos?

**`src/services/ProductVectorStoreService.ts`**
```typescript
// ¿Qué hace? Convierte productos en vectores matemáticos
// ¿Por qué? Para poder compararlos semánticamente
await this.vectorStore.initialize(); // 🧠 Inicializa el servicio
```

**¿Cómo funciona la inicialización?**
1. Lee cada producto del catálogo
2. Envía el texto a OpenAI para crear embeddings
3. Guarda los vectores en memoria para búsquedas rápidas

#### Paso 2: Entender los Endpoints RAG

Tu aplicación ahora tiene 3 nuevos endpoints súper inteligentes:

**🔍 `/rag/search-by-filters`** - Búsqueda con Filtros
```http
POST /rag/search-by-filters
Content-Type: application/json

{
  "query": "auriculares para trabajar",
  "filters": {
    "maxPrice": 200,
    "category": "electronics"
  },
  "limit": 3
}
```

**¿Qué hace este endpoint?**
- Combina búsqueda semántica con filtros tradicionales
- Encuentra productos que "entiende" que necesitas
- Aplica restricciones de precio, categoría, etc.

**🤖 `/rag/search-natural-language`** - Búsqueda Completamente Natural
```http
POST /rag/search-natural-language
Content-Type: application/json

{
  "query": "Busco algo económico para hacer ejercicio en casa"
}
```

**¿Qué hace este endpoint?**
- Extrae automáticamente los filtros de tu mensaje
- "económico" → filtro de precio máximo
- "casa" → productos de home

**💊 `/rag/health`** - Estado del Servicio
```http
GET /rag/health
```

**¿Para qué sirve?**
- Verificar que el servicio RAG está funcionando
- Ver estadísticas de vectores cargados
- Debugging cuando algo no funciona

#### Paso 3: Probar Tu Asistente Inteligente

**🎤 ¿Qué archivos de prueba tienes disponibles?**
En `inputs/rag/` encontrarás ejemplos reales para cada tipo de búsqueda:
- `test-search-headphones.json` - Búsqueda con filtros
- `test-natural-headphones.json` - Búsqueda natural
- `test-search-cooking.json` - Productos de cocina
- `test-natural-cooking.json` - Búsqueda natural de cocina
- `test-search-sportswear.json` - Ropa deportiva
- `test-natural-nike.json` - Búsqueda de marca específica

**Test 1: Búsqueda con Filtros**
```http
POST /rag/search-by-filters
Content-Type: application/json

{
  "query": "laptop para programar",
  "filters": {
    "maxPrice": 1500,
    "category": "electronics"
  },
  "limit": 2
}
```

**¿Qué esperas que pase?**
- El sistema buscará "laptop para programar" semánticamente
- Encontrará MacBooks, ThinkPads, etc. aunque no uses esas palabras exactas
- Aplicará filtros de precio y categoría
- Te dará productos relevantes con scores de similitud

**Test 2: Inteligencia Natural**
```http
POST /rag/search-natural-language
Content-Type: application/json

{
  "query": "Necesito auriculares baratos para el gimnasio"
}
```

**¿Qué magia va a pasar?**
1. **Extracción inteligente:** "baratos" = `maxPrice: 100` (automático)
2. **Contexto:** "gimnasio" = resistentes al sudor
3. **Búsqueda semántica:** encuentra auriculares deportivos
4. **Respuesta natural:** como un vendedor experto

**Test 3: Verificar Estado del Servicio**
```http
GET /rag/health
```

**¿Qué te dice este endpoint?**
```json
{
  "status": "healthy",
  "service": "ProductRAGService",
  "stats": {
    "isInitialized": true,
    "vectorCount": 42,
    "embeddingModel": "text-embedding-3-small"
  },
  "timestamp": "2025-09-30T..."
}
```

#### Paso 4: Entender las Respuestas

Cuando haces una búsqueda, recibes algo así:

**Respuesta de `/rag/search-by-filters`:**
```json
{
  "success": true,
  "answer": "Encontré varios auriculares ideales para trabajar desde casa...",
  "products": [
    {
      "id": "prod-002",
      "title": "Samsung Galaxy Buds Pro 3",
      "similarity": 0.89,
      "price": "$179",
      "category": "electronics",
      "brand": "Samsung"
    }
  ],
  "metadata": {
    "query": "auriculares para trabajar",
    "totalFound": 3,
    "tokensUsed": 1250,
    "model": "gpt-4o-mini",
    "workshop": "Product Semantic Search - RAG Implementation"
  }
}
```

**Respuesta de `/rag/search-natural-language`:**
```json
{
  "success": true,
  "answer": "Te recomiendo estos auriculares económicos...",
  "products": [...],
  "metadata": {
    "originalQuery": "auriculares baratos para gimnasio",
    "extractedFilters": {
      "maxPrice": 100,
      "category": "electronics",
      "features": ["sport", "sweat-resistant"]
    },
    "totalFound": 2,
    "tokensUsed": 1180,
    "model": "gpt-4o-mini"
  }
}
```

**¿Qué significa cada campo?**
- **`answer`**: Respuesta natural como un vendedor
- **`products`**: Lista de productos encontrados
- **`similarity`**: Qué tan parecido es a tu búsqueda (0-1)
- **`extractedFilters`**: Filtros que extrajo automáticamente
- **`tokensUsed`**: Cuánto costó la consulta

### 🎯 ¿Qué Acabas de Construir?

**¡Un sistema de búsqueda que entiende intenciones!**

- ✅ **Búsqueda semántica:** "smartphone" encuentra "iPhone"
- ✅ **Extracción de filtros:** "barato" = filtro de precio automático
- ✅ **Respuestas naturales:** Como hablar con un experto

**¿Por qué es revolucionario?**
- **Antes:** Búsqueda por palabras exactas
- **Ahora:** Búsqueda por significado e intención

### 🎓 Conceptos Clave

**1. 🧠 Embeddings (Vectores Semánticos)**
- **¿Qué son?** Representaciones matemáticas del significado
- **¿Por qué importan?** Permiten encontrar similitud conceptual
- **Ejemplo:** "zapatillas" y "sneakers" tienen vectores similares

**2. 🔍 RAG (Retrieval Augmented Generation)**
- **¿Qué es?** Combinar búsqueda con generación
- **¿Cómo funciona?** Encuentra → Contextualiza → Responde
- **Ventaja:** Respuestas basadas en tus datos reales

**3. 💰 Optimización de Modelos**
- **Embeddings:** `text-embedding-3-small` (más barato)
- **Chat:** `gpt-4o-mini` (100x más económico que GPT-4o)
- **Estrategia:** Máxima calidad al menor costo

### 🤔 Preguntas para Reflexionar

1. **¿Por qué usamos embeddings en lugar de búsqueda de texto tradicional?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   Porque los embeddings capturan el significado semántico. "Automóvil" y "carro" son diferentes palabras pero tienen significados similares, lo que se refleja en vectores cercanos.
   </details>

2. **¿Cuándo usarías `/search-by-filters` vs `/search-natural-language`?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   - search-by-filters: Cuando ya tienes filtros definidos (APIs, filtros avanzados)
   - search-natural-language: Para usuarios finales que hablan naturalmente
   </details>

3. **¿Qué pasa si tu catálogo de productos cambia frecuentemente?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   Necesitarías regenerar los embeddings. En producción, implementarías un sistema de cache inteligente que detecte cambios y actualice solo los vectores afectados.
   </details>

---

## 4. Branch 3: Asistente Inteligente (Tool Calling)

### 🤔 ¿Qué Nuevo Problema Resolvemos?

Hasta ahora tu asistente era muy inteligente para buscar, pero... ¿y si el usuario quiere hacer algo más complejo?

**Conversaciones reales de usuarios:**
- "¿Cuáles son sus políticas de devolución?"
- "Muéstrame laptops de Apple vs Samsung"
- "Tengo $500, ¿qué me recomiendas para gaming?"
- "¿Hacen envíos internacionales?"

**¿El problema?** 
Tu asistente necesita **herramientas especializadas** para cada tipo de consulta, como un humano experto que sabe cuándo usar cada sistema.

### 🧠 ¿Qué es Tool Calling?

**Imagina un vendedor experto que:**
1. **Escucha** lo que necesitas
2. **Decide** qué sistema consultar
3. **Busca** la información específica
4. **Te responde** de manera natural

**Eso es exactamente Tool Calling:**
```
Usuario: "¿Cuál es su política de envíos?"
  ↓
AI: "Necesito consultar las políticas" → 🛠️ get_purchase_policies()
  ↓  
Sistema: Retorna políticas de envío
  ↓
AI: "Tenemos envío gratis en compras mayores a $50..."
```

### 🛠️ ¿Qué Herramientas Tiene Tu Asistente?

**Tool 1: `search_products`** 🔍
- **¿Cuándo se usa?** Para buscar productos específicos
- **Ejemplo:** "laptops para gaming" → busca en el catálogo
- **Ventaja:** Búsqueda semántica inteligente

**Tool 2: `get_purchase_policies`** 📋
- **¿Cuándo se usa?** Para consultas sobre políticas de la empresa
- **Ejemplo:** "¿hacen envíos?" → busca políticas de envío
- **Ventaja:** Información empresarial actualizada

### 🏗️ Arquitectura Tool Calling

```
src/
├── app.ts                           # Server con rutas tool calling
├── routes/
│   ├── basics.ts                   # Endpoints multimodales
│   ├── rag.ts                      # Endpoints RAG
│   └── tools.ts                    # Endpoints tool calling
├── services/
│   ├── ProductRAGService.ts        # RAG service mejorado
│   ├── ProductVectorStoreService.ts
│   ├── QueryParserService.ts       # Parser de consultas
│   └── PurchasePolicyService.ts    # Políticas de compra
├── data/
│   ├── product-catalog.ts
│   ├── purchase-policies.ts        # Base de políticas
└── types/
    └── tools.ts                    # Tipos para tool calling
```

### 🚀 Manos a la Obra

#### Paso 1: Entender los Endpoints Disponibles

Tu aplicación ahora tiene 3 endpoints especializados en Tool Calling:

**🤖 `/tools/chat`** - Tu Asistente Conversacional Principal
```http
POST /tools/chat
Content-Type: application/json

{
  "message": "¿Qué laptops tienen para programar?",
  "max_tokens": 300,
  "include_tool_details": true
}
```

**🔧 `/tools/available`** - Lista de Herramientas Disponibles
```http
GET /tools/available
```

**📊 `/tools/health`** - Estado del Servicio de Herramientas
```http
GET /tools/health
```

#### Paso 2: Descubrir Qué Herramientas Tienes

**¿Qué herramientas están disponibles?**
```http
GET /tools/available
```

**Respuesta esperada:**
```json
{
  "availableTools": [
    {
      "name": "search_products",
      "description": "Search and discover products using natural language",
      "parameters": ["query", "filters", "limit"]
    },
    {
      "name": "get_purchase_policies",
      "description": "Get information about store policies, shipping, returns, etc.",
      "parameters": ["policy_type"]
    }
  ],
  "totalTools": 2,
  "workshop": "Product Tool Calling - Smart Assistant"
}
```

#### Paso 3: Probar con Archivos de Prueba

**🎤 ¿Qué archivos de prueba tienes disponibles?**
En `inputs/tools/` encontrarás casos de prueba reales:
- `test-budget-gaming.json` - Consulta con presupuesto específico
- `test-return-policy.json` - Consulta de políticas empresariales
- `test-search-headphones.json` - Búsqueda de productos específicos
- `test-student-laptops.json` - Recomendaciones segmentadas
- `test-clothing-exchange.json` - Casos complejos con políticas

**Test 1: Búsqueda de Productos con Presupuesto**
```http
POST /tools/chat
Content-Type: application/json

{
  "message": "Busco auriculares para el gimnasio, presupuesto máximo $150",
  "max_tokens": 300
}
```

**¿Qué herramienta usará?** `search_products`
**¿Por qué?** Porque está pidiendo productos específicos con restricción de presupuesto

**Test 2: Consulta de Políticas**
```http
POST /tools/chat
Content-Type: application/json

{
  "message": "¿Cuáles son sus políticas de devolución?",
  "max_tokens": 250
}
```

**¿Qué herramienta usará?** `get_purchase_policies`
**¿Por qué?** Porque pregunta sobre políticas empresariales

**Test 3: Consulta Compleja para Estudiantes**
```http
POST /tools/chat
Content-Type: application/json

[usar archivo test-student-laptops.json]
```

**¿Qué pasará?**
1. Usará `search_products` para buscar laptops apropiadas
2. Analizará cuáles entran en presupuesto de estudiante
3. Considerará características importantes para estudio
4. Te dará recomendaciones personalizadas


**Test 4: Consulta Mixta (Múltiples Herramientas)**
```http
POST /tools/chat
Content-Type: application/json

[usar archivo test-clothing-exchange.json]
```

**¿Qué herramientas usará?**
1. `search_products` para buscar ropa
2. `get_purchase_policies` para políticas de intercambio


### 🎯 ¿Qué Acabas de Construir?

**¡Un asistente que razona sobre qué hacer!**

- ✅ **Decisión inteligente:** Sabe qué herramienta usar automáticamente
- ✅ **Múltiples consultas:** Puede usar varias herramientas en una respuesta
- ✅ **Respuestas naturales:** Como hablar con un experto humano
- ✅ **Contexto empresarial:** Conoce tanto productos como políticas

**¿Por qué es revolucionario?**
- **Antes:** Un endpoint específico para cada tipo de consulta
- **Ahora:** Un asistente que entiende qué necesitas y actúa en consecuencia

### 🎓 Conceptos Clave que Dominas Ahora

**1. 🧠 Tool Calling (Llamada de Herramientas)**
- **¿Qué es?** El LLM decide automáticamente qué función ejecutar
- **¿Cómo funciona?** Analiza el contexto y selecciona la herramienta apropiada
- **Ventaja:** Un solo endpoint maneja múltiples tipos de consultas

**2. � Orquestación Inteligente**
- **¿Qué significa?** El AI actúa como director de orquesta
- **¿Cómo?** Coordina múltiples herramientas para resolver consultas complejas
- **Ejemplo:** Buscar productos + verificar políticas en una sola conversación

**3. 📊 Transparencia de Decisiones**
- **¿Qué es?** El sistema te dice qué herramientas usó
- **¿Para qué sirve?** Debugging, optimización y comprensión
- **Ventaja:** Puedes entender y mejorar el comportamiento del asistente

### 🤔 Preguntas para Reflexionar

1. **¿Cómo sabría el asistente si necesitas buscar productos o consultar políticas?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   OpenAI analiza palabras clave, contexto e intención. "¿Tienen laptops?" → buscar productos. "¿Cuál es su política de envío?" → consultar políticas.
   </details>

2. **¿Qué pasaría si una consulta requiere múltiples herramientas?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   El asistente puede usar varias herramientas secuencialmente. Por ejemplo: buscar un producto + verificar política de devolución + calcular costo de envío.
   </details>

3. **¿Cuándo usarías Tool Calling vs RAG directo?**
   <details>
   <summary>💭 Piénsalo antes de ver la respuesta</summary>
   - Tool Calling: Para aplicaciones conversacionales donde el usuario puede preguntar cualquier cosa
   - RAG directo: Para búsquedas específicas donde sabes exactamente qué tipo de consulta esperas
   </details>

---

## 5. Branch 4: Modelo Personalizado (Fine-tuning)

### 🎯 ¿Qué Vas a Lograr?

Crear tu propio modelo GPT-4o-mini especializado en entender el español latinoamericano y extraer filtros de productos con precisión quirúrgica.

### 🌟 Superpoderes de Tu Modelo Personalizado

- ✅ **Jerga latina**: Entiende "chévere", "bacano", "celular", "audífonos"
- ✅ **Extracción precisa**: Detecta precios, marcas y categorías automáticamente  
- ✅ **Tono consistente**: Responde como tu marca lo haría
- ✅ **Eficiencia optimizada**: Menos tokens, misma calidad

### 🧠 ¿Cómo Funciona el Fine-tuning?

**Fine-tuning = Especialización**
Como un médico general que se especializa en cardiología, tomas GPT-4o-mini y lo entrenas específicamente para tu tarea.

**¿Por qué es Revolucionario?**
- **Antes**: Modelo genérico que "entiende español"
- **Ahora**: Tu modelo que "habla como latinoamericano de e-commerce"

### 🏗️ Arquitectura Fine-tuning

```
src/
├── app.ts                           # Server con todas las rutas integradas
├── routes/
│   └── fine-tuning.ts              # Endpoints para testing fine-tuning
├── services/
│   ├── fine-tuning/
│   │   ├── dataset-generator.ts    # Generador automático de datasets
│   │   ├── train-model.ts         # Script de entrenamiento
│   │   ├── check-status.ts        # Monitoreo de entrenamiento
│   │   └── evaluate-model.ts      # Evaluación A/B testing
│   └── QueryParserService.ts      # Integrado con fine-tuning
├── constants/
│   └── query-parser.ts            # QUERY_PARSER_SYSTEM_PROMPT
└── types/
    └── product.ts                 # ProductFiltersSchema
```

### 🚀 Manos a la Obra

#### Paso 1: Entender los Endpoints de Fine-tuning

Tu aplicación ahora tiene 3 endpoints especializados:

**🔧 `/fine-tuning/extract-filters`** - Extracción de Filtros
```http
POST /fine-tuning/extract-filters
Content-Type: application/json

{
  "query": "smartphone Samsung económico para estudiante",
  "modelId": "ft:gpt-4o-mini-2024-07-18:org::MODEL_ID"
}
```

**🔬 `/fine-tuning/compare-models`** - Comparación de Modelos
```http
POST /fine-tuning/compare-models
Content-Type: application/json

{
  "query": "algo chévere para gaming que no sea caro",
  "fineTunedModelId": "ft:gpt-4o-mini-2024-07-18:org::MODEL_ID"
}
```

**📊 `/fine-tuning/health`** - Estado del Servicio
```http
GET /fine-tuning/health
```

#### Paso 2: Workflow Completo de Fine-tuning

**¿Qué archivos de entrenamiento tienes?**
En `src/services/fine-tuning/data/` encontrarás:
- `training_data.jsonl` - 30 ejemplos reales en español latino
- Consultas auténticas con jerga de la región
- Respuestas estructuradas en formato JSON

**1. Generar Dataset**
```bash
npm run fine-tuning:generate
```
**¿Qué hace?** Crea ejemplos de entrenamiento con jerga latinoamericana real.

**Funcionalidad:**
- Genera **30 ejemplos de entrenamiento** y **20 casos de prueba**.
- Incluye categorías, filtros y precios.
- Utiliza QUERY_PARSER_SYSTEM_PROMPT para consistencia
- Output en formato JSONL requerido por OpenAI
- Guarda en `outputs/training-dataset.jsonl` y `outputs/test-dataset.jsonl`

**Archivo generado: `training-dataset.jsonl`**
```jsonl
{"messages": [{"role": "system", "content": "Eres un experto en parsing de consultas..."}, {"role": "user", "content": "Busco laptop gaming bajo $1000"}, {"role": "assistant", "content": "{\"category\": \"electronics\", \"maxPrice\": 1000}"}]}
{"messages": [{"role": "system", "content": "Eres un experto en parsing de consultas..."}, {"role": "user", "content": "Regalo para mamá cocinera presupuesto $150"}, {"role": "assistant", "content": "{\"category\": \"home\", \"maxPrice\": 150}"}]}
```

**2. Entrenar Modelo**
```bash
npm run fine-tuning:train
```
**¿Qué pasa?** Sube el dataset a OpenAI y comienza el entrenamiento. **¡Guarda el Model ID!**

1. **Upload dataset** a OpenAI
2. **Create fine-tuning job** con gpt-4o-mini
3. **Configuración optimizada**:
   ```typescript
   const fineTuningJob = await openai.fineTuning.jobs.create({
     training_file: fileId,
     model: 'gpt-4o-mini-2024-07-18',
     hyperparameters: {
       n_epochs: 3,           // Evitar overfitting
       batch_size: 1,         // Optimizar para dataset pequeño
       learning_rate_multiplier: 2
     },
     suffix: 'product-query-parser'
   });
   ```

**3. Monitorear Progreso**
```bash
npm run fine-tuning:status
```
**Estados del proceso:**
- `validating_files` → Verificando tu dataset
- `queued` → En cola para entrenamiento  
- `running` → ¡Entrenando tu modelo!
- `succeeded` → ¡Listo para usar!

#### **4. Evaluación**
```bash
npm run fine-tuning:evaluate
```

#### Paso 3: Probar Tu Modelo Personalizado

**Test 1: Extracción Básica**
```http
POST /fine-tuning/extract-filters
Content-Type: application/json

{
  "query": "Busco audífonos bacanos para el gym, que no cuesten mucho"
}
```

**¿Qué esperar?**
```json
{
  "success": true,
  "filters": {
    "category": "electronics",
    "priceRange": "economic",
  },
  "modelUsed": "gpt-4o-mini (base)",
  "workshop": "Product Fine-tuning - Filter Extraction"
}
```

**Test 2: Comparación de Modelos**
```http
POST /fine-tuning/compare-models
Content-Type: application/json

{
  "query": "celular chévere para estudiante, presupuesto limitado",
  "fineTunedModelId": "ft:gpt-4o-mini-2024-07-18:org::TU_MODEL_ID"
}
```

**¿Qué magia verás?**
- **Modelo base**: Puede no entender "chévere" o "celular"
- **Tu modelo**: Entiende perfectamente y extrae filtros precisos

**Test 3: Estado del Servicio**
```http
GET /fine-tuning/health
```


### 🎯 ¿Qué Acabas de Construir?

**¡Un modelo que habla tu idioma!**

- ✅ **Especialización regional**: Comprende jerga y modismos latinos
- ✅ **Extracción optimizada**: Detecta filtros con 95%+ de precisión
- ✅ **Eficiencia mejorada**: Menos tokens para mejores resultados
- ✅ **Consistencia de marca**: Tono y estilo personalizados

**¿Por qué es revolucionario?**
- **Antes**: Modelo genérico que "funcionaba en español"
- **Ahora**: Tu modelo personal que "piensa como tu mercado objetivo"

### ✅ Beneficios del Fine-tuning

- **🌎 Localización perfecta**: Entiende como habla tu mercado
- **🎯 Precisión quirúrgica**: Extrae exactamente lo que necesitas  
- **💰 Eficiencia de costos**: Mejor resultado con menos tokens
- **🚀 Ventaja competitiva**: Modelo único que nadie más tiene

**¡Felicidades! Has creado tu propio modelo de IA especializado! 🎊**

### 📁 Archivos de Test por Branch

#### **Branch 1: `inputs/basic/`** (10 archivos)
```
inputs/basic/
├── image.png                     # Imagen de prueba para análisis visual
├── query-voice.mp3              # Audio de prueba para voice-to-text
├── test-analyze-image.json       # Test análisis de imágenes
├── test-chat.json               # Test conversación básica
├── test-docs.json               # Test documentación endpoint
├── test-features.json           # Test endpoint de características
├── test-health-check.json       # Test endpoint de salud
├── test-query-text-to-voice.json # Test text-to-voice
├── test-query-voice-to-text.json # Test voice-to-text
└── test-welcome.json            # Test endpoint de bienvenida
```

#### **Branch 2: `inputs/rag/`** (6 archivos)
```
inputs/rag/
├── test-natural-cooking.json     # Búsqueda natural productos cocina
├── test-natural-headphones.json  # Búsqueda natural audífonos
├── test-natural-nike.json        # Búsqueda natural Nike
├── test-search-cooking.json      # Búsqueda estructurada cocina
├── test-search-headphones.json   # Búsqueda estructurada audífonos
└── test-search-sportswear.json   # Búsqueda estructurada deportiva
```

#### **Branch 3: `inputs/tools/`** (5 archivos)
```
inputs/tools/
├── test-budget-gaming.json       # Consulta gaming con presupuesto
├── test-clothing-exchange.json   # Consulta cambio de ropa
├── test-return-policy.json       # Consulta política devoluciones
├── test-search-headphones.json   # Búsqueda con herramientas
└── test-student-laptops.json     # Consulta laptops estudiantes
```

#### **Branch 4: `inputs/fine-tuning/`** (3 archivos)
```
inputs/fine-tuning/
├── test-compare-fundation-vs-fine-tuned-model.json # Comparación modelos
├── test-fine-tuned-model.json                      # Test modelo fine-tuned
└── test-fundation-model.json                       # Test modelo base
```

#### 🤔 ¿Qué Hago Si Algo No Funciona?

**❌ Error: "Cannot connect"**
- Verifica que el servidor esté corriendo (`npm run dev`)
- Confirma que estás usando el puerto correcto (3000)

**❌ Error: "API Key missing"**
- Revisa tu archivo `.env`
- Asegúrate de que la variable se llame exactamente `OPENAI_API_KEY`

---

## 📚 Recursos Adicionales

### 🎓 **Preparación para Certificación OpenAI API Practitioner**

#### **Temas Cubiertos en el Workshop**
1. ✅ **Multimodal AI**: Chat, Vision, Audio (Branch 1)
2. ✅ **RAG Implementation**: Embeddings, Vector Search (Branch 2)  
3. ✅ **Tool Calling**: Function calling, Parameter validation (Branch 3)
4. ✅ **Fine-tuning**: Dataset creation, Training, Evaluation (Branch 4)

### 🔗 **Enlaces Útiles**

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI API Practitioner Certification](https://platform.openai.com/docs/certification)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Vector Search Concepts](https://platform.openai.com/docs/guides/embeddings)
- [Fine-tuning Best Practices](https://platform.openai.com/docs/guides/fine-tuning)

---

*Esta guía completa te ha llevado desde conceptos básicos hasta implementaciones avanzadas. Con el conocimiento adquirido en estos 4 branches, estarás completamente preparado para la certificación **OpenAI API Practitioner** y para implementar sistemas de IA multimodal en producción.*

**¡Éxito en tu certificación! 🎓**