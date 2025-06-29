# 📰 llm-news

[Live Demo](https://llm-news.deveugene.de/)

---

## 🚀 What is llm-news?

**llm-news** automatically fetches the most popular news topics from Google Search and summarizes them using state-of-the-art LLMs.  
The news is updated daily and served directly via GitHub Pages — no servers or backend required!

- **Automated**: News generation runs on GitHub Actions.
- **Multi-Model**: Easily configurable to use different LLMs.
- **Open Source**: Contributions are welcome!

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
- **Extendable:** Plan to add more models and features.

---

## 🤝 Contributing

Contributions, ideas, and feedback are always welcome!  
Feel free to [open an issue](https://github.com/eugene-taran/llm-news/issues), fork the repo, or submit a PR.

**Roadmap:**
- Monitor and compare how different LLMs generate news.
- Add support for more models and sources.

---

## 🏃‍♂️ Run News Generation Locally

1. **Create a `.secrets` file** with your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

2. **Run the gcloud workflow locally**:
    ```
    act -W .github/workflows/gcloud-news-aggregator.yml
    ```

3**Run the openai workflow locally**:
    ```
    act -W .github/workflows/openai-news-aggregator.yml
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
cd frontend && yarn frontend:prep
```

---

## 📚 License

MIT License

---

