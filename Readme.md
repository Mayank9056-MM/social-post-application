# 🧑‍🤝‍🧑 Social Post Application

A full-stack **Social Media–style application** where users can register, log in, create posts with images, like/unlike posts, and interact with content securely.  
Built to demonstrate **real-world backend practices** such as authentication, authorization, media uploads, and RESTful APIs.

--- 
## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Secure **HTTP-only cookies** for access tokens
- Protected routes using middleware

### 📝 Posts
- Create posts with image uploads
- View all posts with pagination
- Like / Unlike posts
- Delete posts (owner only)

### ❤️ Likes
- Toggle like functionality
- Prevent duplicate likes
- Likes stored as user references

### ☁️ Media Upload
- Image upload using **Cloudinary**
- Automatic cleanup on failure

### 🧠 Security & Best Practices
- Password hashing using **bcrypt**
- Token expiration handling
- Input validation
- Proper error handling with custom API errors

---

## 🛠️ Tech Stack


### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (jsonwebtoken)**
- **bcryptjs**
- **Cloudinary**
- **Cookie-parser**
- **CORS**

### Frontend (separate repo / client)
- **React**
- **Axios**
- **React Router**

---

## 📂 Project Structure

## 🔑 Environment Variables

In server/.env

```env
  MONGODB_URI = 
PORT = 5000

ACCESS_TOKEN_SECRET = your_jwt_secret_key
ACCESS_TOKEN_EXPIRY = 7d

FRONTEND_URL = *

NODE_ENV = development

# cloudinary
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

```

For client

```env
  VITE_API_URL= 
```



### 🧑‍💻 Installation & Setup

1. Clone the repo

```bash
https://github.com/Mayank9056-MM/social-post-application
cd social-post-application
```

2. Backend Setup

```bash
  cd server
  npm install
  npm run dev
```

3. Frontend Setup

```bash
  cd client
  npm install
  npm run dev
```

### 🔐 API Endpoints (Backend)

#### Authentication

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| POST   | `/api/v1/users/register` | Register new user |
| POST   | `/api/v1/users/login`    | Login user        |

#### Tasks

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/api/v1/posts/create`            | Create post (only upload image)    |
| POST   | `/api/v1/posts/update`            | Update post   |
| PATCH  | `/api/v1/posts/add-comment/:id`        | add comment to post        |
| PATCH  | `/api/v1/posts/toggle-like/:id` | toggle like |
| DELETE | `/api/v1/posts/delete/:id`        | Delete post        |

> ⚠️ All task routes are protected and require a valid JWT access token in the Authorization header.

## 📄 License

> This project is for educational and skill assessment purposes.

## 🙋‍♂️ Author

> Mayank Mahajan
> Full Stack Developer

## 🖼️ Screenshots

### 🔐 Login Page
![Login Page](./screenshots/login.png)

### 📝 Register Page
![Register Page](./screenshots/register.png)

### 📋 Task Dashboard
![Dashboard](./screenshots/dashboard.png)

### ➕ Add Task Modal
![Add Task](./screenshots/add-task.png)

