# 🚀 Advanced AI Translator

A modern, high-performance translation tool inspired by DeepL and Google Translate. Built with a React frontend and an Express backend, supporting multi-language translation and file document processing.

![Translator UI](https://via.placeholder.com/800x400?text=Translator+Preview)

## ✨ Features

- **📝 Smart Text Translation**: Real-time translation with auto-language detection.
- **📄 Document Translation**: Support for **PDF** and **HTML** file translation (drag & drop).
- **🎨 Modern UI**: Clean, responsive interface built with TailwindCSS.
- **🌍 Multi-language Support**: Supports 100+ languages including Chinese, English, Spanish, French, Japanese, etc.
- **⚡ Fast & Efficient**: Optimized for speed with local caching.

## 🛠️ Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)

### Setup Steps

1. **Backend Setup**
   Open a terminal in the project root directory:
   ```bash
   # Install backend dependencies
   npm install
   ```

2. **Frontend Setup**
   Open a new terminal (or `cd client`) and install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## 🚀 How to Run

You need to run both the backend and frontend servers.

1. **Start the Backend Server** (API)
   In the root directory:
   ```bash
   node server.js
   ```
   *Server will start on http://localhost:3000*

2. **Start the Frontend Client** (UI)
   In the `client` directory:
   ```bash
   cd client
   npm run dev
   ```
   *Client will start on http://localhost:5173*

3. **Open in Browser**
   Visit **[http://localhost:5173](http://localhost:5173)** to use the translator.

## 📖 User Manual

### 1. Text Translation
- Click the **"Text"** tab at the top.
- Select your source language (or leave as "Detect Language").
- Select your target language on the right.
- Type or paste text into the left box.
- The translation will appear automatically on the right.
- Use the **Copy** button to copy the result.

### 2. Document Translation
- Click the **"Documents"** tab.
- Drag and drop a **PDF** or **HTML** file into the upload zone.
- Or click "Select File" to browse your computer.
- Click **"Translate Document"**.
- The extracted and translated text will appear in the result box.

## ❓ Troubleshooting

- **"Network Error" or "Connection Refused"**:
  - Ensure **BOTH** terminal windows (Backend and Frontend) are running.
  - Check if ports 3000 or 5173 are occupied by other programs.

- **PDF Parsing Error**:
  - Currently, some complex PDFs might have issues. If parsing fails, try converting to a simpler format or copying the text manually.

---
*Created by Antigravity*
