# GitHub Setup Guide

Follow these steps to link your project to GitHub:

## Prerequisites
1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or install via winget: `winget install Git.Git`
   - Or install via Chocolatey: `choco install git`

2. **Create a GitHub account** (if you don't have one):
   - Go to: https://github.com
   - Sign up for a free account

## Steps to Link Your Project

### Step 1: Initialize Git Repository
Open PowerShell in your project directory and run:
```powershell
cd c:\projects\adohealthicmr
git init
```

### Step 2: Add All Files
```powershell
git add .
```

### Step 3: Create Initial Commit
```powershell
git commit -m "Initial commit"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (name it `adohealthicmr` or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 5: Link Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your GitHub username):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/adohealthicmr.git
git branch -M main
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)
```powershell
git remote add origin git@github.com:YOUR_USERNAME/adohealthicmr.git
git branch -M main
git push -u origin main
```

## Quick Command Reference
Once Git is installed, you can run all these commands in sequence:
```powershell
cd c:\projects\adohealthicmr
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/adohealthicmr.git
git branch -M main
git push -u origin main
```

## Troubleshooting
- If you get authentication errors, you may need to set up a Personal Access Token:
  - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
  - Generate a new token with `repo` permissions
  - Use the token as your password when pushing
