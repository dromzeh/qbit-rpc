import chalk from "chalk";
import qbitapi from "qbittorrent-api-v2";
import discord from "discord-rpc";

const rpcClientID = " 1070295187479347250";

const startingTimestamp = new Date();

console.log(chalk.green("\nLoaded All Dependencies"));

import config from "./config/config.json" assert { type: "json" };

if (!config.ip || !config.port || !config.username || !config.password) {
    console.log(chalk.red(`Missing config values: ${!config.ip ? 'ip, ' : ''}${!config.port ? 'port, ' : ''}${!config.username ? 'username, ' : ''}${!config.password ? 'password' : ''}`));
    process.exit(1);
}

config.updateInterval = config.updateInterval || 10; // sets default to 10 seconds if not provided
config.showTimestamp = config.showTimestamp || true; // sets to true if not provided

config.filterInactiveDL = config.filterInactiveUL || false; // sets to false if not provided
config.filterInactiveUL = config.filterInactiveDL || false; // sets to false if not provided

console.log(chalk.green("Loaded Config"));

const bytesToFileSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = parseInt(Math.log2(bytes) / 10, 10);
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const averageTorrentRatio = (torrents) => {
    let ratio = 0;
    let count = 0;
    for (const torrent of torrents) {
        ratio += torrent.ratio;
        count += 1;
    }
    return (ratio / count).toFixed(2);
};

const rpc = new discord.Client({
    transport: "ipc"
});

const discordPRC = async () => {
    const api = await qbitapi.connect(`http://${config.ip}:${config.port}`, config.username, config.password);
    // console.log(chalk.green("Connected to qBittorrent API"));

    let torrents = await api.torrents();
    let speeds = await api.transferInfo();
    let version = await api.appVersion();

    // console.log(speeds);

    if (config.filterInactiveUL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedUP"); // removes torrents if upload is paused
    }

    if (config.filterInactiveDL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedDL"); // removes torrents if download is paused
    }

    let activity = {
        details: `${version} | ${torrents.length} torrents`,
        buttons: [
            {
                label: "Get this RPC",
                url: "https://github.com/dromzeh/qbit-rpc"
            }
        ],
        state: `⇧ ${bytesToFileSize(speeds.up_info_speed)}/s | ⇩ ${bytesToFileSize(speeds.dl_info_speed)}/s (${averageTorrentRatio(torrents)})`,
        largeImageKey: "logo",
        largeImageText: `Downloaded ${bytesToFileSize(speeds.dl_info_data)} | Uploaded ${bytesToFileSize(speeds.up_info_data)}`,
    };

    if (config.showTimeStamp) {
        activity.startingTimestamp = startingTimestamp;
    }

    rpc.setActivity(activity); // sets activity
};

// function runs when rpc connects successfully.
rpc.on("connected", () => {
    discordPRC();
    console.log(chalk.green(`Connected to discord on ${rpc.user.username}#${rpc.user.discriminator}`));
    setInterval(() => discordPRC(), config.updateInterval * 1000); // UpdateInterval being 1 means it updates every second..
});

// basic error handling
process.on("uncaughtException", (err) => {
    console.log(chalk.red(err));
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log(chalk.red(err));
    process.exit(1);
});

rpc.login(
    {clientId: rpcClientID}
);