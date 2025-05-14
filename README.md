# 🏨 Hotel Management System Backend

A powerful and scalable backend built with **Node.js**, **Express.js**, and **MongoDB** to support a feature-rich **Hotel Management System**. This server handles hotel listings, user sessions, booking management, virtual tours, contact forms, and much more—all through RESTful APIs and dynamic EJS views.

---

## 📌 Features

- 🔐 **User Authentication** (Register, Login, Logout, Session Management)
- 🏨 **Hotel Listings** with locations, rooms, pricing, amenities, and descriptions
- 🧾 **Booking System** with support for room selection, check-in/check-out, and cancellations
- 📋 **Contact Form API** for inquiries and support
- 🧭 **Virtual Tours**, Dining, Spa, Events, and Sustainability pages
- 📊 **User Dashboard & Portfolio** with recent activities
- 🌐 **Dynamic Frontend Rendering** using EJS templates
- 📈 **Rate Limiting** and **Session Handling** for security and stability
- 📥 **MongoDB Integration** for persistent data storage

---

## 🛠️ Tech Stack

| Technology     | Description                                  |
|----------------|----------------------------------------------|
| Node.js        | JavaScript runtime for backend logic         |
| Express.js     | Web framework for routing and middleware     |
| MongoDB        | NoSQL database for storing users & bookings  |
| Mongoose       | ODM for modeling MongoDB data                |
| EJS            | Templating engine for server-rendered views  |
| express-session| Session management using cookies             |
| JWT            | JSON Web Token for secure data transmission  |
| body-parser    | Middleware for parsing incoming requests     |
| dotenv         | Manage environment variables securely        |
| express-rate-limit | Rate limiting middleware to prevent abuse|

---

## 🧱 Project Structure

```

hotel-management-system-backend/
├── server.js                # Main entry point and route definitions
├── public/                  # Static assets and EJS views
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection logic
│   ├── models/
│   │   ├── user.js          # Mongoose user schema
│   │   ├── booking.js       # Mongoose booking schema
│   │   └── contact.js       # Contact form schema

````

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud via MongoDB Atlas)

### Installation

```bash
git clone https://github.com/your-username/hotel-management-system-backend.git
cd hotel-management-system-backend
npm install
````

### Environment Setup

Create a `.env` file in the root directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hotel_hub
SECRET_KEY=your-secret-key
NODE_ENV=development
```

### Run the Server

```bash
npm start
```

Server will start at: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login existing user    |
| POST   | `/api/auth/logout`   | Logout current user    |
| GET    | `/api/auth/validate` | Validate session token |

### 🏨 Hotel & Room Management

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/hotels`           | View all hotels            |
| GET    | `/hotel/:id`        | View hotel details by ID   |
| POST   | `/api/search-rooms` | Search for available rooms |

### 📅 Booking

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| POST   | `/api/bookings`            | Create a new booking      |
| GET    | `/api/bookings`            | Get user bookings         |
| POST   | `/api/bookings/:id/cancel` | Cancel a specific booking |

### 📇 User & Contact

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/user/profile` | Get logged-in user's profile |
| POST   | `/api/contact`      | Submit a contact form        |

---

## 📷 Virtual Pages (EJS)

| Path              | Description                       |
| ----------------- | --------------------------------- |
| `/home`           | Home page with hero slider        |
| `/about`          | About the company                 |
| `/contact`        | Contact form with FAQs            |
| `/dashboard`      | Logged-in user dashboard          |
| `/portfolio`      | User’s booked hotels and rooms    |
| `/rooms`          | Explore room types                |
| `/virtual-tours`  | View virtual tours of rooms       |
| `/spa`            | Explore spa treatments            |
| `/dining`         | View dining venues                |
| `/events`         | Venue booking for events          |
| `/sustainability` | View hotel sustainability efforts |

---

## ✅ To-Do / Enhancements

* Password hashing (currently plain text)
* Admin panel for managing hotels and bookings
* Email notifications on bookings and cancellations
* Payment integration (Stripe, Razorpay)
* Role-based access control (RBAC)
* Unit and integration testing with Jest/Supertest

---

## 🙌 Credits

* [Unsplash](https://unsplash.com) for image assets
* [Express.js](https://expressjs.com)
* [MongoDB](https://www.mongodb.com)
* [EJS Templates](https://ejs.co)
