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
