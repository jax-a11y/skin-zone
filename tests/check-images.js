const fs = require("fs");
const path = require("path");
const glob = require("glob");

const repoRoot = path.resolve(__dirname, "..");
const files = glob.sync("**/*.md", { cwd: repoRoot, ignore: "node_modules/**" });

const imageRegex = /!\[[^\]]*\]\(([^)]+?)\)/g;
let allImages = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(repoRoot, file), "utf8");
    const matches = content.match(imageRegex) || [];
    matches.forEach(match => {
        const imagePath = match.match(/\(([^)]+?)\)/)[1];
        if (imagePath) {
            allImages.push({ path: imagePath, file });
        }
    });
});

function checkImages() {
    console.log("Checking for missing image references...");
    const missingImages = [];

    for (const image of allImages) {
        if (!image.path.startsWith("http")) {
            const absolutePath = path.resolve(path.dirname(path.join(repoRoot, image.file)), image.path);
            if (!fs.existsSync(absolutePath)) {
                missingImages.push(image);
                console.error(`Missing image: ${image.path} in ${image.file}`);
            }
        }
    }

    if (missingImages.length > 0) {
        console.error(`${missingImages.length} missing images found.`);
        process.exit(1);
    }

    console.log("No missing images found.");
}

checkImages();

