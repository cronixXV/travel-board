import { expect, test } from '@playwright/test';
import { createTestUser, registerUserViaApi } from './helpers/api';

test.describe('Auth', () => {
  test('user can register', async ({ page }) => {
    const user = createTestUser();

    await page.goto('/register');

    await page.getByLabel('Имя пользователя').fill(user.username);
    await page.getByLabel('Почта').fill(user.email);
    await page.getByLabel('Пароль').fill(user.password);

    await page.getByRole('button', { name: /зарегистрироваться/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(`@${user.username}`)).toBeVisible();
  });

  test('user can login', async ({ page, request }) => {
    const user = createTestUser();

    await registerUserViaApi(request, user);

    await page.goto('/login');

    await page.getByLabel('Почта').fill(user.email);
    await page.getByLabel('Пароль').fill(user.password);

    await page.getByRole('button', { name: /войти/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(`@${user.username}`)).toBeVisible();
  });
});
