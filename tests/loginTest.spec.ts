// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://raceportal.edwrdledgar.me/");
});

test("Affiche erreur si champs vides", async ({ page }) => {
  await page.click("button.login-button");
  const message = page
    .locator(".login-message, p, span, div")
    .filter({ hasText: "Veuillez remplir tous les champs" });
  await expect(message.first()).toBeVisible();
});

test("Connexion réussie avec bons identifiants", async ({ page }) => {
  await page.fill("input[type='text']", "edgar@gmail.com");
  await page.fill("input[type='password']", "123456");
  await page.click("button.login-button");
  await expect(page).toHaveURL("https://raceportal.edwrdledgar.me/Accueil");
  await expect(page.locator("nav")).toBeVisible();
});

test("Affiche erreur avec mauvais identifiants", async ({ page }) => {
  await page.fill("input[type='text']", "edgar@mail.com"); // email du screenshot
  await page.fill("input[type='password']", "mauvaismdp");
  await page.click("button.login-button");
  const message = page.locator("text=Invalid username");
  await expect(message).toBeVisible();
});
