# Fine-Tuning Guide - Product Intent Classification

## 🎯 Overview

This guide covers the complete fine-tuning pipeline for improving the Product Intent Classification system. The goal is to create a specialized model that can better understand user intentions when searching for products.

## 📊 Performance Targets

**Go/No-Go Criteria:**
- ✅ **Accuracy Improvement**: ≥10% over baseline
- ✅ **Absolute Accuracy**: ≥85% on test dataset
- ✅ **Response Quality**: Better structured intent extraction
- ✅ **Response Time**: Comparable or better than baseline

## 🚀 Quick Start

### Step 1: Generate Datasets
```bash
npm run fine-tuning:generate
```
This creates:
- `training_data.jsonl` (400+ examples)
- `test_data.jsonl` (100 examples)

### Step 2: Baseline Evaluation
```bash
npm run fine-tuning:setup
```
This will:
- Generate fresh datasets
- Test baseline model performance
- Show expected improvements needed

### Step 3: Start Fine-Tuning
```bash
npm run fine-tuning:start full-workflow
```
This runs the complete workflow:
- Upload datasets to OpenAI
- Create fine-tuning job
- Wait for completion (~20-30 minutes)
- Run comparative evaluation
- Make Go/No-Go decision

## 📋 Manual Process (Step by Step)

### Upload Files
```bash
npm run fine-tuning:start upload
```

### Create Fine-Tuning Job
```bash
npm run fine-tuning:start create-job <training-file-id> <validation-file-id>
```

### Monitor Progress
```bash
npm run fine-tuning:start status <job-id>
npm run fine-tuning:start list-jobs
```

### Compare Models
```bash
npm run fine-tuning:start compare gpt-4o-mini-2024-07-18 <your-fine-tuned-model-id>
```

## 📈 Dataset Information

### Training Dataset (400+ examples)
- **Intent Distribution:**
  - GIFT: ~180 examples (45%)
  - PERSONAL_USE: ~100 examples (25%)
  - BUSINESS: ~40 examples (10%)
  - COMPARISON: ~40 examples (10%)
  - URGENT: ~40 examples (10%)

- **Budget Tiers:**
  - mid_range: ~200 examples (50%)
  - economic: ~80 examples (20%)
  - premium: ~80 examples (20%)
  - unspecified: ~40 examples (10%)

### Test Dataset (100 examples)
- Balanced across all intent types
- Real-world Spanish queries
- Edge cases and ambiguous scenarios

## 🔬 Evaluation Metrics

The system evaluates models on:

1. **Intent Accuracy**: Correct classification of intent type
2. **Budget Tier Accuracy**: Correct budget classification
3. **JSON Validity**: Proper structured response format
4. **Response Time**: API response latency
5. **Overall Accuracy**: Combined success rate

## 🎛️ Fine-Tuning Configuration

```typescript
{
  BASE_MODEL: 'gpt-4o-mini-2024-07-18',
  EPOCHS: 3,
  BATCH_SIZE: 1,
  LEARNING_RATE_MULTIPLIER: 2
}
```

### Why These Settings?
- **3 epochs**: Sufficient for intent classification without overfitting
- **Batch size 1**: Optimal for small dataset
- **Learning rate 2x**: Faster convergence for structured tasks

## 📝 Example Training Data

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a Product Intent Classifier. Analyze user queries and return structured intent with type (GIFT/PERSONAL_USE/BUSINESS/COMPARISON/URGENT), budget tier, category, recipient, context tags, and priority features. Return only valid JSON."
    },
    {
      "role": "user", 
      "content": "Busco algo especial para mi madre en su cumpleaños, presupuesto medio"
    },
    {
      "role": "assistant",
      "content": "{\"intent_type\":\"GIFT\",\"category\":\"unspecified\",\"budget_tier\":\"mid_range\",\"recipient\":\"mother\",\"context_tags\":[\"gift\",\"birthday\",\"special\"],\"priority_features\":[\"thoughtful\",\"age_appropriate\",\"memorable\"]}"
    }
  ]
}
```

## 🚦 Decision Framework

The system makes automated Go/No-Go decisions based on:

### ✅ Deploy Fine-Tuned Model IF:
- Accuracy improvement ≥ 10%
- Absolute accuracy ≥ 85%
- No significant response time degradation
- Better structured responses

### ❌ Keep Base Model IF:
- Accuracy improvement < 10%
- Absolute accuracy < 85%
- Significant performance degradation
- Quality regression

## 💰 Cost Estimation

### Training Costs (OpenAI):
- **Dataset Upload**: Free
- **Training Job**: ~$0.50-2.00 (based on token count)
- **Evaluation**: ~$0.10-0.30 (testing queries)

### Expected ROI:
- Better user experience
- More accurate product recommendations
- Reduced need for fallback logic
- Improved conversion rates

## 🔧 Troubleshooting

### Common Issues:

1. **Dataset Too Small**
   - Solution: Run `npm run fine-tuning:generate` to create more examples

2. **Training Job Failed**
   - Check file format with OpenAI validator
   - Verify JSON structure in JSONL files

3. **Poor Accuracy Results**
   - Review test dataset quality
   - Consider adjusting hyperparameters
   - Add more diverse training examples

4. **API Rate Limits**
   - Add delays between evaluation calls
   - Use smaller test batches

### Debug Commands:

```bash
# Check dataset files
cat data/fine-tuning/training_data.jsonl | head -5

# Validate JSON format
python -m json.tool data/fine-tuning/training_data.jsonl

# Check OpenAI file status
npm run fine-tuning:start list-jobs
```

## 📊 Expected Results

Based on similar intent classification tasks:

- **Baseline (GPT-4o-mini)**: ~85-90% accuracy
- **Expected Fine-tuned**: ~92-97% accuracy
- **Improvement**: 5-12% accuracy gain
- **Response Time**: Similar (1-3 seconds)

## 🔄 Continuous Improvement

After deployment:

1. **Monitor Performance**: Track real-world accuracy
2. **Collect Feedback**: User corrections and edge cases
3. **Update Dataset**: Add new examples monthly
4. **Re-train**: Quarterly fine-tuning updates
5. **A/B Testing**: Compare versions in production

## 📚 Related Files

- `data/fine-tuning/dataset-generator.ts` - Training data generation
- `data/fine-tuning/fine-tuning-manager.ts` - OpenAI fine-tuning operations
- `data/fine-tuning/setup-baseline.ts` - Baseline evaluation
- `data/fine-tuning/evaluator.ts` - Model comparison tools
- `src/services/QueryParserService.ts` - Production integration

## ✅ Success Checklist

- [ ] Datasets generated successfully
- [ ] Baseline performance measured
- [ ] Training data uploaded to OpenAI
- [ ] Fine-tuning job completed
- [ ] Comparative evaluation run
- [ ] Go/No-Go decision documented
- [ ] Production integration tested
- [ ] Monitoring setup configured

---

**Next**: Once fine-tuning is complete and shows improvement, integrate the new model into `QueryParserService.ts` for production use.