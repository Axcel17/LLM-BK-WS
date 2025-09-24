# GitHub Copilot Instructions

## Project Overview
This is a **Progressive Product Semantic Search Workshop** designed for OpenAI API Practitioner certification. The architecture follows a **branch-based learning progression** where each branch builds upon the previous one:

- **Branch 1** (`1-initial-project`): Multimodal basics (chat, voice-to-text, text-to-voice, image analysis)
- **Branch 2-5**: RAG implementation → Tool calling → Fine-tuning → Production deployment

## Key Architecture Patterns

### Modular Route Structure
Routes are organized by feature/branch in `src/routes/`:
- `basics.ts` contains all multimodal AI endpoints for branch 1
- Each future branch will have its own route file (`rag.ts`, `tools.ts`, etc.)
- `app.ts` contains only meta/informational endpoints (health, docs, progress, costs)

### Centralized Configuration
- **OpenAI client**: Single shared instance in `src/config/index.ts`
- **Environment config**: Zod-validated types in `src/types/config.ts`
- **Multer configs**: Separated by use case in `src/config/multer.ts`:
  - `imageUpload`: Memory storage for base64 conversion (Vision API)
  - `audioUpload`: Disk storage with extensions (Whisper API)

### Cost Optimization Strategy
This workshop prioritizes **cost-effective OpenAI usage**:
- Primary model: `gpt-4o-mini` (100x cheaper than GPT-4o)
- Strict token limits: 300 max for chat, 50 for image analysis, 30 for text enhancement
- Embedding model: `text-embedding-3-small` for cost optimization
- Audio files automatically deleted after processing

### Multimodal Patterns
Each AI endpoint follows a consistent structure:
```typescript
// 1. Input validation with helpful error messages
// 2. OpenAI API call with cost-optimized parameters  
// 3. Structured response with usage metadata
// 4. Comprehensive error handling with workshop context
```

## Development Workflows

### Testing with Provided Assets
Use test files in `inputs/basic/` which include:
- `query-voice.mp3` - Audio file for speech-to-text testing
- `image.png` - Image file for vision analysis testing  
- `test-*.json` - Complete test payloads for each endpoint

### Running the Server
```bash
npm run dev  # Development with ts-node
npm run build && npm start  # Production build
```

### Branch Navigation
Each branch represents a workshop module. When switching branches, test files move to corresponding directories:
- Branch 1: `inputs/basic/`
- Branch 2: `inputs/rag/`  
- Branch 3: `inputs/tool-calling/`

## Critical Implementation Details

### Audio Processing Flow
1. Upload via `audioUpload.single("audio")` → saves to `uploads/` with extension
2. Create `ReadStream` for Whisper API (requires file path, not buffer)
3. Process with Whisper, then enhance with GPT-4o-mini suggestions
4. **Always** delete file with `unlinkSync()` in both success and error cases

### Image Processing Flow  
1. Upload via `imageUpload.single("image")` → stores in memory
2. Convert buffer to base64 data URL for Vision API
3. Support both file upload and direct URL input
4. Use `gpt-4o-mini` for cost-effective vision analysis (not GPT-4o)

### Response Patterns
All endpoints return structured responses with:
- `success: boolean` for POST endpoints
- `model: string` indicating which OpenAI model was used
- `usage: object` with token consumption data
- `workshop: string` for tracking/analytics
- Detailed error objects with examples and supported formats

### Logging Strategy
Use centralized `Logger` from `src/utils/logger.ts` for:
- File processing details (names, sizes, paths)
- OpenAI API interactions  
- Error tracking with full context

## Workshop-Specific Conventions

- **Spanish by default**: Voice endpoints use `language: "es"` for Latin American audience
- **Informational endpoints**: Provide comprehensive workshop metadata (progress, costs, features)
- **404 handler**: Shows available endpoints and hints about branch progression
- **Branch awareness**: All responses include `currentBranch` context

## Integration Points

### OpenAI Services Used
- **Chat**: GPT-4o-mini for cost-effective text processing
- **Audio**: Whisper-1 for transcription, TTS-1 for synthesis
- **Vision**: GPT-4o-mini (not GPT-4o) for image analysis
- **Future**: text-embedding-3-small for RAG (branch 2+)

### External Dependencies
- **Multer**: Handles multimodal file uploads with format validation
- **Zod**: Runtime config validation with TypeScript integration
- **Express**: RESTful API with comprehensive error handling

## Code Quality Patterns

When implementing new features:
- Import shared OpenAI instance from `src/config/index.ts`
- Use appropriate multer config from `src/config/multer.ts`
- Follow the established response structure with metadata
- Include comprehensive error handling with workshop context
- Add corresponding test files to `inputs/{branch}/`
- Maintain cost optimization with token limits and model selection