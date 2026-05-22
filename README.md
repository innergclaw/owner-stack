# OwnYourWeb Lead Magnet

This folder contains a static website version of `The Owner Stack Starter Kit`.

The visitor sees a popup email gate first. After they submit their name and email, the full Owner Stack details unlock on the same page.

## Preview

Run the page locally from this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Email Capture

The form posts to Netlify Forms for lead collection and also posts to a Netlify Function at:

```text
/.netlify/functions/owner-stack-lead
```

That function sends a Telegram notification for each new lead. Local static preview keeps working without sending notifications.

GitHub Pages can host the website, but it cannot run the Telegram function by itself. For Telegram notifications on a GitHub Pages site, deploy the included Netlify function or another secure backend, then set `TELEGRAM_ENDPOINT` in `script.js` to that full function URL.

For ConvertKit, Mailchimp, Formspree, or a custom backend, set `FORM_ENDPOINT` in `script.js` to the provider's form endpoint.

## Telegram Notifications

Create a Telegram bot with `@BotFather`, then set these environment variables in Netlify:

```text
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

After those are set, each submitted lead will send a Telegram message with name, email, source, page URL, referrer, and submit time.

Keep `TELEGRAM_BOT_TOKEN` out of `script.js`. It belongs only in Netlify environment variables.

To test the function locally with Netlify CLI, run from this folder:

```bash
netlify dev
```

Then open:

```text
http://localhost:8888/
```

## Reset Local Gate

The preview stores unlock status in local storage. To see the popup again, clear local storage for `127.0.0.1:4173` or run this in the browser console:

```js
localStorage.removeItem("ownerStackSiteUnlocked");
```
