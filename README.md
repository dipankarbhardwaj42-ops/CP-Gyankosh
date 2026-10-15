# CP-Gyan Kosh (सी एंड पी ज्ञान कोष)
### NUPPL Contracts & Purchase Department Knowledge Repository

**NUPPL (Neyveli Uttar Pradesh Power Limited)** is a Joint Venture thermal power project of **NLCIL** (Neyveli Lignite Corporation India Limited) and **UPRVUNL** (Uttar Pradesh Rajya Vidyut Utpadan Nigam Limited) with an equity participation of **51:49**.

CP-Gyan Kosh serves as the central digital knowledge repository and circulars management system for both operating entities:
1. **GTPS (Ghatampur Thermal Power Station)** – 3x660 MW Supercritical Thermal Power Project, Kanpur Nagar, UP.
2. **PSOCP, Dumka (Pachwara South Open Cast Project)** – Captive coal mine block, Dumka, Jharkhand.

---

## 🌟 Key Features

- **Open Access for All Executives:** Anyone can explore circulars, search guidelines, inspect AI summaries, download documents, and consult the AI Chatbot without logging in.
- **Dedicated Admin ID (`admin@nuppl.in`):** C&P administrators can sign in to upload new PDF documents, create custom folders, and add new categories/subcategories.
- **Preset Master Categories:**
  1. *Purchase Manual*
  2. *Contracts Manual*
  3. *Delegation of Power (DoP)*
  4. *Vigilance Systemic Improvements* (with dedicated subcategory for *Replies submitted to Vigilance*)
  5. *Circulars* (Regarding Bank Guarantee, GeM, Make in India, and Other with custom category naming)
- **Drag-and-Drop PDF Upload with Progress Status:** Visual progress bar tracking uploading, metadata extraction, and indexing.
- **Fast-Upload with Deferred AI Summary:** Provision to speed up uploads by saving the document immediately and generating the AI summary in later time with one click.
- **Folder Organization System:** File hierarchy to structure circulars by financial year, plant packages, or statutory mandates.
- **AI-Powered Search & Gyan Kosh Chatbot:** Natural language assistant embedded directly into the search bar to query GeM limits, SFMS bank guarantee rules, and Vigilance replies.

---

## 🚀 How to Host This on GitHub (Step-by-Step Guide)

You can host **CP-Gyan Kosh** for free on **GitHub Pages** in just a few minutes.

### Step 1: Create a New Repository on GitHub
1. Log in to your GitHub account at [https://github.com](https://github.com).
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository (for example: `cp-gyan-kosh` or `CP-Gyan-Kosh`).
4. Choose **Public** (required for free GitHub Pages).
5. Leave "Initialize this repository with a README" **unchecked**.
6. Click **Create repository**.

---

### Step 2: Push Your Code to GitHub
Open your terminal in the project directory and run the following commands:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit your files
git commit -m "Initial commit of NUPPL CP-Gyan Kosh portal"

# 4. Set the main branch
git branch -M main

# 5. Link to your GitHub repository (replace with your actual GitHub username and repo name)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cp-gyan-kosh.git

# 6. Push the code
git push -u origin main
```

---

### Step 3: Enable GitHub Pages (Automated via GitHub Actions)
1. Go to your repository on GitHub.
2. Click on **Settings** (tab at the top).
3. In the left sidebar, click on **Pages** (under "Code and automation").
4. Under **Build and deployment > Source**, select:
   👉 **`GitHub Actions`** (instead of "Deploy from a branch").
5. The included workflow `.github/workflows/deploy.yml` will automatically build and publish your site!
6. Click on the **Actions** tab at the top of your repository to see the deployment running.
7. Once finished (usually ~1 minute), your site URL will be displayed:
   `https://YOUR_GITHUB_USERNAME.github.io/cp-gyan-kosh/`

---

## 💻 Running Locally

To run the project on your local computer:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Architecture & Dual-Mode Hosting

The application has been engineered to run seamlessly across all hosting environments:

| Mode | Environment | How AI & Summaries Work |
| :--- | :--- | :--- |
| **Static Mode** | GitHub Pages (`github.io`) | Uses the integrated in-browser C&P Procurement Knowledge Engine and client-side analyzer. No server required. |
| **Full-Stack Mode** | Local / Docker / Render / Cloud Run | Uses `server.ts` Express backend with `@google/genai` (Gemini 3.8 Flash) using `GEMINI_API_KEY`. |

If you ever wish to host with the full-stack Express server (with live backend Gemini API calls), you can deploy with 1 click to:
- **Render.com** (Web Service: Build command `npm install && npm run build`, Start command `node server.ts`)
- **Vercel** or **Railway**
- **Docker**: Run via standard Node 20 container on port 3000.

---

## 🔒 Default Admin Credentials

- **Admin ID:** `admin@nuppl.in`
- **Passcode:** `nuppl@admin` *(or use the "One-Click Sign In" button on the login modal)*

*Note: Document reading, search, and the AI chatbot require no login.*
