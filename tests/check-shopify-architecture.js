const fs = require("fs");
const path = require("path");

const architectureFile = path.resolve(
    __dirname,
    "../architecture/shopify_app_marketplace.md"
);

const requiredPhrases = [
    "Shopify app",
    "integrated marketplace",
    "custom sales channel editor",
    "network topology designer",
    "hyper-local",
    "B2B",
    "promo optimization"
];

function validateShopifyArchitecture() {
    console.log("Validating Shopify marketplace architecture document...");

    if (!fs.existsSync(architectureFile)) {
        console.error(`Missing required file: ${architectureFile}`);
        process.exit(1);
    }

    const content = fs.readFileSync(architectureFile, "utf8");
    const missing = requiredPhrases.filter(phrase =>
        !content.toLowerCase().includes(phrase.toLowerCase())
    );

    if (missing.length > 0) {
        console.error("Missing required architecture concepts:");
        missing.forEach(phrase => console.error(`- ${phrase}`));
        process.exit(1);
    }

    console.log("Shopify marketplace architecture validation passed.");
}

validateShopifyArchitecture();
