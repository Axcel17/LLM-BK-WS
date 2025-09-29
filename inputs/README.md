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

# Ejemplo para transcripción de voz con sugerencias (rama 1)
curl -X POST http://localhost:3000/query-voice-to-text \
  -F "audio=@path/to/audio.mp3"

# Ejemplo para síntesis de voz mejorada (rama 1)
curl -X POST http://localhost:3000/query-text-to-voice \
  -H "Content-Type: application/json" \
  -d '{"text":"Busco auriculares","voice":"nova"}' --output speech.mp3

# Ejemplo para análisis de imagen (rama 1)
curl -X POST http://localhost:3000/analyze-image \
  -F "image=@path/to/image.jpg"

# Ejemplo para búsqueda semántica (rama 2)
curl -X POST http://localhost:3000/rag/search-natural-language \
  -H "Content-Type: application/json" \
  -d @inputs/rag/test-natural-cooking.json
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
- `test-features.json` - Características del sistema
- `test-chat.json` - Chat básico con GPT-4o-mini
- `test-query-voice-to-text.json` - Transcripción de voz con sugerencias de productos
- `test-query-text-to-voice.json` - Síntesis de voz mejorada
- `test-analyze-image.json` - Análisis de imagen (archivo o URL)

### RAG (Rama 2)  
- `test-natural-cooking.json` - Búsqueda natural de productos de cocina
- `test-natural-headphones.json` - Búsquea natural de productos electrónicos
- `test-natural-nike.json` - Búsqueda natural de productos de ropa deportiva
- `test-search-cooking.json` - Búsqueda por filtros de productos de cocina 
- `test-search-headphones.json` - Búsqueda por filtros de productos electrónicos
- `test-search-sportswear.json` - Búsqueda por filtros de productos de ropa deportiva

## ⚡ Tips de Uso

1. **Verifica endpoints**: Los endpoints pueden variar según la rama
2. **Revisa instrucciones**: Cada archivo tiene instrucciones específicas
3. **Compara resultados**: Los expected results te ayudan a validar
4. **Modifica datos**: Siéntete libre de crear tus propios casos de prueba
5. **Documenta cambios**: Si mejoras los datos, actualiza las instrucciones

---
*Estos datos están disponibles en todas las ramas del workshop para facilitar el testing progresivo.*
