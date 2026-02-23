// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/login");
});

test("Affiche erreur si champs vides", async ({ page }) => {
  await page.click("button.login-button");
  const message = page.locator("p.login-message.error");
  await expect(message).toBeVisible();
  await expect(message).toHaveText("Veuillez remplir tous les champs");
});

test("Connexion réussie avec bons identifiants", async ({ page }) => {
  await page.fill("input[type='text']", "edgar@gmail.com");
  await page.fill("input[type='password']", "123456");
  await page.click("button.login-button");
  const message = page.locator("p.login-message.success");
  await expect(message).toBeVisible();
  await expect(message).toHaveText("Connexion réussie !");
});

test("Affiche erreur avec mauvais identifiants", async ({ page }) => {
  await page.fill("input[type='text']", "qsdqdqs@test.com");
  await page.fill("input[type='password']", "qxdfqsd");
  await page.click("button.login-button");
  const message = page.locator("p.login-message.error");
  await expect(message).toBeVisible();
});
