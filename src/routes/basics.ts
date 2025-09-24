import { Router } from "express";
import { config, openai } from "../config";
import { audioUpload, imageUpload } from "../config/multer";
import { Logger } from "../utils/logger";
import { createReadStream, existsSync, unlinkSync } from "fs";

const router = Router();

// Basic chat endpoint - GPT-4o-mini for cost-effective chat
router.post("/chat", async (req, res) => {
  try {
    const { message, temperature = 0.7 } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
        example: { message: "Tell me about running shoes", temperature: 0.7 },
      });
    }

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful product search assistant. You help users find products and provide recommendations. Keep responses concise and helpful.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: temperature,
      max_tokens: 300, // Reduced for cost optimization
    });

    res.json({
      response: completion.choices[0].message.content,
      model: config.openai.model,
      temperature,
      usage: completion.usage,
      workshop: "Product Semantic Search - Basic Chat",
    });
  } catch (error: any) {
    Logger.error("Chat error:", error);
    res.status(500).json({
      error: "Chat processing failed",
      message: error.message,
      workshop: "Product Semantic Search Workshop",
    });
  }
});

// Voice to Text Query - Upload audio, transcribe with Whisper, suggest products with GPT-4o-mini
router.post("/query-voice-to-text", audioUpload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Audio file is required",
        supportedFormats: [
          "mp3",
          "mp4",
          "mpeg",
          "mpga",
          "m4a",
          "wav",
          "webm",
        ],
        maxSize: "25MB",
      });
    }

    console.log("Archivo recibido:", req.file.originalname);
    console.log("Archivo guardado como:", req.file.filename);

    // Crear stream del archivo para Whisper
    const audioStream = createReadStream(req.file.path);
    Logger.info(
      `Processing audio file: ${req.file.originalname} (${req.file.size} bytes). Path: ${req.file.path}`
    );

    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      language: "es", // Spanish by default, but Whisper auto-detects
    });

    const transcribedText = transcription.text;
    Logger.info(`Transcribed text: ${transcription.text}`);

    // Analyze transcribed text for product suggestions
    const productSuggestions = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "Based on the user's voice query, provide 1-2 brief product search suggestions or next steps they could take. Respond in Spanish when appropriate.",
        },
        {
          role: "user",
          content: `User said: "${transcribedText}". What product-related help can we offer?`,
        },
      ],
      max_tokens: 150,
    });

    // Delete the uploaded file after processing
    unlinkSync(req.file.path);

    res.json({
      success: true,
      transcription: {
        model: "whisper-1",
        language: "es",
        originalAudio: req.file.originalname,
        transcribedText: transcribedText,
        audioSize: req.file.size,
        processingTime: Date.now(),
      },
      suggestions: {
        model: config.openai.model,
        usage: productSuggestions.usage,
        text: productSuggestions.choices[0].message.content,
      },
      processingTime: Date.now(),
      workshop: "Product Semantic Search - Speech-to-Text",
    });
  } catch (error: any) {
    Logger.error("Transcription error:", error);

    // Limpiar archivo en caso de error
    if (req.file && existsSync(req.file.path)) {
      unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Transcription failed",
      message: error.message,
      workshop: "Product Semantic Search Workshop",
    });
  }
});

// Text to Audio Query - Send text and receive audio response
router.post("/query-text-to-voice", async (req, res) => {
  try {
    const { text, voice = "nova" } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
        example: {
          text: "Hola, estoy buscando unos zapatos deportivos",
          voice: "alloy",
        },
        availableVoices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
      });
    }

    const enhancement = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "You are a product search assistant. Respond with ONLY ONE very brief and direct sentence, maximum 20 words, no emojis, no special formatting, no lists. Plain text only.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 30, // Reduced for very short responses
    });

    let enhancedText = enhancement.choices[0].message.content;
    Logger.info(`Enhanced text: ${enhancedText}`);

    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: enhancedText || text,
      response_format: "mp3",
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());

    // Send audio with metadata in headers
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
      "Content-Disposition": 'inline; filename="speech.mp3"',
      "X-Voice-Used": voice,
      "X-Audio-Length": `${audioBuffer.length} bytes`,
      "X-Processing-Time": new Date().toISOString(),
    });

    res.send(audioBuffer);
  } catch (error: any) {
    Logger.error("TTS error:", error);
    res.status(500).json({
      error: "Text-to-speech failed",
      message: error.message,
      workshop: "Product Semantic Search Workshop",
    });
  }
});

// Analyze image endpoint - Vision with GPT-4o-mini for cost-effective image analysis
router.post("/analyze-image", imageUpload.single("image"), async (req, res) => {
  try {
    let imageUrl;
    let imageSource;

    // Multipart/form-data: uploaded file
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      imageSource = "uploaded_file";
      Logger.info(
        `Analyzing uploaded image: ${req.file.originalname} (${req.file.size} bytes)`
      );
    }
    // JSON body: image URL: send directly
    else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
      imageSource = "url";

      // Validate URL format
      try {
        new URL(imageUrl);
        Logger.info(`Analyzing image from URL: ${imageUrl}`);
      } catch {
        return res.status(400).json({
          error: "Invalid image URL format",
        });
      }
    }
    // No image provided
    else {
      return res.status(400).json({
        error: "Image file or image URL is required",
        examples: [
          'Form-data: Send file with key "image"',
          'JSON: {"imageUrl": "https://example.com/image.jpg"}',
        ],
        supportedFormats: ["png", "jpg", "jpeg", "gif", "webp"],
        maxSize: "25MB",
      });
    }

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "Eres un analizador de imágenes de productos. Describe lo que ves en la imagen, identifica posibles productos, sugiere términos de búsqueda y proporciona recomendaciones de productos. Responde en español de manera detallada pero concisa.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analiza esta imagen y dime qué productos puedes identificar. Sugiere términos de búsqueda relevantes para descubrir productos.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 50,
    });

    res.json({
      success: true,
      analysis: response.choices[0].message.content,
      model: config.openai.model,
      imageSource: imageSource,
      usage: response.usage,
      processingTime: new Date().toISOString(),
      workshop: "Product Semantic Search - Image Analysis",
    });
  } catch (error: any) {
    Logger.error("Image analysis error:", error);
    res.status(500).json({
      error: "Image analysis failed",
      message: error.message,
      workshop: "Product Semantic Search Workshop",
    });
  }
});

export default router;