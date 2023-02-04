import chalk from "chalk";
import qbitapi from "qbittorrent-api-v2";
import discord from "discord-rpc";
import { exec } from 'child_process';
import readline from 'readline';


const rpcClientID = " 1070295187479347250";

const startingTimestamp = new Date();

console.log(chalk.cyan("\n\nqbit-rpc ") + chalk.bold("v1.0.0"));
console.log(chalk.dim("https://github.com/dromzeh/qbit-rpc\n"));

import config from "./config/config.json" assert { type: "json" };
import { exit } from "process";

const checkForUpdates = () => {
    exec('git rev-parse --git-dir', (error, gitDir) => {
    if (error) {
        console.log(chalk.red(`→ `) + chalk.dim('Unable to check for updates as this is not a git repository.'));
        return;
    }

    // TODO: fix this when i am bothered
    exec('git log -1 HEAD --pretty=format:"%H"', (error, localCommit) => {
        exec('git log -1 origin/HEAD --pretty=format:"%H"', (error, remoteCommit) => {
        if (localCommit.trim() === remoteCommit.trim()) { // if local commit is the same as remote commit
            console.log(chalk.green(`→ `) + chalk.dim('Already up to date!')); 
        } else {
            const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
            });

            rl.question(console.log(chalk.green(`→ `) + chalk.dim('An update is available, do you want to git pull? ') +  chalk.bold('(y/n): ')), (answer) => {
            if (answer === 'y') {
                exec('git stash', (error) => {
                exec('git pull', (error) => {
                    if (!error) {
                        console.log(chalk.green(`→ `) + chalk.dim('Repository updated successfully, please restart the application.'));
                        exit(1);
                    } else {
                        console.log(chalk.red(`→ `) + chalk.dim('Files unmodified'));
                    }
                    exec('git stash apply', (error) => {
                    if (!error) {
                        console.log(chalk.red(`→ `) + chalk.dim('Files unmodified'));
                    } else {
                        console.log(chalk.red(`→ `) + chalk.dim('Error applying stash'));
                    }
                    rl.close();
                    });
                });
                });
            } else {
                console.log(chalk.red(`→ `) + chalk.dim('Error applying stash'));
                rl.close();
            }
            });
        }
        });
    });
    });
};


const checkConfig = () => { // TODO: add warnings for config values that are optional, auto fill them with defaults if not provided.
    if (!config.ip || !config.port || !config.username || !config.password) {
        console.log(chalk.red(`→ `) +  (`Missing config values: `) + chalk.red(`${!config.ip ? 'ip, ' : ''}${!config.port ? 'port, ' : ''}${!config.username ? 'username, ' : ''}${!config.password ? 'password' : ''}`));
        process.exit(1);
    }
};

checkForUpdates();
checkConfig();

config.updateInterval = config.updateInterval || 10; // sets default to 10 seconds if not provided
config.showTimestamp = config.showTimestamp || true; // sets to true if not provided

// sets to false if not provided
config.filterInactiveDL = config.filterInactiveUL || false; 
config.filterInactiveUL = config.filterInactiveDL || false;

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

    let torrents = await api.torrents();
    let transferInfo = await api.transferInfo();
    let version = await api.appVersion();

    if (config.filterInactiveUL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedUP"); // removes torrents if upload is paused
    }

    if (config.filterInactiveDL) {
        torrents = torrents.filter((torrent) => torrent.state !== "pausedDL"); // removes torrents if download is paused
    }

    let activity = {
        details: `${version} | ${torrents.length} torrents (${averageTorrentRatio(torrents)} avg ratio)`,
        buttons: [
            {
                label: "Get this RPC",
                url: "https://github.com/dromzeh/qbit-rpc"
            }
        ],
        state: `⇩ ${bytesToFileSize(transferInfo.dl_info_speed)}/s | ⇧ ${bytesToFileSize(transferInfo.up_info_speed)}/s`,
        largeImageKey: "logo",
        largeImageText: `Downloaded: ${bytesToFileSize(transferInfo.dl_info_data)} Uploaded: ${bytesToFileSize(transferInfo.up_info_data)}`, // TODO: allow for custom text or maybe to show overall ratio, not just current session.
    };

    if (config.showTimeStamp) {
        activity.startingTimestamp = startingTimestamp;
    }

    rpc.setActivity(activity); // sets activity
};

// function runs when rpc connects successfully.
rpc.on("connected", () => {
    discordPRC();
    console.log(chalk.green('→ ') + (`Connected to discord on `) + chalk.cyan(`${rpc.user.username}#${rpc.user.discriminator}`));
    setInterval(() => discordPRC(), config.updateInterval * 1000); // UpdateInterval being 1 means it updates every second..
});

// basic error handling
process.on("uncaughtException", (err) => {
    console.log(chalk.red(`→ `) + chalk.dim('Uncaught exception: ') + chalk.red(`${err}`)); 
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log(chalk.red(`→ `) + chalk.dim('Unhandled rejection: ') + chalk.red(`${err}`));
    process.exit(1);
});


rpc.login(
    {clientId: rpcClientID}
);