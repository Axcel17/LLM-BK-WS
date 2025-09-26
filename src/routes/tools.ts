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

    // Extract budget from message if mentioned
    const budgetMatch = message.match(/(\$|peso|dolar|euro)?\s*(\d+)/i);
    if (budgetMatch) {
      context.budget_limit = parseInt(budgetMatch[2]);
    }

    // Create OpenAI chat completion with tools
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en productos que ayuda a los usuarios a encontrar, comparar y elegir productos. 

HERRAMIENTAS DISPONIBLES:
- search_products: Busca productos usando lenguaje natural
- get_product_details: Obtiene información detallada de un producto específico  
- compare_products: Compara 2-4 productos lado a lado

INSTRUCCIONES:
1. USA las herramientas cuando sea apropiado para dar respuestas precisas
2. Mantén respuestas CONCISAS y ÚTILES (max ${max_tokens} tokens)
3. Siempre incluye precios cuando estén disponibles
4. Si el usuario menciona un presupuesto, tenlo en cuenta
5. Prioriza la experiencia del usuario sobre mostrar información técnica

FORMATO DE RESPUESTA:
- Respuestas directas y actionables
- Usa viñetas para comparaciones
- Incluye recomendaciones claras
- Menciona beneficios clave de cada producto`
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
          content: `Usa los resultados de las herramientas para dar una respuesta útil y concisa al usuario. 
          
LÍMITE DE TOKENS: ${max_tokens}
CONTEXTO: El usuario preguntó "${message}"

Prioriza:
1. Respuesta directa a la pregunta
2. Recomendaciones claras  
3. Información de precios
4. Próximos pasos sugeridos`
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