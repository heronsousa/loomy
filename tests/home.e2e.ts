import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Loomy/);
});

test("renders main header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Loomy/ })).toBeVisible();
});

test("shows product list", async ({ page }) => {
  await page.goto("/");
  const productCards = await page.getByRole("listitem").all();
  expect(productCards.length).toBeGreaterThan(0);
});

test("can open product details", async ({ page }) => {
  await page.goto("/");
  const firstProduct = page.getByRole("listitem").first();
  await firstProduct.click();
  await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
});

test("renders all categories", async ({ page }) => {
  await page.goto("/");
  const categoryNames = [
    "Acessórios",
    "Bermuda & Shorts",
    "Calças",
    "Camisetas",
    "Jaquetas & Moletons",
    "Tênis",
  ];
  for (const name of categoryNames) {
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  }
});
