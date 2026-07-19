# 📒 KhaataPushtak V2

> **KhaataPushtak (खाता-पुस्तक = "Ledger Book")**
>
> A modern full-stack MERN application for managing personal notes and expense logs.

---

# 🚀 Project Overview

KhaataPushtak V2 is the upgraded version of my original project.

Version 1 was built using:

- Node.js
- Express.js
- EJS
- File System (`fs` module)

where every Hisaab was stored as a `.txt` file.

Version 2 reimagines the project as a production-ready MERN Stack application using:

- React.js
- Express.js
- MongoDB Atlas
- REST APIs
- MVC Architecture

---

# 📖 Project Journey

## 🌱 Version 1 (Learning Phase)

The goal of Version 1 was to understand:

- File Handling in Node.js
- CRUD Operations
- Express Routing
- EJS Templating
- Backend Fundamentals
- How applications work without databases

### Technologies Used

```txt
Node.js
Express.js
EJS
File System (fs)
```

---

## ⚠ Problems in Version 1

### 1. Data stored as `.txt` files

- Difficult to query
- Difficult to filter
- Difficult to scale

---

### 2. Serverless deployment limitations

Platforms like Vercel use ephemeral file systems.

```txt
File writes disappear after redeployment.
```

---

### 3. No concurrency safety

Two users writing simultaneously could corrupt files.

---

### 4. Tight coupling

Backend and UI logic were strongly coupled.

---

## 🚀 Why Version 2?

Version 2 is designed to learn:

- Full Stack Development
- Database Design
- MVC Architecture
- REST APIs
- Cloud Deployment
- Production Architecture

---

# 🏗 Architecture

```txt
┌─────────────┐      HTTPS/REST       ┌─────────────┐      Mongoose      ┌──────────────┐
│   React SPA │ ───────────────────▶ │ Express API │ ─────────────────▶ │ MongoDB Atlas│
│  (Vercel)   │ ◀─────────────────── │  (Render)   │ ◀──────────────── │    (Cloud)   │
└─────────────┘        JSON           └─────────────┘      Documents     └──────────────┘
```

---

# 🏛 Three Tier Architecture

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Router

Responsible for:

- Presentation Layer
- User Interactions
- API Requests

---

## Backend

- Node.js
- Express.js
- REST APIs

Responsible for:

- Business Logic
- Validation
- Database Operations

---

## Database

- MongoDB Atlas
- Mongoose ODM

Responsible for:

- Persistent Storage
- Searching
- Filtering
- Sorting

---

# 🧩 MVC Architecture

| Layer | Responsibility | Folder |
|-------|----------------|---------|
| Model | Data Structure & Validation | `models/` |
| Controller | Business Logic | `controllers/` |
| Routes | URL Mapping | `routes/` |
| View | React Frontend | `client/` |

---

# 📂 Folder Structure

## Backend

```txt
server/

├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── index.js
└── package.json
```

---

## Frontend

```txt
client/

├── components/
├── pages/
├── hooks/
├── context/
├── services/
├── App.jsx
└── main.jsx
```

---

# 🔗 REST API Endpoints

Base URL:

```txt
/api/hisaab
```

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/hisaab` | Get all Hisaabs |
| GET | `/api/hisaab/:id` | Get single Hisaab |
| POST | `/api/hisaab` | Create Hisaab |
| PUT | `/api/hisaab/:id` | Update Hisaab |
| DELETE | `/api/hisaab/:id` | Delete Hisaab |

---

# 📦 Response Format

## Success

```json
{
  "success": true,
  "message": "Hisaab created successfully",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Hisaab not found"
}
```

---

# 🗄 Database Schema

```js
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: [
      "Grocery",
      "Food",
      "Shopping",
      "Bills",
      "Travel",
      "Home",
      "Other"
    ],
    default: "Other"
  }
}
```

---

# 🚀 Deployment Architecture

## Frontend

```txt
Vercel
```

---

## Backend

```txt
Render
```

---

## Database

```txt
MongoDB Atlas
```

---

# ⚠ Deployment Challenges Learned

### Version 1

❌ Local file system storage

❌ Not suitable for serverless platforms

❌ Tight coupling

---

### Version 2

✅ Persistent Database

✅ Decoupled Architecture

✅ Production Ready

---

# 📚 Learning Outcomes

- REST APIs
- MVC Architecture
- MongoDB & Mongoose
- React Hooks
- Axios Integration
- Cloud Deployment
- Environment Variables
- Professional Folder Structure

---

# 🔮 Future Scope

- JWT Authentication
- Multi User Support
- Cloudinary File Uploads
- Expense Analytics Dashboard
- PDF Export
- CSV Export
- Pagination
- Notifications

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors

---

# 📈 Project Evolution

```txt
KhaataPushtak V1
(File System)

↓

Learned CRUD & File Handling

↓

Discovered Deployment Limitations

↓

Learned MongoDB & MVC

↓

KhaataPushtak V2
(MERN Stack)
```

---

# 🤖 Role of AI

AI tools such as ChatGPT and Claude were used as:

- Architectural Assistants
- Documentation Partners
- Learning Companions

The project logic, understanding, debugging, modifications, and implementation decisions were manually studied and customized.

---

# 👨‍💻 Author

**Rishab Vaish**

B.Voc Software Development Student  
Passionate about Full Stack Development, Cloud Technologies and Building Practical Projects.
