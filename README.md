<div align="center">

# ✂️ Salon Appointment Booking System

<img src="https://img.shields.io/badge/PHP-8.0+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white" alt="XAMPP">

<br/>
<br/>

**A full-stack, multi-role web application that digitises salon appointment management — eliminating double-bookings, removing phone-call dependency, and giving every stakeholder real-time visibility into bookings.**

<br/>

[🚀 Live Demo](#) &nbsp;·&nbsp; [📋 Project Report](./Salon_Project_Report.pdf) &nbsp;·&nbsp; [🐛 Report a Bug](../../issues) &nbsp;·&nbsp; [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

---

## 🎯 About the Project

Traditional salons and barbershops manage bookings through phone calls, walk-ins, or paper notebooks. This leads to:

- 📅 **Double-bookings** — No centralised conflict check
- 📞 **Zero transparency** — Customers must call to know their status
- 📝 **Manual overhead** — Owners record every booking by hand
- 📊 **No overview** — No way to see all bookings at a glance

**The Salon Booking System** solves all of this with a clean, browser-based platform where three distinct user roles — **Customer**, **Salon Owner**, and **Admin** — each get a purpose-built dashboard backed by a secure PHP REST-like API and a normalised MySQL database.

---

## ✨ Key Features

### 👤 Customer
| Feature | Description |
|---|---|
| 🔐 Register & Login | Secure account creation with bcrypt-hashed passwords |
| 🔍 Search Salons | Live keyword filter by salon name or location |
| 📅 Book Appointments | Pick service, barber, date & available time slot |
| ⏱️ Real-Time Slots | Available/Booked slots updated dynamically — no double-booking possible |
| 📋 My Bookings | Full appointment history with status badges |
| ❌ Cancel Anytime | One-click cancellation for pending appointments |
| ⭐ Rate Salons | Star rating (1–5) with live average recalculation |

### 💇 Salon Owner
| Feature | Description |
|---|---|
| 🏪 Salon Profile | Create/update salon name and location |
| 💅 Manage Services | Add/delete services with prices |
| ✂️ Manage Barbers | Add/delete barber roster |
| 📊 Dashboard Stats | Total appointments, services, and barbers at a glance |
| ✅ Appointment Control | Accept, Reject, or mark Complete for every booking |

### 🔐 Admin
| Feature | Description |
|---|---|
| 👥 User Management | List and delete all customer and salon accounts |
| 🏪 Salon Management | List and delete any salon with cascaded cleanup |
| 📅 Appointment Oversight | Full platform-wide appointment view and delete |
| 📈 Platform Stats | Live counters for total users, salons, and appointments |
| 🔑 Secret-Key Login | Extra access code required for admin authentication |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla) | Page structure and styling |
| **JavaScript** | ES2020 (Vanilla) | DOM manipulation, fetch API calls |
| **Backend** | PHP 8.0+ | Action-router API, session management |
| **Database** | MySQL 8 / MariaDB | Relational data, foreign key constraints |
| **ORM / DB Driver** | PDO | Prepared statements, SQL injection prevention |
| **Local Server** | XAMPP (Apache + MySQL) | Development environment |
| **Password Hashing** | PHP `password_hash()` | bcrypt algorithm |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  HTML Pages  +  assets/css/*.css  +  assets/js/api.js       │
│  Page-specific JS (book.js, admin.js, salon.js, etc.)        │
└──────────────────────┬──────────────────────────────────────┘
                       │  HTTP POST (JSON body)
                       │  credentials: 'same-origin' (session cookie)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                PHP API Layer (Apache/XAMPP)                  │
│                                                              │
│   api/auth.php         ← register, login, admin_login, me   │
│   api/salons.php       ← get_all, get_mine, save_profile     │
│   api/services.php     ← get, add, delete                    │
│   api/barbers.php      ← get, add, delete                    │
│   api/appointments.php ← book, cancel, update_status, rate  │
│   api/admin.php        ← stats, users, salons, appointments  │
│                                                              │
│   config/db.php        ← PDO connection + session + CORS    │
└──────────────────────┬──────────────────────────────────────┘
                       │  PDO prepared statements
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 MySQL Database (salon_db)                     │
│                                                              │
│   users  ──< salons ──< services                            │
│                    └──< barbers                              │
│                    └──< appointments >── users               │
│                    └──< reviews      >── users               │
└─────────────────────────────────────────────────────────────┘
```

**Request Flow:**
1. Every page loads `api.js` (global fetch wrapper + auth guard)
2. `guardPage(role)` validates the PHP session — redirects if unauthorized
3. Page JS calls `API.post(endpoint, {action, ...data})`
4. PHP dispatches via `switch($action)` and responds with `{ok: bool, ...payload}`
5. JS updates the DOM based on the response

---

## 🗄️ Database Schema

```sql
salon_db
├── users          (id, name, email, password, role, created_at)
├── salons         (id, owner_id→users, salon_name, location, rating)
├── services       (id, salon_id→salons, name, price)
├── barbers        (id, salon_id→salons, name)
├── appointments   (id, customer_id→users, salon_id→salons,
│                   service_id→services, barber_id→barbers,
│                   appt_date, appt_time, status, created_at)
└── reviews        (id, salon_id→salons, customer_id→users,
                    rating, created_at)  [UNIQUE: salon+customer]
```

> **All foreign keys use `ON DELETE CASCADE`** — deleting a user or salon automatically removes all child records.

### Entity Relationships

```
users ──────< salons ──────< services
  │               │
  │               └─────< barbers
  │               │
  └──< appointments >────┘
  │         (also references services and barbers)
  │
  └──< reviews >── salons
```

**Normalization:** The schema is in **3NF (Third Normal Form)**. The `rating` field on `salons` is a deliberate summary cache, recalculated on every `rate` action from the `reviews` table.

---

## 📡 API Reference

All endpoints receive a JSON body `{action: "...", ...params}` via HTTP POST.
All responses return `{ok: true|false, ...payload}`.

### Authentication — `api/auth.php`

| Action | Auth Required | Description |
|---|---|---|
| `register` | ❌ | Create customer or salon account |
| `login` | ❌ | Authenticate as customer or salon owner |
| `admin_login` | ❌ | Admin login with email + password + `secret` key |
| `logout` | ✅ | Destroy PHP session |
| `me` | ✅ | Return current session user (used by `guardPage`) |

### Salons — `api/salons.php`

| Action | Auth Required | Description |
|---|---|---|
| `get_all` | ✅ Customer | All salons with nested services and barbers |
| `get_mine` | ✅ Salon | Owner's own salon profile |
| `save_profile` | ✅ Salon | Create or update salon (UPSERT) |
| `stats` | ✅ Salon | Appointment/service/barber counts |
| `customer_stats` | ✅ Customer | Global salon and barber counts |
| `delete` | ✅ Admin | Delete a salon (cascade) |

### Services — `api/services.php`

| Action | Auth Required | Description |
|---|---|---|
| `get` | ✅ Salon | List owner's services |
| `add` | ✅ Salon | Add service (name + price > 0) |
| `delete` | ✅ Salon | Delete (scoped to owner's salon) |

### Barbers — `api/barbers.php`

| Action | Auth Required | Description |
|---|---|---|
| `get` | ✅ Salon | List owner's barbers |
| `add` | ✅ Salon | Add barber |
| `delete` | ✅ Salon | Delete (scoped to owner's salon) |

### Appointments — `api/appointments.php`

| Action | Auth Required | Description |
|---|---|---|
| `book` | ✅ Customer | Book a slot (conflict-checks first) |
| `get_mine` | ✅ Customer | All customer's own appointments |
| `cancel` | ✅ Customer | Cancel own appointment |
| `get_salon` | ✅ Salon | All appointments for the salon |
| `update_status` | ✅ Salon | Accept / Reject / Complete |
| `get_slots` | ✅ Any | Available slots for barber+date |
| `get_all` | ✅ Admin | All platform appointments |
| `delete` | ✅ Admin | Hard delete appointment |
| `rate` | ✅ Customer | Rate salon 1-5 (UPSERT) |

### Admin — `api/admin.php`

| Action | Description |
|---|---|
| `stats` | Platform-wide counts |
| `get_users` / `delete_user` | User management |
| `get_salons` / `delete_salon` | Salon management |
| `get_appointments` / `delete_appointment` | Appointment management |

---

## 🔐 Role-Based Access Control

RBAC is enforced at **two independent layers**:

### Layer 1 — Frontend Guard (UX Protection)

Every protected page starts with:

```javascript
// api.js — guardPage() checks the session before page logic runs
async function guardPage(role) {
    const res = await API.post(API.auth, { action: 'me' });
    if (!res.ok || !res.user || res.user.role !== role) {
        alert('Please login first!');
        location.href = BASE + 'index.html';
        return null;
    }
    return res.user;
}

// Usage on each page:
guardPage('customer').then(user => { /* customer-only logic */ });
guardPage('salon').then(user => {   /* salon-only logic    */ });
guardPage('admin').then(user => {   /* admin-only logic    */ });
```

### Layer 2 — Backend Enforcement (Security Layer)

```php
// admin.php — entire file blocked for non-admins
if (($_SESSION['role'] ?? '') !== 'admin') {
    echo json_encode(['ok' => false, 'msg' => 'Forbidden']); exit;
}

// appointments.php — action-level role check
case 'get_all':
    if ($role !== 'admin') {
        echo json_encode(['ok' => false, 'msg' => 'Forbidden']); exit;
    }

// barbers/services.php — data scoped to owner's salon
$sid = getSid($pdo, $uid); // SELECT id FROM salons WHERE owner_id = ?
$pdo->prepare("DELETE FROM barbers WHERE id=? AND salon_id=?")
    ->execute([$id, $sid]);
```

> ⚠️ The backend is the **authoritative security layer**. Frontend guards are UX conveniences only. Even direct HTTP POST attacks to any endpoint return `Forbidden` without a valid session.

---

## 📁 Project Structure

```
salon_final/
│
├── 📄 index.html                   # Landing page — portal for all 3 roles
├── 📄 customer-login.html          # Customer authentication
├── 📄 customer-register.html       # Customer registration
├── 📄 customer.html                # Customer dashboard (stats overview)
├── 📄 book.html                    # Appointment booking page
├── 📄 my-appointments.html         # Customer's booking history
│
├── 📄 salon-login.html             # Salon owner authentication
├── 📄 salon-register.html          # Salon owner registration
├── 📄 salon.html                   # Salon dashboard (stats overview)
├── 📄 salon-profile.html           # Salon profile editor
├── 📄 manage-services.html         # Add/delete services
├── 📄 manage-barbers.html          # Add/delete barbers
├── 📄 salon-appointments.html      # Manage incoming bookings
│
├── 📄 admin-login.html             # Admin authentication (+ secret key)
├── 📄 admin.html                   # Admin control panel
│
├── 📄 database.sql                 # Database schema + seeded admin account
│
├── 📁 config/
│   └── 📄 db.php                   # PDO connection, CORS headers, session start
│
├── 📁 api/
│   ├── 📄 auth.php                 # register | login | admin_login | logout | me
│   ├── 📄 salons.php               # get_all | get_mine | save_profile | stats | delete
│   ├── 📄 services.php             # get | add | delete
│   ├── 📄 barbers.php              # get | add | delete
│   ├── 📄 appointments.php         # book | cancel | update_status | get_slots | rate
│   └── 📄 admin.php                # stats | users | salons | appointments
│
└── 📁 assets/
    ├── 📁 css/
    │   ├── 📄 shared.css           # Layout, sidebar, tables, buttons (all dashboards)
    │   ├── 📄 auth.css             # Login/register page styling
    │   ├── 📄 book.css             # Booking page specific styles
    │   ├── 📄 admin.css            # Admin panel styles
    │   └── 📄 index.css            # Landing page styles
    │
    └── 📁 js/
        ├── 📄 api.js               # ★ GLOBAL: fetch wrapper, guardPage, logout, showMsg
        ├── 📄 admin-login.js       # Admin login handler
        ├── 📄 admin.js             # Admin dashboard (users, salons, appointments)
        ├── 📄 book.js              # Salon search, slot loading, booking, rating
        ├── 📄 customer-login.js    # Customer login handler
        ├── 📄 customer-register.js # Customer registration handler
        ├── 📄 customer.js          # Customer dashboard stats
        ├── 📄 manage-barbers.js    # Barber CRUD
        ├── 📄 manage-services.js   # Service CRUD
        ├── 📄 my-appointments.js   # Customer booking list + cancel
        ├── 📄 salon-appointments.js# Salon booking management
        ├── 📄 salon-login.js       # Salon login handler
        ├── 📄 salon-profile.js     # Salon profile save/load
        ├── 📄 salon-register.js    # Salon registration handler
        └── 📄 salon.js             # Salon dashboard stats
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **XAMPP** v8.0+ installed — [Download here](https://www.apachefriends.org/)
  - Apache module enabled ✅
  - MySQL module enabled ✅
- **Modern web browser** (Chrome, Firefox, Edge, or Safari)
- **Git** (optional, for cloning)

### Installation

#### Step 1 — Clone or Download the Project

```bash
# Option A: Clone via Git
git clone https://github.com/YOUR_USERNAME/salon_final.git

# Option B: Download ZIP and extract
```

#### Step 2 — Place in XAMPP Web Root

```bash
# Windows
C:\xampp\htdocs\salon_final\

# Linux / macOS
/opt/lampp/htdocs/salon_final/
```

#### Step 3 — Start XAMPP Services

Open the **XAMPP Control Panel** and start:
- ✅ **Apache**
- ✅ **MySQL**

#### Step 4 — Create the Database

Open your browser and go to **phpMyAdmin**:

```
http://localhost/phpmyadmin
```

Then run the SQL file:

```
phpMyAdmin → Import → Choose File → select database.sql → Click Go
```

**Or** run it directly in the MySQL console:

```sql
SOURCE C:/xampp/htdocs/salon_final/database.sql;
```

This creates `salon_db` with all 6 tables and seeds the default admin account.

#### Step 5 — (Optional) Configure Database Password

If your MySQL root account has a password, open `config/db.php` and update line 16:

```php
$pdo = new PDO(
    "mysql:host=localhost;dbname=salon_db;charset=utf8mb4",
    "root",     // ← your MySQL username
    "",         // ← your MySQL password (change this if needed)
    ...
);
```

#### Step 6 — Launch the App 🎉

```
http://localhost/salon_final/
```

---

## 📖 Usage Guide

### 🔑 Default Admin Credentials

The database seed includes a ready-to-use admin account:

| Field | Value |
|---|---|
| Email | `admin@salon.com` |
| Password | `admin123` |
| Secret Key | `salon@secure123` |

> ⚠️ **Change these credentials** immediately in a production environment.

---

### 👤 Customer Flow

```
Register → Login → Browse Salons → Select Salon
→ Pick Service + Barber + Date → Choose Free Slot
→ Book Appointment → Track Status → Cancel if needed
→ Rate the Salon
```

### 💇 Salon Owner Flow

```
Register → Login → Create Salon Profile
→ Add Services (name + price)
→ Add Barbers
→ View Incoming Appointments
→ Accept / Reject / Mark Complete
```

### 🔐 Admin Flow

```
Login (email + password + secret key)
→ View Platform Stats
→ Manage Users (view / delete)
→ Manage Salons (view / delete)
→ Manage Appointments (view / delete)
```

---

## 📸 Screenshots

> **Customer Dashboard**
> Stats showing total available salons, barbers on the platform, and personal appointment count.

> **Booking Page**
> Live salon search, dynamic booking form with service/barber selectors, real-time slot availability (available slots shown in green, booked slots disabled).

> **Salon Appointments**
> Table view of all incoming bookings with Accept / Reject / Done action buttons and colour-coded status badges.

> **Admin Dashboard**
> Glassmorphism admin panel with three management cards (Users, Salons, Appointments) and a real-time platform stats header.

---

## 🗺️ Roadmap

| Version | Feature | Status |
|---|---|---|
| v1.0 | Multi-role auth, booking, slot conflict check | ✅ Complete |
| v1.0 | Service & barber management | ✅ Complete |
| v1.0 | Status lifecycle + salon ratings | ✅ Complete |
| v1.0 | Admin control panel | ✅ Complete |
| v2.0 | 📧 Email/SMS booking notifications | 🔜 Planned |
| v2.0 | 💳 Online payment (Stripe integration) | 🔜 Planned |
| v2.0 | 🖼️ Salon profile image uploads | 🔜 Planned |
| v2.0 | 📊 Revenue & analytics charts (Chart.js) | 🔜 Planned |
| v2.0 | 🔔 Real-time push notifications | 🔜 Planned |
| v2.0 | 🏬 Multi-branch salon support | 🔜 Planned |
| v2.0 | 📱 Progressive Web App (PWA) | 🔜 Planned |
| v2.0 | 🎁 Customer loyalty points system | 🔜 Planned |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch

```bash
git checkout -b feature/your-feature-name
```

3. **Commit** your changes with a clear message

```bash
git commit -m "feat: add email notification on booking"
```

4. **Push** to your fork

```bash
git push origin feature/your-feature-name
```

5. Open a **Pull Request** — describe what you built and why

### Coding Standards

- Follow the existing action-router pattern in PHP API files
- Keep each page's JavaScript in its own file under `assets/js/`
- All SQL queries **must** use PDO prepared statements — no raw string interpolation
- Backend role checks are **mandatory** for any protected action

---

## 🔒 Security Notes

| Practice | Implementation |
|---|---|
| SQL Injection Prevention | PDO prepared statements with bound parameters on every query |
| Password Security | `password_hash()` with `PASSWORD_DEFAULT` (bcrypt) |
| Session Security | PHP native sessions with `session_start()` |
| CORS | Controlled headers in `config/db.php` |
| Admin Hardening | Secret access code as a second factor for admin login |
| Data Scoping | Every owner-level query scoped by `WHERE owner_id = $uid` |
| Cascade Integrity | `ON DELETE CASCADE` on all FK relationships |

> 🚨 **Production Warning:** Before deploying to a live server, replace the hardcoded admin secret key, use environment variables for credentials, enable HTTPS, and tighten CORS headers.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <b>[ Team Member 1 ]</b><br/>
      <sub>Project Manager / Full-Stack Developer</sub><br/>
      <sub>Student ID: XXXXXXX</sub>
    </td>
    <td align="center">
      <b>[ Team Member 2 ]</b><br/>
      <sub>Backend Developer / Database Admin</sub><br/>
      <sub>Student ID: XXXXXXX</sub>
    </td>
    <td align="center">
      <b>[ Team Member 3 ]</b><br/>
      <sub>Frontend Developer / UI Designer</sub><br/>
      <sub>Student ID: XXXXXXX</sub>
    </td>
  </tr>
</table>

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ as a Capstone Project &nbsp;|&nbsp; © 2026 Salon Booking System Team

</div>
