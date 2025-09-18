# 📰 llm-news

[Live Demo](https://llm-news.deveugene.dev/)

---

## ⚠️ Project Status: Archive Mode

**News generation has been discontinued as of September 18, 2025.**

This project now serves as a showcase demonstrating how interesting multi-model AI results can be achieved with minimal operational costs. The existing news archive remains available for exploration.

## 🚀 What was llm-news?

**llm-news** was an automated news aggregation system that fetched trending topics and generated daily summaries using multiple state-of-the-art LLMs (Gemini, GPT-4, Claude).
The news was updated daily via GitHub Actions and served directly through GitHub Pages — no servers or backend required!

- **Automated**: News generation runs on GitHub Actions.
- **Multi-Model**: Easily configurable to use different LLMs.

---

## 🛠️ How It Worked

The system employed a sophisticated multi-model approach:

1. **Multi-Provider Strategy**:
   - **Gemini models**: Used grounded Google Search for real-time data
   - **OpenAI models**: Leveraged web_search_preview tool with structured output
   - **Claude models**: Direct API calls with contextual understanding

2. **Two-Step Process**:
   - Topic discovery with web search capabilities
   - JSON conversion using provider-specific models

3. **Automated Publishing**:
   - News JSON was committed to the repository
   - Instantly available via GitHub Pages
   - Zero infrastructure costs

---

## 🌟 Features

- **No Server Needed:** News is served as static files via GitHub Pages.
- **Configurable:** Change LLMs by editing the workflow file.
- **Extendable:** More models can be added without any problems.

---


---

## 🏃‍♂️ Run News Generation Locally

1. **Create a `.secrets` file** with your Gemini API key:
    ```
    GEMINI_API_KEY=your_openai_api_key
    ```

2. **Run the gcloud workflow locally**:
    ```
    act -W .github/workflows/gcloud-news-aggregator.yml
    ```

To regenerate news for the same day you need to delete the existing day's folder, e.g.:
```
rm -rf news/2025-06-22
```

**Change LLM models**:  
Edit the [`model` parameter](https://github.com/eugene-taran/llm-news/blob/main/.github/workflows/gcloud-news-aggregator.yml#L16) in the workflow file.
Currently, only models grounded on Google Search are supported.

---

## 🖥️ Generate New Data for the Frontend

```
cd frontend && yarn install && yarn frontend:prep
```

---

## 📚 License

MIT License

---

