# Zestro 🛒⚡

![Project Status](https://img.shields.io/badge/status-completed-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Zestro** is a high-performance, full-stack grocery delivery application built specifically to emulate the core functionalities of industry leaders like Blinkit and Swiggy Instamart. 

Developed exclusively with **Next.js** and **TypeScript**, Zestro delivers a seamless, end-to-end quick-commerce experience across three distinct user roles: Customers, Admins, and Delivery Personnel. It features real-time order tracking with live maps, secure online payments, AI-powered chat assistance, and dynamic analytics.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://zestro-zeta.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Video-Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](#)

## 🌟 Key Features

### 🛒 Customer Experience
* **Seamless Shopping**: Browse categories, view items via dynamic sliders, and manage a real-time shopping cart.
* **Secure Checkout**: Integrated with **Stripe** for safe and reliable online transactions.
* **Live Order Tracking**: Powered by **Leaflet**, allowing users to see their delivery progress on a live map.
* **Smart Chat Integration**: Real-time communication with the delivery person, featuring **Google Gemini AI** for smart response suggestions.

### 👑 Admin Capabilities
* **Centralized Dashboard**: View overarching metrics and graphical analytics built with **Recharts**.
* **Inventory Management**: Create, update, and delete grocery items. Media is handled efficiently via **Cloudinary**.
* **Order Oversight**: Monitor all incoming orders, manage statuses, and oversee the assignment of delivery personnel.

### 🛵 Delivery Partner Portal
* **Active Delivery Management**: View assigned tasks, track delivery routes, and update order statuses.
* **Real-time Notifications**: Instantly receive alerts for newly assigned deliveries.
* **Delivery Analytics**: Personal dashboard to track completed deliveries and performance metrics.

### ⚡ Technical Highlights
* **Real-Time Engine**: Built with a custom **Socket.io** server for instant chats and status updates.
* **Advanced Authentication**: Role-based access control with secure login/registration, plus OTP email verification powered by **Nodemailer**.
* **Fluid Animations**: Eye-pleasing, smooth UI transitions powered by **Framer Motion**.
* **Global State**: Efficient state management utilizing **Redux Toolkit**.

---

## 🛠️ Tech Stack

| Area | Technologies |
| :--- | :--- |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| **Backend & DB** | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white) |
| **Tools & APIs** | ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white) ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white) |

---

## 📸 Screenshots

A comprehensive look at the Zestro application workflow.

> **Note**: Images are referenced from the project's `screenshots` folder.

### **Authentication & Onboarding**

| Role Selection | Register | Login | OTP Verification |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/select-your-role.png" width="200" /> | <img src="screenshots/register-page.png" width="200" /> | <img src="screenshots/login-page.png" width="200" /> | <img src="screenshots/otp-verification-page.png" width="200" /> |

### **Customer Experience**

| Dashboard | Categories | Item View | Shopping Cart |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/user-dashboard.png" width="200" /> | <img src="screenshots/category-page.png" width="200" /> | <img src="screenshots/add-grocery-page.png" width="200" /> | <img src="screenshots/user-shopping-cart-page.png" width="200" /> |

| Checkout | Online Payment | Order Placed | Track Order (Map) |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/checkout-page.png" width="200" /> | <img src="screenshots/online-payment-page.png" width="200" /> | <img src="screenshots/order-placed-page.png" width="200" /> | <img src="screenshots/user-track-order-page.png" width="200" /> |

### **Real-time Interaction & History**

| My Orders | AI Chat (User & Driver) | Category Slider | Footer Design |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/user-my-orders-page.png" width="200" /> | <img src="screenshots/user-delivery-boy-chats.png" width="200" /> | <img src="screenshots/shop-by-category-slider.png" width="200" /> | <img src="screenshots/footer.png" width="200" /> |

### **Admin & Delivery Portals**

| Admin Dashboard | Manage Groceries | Delivery Dashboard | Active Delivery |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/admin-dashboard.png" width="200" /> | <img src="screenshots/admin-manage-groceries-page.png" width="200" /> | <img src="screenshots/delivery-boy-dashboard.png" width="200" /> | <img src="screenshots/delivery-boy-active-delivery-page.png" width="200" /> |

---

## ⚙️ Environment Variables

To run this project locally, you must set up environment variables for both the Next.js application and the Socket.io server.

> **⚠️ Security Warning:** Never commit your actual API keys to GitHub. Use `.env` files and add them to your `.gitignore`.

### 1. Client App (`my-app/.env`)

```env
# Database
MONGO_DB_URL=mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/zestro

# Authentication (NextAuth / JWT)
AUTH_SECRET=your_generated_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (Media Storage)
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# URLs
NEXTJS_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Google Gemini AI (Smart Chat)
GEMINI_API_KEY=your_gemini_api_key

# Nodemailer (OTP Emails)
USER_EMAIL=your_email@gmail.com
USER_PASSWORD=your_app_specific_password
```
### 2. Socket Server (`socket-io-server/.env`)

```env
NEXTJS_URL=http://localhost:3000
PORT=5000
```

---

## 🚀 Getting Started

Follow these instructions to get the Zestro project up and running on your local machine. 

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **MongoDB** (Atlas or local)
* Accounts for **Stripe**, **Cloudinary**, and **Google Cloud Console** (for Gemini & OAuth).

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/Prajwal-dev-dsa/ZESTRO_NEXTJS.git](https://github.com/Prajwal-dev-dsa/ZESTRO_NEXTJS.git)
    cd ZESTRO_NEXTJS
    ```

2.  **Setup the Socket.io Server**
    ```bash
    cd socket-io-server
    npm install
    # Create your .env file here based on the variables above
    npm run dev
    ```
    *The socket server should now be running on port 5000.*

3.  **Setup the Next.js Application**

    Open a new terminal window/tab:
    ```bash
    cd my-app
    npm install
    # Create your .env file here based on the variables above
    npm run dev
    ```
    *The Next.js app should now be accessible at http://localhost:3000.*

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📬 Contact

**Project Link:** https://github.com/Prajwal-dev-dsa/ZESTRO_NEXTJS

**Live Application:** [Zestro on Vercel](https://zestro-zeta.vercel.app/)
