require("dotenv").config({ path: "./.env" });
const swaggerJSDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "youStream API",
      version: "1.0.0",
      description: "API documentation for the youStream backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Server URL for Swagger. Priority:
    // 1. process.env.SWAGGER_SERVER_URL (explicit override)
    // 2. production -> same-origin (empty string) so Swagger UI calls relative paths
    // 3. development -> localhost with PORT
    servers: [
      {
        url:
          process.env.SWAGGER_SERVER_URL ||
          (process.env.NODE_ENV === "production"
            ? ""
            : `http://localhost:${process.env.PORT || 5040}`),
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

let swaggerSpec = swaggerJSDoc(options);

// Try to merge YAML docs from src/docs if js-yaml and glob are available
try {
  const yaml = require("js-yaml");
  const glob = require("glob");

  const docsDir = path.resolve(__dirname, "docs");
  if (fs.existsSync(docsDir)) {
    const files = glob.sync("**/*.yaml", { cwd: docsDir, absolute: true });
    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      const doc = yaml.load(content);
      // Merge paths
      if (doc.paths) {
        swaggerSpec.paths = Object.assign(
          {},
          swaggerSpec.paths || {},
          doc.paths
        );
      }
      // Merge components
      if (doc.components) {
        swaggerSpec.components = Object.assign(
          {},
          swaggerSpec.components || {},
          doc.components
        );
      }
      // Merge tags
      if (doc.tags) {
        swaggerSpec.tags = (swaggerSpec.tags || []).concat(doc.tags);
      }
    });
  }
} catch (err) {
  // If packages are missing, we silently continue with JSDoc-only spec
  // Install js-yaml and glob to enable loading external YAML docs.
}

module.exports = swaggerSpec;
