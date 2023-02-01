# Download the latest version of npm
Invoke-WebRequest -Uri https://nodejs.org/dist/latest-version/node-v14.x-x64.msi -OutFile nodejs.msi

# Install nodejs
Start-Process nodejs.msi -Wait

# Check if npm is installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Output "npm is not installed"
    exit 1
}

# Install pnpm
npm install -g pnpm

# Check if pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Output "pnpm is not installed"
    exit 1
}

Write-Output "Both npm and pnpm have been successfully installed."
