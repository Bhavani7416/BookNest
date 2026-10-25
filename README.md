# 📚 BookNest – Online Book Marketplace

BookNest is a full-stack web application that provides a convenient platform for users to explore books, manage their wishlist and shopping cart, place orders, and manage their personal reading shelf. It also includes seller and admin dashboards for book and marketplace management.

## 🚀 Features

### 👤 User Authentication & Profile
- User signup and login
- User profile management
- Logout functionality

### 📖 Book Browsing
- Browse available books
- View individual book details
- Recently viewed books
- Compare books

### 🛒 Shopping Cart & Wishlist
- Add books to the cart
- Update and manage cart items
- Add or remove books from the wishlist

### 📦 Orders & Checkout
- Checkout and place orders
- Select Cash on Delivery or Online Demo Payment
- View order history
- Cancel eligible orders

**Note:** Online payment is currently a demo feature. No real payment or money transfer is processed.

### 📚 Reading Shelf
- Organize books in a personal reading shelf

### 🏪 Seller Dashboard
- Manage books and seller-related information

### 🛡️ Admin Dashboard
- Admin interface for marketplace management

## 🛠️ Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

**Authentication**
- JSON Web Tokens (JWT)

## 📁 Project Structure

```text
BookNest/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

*The exact structure may vary depending on the files in your project.*

## ⚙️ Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd BookNest
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository URL.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use your actual environment variable names from the backend code.

Start the backend using the script configured in `backend/package.json`, for example:

```bash
npm start
```

### 3. Set Up the Frontend

Open another terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔗 API Overview

The backend API base URL during local development is:

```text
http://localhost:5000/api
```

The application includes API functionality for:
- User authentication and profiles
- Books
- Cart and wishlist
- Orders and order cancellation
- Seller and admin operations

The exact endpoints depend on the backend routes implemented in the project.

## 🔐 Security Notes

- Environment variables and database credentials should not be committed to GitHub.
- The `.env` file is excluded using `.gitignore`.
- Never publish passwords, API keys, or JWT secrets in source code.

## 🎯 Project Objective

The objective of BookNest is to provide a user-friendly online marketplace for discovering books, organizing reading interests, and managing purchases through a full-stack web application.

## 🔮 Future Enhancements

- Integration with a real payment gateway
- Book reviews and ratings
- Advanced search and filtering
- Email notifications for order updates
- Enhanced seller analytics

## 👩‍💻 Project Type

Full-Stack Web Application — MERN Stack

**MERN:** MongoDB, Express.js, React.js, and Node.js.
