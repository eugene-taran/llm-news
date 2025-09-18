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

## 🛠️ How It Works

1. **Topic Discovery**:  
   A call to Gemini (grounded on Google Search) finds the top 3 trending news topics.
2. **Summary Generation**:  
   A second Gemini call generates a JSON summary of those topics using the selected LLM (default: `gemini-2.5-flash`).
3. **Publishing**:  
   The generated news JSON is committed to the repository and instantly available via GitHub Pages.

> **Note:** Two calls are required because grounded search cannot return JSON directly.

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

