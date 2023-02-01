#!/bin/bash

# Check if running on Ubuntu or Arch Linux
if [ -f /etc/lsb-release ]; then
    # Running on Ubuntu
    sudo apt update
    sudo apt install -y nodejs
    sudo apt install -y npm
    sudo npm install -g pnpm
elif [ -f /etc/os-release ]; then
    # Running on Arch Linux
    sudo pacman -Syu
    sudo pacman -S nodejs
    sudo pacman -S npm
    sudo npm install -g pnpm
else
    echo "Unknown operating system. npm and pnpm cannot be installed."
    exit 1
fi

# Check if npm and pnpm are installed
if command -v npm > /dev/null 2>&1; then
    echo "npm is installed."
else
    echo "npm is not installed."
    exit 1
fi

if command -v pnpm > /dev/null 2>&1; then
    echo "pnpm is installed."
else
    echo "pnpm is not installed."
    exit 1
fi

echo "Both npm and pnpm have been successfully installed."
