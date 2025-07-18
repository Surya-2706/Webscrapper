# 🧠 AI-Powered Content Extractor

A full-stack React + Node.js app that lets users input **any public article URL**, automatically extracts the content, and uses **Claude AI (Opus)** to generate:

- ✅ A clean title
- 🧾 A concise summary
- 🔑 5–10 keywords

The results are presented in a **Notion-like searchable table** UI. Ideal for content research, note-taking, and knowledge extraction.

---

## ✨ Features

- 🌐 Accepts any **public URL**
- 🧠 Uses Claude Opus for AI-powered summarization
- 🏷️ Generates title, summary, and keywords
- ⚙️ Filters & search in a Notion-style UI
- ⚡ Fast scraping with error handling
- 🚫 Skips login-protected or restricted content
- ☁️ Fully deployable on **Vercel (Frontend)** + **Render/Railway (Backend)**

---

## 🧱 Tech Stack

| Layer     | Technology               |
|-----------|---------------------------|
| Frontend  | React, Axios, MUI |
| Backend   | Node.js, Express, Cheerio |
| AI API    | Claude 3 Opus (Anthropic) |
| Hosting   | Vercel (Frontend) + Render (Backend) |

---

## 🔧 Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-content-extractor.git
cd ai-content-extractor
