# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

llm-news is an automated news aggregation system that fetches trending topics from Google Search and generates summaries using different LLMs. The system consists of GitHub Actions workflows that generate daily news data and a React frontend for viewing the news.

## Key Architecture Components

### News Generation Pipeline
- **GitHub Actions workflows** (`.github/workflows/`) run daily to generate news content
- **Two-step process**: First uses grounded search to find trending topics, then converts to structured JSON
- **Multi-model support**: Generates news using different LLMs (Gemini models, OpenAI models)
- **Data storage**: Results stored in `news/YYYY-MM-DD/model-name/model-output.json` structure

### Frontend Application
- **React + TypeScript + Vite** application in `frontend/` directory
- **News manifest system**: `generate-news-manifest.js` script creates an index of all news data
- **Static deployment**: Built assets copied to root for GitHub Pages hosting

## Common Development Commands

### Frontend Development
```bash
cd frontend
yarn dev                    # Start development server
yarn build                 # Build for production
yarn lint                  # Run ESLint
yarn generate:manifest     # Generate news manifest from existing data
yarn frontend:prep         # Full build pipeline: manifest + build + copy to root
```

### Local News Generation
```bash
# Run GitHub Actions workflows locally (requires act and API keys)
act -W .github/workflows/gcloud-news-aggregator.yml
act -W .github/workflows/openai-news-aggregator.yml

# Regenerate news for existing date (delete first)
rm -rf news/2025-MM-DD
```

### Backend Development
```bash
# Simple Express server for local development
npm start                   # Start server
npm run dev                 # Start with nodemon
```

## Data Flow and Architecture

1. **Scheduled workflows** trigger daily at 6 PM Berlin time
2. **News generation** uses matrix strategy to run multiple LLM models in parallel
3. **Two-step API calls**: 
   - Grounded search call to find trending topics
   - JSON conversion call to structure the data
4. **Results committed** to repository automatically
5. **Frontend rebuild** triggered via separate workflow
6. **Static site deployment** via GitHub Pages

## Key Files and Directories

- `news/` - Generated news data organized by date and model
- `frontend/src/App.tsx` - Main React application with date/model selection
- `frontend/src/types/news.ts` - TypeScript interfaces for news data
- `frontend/scripts/generate-news-manifest.js` - Creates index of all news data
- `.github/workflows/` - Automated news generation and deployment workflows
- `.github/prompts/` - Prompt templates for LLM calls

## Important Notes

- News data structure follows `news/{date}/{model}/model-output.json` pattern
- Frontend uses a manifest system to efficiently load available news data
- GitHub Actions use matrix strategy to generate news from multiple models simultaneously
- Local development requires API keys in `.secrets` file for news generation