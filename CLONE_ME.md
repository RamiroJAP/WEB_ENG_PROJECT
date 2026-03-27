# 🚀 Clone & Setup in One Command

## Windows (PowerShell)

Copy and paste this entire line into PowerShell:

```powershell
powershell -Command "& { $ProgressPreference = 'SilentlyContinue'; $script = Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/YOUR_USERNAME/WEB_ENG_PROJECT/main/clone-and-setup.ps1' -UseBasicParsing; Invoke-Expression $script.Content }"
```

**Or** if you already have the repo locally:

```powershell
npm install
```

---

## Mac/Linux (Bash)

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/WEB_ENG_PROJECT/main/clone-and-setup.sh)"
```

---

## What Happens Automatically:
✅ Clones the repository  
✅ Installs all dependencies (Firebase, React, etc.)  
✅ Sets up git hooks for future auto-install  
✅ Ready to run `npm run dev`

**No manual `npm install` needed!**
