<div align="center">
  
# 🗳️ ElectIQ
**Empowering voters across South Asia with clear, non-partisan electoral knowledge.**

[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28.svg?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

*Built exclusively for the **Google Prompt Wars Challenge**.*

</div>

---

## 🌟 Overview

**ElectIQ** is a modern, responsive web application designed to demystify the democratic process for citizens in **India, Pakistan, and Bangladesh**. By blending deterministic tools (interactive timelines, eligibility wizards) with cutting-edge probabilistic AI (Google's Gemini model), ElectIQ ensures that complex political jargon and electoral procedures become accessible, neutral, and easy to understand.

Whether you're a first-time voter wanting to know how Electronic Voting Machines work, or a citizen checking if you're eligible to vote from overseas, ElectIQ has you covered.

---

## ✨ Key Features

### 🏛️ Interactive Election Timeline
A dynamic, step-by-step breakdown of the electoral processes for India, Pakistan, and Bangladesh. 
* See exactly what happens from the *Dissolution of Assemblies* to *Government Formation*.
* Switch seamlessly between countries to compare democratic structures.

### ⚖️ Voter Eligibility Wizard
An interactive diagnostic tool.
* Answer a few simple questions regarding your age, citizenship, and legal standing.
* Instantly find out if you are eligible to vote, complete with specialized advice for NRIs (Non-Resident Indians) and overseas citizens.

### 🤖 ElectIQ Agentic AI Assistant
A context-aware, active AI agent powered by **Google Gemini 2.5 Flash**.
* Streams responses in real-time using **Server-Sent Events (SSE)** for a fast, app-like feel.
* Strictly prompted to remain politically neutral, focusing purely on *civic education and facts*.
* Persistent chat histories via **Firebase Firestore**, allowing you to pick up where you left off.
* Custom, crash-proof `SimpleMarkdown` rendering engine.

### 🗺️ What-If Scenarios & Roadmap Generator
Advanced agentic routing for personalized experiences.
* **Scenarios:** Choose interactive hypothetical situations (e.g., "What if I miss the registration deadline?") and watch the AI instantly generate a tailored guide for your selected country.
* **Personalized Roadmap:** After completing the Eligibility Wizard, the AI generates a customized, 6-step action plan specific to your unique profile and legal standing.

### 🎯 Dynamic Knowledge Quiz
Test your civic knowledge!
* Combines carefully curated static questions with **AI-generated challenges** generated on the fly by Gemini.
* Dynamic feedback, scoring, and explanations for every answer.

### 📚 Civic Glossary
A beautifully designed, searchable dictionary.
* Look up essential, yet confusing acronyms like **FPTP** (First-Past-The-Post), **EVM**, and **MCC** (Model Code of Conduct).
* Filter by category and instantly ask the AI for deeper explanations.

---

## 🛠️ Architecture & Technologies

ElectIQ employs a decoupled architecture optimized for scalability, security, and developer experience.

### Frontend
* **Core:** React 18, Vite
* **Routing:** React Router DOM v6
* **Styling:** Custom "Premium Minimalist" CSS Design System featuring Deep Navy and Neon Teal accents, glassmorphism, and smooth dark/light mode transitions.
* **Markdown:** `SimpleMarkdown` (Custom zero-dependency markdown renderer designed to prevent version conflicts).
* **Testing:** Vitest & React Testing Library

### Backend
* **Core:** Node.js, Express 5
* **AI Integration:** `@google/genai` SDK (Gemini 2.5 Flash) with Agentic active routing.
* **Streaming:** Server-Sent Events (SSE) implementation for real-time generative output.
* **Security:** `helmet` (HTTP headers), `express-rate-limit` (DDoS/Spam protection), `cors`.
* **Testing:** Jest & Supertest

### Cloud & Infrastructure
* **Database & Auth:** Firebase Firestore (schema-less document DB) & Firebase Anonymous Auth (frictionless user sessions).
* **Containerization:** Multi-stage `Dockerfile` optimized for minimal footprint.
* **Deployment target:** Google Cloud Run

---

## 🚀 Getting Started Locally

To run ElectIQ on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ElectIQ.git
cd ElectIQ
```

### 2. Setup the Backend
The backend serves the API and handles secure communication with Google Gemini.
```bash
cd backend
npm install

# Set up your environment variables
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
echo "PORT=8080" >> .env

# Run the backend server
npm start
```
*The backend will run on `http://localhost:8080`.*

### 3. Setup the Frontend
Open a new terminal window for the React frontend.
```bash
cd frontend
npm install

# Set up your Firebase configuration variables
# Create a .env file based on your Firebase project settings
echo "VITE_API_BASE_URL=http://localhost:8080" > .env
# Add your VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.

# Start the Vite development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## 🧪 Testing

ElectIQ maintains high code quality through automated testing.

**Run Backend API Tests:**
```bash
cd backend
npm run test
```

**Run Frontend Component Tests:**
```bash
cd frontend
npm run test
```

---

## 🔒 Security & Safe AI Implementation

* **API Key Obfuscation:** The Gemini API key is securely stored in the Node.js backend environment variables. The frontend never accesses it directly.
* **Prompt Engineering Safeguards:** The AI is bound by a strict System Prompt prioritizing neutrality, factual correctness, and refusal to engage in political endorsements or hypothetical controversies.
* **Rate Limiting:** The Express backend restricts API requests to 20 requests per minute per IP to prevent spam and abuse of the Gemini quota.

---

<div align="center">
  <p>Made with ❤️ for the <strong>Google Prompt Wars Challenge</strong>.</p>
</div>