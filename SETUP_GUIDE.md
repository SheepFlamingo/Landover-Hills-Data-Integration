# Setup Guide for Non-Programmers

This guide will help you set up and run the Municipal Data Integration Portal even if you've never coded before.

## What You Need to Install First

### 1. Python (for the backend/server)

**What it is:** A programming language that runs the server part of the application.

**How to install:**
1. Go to https://www.python.org/downloads/
2. Click the big yellow "Download Python" button
3. Run the installer
4. ⚠️ **IMPORTANT:** Check the box that says "Add Python to PATH" before clicking Install
5. Click "Install Now"

**How to check if it worked:**
- Open Terminal (Mac) or Command Prompt (Windows)
- Type: `python3 --version` and press Enter
- You should see something like: `Python 3.11.5`
- If you see "command not found", Python isn't installed correctly

### 2. Node.js (for the frontend/website)

**What it is:** A tool that runs the website part of the application.

**How to install:**
1. Go to https://nodejs.org/
2. Download the "LTS" version (it will say "Recommended For Most Users")
3. Run the installer
4. Click "Next" through all the prompts (default settings are fine)
5. Click "Install"

**How to check if it worked:**
- Open Terminal (Mac) or Command Prompt (Windows)
- Type: `node --version` and press Enter
- You should see something like: `v18.17.0`
- If you see "command not found", Node.js isn't installed correctly

## Step-by-Step Setup Instructions

### Step 1: Open Terminal/Command Prompt

**On Mac:**
- Press `Command + Space` (the ⌘ key and spacebar together)
- Type "Terminal"
- Press Enter

**On Windows:**
- Press the Windows key
- Type "cmd" or "Command Prompt"
- Press Enter

You'll see a black or white window with text - this is where you'll type commands.

### Step 2: Navigate to the Project Folder

You need to tell the computer where your project files are located.

**On Mac:**
```bash
cd "/Users/lexindeang/Library/CloudStorage/OneDrive-UniversityofMaryland/School/Senior2025/INST490/Landover-Hills-Data-Integration/main/backend"
```

**On Windows:**
```cmd
cd "C:\Users\YourName\OneDrive\UniversityofMaryland\School\Senior2025\INST490\Landover-Hills-Data-Integration\main\backend"
```

**Note:** Replace the path with the actual location of your project folder. You can find it by:
- Right-clicking the project folder
- Selecting "Copy Path" or "Properties" to see the full path

Press Enter after typing the command.

### Step 3: Set Up the Backend (Server)

Type these commands one at a time, pressing Enter after each:

```bash
python3 -m venv venv
```

**What this does:** Creates a special folder to keep this project's tools separate from other projects.

**What you'll see:** Nothing happens - that's normal! It's working.

**On Windows, if `python3` doesn't work, try:**
```cmd
python -m venv venv
```

---

**Next command (Mac/Linux):**
```bash
source venv/bin/activate
```

**On Windows:**
```cmd
venv\Scripts\activate
```

**What this does:** Turns on the special project folder.

**What you'll see:** You should see `(venv)` appear at the beginning of your command line, like this:
```
(venv) your-computer-name:backend$
```

If you don't see `(venv)`, it didn't work. Try the command again.

---

**Next command:**
```bash
pip install -r requirements.txt
```

**What this does:** Downloads and installs all the tools your project needs.

**What you'll see:** Lots of text scrolling by - this is normal! It's downloading packages.

**How long it takes:** 2-5 minutes depending on your internet speed.

**If you see errors:** Make sure you see `(venv)` at the start of your line. If not, go back and activate it again.

---

**Next command:**
```bash
uvicorn main:app --reload --port 8000
```

**What this does:** Starts the server.

**What you'll see:** Text that says:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**✅ Success!** Your server is running!

**⚠️ IMPORTANT:** Keep this window open! The server needs to keep running. Don't close it.

### Step 4: Set Up the Frontend (Website)

**Open a NEW Terminal/Command Prompt window** (keep the first one running!)

**Navigate to the frontend folder:**

**On Mac:**
```bash
cd "/Users/lexindeang/Library/CloudStorage/OneDrive-UniversityofMaryland/School/Senior2025/INST490/Landover-Hills-Data-Integration/main/frontend"
```

**On Windows:**
```cmd
cd "C:\Users\YourName\OneDrive\UniversityofMaryland\School\Senior2025\INST490\Landover-Hills-Data-Integration\main\frontend"
```

(Again, use your actual project path)

---

**Next command:**
```bash
npm install
```

**What this does:** Downloads all the website tools.

**What you'll see:** Lots of text and progress bars.

**How long it takes:** 3-10 minutes the first time.

---

**Next command (Mac/Linux):**
```bash
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

**On Windows (Command Prompt):**
```cmd
echo REACT_APP_API_URL=http://localhost:8000 > .env
```

**What this does:** Creates a settings file that tells the website where to find the server.

**What you'll see:** Nothing - that's normal!

---

**Next command:**
```bash
npm start
```

**What this does:** Starts the website.

**What you'll see:**
- Text scrolling in the terminal
- Your web browser should automatically open to `http://localhost:3000`
- If it doesn't open automatically, open your browser and go to: `http://localhost:3000`

**✅ Success!** You should now see the application in your browser!

## How to Use the Application

1. **First time:** You'll see a popup asking for your municipality name. Enter it and click "Continue".

2. **Upload a file:** 
   - Click "Choose a file..."
   - Select any file from your computer
   - Click "Upload File"

3. **Add information:**
   - Click "View Metadata" on any file
   - Fill in the information about the file
   - Click "Save Changes"

4. **Download files:**
   - Click "Download File" to get the original file
   - Click "Download Metadata" to get an Excel file with all the information

## Stopping the Application

When you're done:

1. **Stop the website:** In the frontend terminal window, press `Ctrl + C` (Mac) or `Ctrl + C` (Windows)
2. **Stop the server:** In the backend terminal window, press `Ctrl + C`

## Common Problems

### "python3: command not found"
**Solution:** Python might be installed as `python` instead. Try using `python` instead of `python3` in all commands.

### "npm: command not found"
**Solution:** Node.js isn't installed or isn't in your PATH. Reinstall Node.js and make sure to check "Add to PATH" during installation.

### Website shows "Failed to fetch" or can't connect
**Solution:**
1. Make sure the backend server is still running (check the first terminal window)
2. Make sure you see `(venv)` in the backend terminal
3. Check that your `.env` file exists in the frontend folder

### "Port 8000 already in use"
**Solution:** Something else is using that port. Close other programs or use a different port:
```bash
uvicorn main:app --reload --port 8001
```
Then update your `.env` file to use port 8001.

### Browser doesn't open automatically
**Solution:** Manually open your web browser and go to: `http://localhost:3000`

## What's Happening Behind the Scenes

- **Backend (Terminal Window 1):** This is the server that stores your files and handles all the data
- **Frontend (Terminal Window 2):** This runs the website you see in your browser
- **Browser:** This is what you interact with - the pretty interface

They all work together:
- You click something in the browser
- The frontend sends a request to the backend
- The backend processes it and sends data back
- The frontend shows you the result

## Next Steps

Once everything is running:
1. Try uploading a test file
2. Add some metadata to it
3. Download the file and metadata
4. Explore all the features!

## Getting Help

If something doesn't work:
1. Read the error message carefully - it often tells you what's wrong
2. Make sure both terminal windows are still running
3. Check that you're in the right folders
4. Verify Python and Node.js are installed correctly

## Summary Checklist

Before you start:
- [ ] Python is installed (`python3 --version` works)
- [ ] Node.js is installed (`node --version` works)
- [ ] You know where your project folder is located

During setup:
- [ ] Backend terminal shows `(venv)` at the start
- [ ] Backend shows "Uvicorn running on http://127.0.0.1:8000"
- [ ] Frontend terminal shows the website is starting
- [ ] Browser opens to `http://localhost:3000`

If all checkboxes are checked, you're ready to use the application! 🎉



