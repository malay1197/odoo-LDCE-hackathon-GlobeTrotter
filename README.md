# 🧳 GlobeTrotter — Intelligent Multi-City Travel Planning Workspace

> **Odoo LDCE Hackathon Build** | Production-Quality 2D Travel Workspace

GlobeTrotter is an end-to-end personalized travel planner designed for multi-city journeys across India. It empowers travelers to organize destinations, assign activities, manage real-time budgets in ₹ INR with daily average analytics, generate itineraries via AI, and share journey plans.

---

## 🌟 Key Features

### 1. 🔐 Complete Authentication Engine
- **Login & Signup**: Validation, SHA-256 password hashing, protected routes, and session JWT persistence.
- **Forgot Password**: Password reset request modal flow.
- **Pre-configured Demo Credentials**:
  - Email: `malay@globetrotter.io`
  - Password: `password123`

### 2. 📊 Travel Command Center Dashboard
- Personalized greeting ("Good morning, Malay 👋").
- Quick destination search bar across 50+ indexed Indian cities.
- Featured journey highlight, recent trips, recommended destinations, and budget progress summary.

### 3. 🗺️ Multi-City Itinerary Builder & Visualization
- **Create Trip**: Custom trip name, dates, description, cover photo, target budget (₹ INR), travel style, and interests.
- **Day-Wise Builder**: Add destination stops (Udaipur, Jaipur, Goa, Kutch, Munnar, Rishikesh, etc.), assign activities, reorder cities, and set departure/arrival dates.
- **Visualization Modes**: Switch seamlessly between **List View**, **Timeline Mode**, and **Calendar Grid**.

### 4. 📍 Destination & Activity Discovery
- **City Search**: Filter by Region (North-West, West Coast, South, Himalayas, West) and Cost Index (Budget ₹, Moderate ₹₹, Premium ₹₹₹). View recommended duration, best season, and popularity ratings.
- **Activity Catalog**: Filter by category (Sightseeing, Cultural, Adventure), cost, duration, and high-res preview images.

### 5. 💰 Real-Time ₹ INR Budget Analytics & Alerts
- Real-time calculated costs for **Transport**, **Stay**, **Activities**, **Meals**, and **Miscellaneous**.
- Indian numbering currency formatting (e.g., `₹1,500`, `₹12,500`, `₹1,25,000`).
- Daily average spend calculation (`Total Cost / Total Days`).
- **Over-Budget Warnings**: Overage alerts with instant budget optimization suggestions.
- Interactive **Chart.js Doughnut Chart** showing cost distribution by category.

### 6. 🔗 Public Share & Copy Trip Engine
- Generates unique shareable read-only public URL (`#share/:id`).
- One-click **"Copy Trip"** feature that clones the shared itinerary into the logged-in user's library as a customizable copy.
- Direct social sharing buttons for WhatsApp and Twitter.

### 7. 🤖 Phase 3 AI Suite & Travel Tools
- **AI Trip Planner**: Generates full multi-city itineraries, stop dates, activities, and budget estimates from natural language prompts.
- **AI Travel Copilot**: Interactive assistant supporting prompts like *"Make my trip cheaper"*, *"Add food activities"*, *"Keep budget under ₹25,000"*.
- **Trip Optimizer**: Calculates "Before vs After" savings with one-click budget optimization.
- **Trip Health Score**: 0-100 feasibility score analyzing budget margins, activity density, and route logistics.
- **Group Expense Split**: Multi-traveler per-person cost calculator.
- **Smart Packing Assistant**: Auto-generated checklist customized for Indian travel.
- **Travel Memories**: Post-trip memory scrapbook.

---

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5, JavaScript (ES Modules, modern modular component architecture)
- **Styling**: Vanilla CSS3 Custom Design System (Warm Ivory `#FAF7F2`, Saffron/Coral `#FF5A36`, Peacock Blue `#007791`, Royal Purple `#6B21A8`, Indian Green `#15803D`)
- **Database**: Relational Database Engine (IndexedDB + LocalStorage sync) with 13 relational tables
- **Visualizations**: Chart.js
- **Server**: PowerShell HTTP Server script (`server.ps1`)

---

## 🚀 Quick Start Instructions

1. **Clone Repository**:
   ```bash
   git clone https://github.com/malay1197/odoo-LDCE-hackathon-GlobeTrotter.git
   cd odoo-LDCE-hackathon-GlobeTrotter
   ```

2. **Launch Local Web Server**:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File server.ps1
   ```

3. **Open Application**:
   Navigate to `http://localhost:8080/` in any modern browser.

<!-- Last verified update: 2026-08-22 12:33:55 by Malay Patel -->

<!-- Last verified update: 2026-08-22 15:01:32 by VedantGadewar04 -->

<!-- Feature patch update: 2026-08-22 13:12:45 +0530 by bharatsingh -->

<!-- Feature patch update: 2026-08-22 14:18:30 +0530 by Malay Patel -->

<!-- Last verified update: 2026-08-22 15:29:03 by Malay Patel -->
