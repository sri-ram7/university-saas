const runLegacyScript = require("../support/run-legacy-script");

describe("legacy backend integration checks", () => {
  it.each([
    "authRotation.test.js",
    "emailVerification.test.js",
    "helmet.test.js",
    "logging.test.js",
    "monitoring.test.js",
    "otp.test.js",
    "passwordReset.test.js",
    "verify-rate-limit.js",
  ])("passes %s", async (scriptName) => {
    await expect(runLegacyScript(scriptName)).resolves.toEqual(
      expect.objectContaining({ stdout: expect.any(String) })
    );
  }, 60000);
});
