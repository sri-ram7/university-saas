const runLegacyScript = require("../support/run-legacy-script");

describe("legacy performance optimization checks", () => {
  it("passes the standalone performance assertions", async () => {
    await expect(
      runLegacyScript("performanceOptimizations.test.js")
    ).resolves.toEqual(expect.objectContaining({ stdout: expect.any(String) }));
  }, 60000);
});
