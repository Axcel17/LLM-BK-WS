# RAG Test Files

Estos archivos contienen queries de prueba para el sistema de búsqueda semántica de productos.

## Endpoints Disponibles

### POST /rag/search
Realiza búsqueda semántica de productos usando RAG (Retrieval Augmented Generation).

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:3000/rag/search \
  -H "Content-Type: application/json" \
  -d @test-search-headphones.json
```

### GET /rag/categories
Obtiene categorías, marcas y rangos de precio disponibles.

```bash
curl http://localhost:3000/rag/categories
```

### GET /rag/browse/:category
Explora productos por categoría.

```bash
curl http://localhost:3000/rag/browse/electronics?limit=5
```

### GET /rag/health
Verifica el estado del servicio RAG.

```bash
curl http://localhost:3000/rag/health
```

## Archivos de Test

- `test-search-headphones.json` - Búsqueda de auriculares con filtro de precio
- `test-search-samsung.json` - Búsqueda específica por marca Samsung
- `test-search-sportswear.json` - Ropa deportiva con categoría específica
- `test-search-apple.json` - Productos Apple con precio mínimo
- `test-search-cooking.json` - Productos económicos para cocina

## Filtros Disponibles

```json
{
  "query": "tu búsqueda aquí",
  "filters": {
    "category": "electronics|clothing|home|sports",
    "brand": "Apple|Samsung|Nike|Sony|etc",
    "minPrice": 50,
    "maxPrice": 200,
    "limit": 5
  }
}
```

## Respuesta Esperada

```json
{
  "success": true,
  "answer": "Respuesta contextual basada en los productos encontrados",
  "products": [
    {
      "id": "product-1",
      "title": "Nombre del producto",
      "content": "Descripción completa",
      "category": "electronics",
      "price": 99.99,
      "brand": "MarcaEjemplo",
      "similarity": 0.85
    }
  ],
  "metadata": {
    "query": "búsqueda original",
    "totalFound": 3,
    "tokensUsed": 450,
    "model": "gpt-4o-mini",
    "processingTime": "2024-01-15T10:30:00.000Z",
    "workshop": "Product Semantic Search - RAG Implementation"
  }
}
```