const { execFile } = require("child_process");
const path = require("path");

function runLegacyScript(scriptName) {
  const scriptPath = path.resolve(__dirname, "..", scriptName);
  const backendRoot = path.resolve(__dirname, "../..");

  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [scriptPath],
      {
        cwd: backendRoot,
        env: { ...process.env, MONGO_URI: "" },
        timeout: 60000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          error.message += `\n${stdout}\n${stderr}`;
          reject(error);
          return;
        }

        resolve({ stdout, stderr });
      }
    );
  });
}

module.exports = runLegacyScript;
