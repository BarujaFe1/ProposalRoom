import { expect, test } from "@playwright/test";

test("login → dashboard → create proposal → hit limit → upgrade", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("demo@proposalroom.app");
  await page.getByLabel("Senha").fill("demo1234");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app/);

  await page.goto("/app/proposals/new");
  await page.getByLabel("Título").fill("Proposta E2E Limite");
  await page.getByLabel("Cliente").fill("Cliente Teste");
  await page.getByLabel("E-mail do cliente").fill("cliente@teste.com");
  await page.getByLabel("Brief").fill(
    "Brief completo para validar o fluxo E2E de criação, limite de plano e upgrade.",
  );
  await page.getByRole("button", { name: "Gerar proposta" }).click();

  // Demo starter already has 3 active proposals; fourth should require upgrade.
  await expect(page.getByText(/limite|upgrade|atingiu/i)).toBeVisible({ timeout: 15_000 });
  await page.goto("/app/upgrade");
  await expect(page.getByRole("heading", { name: "Upgrade" })).toBeVisible();
  await expect(page.getByText("Pro")).toBeVisible();
});

test("secure client room accept + mock pay", async ({ page }) => {
  await page.goto("/r/tok_casa_aurora_demo");
  await expect(page.getByRole("heading", { name: /Casa Aurora/i })).toBeVisible();
  await page.getByRole("button", { name: "Aceitar proposta" }).click();
  await expect(page.getByText(/Aceite registrado|aceita/i)).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: /Simular pagamento/i }).click();
  await expect(page.getByText(/simulado/i)).toBeVisible({ timeout: 10_000 });
});
