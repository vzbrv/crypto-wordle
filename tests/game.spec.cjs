const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("plays the daily answer to completion", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Play today" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const answer = await page.evaluate(() => answerComparable);
  await page.getByLabel("Your guess").fill(answer);
  await page.getByRole("button", { name: "Guess" }).click();

  await expect(page.getByText("Correct. The brain is pleased.", { exact: true })).toBeVisible();
  await expect(page.locator("#resultPanel")).toBeVisible();
  expect(errors).toEqual([]);
});

test("landing page and game dialog have no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  let results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.getByRole("button", { name: "Play today" }).click();
  results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("game dialog fits mobile viewports", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.getByRole("button", { name: "Play today" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Your guess")).toBeVisible();
  await expect(page.locator(".widget-card")).toBeInViewport();
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});

test("share falls back to clipboard when native share is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedShareText = text;
        }
      }
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Play today" }).click();
  const answer = await page.evaluate(() => answerComparable);
  await page.getByLabel("Your guess").fill(answer);
  await page.getByRole("button", { name: "Guess" }).click();
  await page.getByRole("button", { name: "Share result" }).click();

  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  const copied = await page.evaluate(() => window.__copiedShareText);
  expect(copied).toContain("IQ.wiki Word Brain");
  expect(copied).toContain("http://127.0.0.1:4173/");
});

test("dev server rejects malformed encoded paths", async ({ request }) => {
  const response = await request.get("/%");
  expect(response.status()).toBe(400);
});
