# Fast Capture Ecosystem Setup

A second brain is only as good as its capture speed. If capturing an idea takes more than 5 seconds, friction will cause you to lose it.

This guide outlines setup workflows for **Apple iOS Shortcuts**, **Raycast**, and **Web Clippers** connecting directly to `DB_Notes`.

---

## 1. Apple iOS Shortcuts (Action Button / Lock Screen Widget)

Push quick thoughts or voice memos directly into `DB_Notes` from your iPhone or iPad.

### Method A: Notion Official Mobile Widget
1. Long-press on your iOS Home Screen or Lock Screen.
2. Tap **(+) Add Widget** $\to$ select **Notion**.
3. Choose the **Page Shortcut** widget.
4. Select `DB_Notes` (or your OpenSecondBrain landing dashboard).
5. Tapping the widget opens Notion directly to your inbox ready to type.

### Method B: Native iOS Shortcut via Notion API
For instant, background capture without opening the Notion app:
1. Open the iOS **Shortcuts** app $\to$ Create **New Shortcut**.
2. Add action: **Ask for Input** (`Text` with prompt `"What's on your mind?"`).
3. Add action: **Get Contents of URL**:
   - **URL**: `https://api.notion.com/v1/pages`
   - **Method**: `POST`
   - **Headers**:
     - `Authorization`: `Bearer secret_your_notion_api_key`
     - `Notion-Version`: `2022-06-28`
     - `Content-Type`: `application/json`
   - **Request Body (JSON)**:
     ```json
     {
       "parent": { "database_id": "YOUR_DB_NOTES_ID" },
       "properties": {
         "Title": {
           "title": [{ "text": { "content": "Provided Input" } }]
         },
         "Status": {
           "select": { "name": "📥 Inbox" }
         },
         "Type": {
           "select": { "name": "Quick Thought" }
         }
       }
     }
     ```
4. Assign this shortcut to the **iPhone 15/16 Action Button** or Back Tap for instant sub-2-second capture anywhere.

---

## 2. Raycast Extension (macOS Fast Capture)

For Mac users, Raycast provides keyboard-first capture in under 3 keystrokes.

1. Open Raycast (`⌘ + Space`).
2. Type `Store` $\to$ search for the official **Notion** extension by Raycast.
3. Authenticate with your Notion account.
4. Open Raycast Preferences $\to$ Extensions $\to$ Notion $\to$ **Create Database Page**:
   - Target Database: `DB_Notes`
   - Set Hotkey: `⌥ + N` (Option + N)
   - Default Properties:
     - `Status`: `📥 Inbox`
     - `Type`: `Quick Thought`
5. Pressing `⌥ + N` anywhere on macOS instantly triggers a floating modal to save ideas without interrupting your work.

---

## 3. Web Clippers & Article Archival

Clip full articles, bookmarks, and code snippets straight into OpenSecondBrain:

### Option A: Official Notion Web Clipper (Chrome / Firefox / Safari)
1. Install the [Notion Web Clipper extension](https://www.notion.so/web-clipper).
2. When reading an article, click the Notion clipper icon.
3. Set **Add to**: `DB_Notes` (or `DB_Resources`).
4. The clipper automatically pulls the page title, URL, and full article body into the page.

### Option B: "Save to Notion" Extension (Enhanced Field Mapping)
1. Install the [Save to Notion extension](https://chrome.google.com/webstore/detail/save-to-notion/ldmmifpegigmeammaeckplhnjbbpbmna).
2. Create a form preset for `DB_Notes`:
   - Auto-fill `URL` with browser URL.
   - Auto-fill `Type` with `Web Bookmark`.
   - Auto-fill `Status` with `📥 Inbox`.
   - Clip highlights, images, and executive summaries directly.
