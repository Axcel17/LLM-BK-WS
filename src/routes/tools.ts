import { Router } from "express";
import { openai } from "../config";
import { Logger } from "../utils/logger";
import { ToolService } from "../services/ToolService";
import { 
  ChatWithToolsSchema, 
  ChatWithToolsRequest,
  ToolCallContext 
} from "../types/tools";
import { z } from "zod";

const router = Router();

// Initialize Tool Service
let toolService: ToolService;

// Initialize service on module load
(async () => {
  try {
    toolService = new ToolService();
    await toolService.initialize();
  } catch (error) {
    Logger.error("Failed to initialize Tool Service:", error);
  }
})();

// Chat with tools endpoint - Main conversational interface
router.post("/chat", async (req, res) => {
  try {
    // Validate input
    const validatedData = ChatWithToolsSchema.parse(req.body);
    const { message, conversation_id, max_tokens, include_tool_details } = validatedData;

    if (!toolService?.isServiceReady()) {
      return res.status(503).json({
        success: false,
        error: "Tool service not initialized",
        message: "The tool service is still starting up. Please try again in a moment.",
        workshop: "Product Tool Calling - Smart Assistant",
      });
    }

    Logger.info(`🤖 Processing chat with tools: "${message}"`);

    // Build context for tool calls
    const context: ToolCallContext = {
      conversation_id,
      user_query: message
    };

    // Create OpenAI chat completion with tools
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en productos que ayuda a los usuarios a encontrar, comparar y elegir productos ÚNICAMENTE de nuestro catálogo disponible.

HERRAMIENTAS DISPONIBLES:
- search_products: Busca productos usando lenguaje natural en nuestro catálogo
- get_product_details: Obtiene información detallada de un producto específico  
- compare_products: Compara productos lado a lado

REGLAS IMPORTANTES:
1. USA las herramientas para obtener información real de nuestro catálogo
2. Si no encuentras productos que cumplan los criterios, sé HONESTO al respecto
3. Para consultas con presupuesto específico, busca primero y luego analiza si hay opciones
4. Mantén respuestas CONCISAS y ÚTILES (max ${max_tokens} tokens)
5. NUNCA inventes productos, precios o características que no estén en los resultados

ESTRATEGIAS POR CASO:
- Presupuesto específico: Busca productos y analiza si están dentro del rango
- Comparaciones: Busca cada producto mencionado individualmente  
- Detalles de marca: Busca todos los productos de esa marca
- Recomendaciones generales: Busca por categoría o uso específico

FORMATO DE RESPUESTA:
- Si HAY productos: Información detallada con precios reales
- Si NO HAY productos: "No tenemos productos disponibles para [criterio]"
- Si están FUERA de presupuesto: Menciona los productos disponibles y sugiere ajustar presupuesto`
        },
        {
          role: 'user',
          content: message
        }
      ],
      tools: toolService.getToolDefinitions(),
      tool_choice: 'auto',
      max_tokens,
      temperature: 0.3,
    });

    const choice = completion.choices[0];
    let finalResponse = choice.message?.content || "";
    let toolResults: any[] = [];
    let totalTokens = completion.usage?.total_tokens || 0;

    // Handle tool calls if any
    if (choice.message?.tool_calls && choice.message.tool_calls.length > 0) {
      Logger.info(`🛠️ Processing ${choice.message.tool_calls.length} tool calls`);

      for (const toolCall of choice.message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolParams = JSON.parse(toolCall.function.arguments);
        
        Logger.info(`⚙️ Executing: ${toolName}(${JSON.stringify(toolParams)})`);

        // Execute tool
        const toolResult = await toolService.executeToolCall(toolName, toolParams, context);
        toolResults.push({
          tool_name: toolName,
          parameters: toolParams,
          result: toolResult
        });

        // Add tokens from tool execution
        if (toolResult.tokens_used) {
          totalTokens += toolResult.tokens_used;
        }
      }

      // Create follow-up completion with tool results
      const messages: any[] = [
        {
          role: 'system',
          content: `Eres un asistente de productos COMPLETAMENTE HONESTO. Usa ÚNICAMENTE los resultados de las herramientas para responder.

REGLAS CRÍTICAS:
1. Usa ÚNICAMENTE los resultados de las herramientas para responder
2. NUNCA inventes productos, marcas, modelos o precios que no aparezcan en los resultados
3. Si budget_analysis.situation indica:
   - 'no_related_products_found': "No tenemos [producto] disponible en nuestro catálogo. Te sugerimos consultar tiendas especializadas."
   - 'products_over_budget': "No tenemos [producto] en tu presupuesto de $X. Sin embargo, tenemos estas opciones si consideras aumentar tu presupuesto: [lista alternativas con precios]"
   - 'products_within_budget': Presenta los productos encontrados normalmente
4. Mantén respuestas concisas (max ${max_tokens} tokens)

CONTEXTO: El usuario preguntó "${message}"

EJEMPLOS DE RESPUESTAS HONESTAS:
- Sin productos relacionados: "No tenemos bicicletas disponibles en nuestro catálogo. Puedes consultar en tiendas especializadas en deportes."
- Productos fuera de presupuesto: "No tenemos smartphones en tu presupuesto de $300. Sin embargo, tenemos: iPhone 15 Pro $999 (excede por $699), iPad Pro $1099 (excede por $799). ¿Te interesa considerar aumentar tu presupuesto?"
- Productos encontrados: Presenta información completa con precios y características

Prioriza:
1. Honestidad absoluta sobre disponibilidad
2. Información específica del catálogo real
3. Sugerencias constructivas basadas en la situación`
        },
        {
          role: 'user',
          content: message
        },
        {
          role: 'assistant',
          content: choice.message.content,
          tool_calls: choice.message.tool_calls
        }
      ];

      // Add tool call results to conversation
      for (let i = 0; i < choice.message.tool_calls.length; i++) {
        messages.push({
          role: 'tool',
          tool_call_id: choice.message.tool_calls[i].id,
          content: JSON.stringify(toolResults[i].result.data)
        });
      }

      // Get final response with tool context
      const finalCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: Math.min(max_tokens, 200), // Reserve tokens for final response
        temperature: 0.3,
      });

      finalResponse = finalCompletion.choices[0]?.message?.content || finalResponse;
      totalTokens += finalCompletion.usage?.total_tokens || 0;
    }

    // Build response
    const response = {
      success: true,
      response: finalResponse,
      metadata: {
        conversation_id: conversation_id || `chat-${Date.now()}`,
        tools_used: toolResults.length,
        total_tokens: totalTokens,
        processing_time: new Date().toISOString(),
        workshop: "Product Tool Calling - Smart Assistant"
      }
    };

    // Include tool details if requested
    if (include_tool_details && toolResults.length > 0) {
      (response as any).tool_executions = toolResults;
    }

    Logger.success(`✅ Chat response generated (${toolResults.length} tools, ${totalTokens} tokens)`);
    res.json(response);

  } catch (error: any) {
    Logger.error("Tool calling chat error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid request format",
        details: error.errors,
        example: {
          message: "Busco auriculares baratos para trabajar desde casa",
          max_tokens: 300,
          include_tool_details: false
        },
        workshop: "Product Tool Calling - Smart Assistant",
      });
    }

    res.status(500).json({
      success: false,
      error: "Tool calling failed",
      message: error.message,
      workshop: "Product Tool Calling - Smart Assistant",
    });
  }
});

// Get available tools
router.get("/available", async (req, res) => {
  try {
    if (!toolService?.isServiceReady()) {
      return res.status(503).json({
        error: "Tool service not initialized",
        workshop: "Product Tool Calling - Smart Assistant",
      });
    }

    const tools = toolService.getToolDefinitions();

    res.json({
      available_tools: tools.length,
      tools: tools.map(tool => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters.required || []
      })),
      usage: "POST /tools/chat with your message to use tools automatically",
      workshop: "Product Tool Calling - Smart Assistant",
    });

  } catch (error: any) {
    Logger.error("Available tools error:", error);
    res.status(500).json({
      error: "Failed to get available tools",
      message: error.message,
      workshop: "Product Tool Calling - Smart Assistant",
    });
  }
});

// Tool health check
router.get("/health", async (req, res) => {
  try {
    const isHealthy = toolService?.isServiceReady();
    const toolDefinitions = toolService?.getToolDefinitions() || [];

    res.json({
      status: isHealthy ? "healthy" : "initializing",
      service: "ToolService",
      available_tools: toolDefinitions.length,
      tools: toolDefinitions.map(t => t.function.name),
      timestamp: new Date().toISOString(),
      workshop: "Product Tool Calling - Smart Assistant",
    });

  } catch (error: any) {
    Logger.error("Tool health check error:", error);
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      workshop: "Product Tool Calling - Smart Assistant",
    });
  }
});

export default router;