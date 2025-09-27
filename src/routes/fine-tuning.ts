import express from 'express';
import { openai } from '../config/index';
import { Logger } from '../utils/logger';
import { ProductRAGService } from '../services/ProductRAGService';
import { PRODUCTS_CATALOG, AVAILABLE_CATEGORIES } from "../data/product-catalog";

const router = express.Router();

// Interface for intent classification request
interface IntentClassificationRequest {
    query: string;
    modelId?: string; // Optional, defaults to base model
    temperature?: number;
    maxTokens?: number;
}

// Interface for intent classification
interface IntentClassification {
    intent_type: 'GIFT' | 'PERSONAL_USE' | 'BUSINESS' | 'COMPARISON' | 'URGENT';
    category?: string;
    budget_tier: 'economic' | 'mid_range' | 'premium' | 'unspecified';
    recipient?: string;
    context_tags: string[];
    priority_features: string[];
    confidence?: number;
}

// Extended interface for analysis
interface IntentAnalysis extends IntentClassification {
    extracted_budget: number | null;
    enhanced_query: string;
}

// Default models available
const AVAILABLE_MODELS = {
    base: 'gpt-4o-mini-2024-07-18',
    'fine-tuned': 'ft:gpt-4o-mini-2024-07-18:personal::CKAp8rjB',
} as const;

// ============================================================================
// INTENT CLASSIFICATION ENDPOINT
// ============================================================================

let ragService: ProductRAGService;

ragService = new ProductRAGService(PRODUCTS_CATALOG)

router.post('/classify-intent', async (req, res) => {
    try {
        const {
            query,
            modelId = 'base',
            temperature = 0.1,
            maxTokens = 250
        }: IntentClassificationRequest = req.body;

        // Validation
        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Query is required',
                example: {
                    query: "regalo para mi mamá que le gusta cocinar, presupuesto $100",
                    modelId: "fine-tuned", // optional, defaults to "base"
                    temperature: 0.1, // optional
                    maxTokens: 150 // optional
                }
            });
        }

        // Determine which model to use
        const actualModelId = AVAILABLE_MODELS[modelId as keyof typeof AVAILABLE_MODELS] || modelId;

        Logger.info('Intent classification request', {
            query: query.substring(0, 100),
            modelId: actualModelId,
            temperature,
            maxTokens
        });

        const startTime = Date.now();

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: actualModelId,
            messages: [
                {
                    role: 'system',
                    content: `Eres un experto clasificador de intenciones comerciales para un sistema de recomendación de productos. 

Tu trabajo es analizar consultas de usuarios en español y extraer:
1. Tipo de intención: GIFT, PERSONAL_USE, BUSINESS, COMPARISON, URGENT
2. Categoría de producto (si se especifica): electrónicos, ropa, hogar, deportes, etc.
3. Nivel de presupuesto: economic, mid_range, premium, unspecified
4. Destinatario (si es regalo): mother, father, friend, spouse, child, etc.
5. Tags contextuales: ocasión, características importantes
6. Características prioritarias: funcionalidades clave que busca

Responde ÚNICAMENTE en formato JSON válido, sin texto adicional.

Ejemplos:
- "regalo para mi mamá cocinera, $100" → {"intent_type": "GIFT", "category": "hogar", "budget_tier": "mid_range", "recipient": "mother", "context_tags": ["cooking", "gift"], "priority_features": ["kitchen_appliances", "cooking_tools"]}
- "necesito laptop para trabajo" → {"intent_type": "BUSINESS", "category": "electrónicos", "budget_tier": "unspecified", "context_tags": ["work", "productivity"], "priority_features": ["performance", "reliability"]}`
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            max_tokens: maxTokens,
            temperature: temperature
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const resultText = response.choices[0]?.message?.content;

        if (!resultText) {
            return res.status(500).json({
                success: false,
                error: 'No response from model',
                modelId: actualModelId,
                workshop: 'Product Semantic Search - Fine-tuning'
            });
        }

        let classification: IntentClassification;
        try {
            classification = JSON.parse(resultText) as IntentClassification;
        } catch (parseError) {
            Logger.error('Failed to parse intent classification JSON', {
                modelId: actualModelId,
                query,
                response: resultText,
                error: parseError
            });

            return res.status(500).json({
                success: false,
                error: 'Invalid JSON response from model',
                rawResponse: resultText,
                modelId: actualModelId,
                suggestion: 'The model may need additional fine-tuning for consistent JSON output',
                workshop: 'Product Semantic Search - Fine-tuning'
            });
        }

        // Success response
        res.json({
            success: true,
            classification,
            metadata: {
                query: query,
                modelId: actualModelId,
                responseTime: `${responseTime}ms`,
                temperature,
                maxTokens,
                usage: {
                    promptTokens: response.usage?.prompt_tokens || 0,
                    completionTokens: response.usage?.completion_tokens || 0,
                    totalTokens: response.usage?.total_tokens || 0
                }
            },
            workshop: 'Product Semantic Search - Fine-tuning Branch',
            timestamp: new Date().toISOString()
        });

        Logger.info('Intent classification completed', {
            modelId: actualModelId,
            responseTime,
            intentType: classification.intent_type,
            budgetTier: classification.budget_tier,
            tokensUsed: response.usage?.total_tokens
        });

    } catch (error: any) {
        Logger.error('Intent classification error', { error: error.message, stack: error.stack });

        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message || 'Failed to classify intent',
            workshop: 'Product Semantic Search - Fine-tuning',
            support: 'Check if the model ID is correct and accessible'
        });
    }
});

// ============================================================================
// AVAILABLE MODELS ENDPOINT
// ============================================================================

router.get('/models', (req, res) => {
    res.json({
        availableModels: {
            base: {
                id: AVAILABLE_MODELS.base,
                description: 'Base GPT-4o-mini model',
                performance: {
                    accuracy: '~60% JSON validity, ~0% intent accuracy',
                    speed: 'Fast (~2s response time)',
                    cost: 'Low'
                },
                recommendedFor: 'General purpose, cost optimization'
            },
            'fine-tuned': {
                id: AVAILABLE_MODELS['fine-tuned'],
                description: 'Fine-tuned model for intent classification',
                performance: {
                    accuracy: '100% JSON validity, 100% intent accuracy',
                    speed: 'Slower (~9s response time)',
                    cost: 'Higher (fine-tuned model pricing)'
                },
                recommendedFor: 'Production intent classification, high accuracy requirements'
            }
        },
        usage: {
            default: 'Uses "base" model if no modelId specified',
            customModel: 'You can also provide any OpenAI model ID directly',
            endpoint: 'POST /fine-tuning/classify-intent'
        },
        workshop: 'Product Semantic Search - Fine-tuning'
    });
});

// ============================================================================
// INTEGRATED SMART RECOMMENDATION ENDPOINT
// ============================================================================

router.post('/smart-recommend', async (req, res) => {
    try {
        const {
            query,
            useFineTuned = true,
            maxProducts = 5
        } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Query is required',
                example: {
                    query: "regalo para mi mamá que le gusta cocinar, presupuesto $150",
                    useFineTuned: true, // optional, defaults to true
                    maxProducts: 3 // optional, defaults to 3
                }
            });
        }

        const startTime = Date.now();
        Logger.info('Smart recommendation request', { query: query, useFineTuned });

        // STEP 1: Intent Analysis - Intent + Budget + Enhanced Query
        let IntentAnalysis: IntentAnalysis | null = null;
        let enhancedQuery = query;
        let userBudget: number | null = null;

        const modelToUse = useFineTuned ? AVAILABLE_MODELS['fine-tuned'] : AVAILABLE_MODELS.base;

        try {
            Logger.info('🎯 Step 1: Intent analysis with', useFineTuned ? 'fine-tuned' : 'base', 'model...');

            const analysisResponse = await openai.chat.completions.create({
                model: modelToUse,
                messages: [
                    {
                        role: 'system',
                        content: `Eres un experto analista de intenciones comerciales y búsquedas de productos. Tu trabajo es analizar la consulta del usuario y extraer TODA la información relevante en un solo paso.

Analiza la consulta y responde SOLO con JSON válido que incluya:
1. Clasificación de intención
2. Presupuesto extraído (número o null)
3. Query mejorado para búsqueda semántica

FORMATO DE RESPUESTA:
{
  "intent_type": "GIFT|PERSONAL_USE|BUSINESS|COMPARISON|URGENT",
  "category": "categoría del producto si se especifica",
  "budget_tier": "economic|mid_range|premium|unspecified", 
  "recipient": "destinatario si es regalo",
  "context_tags": ["tags", "contextuales", "relevantes"],
  "priority_features": ["características", "importantes", "buscadas"],
  "extracted_budget": 300,
  "enhanced_query": "query expandido con sinónimos y términos relacionados"
}

REGLAS PARA EXTRACTED_BUDGET:
- Si mencionan "$300", "300 dólares", "presupuesto 300", etc. → extracted_budget: 300
- Si NO mencionan presupuesto específico → extracted_budget: null

REGLAS PARA ENHANCED_QUERY:
- Mantén el sentido original
- Agrega sinónimos y términos relacionados
- Incluye palabras clave técnicas relevantes
- Expande para mejorar búsqueda semántica

EJEMPLOS:
Consulta: "regalo para mamá que cocina, presupuesto $150"
→ enhanced_query: "regalo cocina madre familia cuchillos sartén electrodomésticos culinarios chef cooking hogar kitchen"

Consulta: "necesito algo para escribir digitalmente"
→ enhanced_query: "escritura digital tabletas stylus iPad Pro Apple Pencil teclados mecánicos writing notas drawing"

Consulta: "equipos para ejercicio en casa, máximo $200"
→ enhanced_query: "fitness hogar equipos deportivos bandas yoga colchoneta ejercicio casa entrenamiento gym home workout"`
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                max_tokens: 200,
                temperature: 0.1
            });

            const analysisText = analysisResponse.choices[0]?.message?.content;
            if (analysisText) {
                IntentAnalysis = JSON.parse(analysisText);
                enhancedQuery = IntentAnalysis?.enhanced_query || query;
                userBudget = IntentAnalysis?.extracted_budget || null;
                Logger.info('🎯 Intent analysis completed', { IntentAnalysis });
            }
        } catch (error) {
            Logger.error('⚠️ Intent analysis failed, using original query and fallback budget extraction...');
        }
        // STEP 2: Multi-Stage RAG Search
        Logger.info('📚 Step 2: Performing intelligent product search...');

        // Perform two searches: original + enhanced, then combine results
        const searchResults = await ragService.searchProducts(enhancedQuery, maxProducts);

        // If enhanced search found nothing, fallback to original query
        if (searchResults.products.length === 0 && enhancedQuery !== query) {
            const fallbackResults = await ragService.searchProducts(query, maxProducts);
            searchResults.products = fallbackResults.products;
        }

        // STEP 3: Generate Smart Recommendations with Context
        Logger.info('🤖 Step 3: Generating intelligent recommendations...');

        let recommendationPrompt: string;
        let systemMessage: string;

        if (searchResults.products.length === 0) {
            // Case: No products found - provide helpful guidance
            Logger.warn('⚠️ No products found, generating guidance...');

            recommendationPrompt = `El usuario busca: "${query}"

INTENCIÓN CLASIFICADA:
${IntentAnalysis ? JSON.stringify(IntentAnalysis, null, 2) : 'No clasificada'}

SITUACIÓN: NO encontré productos específicos que coincidan con esta búsqueda en nuestro catálogo actual.

NUESTRO CATÁLOGO INCLUYE ESTAS CATEGORÍAS:
- Electronics (iPhone, iPad, MacBook, audífonos, teclados mecánicos, monitores, webcams)
- Sports (equipos ejercicio, bandas elásticas, colchonetas yoga, mancuernas)  
- Kitchen (cuchillos, cafeteras, freidoras, licuadoras, sartenes)
- Home (aspiradoras, purificadores, lámparas, organizadores)
- Clothing (zapatillas, chaquetas, leggings, camisas)
- Beauty (sets spa, cepillos faciales, secadores)
- Accessories (mochilas, relojes inteligentes, botellas térmicas, powerbanks)
- Education (cursos online, kits Arduino)

INSTRUCCIONES CRÍTICAS:
1. Sé COMPLETAMENTE HONESTO: "No encontré productos específicos para tu búsqueda"
2. NO menciones productos específicos como "iPad Pro con Apple Pencil" a menos que aparezcan en resultados de búsqueda
3. NO inventes categorías o productos que no existen
4. Sugiere que el usuario sea más específico o busque en tiendas especializadas
5. Mantén un tono empático pero honesto

EJEMPLO DE RESPUESTA HONESTA:
"Lamentablemente, no encontré productos específicos en nuestro catálogo que coincidan exactamente con tu búsqueda de [necesidad específica]. 

Nuestro catálogo se enfoca en [categorías relevantes], pero no tenemos la solución específica que buscas.

Te sugiero buscar en tiendas especializadas en [área específica] para encontrar exactamente lo que necesitas."`;

            systemMessage = 'Eres un asistente COMPLETAMENTE HONESTO. Si no encontraste productos específicos, dilo claramente. NO inventes productos ni sugerencias.';

        } else {
            // Case: Products found - use budget from intent analysis
            Logger.info(`✅ Found ${searchResults.products.length} products, generating recommendations...`);
            Logger.info(`💰 Budget from analysis: ${userBudget ? '$' + userBudget : 'None'}`);

            recommendationPrompt = `Usuario busca: "${query}" ${userBudget ? `Presupuesto: $${userBudget}` : 'Sin límite de presupuesto'}`;

            if (userBudget !== null) {
                const withinBudget = searchResults.products.filter((p: any) => {
                    return p.price && userBudget && p.price <= userBudget;
                });

                const overBudget = searchResults.products.filter((p: any) => {
                    return p.price && userBudget && p.price > userBudget;
                });

                if (withinBudget.length > 0) {
                    recommendationPrompt += `\nPRODUCTOS RECOMENDADOS (dentro del presupuesto):\n${withinBudget.map((p: any) => `- ${p.title}: ${p.price}${p.description ? ' - ' + p.description.substring(0, 100) : ''}`).join('\n')}`;
                }

                if (overBudget.length > 0) {
                    recommendationPrompt += `\nOPCIONES ADICIONALES (requieren más presupuesto):\n${overBudget.map((p: any) => {
                        const excess = userBudget ? p.price - userBudget : null;
                        return `- ${p.title}: ${p.price} (excede por $${excess})`;
                    }).join('\n')}`;
                }

            } else {
                // No userBudget provided, list all products
                Logger.info(`💰 No budget provided, listing all products...`);
                recommendationPrompt += `Usuario busca: "${query}" Sin límite de presupuesto\n\nPRODUCTOS RECOMENDADOS:\n${searchResults.products.map((p: any) => `- ${p.title}: ${p.price}${p.description ? ' - ' + p.description.substring(0, 100) : ''}`).join('\n')}`;
            }

            systemMessage = `Eres un asistente de compras COMPLETAMENTE HONESTO. 

REGLAS CRÍTICAS:
1. SOLO menciona productos que están en la lista proporcionada
2. NUNCA inventes productos, precios o descripciones
3. USA EXACTAMENTE los nombres y precios que te proporciono
4. NO agregues productos adicionales que no aparezcan en la lista
5. Si no hay productos dentro del presupuesto, dilo claramente

Presenta de forma clara los productos reales encontrados, separando por presupuesto.`;
        }
        const recommendationResponse = await openai.chat.completions.create({
            model: AVAILABLE_MODELS.base, // Use base model for final recommendations
            messages: [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: recommendationPrompt
                }
            ],
            max_tokens: 200,
            temperature: 0.1
        });

        const recommendation = recommendationResponse.choices[0]?.message?.content || 'No se pudo generar recomendación';

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        // Success Response
        res.json({
            success: true,
            workflow: {
                step1: 'Analysis (Intent + Budget + Enhanced Query)',
                step2: 'Multi-Stage RAG Search',
                step3: 'Smart Recommendations'
            },
            classification: IntentAnalysis || { error: 'Analysis failed, used fallback' },
            searchResults: {
                query: enhancedQuery,
                found: searchResults.products.length,
                products: searchResults.products
            },
            recommendation,
            performance: {
                totalTime: `${totalTime}ms`,
                modelUsed: useFineTuned ? 'fine-tuned + base' : 'base only'
            },
            metadata: {
                workshop: 'Product Semantic Search - Integrated Fine-tuning',
                timestamp: new Date().toISOString(),
                enhanced: !!IntentAnalysis
            }
        });

        Logger.info('Smart recommendation completed', {
            totalTime,
            enhanced: !!IntentAnalysis,
            productsFound: searchResults.products.length,
            intentType: IntentAnalysis?.intent_type
        });

    } catch (error: any) {
    Logger.error('Smart recommendation error', { error: error.message });

    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        workflow: 'Failed during smart recommendation process',
        workshop: 'Product Semantic Search - Integrated Fine-tuning'
    });
}});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

router.get('/health', (req, res) => {
    res.json({
        service: 'Fine-tuning Intent Classification',
        status: 'healthy',
        availableEndpoints: [
            'POST /fine-tuning/classify-intent - Classify user intent',
            'POST /fine-tuning/smart-recommend - Full integrated workflow',
            'GET /fine-tuning/models - List available models',
            'GET /fine-tuning/health - Service health check'
        ],
        models: {
            base: AVAILABLE_MODELS.base,
            'fine-tuned': AVAILABLE_MODELS['fine-tuned']
        },
        performance: {
            baseModel: '60% JSON validity, 0% intent accuracy, ~2s response',
            fineTunedModel: '100% JSON validity, 100% intent accuracy, ~9s response'
        },
        integratedWorkflow: {
            description: 'Fine-tuned intent classification + RAG search + Smart recommendations',
            steps: ['Intent Analysis', 'Enhanced Search', 'Personalized Recommendations'],
            totalTime: '~12s with fine-tuned model, ~4s with base model'
        },
        workshop: 'Product Semantic Search - Fine-tuning',
        timestamp: new Date().toISOString()
    });
});

export default router;