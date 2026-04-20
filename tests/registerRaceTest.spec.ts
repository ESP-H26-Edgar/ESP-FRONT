import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://raceportal.edwrdledgar.me/");
});

test("Inscription à une course", async ({ page }) => {
  await page
    .getByRole("img", { name: "Marathon de Montréal", exact: true })
    .click();

  await page
    .locator("#course-1")
    .getByRole("button", { name: "S'inscrire à la course" })
    .click();
  await page.getByRole("textbox", { name: "Prénom" }).click();

  await page.getByRole("textbox", { name: "Prénom" }).click();
  await page.getByRole("textbox", { name: "Prénom" }).fill("edgar");
  await page.getByRole("textbox", { name: "Nom", exact: true }).click();
  await page.getByRole("textbox", { name: "Nom", exact: true }).fill("gegout");
  await page.getByRole("textbox", { name: "Mail" }).click();

  await page.getByRole("textbox", { name: "Mail" }).fill("edgar@gmail.com");
  await page.getByRole("textbox", { name: "Téléphone" }).click();
  await page.getByRole("textbox", { name: "Téléphone" }).fill("412874586");
  await page
    .getByRole("textbox", { name: "Date de naissance" })
    .fill("2004-03-10");
  await page.getByLabel("Sexe").selectOption("H");
  await page.getByRole("button", { name: "S'inscrire" }).click();
  await page.waitForSelector("h2.paiement-title", { state: "visible" });

  const message = page.locator("h2.paiement-title");
  await expect(message).toBeVisible();
  await expect(message).toHaveText("Paiement");
  await page.waitForTimeout(3000);
  const stripeFrame = page
    .frameLocator('iframe[name^="__privateStripeFrame"]')
    .first();

  await stripeFrame.getByRole("button", { name: "Card" }).click();
  await stripeFrame
    .getByRole("textbox", { name: "Card number" })
    .fill("4242424242424242");
  await stripeFrame
    .getByRole("textbox", { name: "Expiration date MM / YY" })
    .fill("05 / 28");
  await stripeFrame.getByRole("textbox", { name: "Security code" }).fill("555");
  await page.waitForTimeout(2000);
  const payButton = page.getByRole("button", { name: "Payer 50 $CA" });
  await expect(payButton).toBeEnabled({ timeout: 10000 });
  await payButton.click();
  await page
    .getByRole("heading", { name: "✅ Paiement confirmé !" })
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Retour à l'accueil" }).click();
});
