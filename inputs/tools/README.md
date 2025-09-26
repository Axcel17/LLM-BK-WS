# Tool Calling Test Files

Estos archivos contienen conversaciones de prueba para el sistema de Tool Calling inteligente.

## Endpoint Principal

### POST /tools/chat
Conversación natural con herramientas automáticas.

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:3000/tools/chat \
  -H "Content-Type: application/json" \
  -d @test-search-headphones.json
```

### GET /tools/available
Lista las herramientas disponibles.

```bash
curl http://localhost:3000/tools/available
```

### GET /tools/health
Estado del servicio de herramientas.

```bash
curl http://localhost:3000/tools/health
```

## Herramientas Disponibles

### 1. **search_products**
- **Propósito**: Encuentra productos usando búsqueda semántica
- **Ejemplo**: "Busco auriculares baratos para trabajar"
- **Activación automática**: Preguntas sobre encontrar, buscar, descubrir productos

### 2. **get_product_details**  
- **Propósito**: Información detallada de un producto específico
- **Ejemplo**: "Detalles del MacBook Pro de 16 pulgadas"
- **Activación automática**: "detalles de", "información sobre", "specs de"

### 3. **compare_products**
- **Propósito**: Comparación estructurada lado a lado
- **Ejemplo**: "Compara iPhone vs Samsung Galaxy"
- **Activación automática**: "compara", "cuál es mejor", "diferencias entre"

## Archivos de Test

### **test-search-headphones.json**
- Búsqueda natural con filtros implícitos
- Incluye detalles de herramientas
- Test: search_products tool

### **test-compare-phones.json**  
- Comparación de smartphones
- Enfoque en fotografía
- Test: search_products + compare_products tools

### **test-product-details.json**
- Detalles específicos de MacBook
- Análisis de valor/precio
- Test: search_products + get_product_details tools

### **test-budget-gaming.json**
- Búsqueda con presupuesto específico ($500)
- Recomendaciones de setup completo
- Test: search_products + context awareness

### **test-cooking-budget.json**
- Productos de cocina económicos
- Filtros de precio implícitos
- Test: search_products con filtros automáticos

## Flujos de Trabajo Típicos

### **Flujo 1: Descubrimiento**
```
Usuario: "Busco auriculares baratos"
1. search_products → encuentra opciones
2. get_product_details → detalles de los mejores
3. Respuesta: recomendaciones con precios
```

### **Flujo 2: Comparación**
```
Usuario: "iPhone vs Samsung para fotografía"
1. search_products → encuentra ambos
2. compare_products → comparación estructurada
3. Respuesta: análisis y recomendación
```

### **Flujo 3: Presupuesto**
```
Usuario: "Setup gaming por $500"
1. search_products → productos gaming
2. Filtrado por presupuesto → opciones viables
3. get_recommendations → bundle sugerido
```

## Parámetros de Request

```json
{
  "message": "Tu consulta natural aquí",
  "max_tokens": 300,
  "include_tool_details": true,
  "conversation_id": "optional-session-id"
}
```

## Respuesta Esperada

```json
{
  "success": true,
  "response": "Respuesta conversacional del asistente",
  "metadata": {
    "conversation_id": "chat-123456789",
    "tools_used": 2,
    "total_tokens": 245,
    "processing_time": "2024-09-26T10:30:00.000Z"
  },
  "tool_executions": [
    {
      "tool_name": "search_products",
      "parameters": {"query": "auriculares baratos"},
      "result": {"success": true, "data": {...}}
    }
  ]
}
```

## Optimización de Tokens

- **search_products**: ~50-100 tokens por respuesta
- **get_product_details**: ~30-50 tokens por respuesta  
- **compare_products**: ~80-120 tokens por respuesta
- **Total conversación**: Objetivo < 300 tokens

## Detección Automática de Intent

El sistema detecta automáticamente cuándo usar cada herramienta:

| Query Pattern | Tool Triggered |
|---------------|----------------|
| "busco", "encuentro", "necesito" | search_products |
| "detalles de", "información", "specs" | get_product_details |
| "compara", "vs", "cuál mejor" | compare_products |
| "$500 presupuesto" | Context: budget_limit |