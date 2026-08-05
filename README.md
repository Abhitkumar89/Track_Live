# 📍 Liv Tracker — Real-Time GPS Tracking

A real-time multi-user location tracking app. Users share their live GPS position over WebSockets and appear as named markers on a shared map.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-GeoJSON-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Sessions-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=openstreetmap&logoColor=white)

---

## ✨ Features

- **Live multi-user tracking** — see everyone connected on one map
- **Browser geolocation** — continuous GPS updates via `watchPosition`
- **Socket.IO realtime sync** — location broadcasts with near-zero delay
- **MongoDB history** — every ping stored as GeoJSON with a `2dsphere` index
- **Redis live sessions** — online user state cached in memory; cleared on disconnect
- **Zero map API keys** — Leaflet + OpenStreetMap (no Google Maps billing)

---

## 🧠 How it works

```text
Browser GPS
    │
    ▼
Socket.IO  ──►  MongoDB (location history + GeoJSON)
    │
    ├──►  Redis (live session: user:<socketId>)
    │
    └──►  Broadcast to all clients → Leaflet markers update
```

| Layer | Role |
| --- | --- |
| **Socket.IO** | Real-time send / receive of GPS updates |
| **MongoDB** | Permanent trail of locations (`Point` + `2dsphere`) |
| **Redis** | Who is online *right now* (fast SET / DEL) |
| **Leaflet** | Map UI and markers |

---

## 🛠️ Tech stack

| Area | Tech |
| --- | --- |
| Backend | Node.js, Express |
| Realtime | Socket.IO |
| Database | MongoDB + Mongoose (GeoJSON) |
| Cache / sessions | Redis (`ioredis`) |
| Frontend | EJS, Leaflet, OpenStreetMap |
| Config | `dotenv` |

---

## 🚀 Quick start

### Prerequisites

- **Node.js** 18+
- **MongoDB** running locally **or** a MongoDB Atlas URI

Redis is optional — if `REDIS_URL` is not set, the app starts a built-in local Redis for development.

### 1. Clone the repo

```bash
git clone https://github.com/Abhitkumar89/Track_Live.git
cd Track_Live
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/liv-tracker

# Optional — leave empty to use built-in Redis
# REDIS_URL=redis://127.0.0.1:6379
```

### 4. Run the app

```bash
npm start
```

Open **[http://localhost:3000](http://localhost:3000)**  
Enter your name → allow location access → you appear on the map.

Open the same URL in another browser / device to see multiple live markers.

---

## 📁 Project structure

```text
├── app.js                 # Express + Socket.IO server
├── config/
│   ├── db.js              # MongoDB connection
│   └── redis.js           # Redis connection (or memory fallback)
├── models/
│   └── Location.js        # GeoJSON location schema + 2dsphere index
├── views/
│   └── index.ejs          # Map page
├── public/
│   ├── css/style.css
│   └── js/script.js       # Geolocation + Leaflet + Socket.IO client
├── .env.example
├── .gitignore
└── package.json
```

---

## 🔐 Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `PORT` | No | Server port (default `3000`) |
| `REDIS_URL` | No | Redis URL; if omitted, uses built-in local Redis |

---

## 📸 Demo tips

1. Allow location permission when prompted  
2. Use two windows (or phone + laptop) on the same server URL  
3. Move / refresh GPS — markers should update live  
4. Check MongoDB (`liv-tracker` → `locations`) for saved history  

---

## 📝 License

MIT
