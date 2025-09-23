# 📁 Test Data Examples

Esta carpeta contiene datos de prueba para cada funcionalidad del workshop Product Semantic Search v2.

## 🗂️ Estructura de Carpetas

```
inputs/
├── basic/              # Rama 1: Setup multimodal básico
├── rag/               # Rama 2: Búsqueda semántica con embeddings  
├── tool-calling/      # Rama 3: Tool calling inteligente
├── fine-tuning/       # Rama 4: Fine-tuning para intención comercial
└── moderation/        # Rama 5: Moderación y producción
```

## 🚀 Cómo Usar los Datos

### 1. **Postman Collection**
Importa cada archivo JSON como un request en Postman:
1. Crea una nueva colección "Product Semantic Search Workshop"
2. Para cada archivo, crea un request GET/POST según corresponda
3. Copia el contenido JSON al Body (raw) si es POST
4. Usa la URL correspondiente según las instrucciones

### 2. **cURL Examples**
```bash
# Ejemplo para búsqueda básica
curl http://localhost:3000/

# Ejemplo para búsqueda semántica (rama 2)
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d @inputs/rag/test-product-search.json

# Ejemplo para tool calling (rama 3)
curl -X POST http://localhost:3000/assistant \
  -H "Content-Type: application/json" \  
  -d @inputs/tool-calling/test-product-comparison.json
```

### 3. **Testing Workflow**
1. **Empezar en rama correspondiente**: `git checkout 2-rag-implementation`
2. **Levantar servidor**: `npm run dev`
3. **Probar endpoint**: Usar datos de `inputs/rag/`
4. **Verificar respuesta**: Comparar con expected results
5. **Avanzar a siguiente rama**: Repetir proceso

## 📋 Datos por Funcionalidad

### Basic (Rama 1)
- `test-welcome.json` - Prueba endpoint de bienvenida
- `test-health-check.json` - Verificación de salud del sistema  
- `test-docs.json` - Documentación del workshop
- `test-progress.json` - Progreso del workshop
- `test-features.json` - Características del sistema
- `test-costs.json` - Información de costos
- `test-404.json` - Manejo de rutas no encontradas

### RAG (Rama 2)  
- `test-product-search.json` - Búsqueda semántica de productos
- `test-image-search.json` - Búsqueda por imagen
- `test-voice-search.json` - Búsqueda por voz
- `test-hybrid-search.json` - Búsqueda híbrida (texto + imagen)

### Tool Calling (Rama 3)
- `test-product-comparison.json` - Comparación inteligente de productos
- `test-search-products.json` - Tool para búsqueda de productos
- `test-get-details.json` - Detalles específicos de productos
- `test-assistant-chat.json` - Chat con asistente inteligente

### Fine-tuning (Rama 4)
- `test-intent-recognition.json` - Reconocimiento de intención comercial
- `test-base-vs-finetuned.json` - Comparación de modelos
- `test-commercial-queries.json` - Consultas comerciales específicas
- `test-structured-output.json` - Salida estructurada

### Moderation (Rama 5)
- `test-safe-content.json` - Contenido seguro de productos
- `test-flagged-content.json` - Contenido potencialmente problemático
- `test-rate-limiting.json` - Pruebas de limitación de velocidad
- `test-error-handling.json` - Manejo de errores

## ⚡ Tips de Uso

1. **Verifica endpoints**: Los endpoints pueden variar según la rama
2. **Revisa instrucciones**: Cada archivo tiene instrucciones específicas
3. **Compara resultados**: Los expected results te ayudan a validar
4. **Modifica datos**: Siéntete libre de crear tus propios casos de prueba
5. **Documenta cambios**: Si mejoras los datos, actualiza las instrucciones

---
*Estos datos están disponibles en todas las ramas del workshop para facilitar el testing progresivo.*
