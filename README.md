# BurnFeed Matchmaker Quiz

A static GitHub Pages-friendly website that mimics a BuzzFeed-style quiz, returns a deterministic match from 31 possible results, shows the result in a modal, preserves previous answers in the browser, and can log the **first** submission from that browser to a Google Form through Google Apps Script.

## Files

- `index.html` - main page
- `styles.css` - page styling
- `data.js` - quiz questions, 31 matches, image paths, and config
- `script.js` - quiz rendering, deterministic result logic, modal behavior, answer persistence, and first-submit logging
- `google-apps-script/Code.gs` - optional Google Apps Script endpoint that forwards submissions into your Google Form
- `assets/matches/placeholder.svg` - placeholder result image until you replace each match image path

## Quick setup for GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder into the root of the repository.
3. In GitHub, go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/root` folder, then save.
6. Wait a minute or two. GitHub will publish your site.

## How to customize match images

Each result in `data.js` has an `image` field.

Example:

```js
{
  id: 1,
  name: "Avery",
  image: "assets/matches/avery.jpg",
  text: ["Paragraph 1", "Paragraph 2"]
}
```

To use real images:

1. Put your image files into `assets/matches/`
2. Update each `image` path in `data.js`
3. Commit and push the changes to GitHub

## How deterministic matching works

The final match does **not** depend semantically on the answers. Instead, the site:

1. Combines all 10 selected answers into one string
2. Hashes that string
3. Uses the hash to choose one of the 31 matches

That means:

- same answers = same match every time
- different answers may produce different matches
- the answers do not need any actual compatibility logic

## How retry behavior works

- After a user submits, a **Try Again** button appears.
- Their previous answers stay selected using `localStorage`.
- If they change answers and submit again, the result updates.
- Logging to Google Form happens only on the **first** submission in that browser because a `localStorage` flag is stored.

## Google Form logging setup

A static GitHub Pages site should not try to talk directly to a Google Form from browser code unless you enjoy brittle CORS behavior and random headaches. So this project uses Google Apps Script as a simple middle layer.

### Step 1: Create your Google Form

Create a Google Form with fields for:

- Submitted At
- Q1 through Q10
- Result ID
- Result Name

You can make them short answer fields.

### Step 2: Find your Google Form ID

Open the form editor URL. It will look something like:

```text
https://docs.google.com/forms/d/e/FORM_ID_HERE/edit
```

Copy the `FORM_ID_HERE` value.

### Step 3: Find each `entry.xxxxxxxxxx` ID

1. Open the live form
2. Right-click and inspect the page source, or use browser dev tools
3. Search for each field's `entry.` identifier
4. Copy those into `google-apps-script/Code.gs`

Replace:

- `FORM_ID`
- every value in `FIELD_MAP`

### Step 4: Deploy the Apps Script web app

1. Go to `script.google.com`
2. Create a new Apps Script project
3. Paste in the contents of `google-apps-script/Code.gs`
4. Save the project
5. Click **Deploy > New deployment**
6. Choose **Web app**
7. Execute as **Me**
8. Who has access: **Anyone**
9. Deploy and authorize
10. Copy the Web App URL

### Step 5: Paste the Web App URL into `data.js`

Replace:

```js
googleScriptUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

with your real deployed URL.

### Step 6: Push your updated site

Commit and push the change. Now first submissions from each browser should log into your Google Form.

## Editing quiz questions and answers

Update the `QUIZ_QUESTIONS` array in `data.js`.

Each question has:

- `id`
- `question`
- `options`

Keep the IDs as `q1` through `q10` unless you also update the Google Apps Script field mapping.

## Future additions

This structure is ready for the next round of questionable feature creep, including:

- intro splash screens
- result share cards
- categories/tags per match
- timers
- analytics
- more elaborate layouts
- image-heavy question cards

