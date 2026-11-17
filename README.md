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

1. Choose **Find a pro**, pick **Plumbing** and **Gasabo**, and open **Mugisha Home Plumbing**. Send a test quote request with fictional contact and job details.
2. Sign in as **plumbing@example.test**. Open **Requests from guests** in the dashboard. You can see the customer's details and contact them directly.
3. Sign in as **admin@example.test**. Check the request and hide a demo profile. Return to search to check visibility, then restore the profile from the admin dashboard.
4. Switch to **Kinyarwanda**, then try **Join as a professional** to create a test account and list a service. The language switch translates the interface. Names and text entered by users stay in their original language.

The demo command adds fictional profiles and local accounts to `data/fixit.sqlite`. Restarting keeps your test work. Each request goes to one professional. Guest customers receive quotes directly from that professional. The first release covers Gasabo, Kicukiro, and Nyarugenge.

## 3. Make your first code change

1. Open `public/app.js` in a text editor. Find `heroEnd` and edit the English and Kinyarwanda versions.
2. Save and refresh Edge. The headline should change in both languages.
3. Open `public/styles.css` and change `--lime` near the top to try a different accent color. Save and refresh.
4. Follow the request through the code. The form in `public/app.js` submits to `POST /api/guest-requests` in `server.js`. The server checks the signed-in role, saves the request in SQLite, and shows it on the professional’s dashboard.

This build serves your own computer. The sample credentials and data are intended for local practice.

## Run online on Cloudflare Workers Free

Start with a Cloudflare account on the Workers Free plan. This deployment uses Workers for the website and API, and D1 for persistent records. The online database starts empty. The laptop demo continues using its own database and sample accounts.

1. In PowerShell in this folder, run `npx.cmd wrangler@latest login` and approve access in your browser. In the Cloudflare dashboard, set up your free `workers.dev` subdomain when prompted.
2. Run `npx.cmd wrangler@latest d1 create fixit-rwanda`. Copy the returned database ID into the existing D1 entry in `wrangler.jsonc` as the `database_id` property. Keep only one `DB` binding. If Wrangler already added the ID, keep that value.
3. Apply the schema and deploy:

   ```powershell
   npx.cmd wrangler@latest d1 migrations apply DB --remote
   npx.cmd wrangler@latest deploy
   ```

4. Open the printed HTTPS URL. Register your administrator account as a customer and confirm you can sign in. In the Cloudflare dashboard, open the `fixit-rwanda` D1 database and its **Console**. Promote only the account you just created, using its exact lowercase email:

   ```sql
   UPDATE users SET role='admin' WHERE email='your-email@example.com' AND role='customer';
   ```

   Refresh the dashboard. The session reads the account role from the database.
5. Verify the live workflow with separate test customer and professional accounts. Send a guest request and check the professional and admin dashboards. Use fictional job details for this test.
6. Commit the database ID with the Cloudflare configuration and push the project to your private GitHub repository. In the Worker settings, connect the GitHub repository under **Builds**. Use `npx wrangler deploy` as the deploy command. Apply any future database migrations before deploying code that depends on them.

The database ID is a resource identifier. Keep credentials, local databases, and backups out of GitHub.

## Enable quote-request alerts in Cloudflare

New requests appear in the selected professional’s dashboard even while email and SMS are unconfigured. The admin dashboard shows whether each provider accepted the alert. Provider acceptance does not confirm delivery to an inbox or handset.

- **Email** uses Resend. Verify a domain you own in Resend and choose a sender address on it. Add `RESEND_API_KEY` and `QUOTE_EMAIL_FROM` in the Worker’s **Settings → Variables and Secrets**. Email includes the customer’s name, callback number, optional email, and job details.
- **SMS** uses Africa’s Talking. Set up a live Rwanda app, obtain an approved sender ID, and check rates and wallet requirements. Add `AT_API_KEY`, `AT_USERNAME`, and `AT_SENDER_ID` in the Worker’s **Settings → Variables and Secrets**. Professionals enable text alerts themselves in their profile with a Rwanda mobile number. The SMS includes the customer’s callback number and a link to the signed-in dashboard for the full request.
- Once configured, send a new test request to a professional who has opted in and confirm it reaches both their email and phone. Prior requests remain in the dashboard. The app sends alerts once per newly saved request.

Store API keys as encrypted Worker secrets. The local Node demo only saves requests in SQLite.
