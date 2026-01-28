# Aclique CLI

Aclique CLI is a **CLI-based AI application** powered by **Google Gemini**, featuring **secure device-flow authentication** and a full-stack backend setup.
It enables intelligent command-line interactions while handling authentication in a CLI-friendly way using GitHub OAuth.

---

## ✨ Features

* 🤖 AI-powered CLI using **Google Gemini**
* 🔐 Secure **login & logout** using device authorization flow
* 🔑 Token-based session management (stored locally)
* 🌐 GitHub OAuth integration via **BetterAuth**
* 🧠 End-to-end authentication system (CLI + Backend + Frontend)
* 🗄️ Persistent storage using **PostgreSQL (NeonDB)**

---

## 🛠️ Tech Stack

### CLI

* Node.js
* Google Gemini API

### Authentication

* BetterAuth (Device Flow)
* GitHub OAuth

### Backend

* Prisma ORM
* PostgreSQL (NeonDB)

### Frontend

* Next.js (Device Authorization UI)

---

## 🔄 Authentication Flow (High-Level)

1. User runs `login` from the CLI
2. CLI initiates **device authorization flow**
3. User authenticates via **GitHub OAuth** in the browser
4. Backend validates and issues a session token
5. Token is stored locally in a file
6. CLI uses the token for authenticated requests
7. `logout` deletes the stored token and ends the session

This approach allows secure authentication **without embedding a browser inside the CLI**.

---

## 📦 Installation

```bash
git clone https://github.com/AnshBhardwaj-98/aclique-cli.git
cd aclique-cli
npm install
```

---

## 🚀 Usage

### Login

```bash
aclique login
```

* Generates a device code
* Opens browser for GitHub authentication
* Saves session token locally

### Logout

```bash
aclique logout
```

* Deletes the locally stored token

### User info

```bash
aclique my_info
```
* Shows the user info

### Chat with AI

```bash
aclique init
select chat feature
```
* Chat with AI

---
## 📸 CLI Showcase

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/f4854dab-0ae4-44a9-9c31-a200f2381e08" />


### 🔐 Login via Device Flow
#### run login command
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/8a82660d-a026-4672-9e68-249a64cf458c" />

#### authorize the request
<img width="1919" height="963" alt="image" src="https://github.com/user-attachments/assets/8fdd5380-fb32-433c-9ade-0d030039a6dd" />
<img width="1918" height="961" alt="image" src="https://github.com/user-attachments/assets/e8a2d567-20b9-4ce4-a21e-84604ac06759" />

#### Login successful
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ec288ee0-1c53-44e6-b703-b1dbc079eed0" />

### 🤖 AI Interaction using Google Gemini
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/c5aefc41-87f3-4f63-b930-eb9aa08393b8" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/e3e67ca1-cba4-4958-b309-3203d4c99cbf" />

### 🚪 Logout
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/6040b7e3-9717-4330-a60d-039c5ed1f488" />


---

## 🌐 Frontend Showcase (Device Authorization UI)

### Home Page

<img width="2400" height="1750" alt="localhost_3000_(hd display) (1)" src="https://github.com/user-attachments/assets/ffceb4c3-e579-4ae8-bdea-47a105141c28" />

### Device Authorization Page

<img width="1919" height="963" alt="image" src="https://github.com/user-attachments/assets/8fdd5380-fb32-433c-9ade-0d030039a6dd" />
<img width="1918" height="961" alt="image" src="https://github.com/user-attachments/assets/e8a2d567-20b9-4ce4-a21e-84604ac06759" />

### Authentication Success

<img width="2400" height="1350" alt="localhost_3000_(hd display) (2)" src="https://github.com/user-attachments/assets/89c77677-712a-4c62-b543-09c3a5c3ea41" />

---
## ❓ Why Device Flow?

CLI applications cannot securely handle browser-based authentication.

Device flow:

* Keeps credentials out of the terminal
* Uses trusted OAuth providers
* Works well over SSH and remote environments

---

## 🔮 Future Improvements

* Agentic AI
* InEditor File manipulation
* Tool Calling

---

## 👤 Author

**Divyansh / Ansh Bhardwaj**

GitHub: [https://github.com/AnshBhardwaj-98](https://github.com/AnshBhardwaj-98)


