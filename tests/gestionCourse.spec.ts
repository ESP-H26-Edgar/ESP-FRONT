import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://raceportal.edwrdledgar.me/");
});
test("Ajout d'une course", async ({ page }) => {
  await page.getByRole("link", { name: "⚙️" }).click();
  await page.getByRole("textbox", { name: "Adresse email" }).click();
  await page
    .getByRole("textbox", { name: "Adresse email" })
    .fill("edgar@gmail.com");
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("123456");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.getByRole("button", { name: "+ Nouvelle course" }).click();
  await page
    .getByRole("textbox", { name: "Ex : Marathon de Montréal" })
    .click();
  await page
    .getByRole("textbox", { name: "Ex : Marathon de Montréal" })
    .fill("Course TEST");
  await page.getByRole("combobox").selectOption("7");
  await page.locator('input[name="date"]').first().fill("2027-08-08T12:00");

  await page.getByPlaceholder("42").click();
  await page.getByPlaceholder("42").fill("13");
  await page.getByRole("textbox", { name: "Ex : Montréal, QC" }).click();
  await page.getByRole("textbox", { name: "Ex : Montréal, QC" }).fill("Test");
  await page.getByPlaceholder("500").click();
  await page.getByPlaceholder("500").fill("40");
  await page.getByPlaceholder("75").click();
  await page.getByPlaceholder("75").fill("40");
  await page.getByRole("textbox", { name: "Décrivez la course..." }).click();
  await page
    .getByRole("textbox", { name: "Décrivez la course..." })
    .fill("Description test");

  await page.setInputFiles(
    'input[type="file"]',
    "parcours-marathon-de-paris-2019.jpg",
  );
  await page.getByRole("button", { name: "Créer la course" }).click();
});

test("Supprimer une course", async ({ page }) => {
  await page.goto("https://raceportal.edwrdledgar.me/admin");
  await page.getByRole("textbox", { name: "Adresse email" }).click();
  await page
    .getByRole("textbox", { name: "Adresse email" })
    .fill("edgar@gmail.com");

  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("123456");
  await page.getByRole("textbox", { name: "Mot de passe" }).press("Enter");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Supprimer cette course ?");
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Supprimer" }).last().click();
});
test("Ajout d'une course avec un parametre invalide", async ({ page }) => {
  await page.getByRole("link", { name: "⚙️" }).click();
  await page.getByRole("textbox", { name: "Adresse email" }).click();
  await page
    .getByRole("textbox", { name: "Adresse email" })
    .fill("edgar@gmail.com");
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("123456");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.getByRole("button", { name: "+ Nouvelle course" }).click();
  await page
    .getByRole("textbox", { name: "Ex : Marathon de Montréal" })
    .click();
  await page
    .getByRole("textbox", { name: "Ex : Marathon de Montréal" })
    .fill("Course TEST");
  await page.getByRole("combobox").selectOption("7");
  await page.locator('input[name="date"]').first().fill("2027-08-08T12:00");

  await page.getByPlaceholder("42").click();
  await page.getByPlaceholder("42").fill("13");
  await page.getByRole("textbox", { name: "Ex : Montréal, QC" }).click();
  await page.getByRole("textbox", { name: "Ex : Montréal, QC" }).fill("Test");
  await page.getByPlaceholder("500").click();
  await page.getByPlaceholder("500").fill("0");
  await page.getByPlaceholder("75").click();
  await page.getByPlaceholder("75").fill("40");
  await page.getByRole("textbox", { name: "Décrivez la course..." }).click();
  await page
    .getByRole("textbox", { name: "Décrivez la course..." })
    .fill("Description test");

  await page.setInputFiles(
    'input[type="file"]',
    "parcours-marathon-de-paris-2019.jpg",
  );
  await page.getByRole("button", { name: "Créer la course" }).click();
  await expect(
    page.getByText("Vous avez enregistré des valeur inférieures à 0."),
  ).toBeVisible();
});
test("Modification d'une course", async ({ page }) => {
  await page.getByRole("link", { name: "⚙️" }).click();
  await page.getByRole("textbox", { name: "Adresse email" }).click();
  await page
    .getByRole("textbox", { name: "Adresse email" })
    .fill("edgar@gmail.com");
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("123456");
  await page.getByRole("textbox", { name: "Mot de passe" }).press("Enter");
  await page.getByRole("button", { name: "Modifier" }).nth(2).click();
  await page
    .getByRole("complementary")
    .filter({ hasText: "Modifier la course✕NomKilomè" })
    .locator('input[name="location"]')
    .click();
  await page
    .getByRole("complementary")
    .filter({ hasText: "Modifier la course✕NomKilomè" })
    .locator('input[name="location"]')
    .fill("Test");

  await page
    .getByRole("complementary")
    .filter({ hasText: "Modifier la course✕NomKilomè" })
    .locator('input[name="numberPlace"]')
    .fill("04");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await page.getByRole("cell", { name: "4", exact: true }).click();
});
