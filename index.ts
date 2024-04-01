import chalk from "chalk";
import qbitapi from "qbittorrent-api-v2";
import discord from "discord-rpc";
import config from "./config/config.json" assert { type: "json" };

const rpcClientID = " 1070295187479347250";
const startingTimestamp = new Date();

console.log(chalk.cyan("\n\nqbit-rpc ") + chalk.bold("v1.0.0"));
console.log(chalk.dim("https://github.com/dromzeh/qbit-rpc\n"));

const checkConfig = () => {
    if (!config.ip || !config.port || !config.username || !config.password) {
        console.log(chalk.red("→ Missing required fields in config.json"));
        process.exit(1);
    }
}

checkConfig();

const bytesToFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log2(bytes) / 10);
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const averageTorrentRatio = (torrents) => {
    const totalRatio = torrents.reduce((acc, torrent) => acc + torrent.ratio, 0);
    return (totalRatio / torrents.length).toFixed(2);
};

const rpc = new discord.Client({ transport: "ipc" });

const discordPRC = async () => {
    const api = await qbitapi.connect(`http://${config.ip}:${config.port}`, config.username, config.password);

    let torrents = await api.torrents();
    let transferInfo = await api.transferInfo();
    let version = await api.appVersion();

    if (config.filterInactiveUL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedUP");
    }

    if (config.filterInactiveDL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedDL");
    }

    const activity = {
        details: `${version} | ${torrents.length} torrents (${isNaN(parseFloat(averageTorrentRatio(torrents))) ? 'Unknown' : averageTorrentRatio(torrents)} avg ratio)`,
        ...(config.showGetRPC && { buttons: [{ label: "Get this RPC", url: "https://github.com/dromzeh/qbit-rpc" }] }),
        state: `⇩ ${bytesToFileSize(transferInfo.dl_info_speed)}/s | ⇧ ${bytesToFileSize(transferInfo.up_info_speed)}/s`,
        largeImageKey: "logo",
        largeImageText: `Downloaded: ${bytesToFileSize(transferInfo.dl_info_data)} Uploaded: ${bytesToFileSize(transferInfo.up_info_data)}`,
        ...(config.showTimestamp && { startTimestamp: startingTimestamp })
    };

    rpc.setActivity(activity);
};

rpc.on("connected", () => {
    discordPRC();
    console.log(chalk.green('→ ') + chalk.gray('Connected to discord on ') + chalk.cyan(`@${rpc.user.username}`));
    setInterval(discordPRC, config.updateInterval * 1000);
});

const logErrorAndExit = (errorType) => (err) => {
    console.log(chalk.red(`→ ${errorType}: ${err}`));
    process.exit(1);
};

process.on("uncaughtException", logErrorAndExit('Uncaught exception'));
process.on("unhandledRejection", logErrorAndExit('Unhandled rejection'));

rpc.login({ clientId: rpcClientID });