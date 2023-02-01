# qbit-rpc

A simple Discord Rich Presence for qBittorrent, tested on Windows & Linux.

<p align = "center">
    <a href="https://buymeacoffee.com/marcelmd" alt="buymeacoffee">
        <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"/></a>
    <a href="https://nodejs.org" alt="node js">
        <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /></a>
    <a href = "https://pnpm.io/installation" alt = "pnpm">
        <img src = "https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=white"></a>
    <a href = "https://javascript.com" alt = "javascript">
        <img src = "https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=white"></a>
</p>

<p align="center">
    <img src = "https://cdn.discordapp.com/attachments/1009624960576274464/1070393490028109885/image.png" alt = "rpc example screenshot" width="380" height="105">
</p>

## Installation

[pnpm](https://pnpm.js.org/) and [Node.js](https://nodejs.org/) are required.

Installing pnpm using npm:

```bash
npm i -g pnpm
```

There is also install scripts for pnpm and npm for Windows (ps1) and Linux (Ubuntu & Arch) - inside the `installscripts` folder.

- If on linux, make sure to run `chmod +x pnpm-node-linux.sh` inside the `installscripts` directory to make the script executable.

Download or clone this repository and run `pnpm install` in the directory to install the correct dependencies needed to run the client.

## Usage

1. Make sure you have **enabled the Web UI** in qBittorrent. **qBittorrent MUST be open before starting the Rich Presence.**
2. You not need to modify anything but `config/config.json` to include the `ip`, `port`, `username` and `password` of your qBittorrent WebUI instance.
3. The `filterInactiveUL` / `filterInactiveDL` value is what controls if 'inactive' torrents are shown or not. (default: false)
4. Run `pnpm start` to start the client, you can also use the scripts `run.sh/run.bat` (for linux, make sure to make it executable first `chmod +x run.sh`)
5. If you are using defaults, the RPC will automatically connect to the qBittorrent WebUI on `127.0.0.1:8080` and will update your status every 10 seconds.

## Issues

If you have any issues, please open an issue, or contact me on Discord: `dromzeh#1337`.

## Contributing

Pull requests are welcome and appreciated.

## License

Licensed under [MIT](https://mit.dromzeh.dev)
