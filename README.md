# 🤖 ChatGPT Clone

A full-stack ChatGPT clone built to replicate a conversational AI experience. This project uses a React frontend and a Node.js/Express backend integrated with the OpenAI API.

---

## 🚀 Features

* Responsive chat interface similar to ChatGPT
* AI-generated responses using OpenAI API
* Backend support for handling conversations
* Full-stack architecture (React + Node.js + MongoDB)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* OpenAI API

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash id="d4k2n9"
git clone https://github.com/Atharav-Deshmukh/ChatGPT-clone.git
cd ChatGPT-clone
```

---

### 2. Backend Setup

```bash id="f7q1mx"
cd BackEnd
npm install
```

Create a `.env` file in the `BackEnd` folder:

```env id="g2v8pl"
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start backend:

```bash id="u9c3zs"
node Server.js
```

---

### 3. Frontend Setup

Open a new terminal:

```bash id="h8k2qt"
cd Front-End
npm install
```

Start frontend:

```bash id="y3l6wd"
npm run dev
```

---

### 4. Run the Application

Open your browser and go to:

```id="n1x5rb"
http://localhost:5173
```

---

## 📌 Project Structure

```id="p7e2kl"
ChatGPT-clone/
├── Front-End/      # React frontend
├── BackEnd/        # Node.js backend
└── README.md
```

---

## 📈 Future Improvements

* User authentication (login/signup)
* Chat history UI improvements
* Streaming responses (typing effect)
* Deployment (Vercel / Render)

---

## 👨‍💻 Author

Atharv Deshmukh
LinkedIn: https://www.linkedin.com/in/atharv-deshmukh-711909372/

---

## 📄 Disclaimer

This project is a personal implementation inspired by ChatGPT and is not affiliated with OpenAI.
