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

<p align = "center">
    <img src = "./assets/docs/rpc-example.png" alt = "rpc example screenshot">
</p>

<details>
  <summary>CLI Image</summary>
<p>
    <img src = "./assets/docs/cli-example.png" alt = "cli example screenshot" width = "500" height = "150">
</p>
</details>

## Installation

[pnpm](https://pnpm.js.org/) and [Node.js](https://nodejs.org/) are required to run this program.

Installing pnpm using npm:

```bash
npm i -g pnpm
```

## Usage

1. Make sure you have **enabled the Web UI** in qBittorrent. **qBittorrent MUST be open before starting the Rich Presence.**
2. You not need to modify anything but `config/config.json`, this is to include the `ip`, `port`, `username` and `password` of your qBittorrent WebUI instance.
3. The `filterInactiveUL` / `filterInactiveDL` value is what controls if 'inactive' torrents are shown or not. (`default: false`)
4. `pnpm start` to start the client ( + `pnpm i` to install dependencies if you haven't already)
5. If you are using defaults, the RPC will automatically connect to the qBittorrent WebUI on `127.0.0.1:8080` and will update your status every 10 seconds.

* If the repository is cloned, the program will check for updates on startup.

## Issues

If you have any issues, please open an issue, or contact me on Discord: `dromzeh#1337`.

## Contributing

Pull requests are welcome and appreciated.

## License

Licensed under [MIT](https://mit.dromzeh.dev) © 2023 [dromzeh](https://dromzeh.dev)
