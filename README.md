# FixIt Rwanda

A local, bilingual home-services marketplace for Kigali. Customers find a professional and send a job request. Professionals respond with a quote in Rwandan francs. Customers can accept the quote. Administrators can review activity and hide or restore public profiles.

## 1. Start it on your Surface Laptop 7

Open this folder in File Explorer. Type `powershell` in the address bar and press Enter. Run:

```powershell
node --version
node server.js --demo
```

Use Node.js 24 or newer. If PowerShell cannot find Node, install the **Windows ARM64** Node.js 24 LTS installer from [nodejs.org](https://nodejs.org/en/download), then reopen PowerShell. No package installation is needed for this project.

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in Edge. Keep PowerShell open while using the site. Press **Ctrl+C** there to stop it. If port 3000 is already in use, run `$env:FIXIT_PORT = '3001'` before restarting and open [http://127.0.0.1:3001](http://127.0.0.1:3001).

## 2. Try the full workflow

Use the password **FixIt-Demo-24** for each demo account.

1. Sign in as **customer@example.test**. Choose **Find a pro**, pick **Plumbing** and **Gasabo**, open **Mugisha Home Plumbing**, and request a quote for a test repair.
2. Sign out and sign in as **plumbing@example.test**. Open the incoming request and send a quote, such as **15000 RWF**, with a short description of the work included.
3. Sign in as the customer again. Open **Dashboard** and accept the quote.
4. Sign in as **admin@example.test**. Check the request and hide a demo profile. Return to search to check visibility. Restore the profile from the admin dashboard.
5. Switch to **Kinyarwanda**, then try **Join as a professional** to create a test account and list a service. The language switch translates the interface. Names and text entered by users stay in their original language.

The demo command adds fictional profiles and local accounts to `data/fixit.sqlite`. Restarting keeps your test work. Each request goes to one professional and can receive one quote. The first release covers Gasabo, Kicukiro, and Nyarugenge.

## 3. Make your first code change

1. Open `public/app.js` in a text editor. Find `heroEnd` and edit the English and Kinyarwanda versions.
2. Save and refresh Edge. The headline should change in both languages.
3. Open `public/styles.css` and change `--lime` near the top to try a different accent color. Save and refresh.
4. Follow the request through the code. The form in `public/app.js` submits to `POST /api/jobs` in `server.js`. The server checks the signed-in role, saves the request in SQLite, and shows it on the professional’s dashboard.

This build serves your own computer. The sample credentials and data are intended for local practice.

## Run online with Render

1. Put the project source in a private GitHub repository. Leave the local `data/` directory out of the repository. It contains demo accounts, job records, and sessions.
2. In Render, connect the GitHub repository and create a **Blueprint** using `render.yaml`. Review the paid service and disk charges before launching.
3. Enter your admin email and a new password of at least 16 characters into Render’s environment settings. The app reads these values to create the first administrator. Keep them out of the repository and chat.
4. After deployment, open the HTTPS URL shown in Render. Sign in as admin, then create fresh customer and professional accounts to verify a request and quote. The hosted database lives on the attached disk and starts empty apart from the administrator.
5. On another laptop, open the same private GitHub repository in Codex. Ask for a change and merge the update into the deployed branch to trigger a redeploy.

The Blueprint is a single-instance pilot. Render can briefly interrupt the service during redeploys because the instance uses a persistent disk.
