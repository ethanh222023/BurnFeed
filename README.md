# BurnFeed Matchmaker Quiz

A static GitHub Pages-friendly website that mimics a BuzzFeed-style quiz, returns a deterministic match from 31 possible results, shows the result in a modal, preserves previous answers in the browser, logs the **first** submission from that browser to a Google Form through Google Apps Script, and now includes aggressively annoying fake ads because apparently dignity was optional.

## Files

- `index.html` - main page
- `styles.css` - page styling, layout, side ads, popups, jumpscare overlay
- `data.js` - quiz questions, 31 matches, ad content, image paths, and config
- `script.js` - quiz rendering, deterministic result logic, modal behavior, answer persistence, ad engine, and first-submit logging
- `google-apps-script/Code.gs` - optional Google Apps Script endpoint that forwards submissions into your Google Form
- `assets/matches/placeholder.svg` - placeholder result image until you replace each match image path
- `assets/ads/side-ad-1.svg` - left side ad placeholder
- `assets/ads/side-ad-2.svg` - right side ad placeholder
- `assets/ads/ad-popup.svg` - popup ad placeholder
- `assets/ads/jumpscare.svg` - jumpscare placeholder image
- `assets/ads/side-ad-3.svg` - extra rotating side ad placeholder
- `assets/ads/side-ad-4.svg` - extra rotating side ad placeholder

## Quick setup for GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder into the root of the repository.
3. In GitHub, go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/root` folder, then save.
6. Wait a minute or two. GitHub will publish your site.

## What you can customize

### Match images

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

### Side ads and popup ads

The ad content is driven by `SIDE_ADS` and `POPUP_ADS` in `data.js`.

You can replace:

- side ad thumbnails
- expanded side ad modal images
- popup ad image
- jumpscare image
- ad titles and copy

Example side ad object:

```js
{
  id: "left-banner",
  title: "This Could Have Been A Nice Website",
  thumbs: ["assets/ads/side-ad-1.svg", "assets/ads/side-ad-3.svg"],
  modalImage: "assets/ads/ad-popup.svg",
  copy: ["Paragraph 1", "Paragraph 2"]
}
```

Example popup ad object:

```js
{
  type: "default",
  title: "Singles Near Literally Anywhere",
  image: "assets/ads/ad-popup.svg",
  body: "A normal popup ad."
}
```

### Ad timing and chaos settings

At the bottom of `data.js`, these config values control the ad behavior:

```js
popupIntervalMinMs: 5000,
popupIntervalMaxMs: 15000,
sideAdRotateMs: 10000,
multiplyPopupRounds: 2,
maxSimultaneousPopups: 4,
jumpscareDurationMs: 300
```

Meaning:

- `popupIntervalMinMs` / `popupIntervalMaxMs` control how often random popup ads appear
- `multiplyPopupRounds` controls how many generations the multiplying ad creates
- `maxSimultaneousPopups` limits how many floating ads are allowed at once
- `jumpscareDurationMs` controls how long the jumpscare image stays visible

- `sideAdRotateMs` controls how often the giant side ads swap images

### Important note on jumpscare audio

The jumpscare sound is now more aggressive, layered, and louder *within browser limits*. Browsers still cannot override the user's operating system mute switch, hardware mute key, or device volume. In other words, even bad design has to obey physics and the OS.

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

## How the fake ads work

### Side ads

- There is one large ad on each side of the quiz on desktop layouts.
- Clicking a side ad opens a modal with a bigger placeholder image and text.
- The user must close that modal before returning to the page.
- On smaller screens, the side ads are hidden to keep the mobile layout from becoming a war crime.

### Random popup ads

After the visitor first interacts with the page, the popup engine starts.

A new popup appears every 5 to 15 seconds and randomly chooses one of these behaviors:

1. **Default popup**
   - Standard floating ad window
   - User can close it with the X or the button

2. **Multiplying popup**
   - Closing it spawns two more popups
   - This repeats for a few rounds, based on `multiplyPopupRounds`

3. **Jumpscare popup**
   - Full-screen scary image
   - Very short display time
   - Loud synthesized audio made with the browser Web Audio API
   - Auto-closes immediately after

### Important browser note about jumpscare audio

Modern browsers usually block autoplay audio until the user has interacted with the page. That is why the ad engine and sound system only start after the first click or key press.

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

This structure is ready for the next round of feature creep, including:

- intro splash screens
- share cards
- categories or filters for results
- extra ad types
- analytics
- timer-based fake urgency
- custom transitions and animations
- a fake "loading" sequence before the result appears


## Custom jumpscare sound

Put your audio file in `assets/ads/` and set the path in `data.js`:

```js
customJumpscareSound: "assets/ads/jumpscare-sound.mp3",
```

Use **MP3** if you want the safest browser support. WAV also works, but the file is usually much larger. OGG can work too, but MP3 is the least annoying choice.
