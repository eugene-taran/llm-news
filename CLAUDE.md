# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

llm-news is an automated news aggregation system that fetches trending topics and generates daily summaries using multiple LLMs. The system uses scheduled GitHub Actions workflows for data generation and a React frontend for viewing the aggregated news.

## Key Architecture Components

### News Generation Pipeline
- **Three GitHub Actions workflows** run daily at staggered times:
  - `gcloud-news-aggregator.yml` - 6 PM Berlin time (Gemini models)
  - `openai-news-aggregator.yml` - 5 PM Berlin time (OpenAI models)
  - `anthropic-news-aggregator.yml` - 4 PM Berlin time (Claude models)
- **Matrix strategy** for parallel model execution:
  - Gemini: `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-2.5-flash-lite-preview-06-17`
  - OpenAI: `gpt-4o`, `gpt-4.1`, `gpt-4.1-mini`
  - Anthropic: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`
- **API approaches differ by provider**:
  - Gemini: Grounded search with dynamic retrieval
  - OpenAI: web_search_preview tool with structured output
  - Anthropic: Direct API calls without web search
- **Two-step process**: Topic discovery → JSON conversion using provider-specific models
- **Automatic conflict resolution**: Up to 5 retry attempts with exponential backoff

### Frontend Application
- **Tech Stack**: React 19.1.0 + TypeScript + Vite 6.3.5 + Yarn
- **Manifest system**: Auto-generated index (`news-manifest.json`) for efficient data loading
- **Static deployment**: Built assets copied to root for GitHub Pages hosting
- **Type safety**: Comprehensive TypeScript interfaces in `frontend/src/types/news.ts`
- **Model priority in manifest**: gemini-2.5-pro (first) → alphabetical → gemini-2.0-flash (last)

### Data Storage Structure
```
news/
├── YYYY-MM-DD/
│   ├── model-name/
│   │   └── model-output.json
```

## Common Development Commands

### Frontend Development
```bash
cd frontend
yarn dev                    # Start Vite dev server
yarn build                 # Production build
yarn lint                  # Run ESLint with TypeScript
yarn preview              # Preview production build
yarn generate:manifest    # Create news data index
yarn build:gh-pages      # Copy dist to root
yarn frontend:prep       # Full pipeline: manifest → build → deploy
```

### Local GitHub Actions Testing
```bash
# Requires 'act' tool and API keys in .secrets file
act -W .github/workflows/gcloud-news-aggregator.yml
act -W .github/workflows/openai-news-aggregator.yml
act -W .github/workflows/anthropic-news-aggregator.yml

# Required secrets:
# GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY
```

### News Data Management
```bash
# Force regenerate news for a date
rm -rf news/YYYY-MM-DD
# Then trigger workflow manually or wait for schedule

# Generate manifest after manual data changes
cd frontend && yarn generate:manifest
```

## Architecture Flow

```
Scheduled Workflows → API Calls → JSON Storage → Manifest Generation → Frontend Build → GitHub Pages
```

### Workflow Orchestration
1. **News generation workflows** run with duplicate prevention checks
2. **Frontend build workflow** auto-triggers after news commits (triggered by gcloud and openai workflows)
3. **Conditional execution** detects local vs CI environment (`!env.ACT`)
4. **Git integration** with descriptive commit messages per model
5. **Scheduled execution**: 14:00 UTC (Anthropic) → 15:00 UTC (OpenAI) → 16:00 UTC (Gemini)

## Key Implementation Details

### Frontend Routing & State
- Date-based routing with model selection tabs
- React hooks for state management (useState, useEffect, useMemo, useCallback)
- Responsive UI with custom date picker component
- Dynamic model availability based on manifest data
- Intelligent date selection (auto-selects latest available date)

### News Data Format
```typescript
interface NewsData {
  model: string;
  date: string;
  articles: Article[];
}

interface Article {
  title: string;
  description: string;
  source: string;
  link: string;
}
```

### SEO & Performance
- Meta tags optimized for "llm news deveugene" searches
- Structured data (JSON-LD) for search engines
- Model-based sitemap.xml (not date-based)
- Code splitting via Vite for optimal loading

## Development Considerations

- Frontend automatically detects new models via manifest system
- Workflows include error handling for API failures and git conflicts
- Local testing with 'act' may skip certain CI-only steps
- Backend Express server referenced in root package.json is not implemented
- Cache busting on manifest fetch with timestamp parameter (`?t=${timestamp}`)
- JSON files validated during manifest generation with error logging
- Build workflow depends on completion of other workflows (not push events)