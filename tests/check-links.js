const fs = require("fs");
const path = require("path");
const glob = require("glob");
const axios = require("axios");

const repoRoot = path.resolve(__dirname, "..");
const files = glob.sync("**/*.md", { cwd: repoRoot, ignore: "node_modules/**" });

const linkRegex = /\((?!#)([^)]+?)\)/g;
let allLinks = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(repoRoot, file), "utf8");
    const matches = content.match(linkRegex) || [];
    matches.forEach(match => {
        const url = match.slice(1, -1);
        if (url && !url.startsWith("mailto:")) {
            allLinks.push({ url, file });
        }
    });
});

async function checkLinks() {
    console.log("Checking for broken links...");
    const brokenLinks = [];

    for (const link of allLinks) {
        if (link.url.startsWith("http") || link.url.startsWith("https")) {
            try {
                await axios.get(link.url, { timeout: 5000 });
            } catch (error) {
                brokenLinks.push(link);
                console.error(`Broken external link: ${link.url} in ${link.file}`);
            }
        } else {
            const absolutePath = path.resolve(path.dirname(path.join(repoRoot, link.file)), link.url);
            if (!fs.existsSync(absolutePath)) {
                brokenLinks.push(link);
                console.error(`Broken internal link: ${link.url} in ${link.file}`);
            }
        }
    }

    if (brokenLinks.length > 0) {
        console.error(`${brokenLinks.length} broken links found.`);
        process.exit(1);
    }

    console.log("No broken links found.");
}

checkLinks();

