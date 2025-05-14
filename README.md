# 🏨 Hotel Management System Backend

A robust backend application built with **Node.js**, **Express.js**, and **MongoDB**, designed to manage hotel listings, bookings, and user interactions efficiently. This backend supports user authentication, hotel management, booking operations, and more.

---

## 🚀 Features

* ✅ **User Authentication** (Register/Login/Logout)
* 🏢 **Hotel Listings** (Create, Read, Update, Delete)
* 🛏️ **Booking System**
* 📬 **Contact Form Handling**
* 🎯 **EJS-based Server-Side Rendering**
* 🧱 **Modular MVC Architecture**
* 🔐 **Secure with Sessions & Rate Limiting**

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Templating**: EJS
* **Authentication**: express-session, bcrypt
* **Security**: Helmet, express-rate-limit

---

## 📁 Project Structure

```
hotels/
├── public/             # Static assets
├── src/
│   ├── controllers/    # Route logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # Express routes
│   └── views/          # EJS templates
├── .env
├── package.json
├── server.js
└── README.md
```

---

## 📦 API Endpoints

### 🔐 Authentication

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | `/register` | Register a new user |
| POST   | `/login`    | Login user          |
| GET    | `/logout`   | Logout user         |

---

### 🏨 Hotels

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/hotels`     | Get all hotel listings       |
| GET    | `/hotels/:id` | Get hotel by ID              |
| POST   | `/hotels`     | Add a new hotel (Admin only) |
| PUT    | `/hotels/:id` | Update hotel details (Admin) |
| DELETE | `/hotels/:id` | Delete a hotel (Admin)       |

---

### 📅 Bookings

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/bookings`     | Get all bookings (Admin only) |
| POST   | `/bookings`     | Book a room                   |
| GET    | `/bookings/:id` | Get booking by ID             |
| DELETE | `/bookings/:id` | Cancel a booking              |

---

### ✉️ Contact

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| POST   | `/contact` | Submit a contact request |

---

## 🚀 Getting Started

### Prerequisites

* Node.js & npm
* MongoDB running locally or via Atlas

### Setup

```bash
git clone https://github.com/kartikeya1911/hotels.git
cd hotels
npm install
cp .env.example .env  # Add your MongoDB URI and session secret
npm start
```

Server will run on `http://localhost:3000`.


## 📄 License

This project is licensed under the [MIT License](LICENSE).
