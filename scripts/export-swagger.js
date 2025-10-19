const fs = require("fs");
const path = require("path");

const swaggerSpec = require("../src/swagger");

const outPath = path.join(__dirname, "..", "public", "openapi.json");

fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), "utf8");
console.log("OpenAPI JSON written to", outPath);
