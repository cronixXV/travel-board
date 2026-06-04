import { expect, test, type Page } from '@playwright/test';

import {
  createPlaceViaApi,
  createTestUser,
  registerUserViaApi,
} from './helpers/api';

const loginViaUi = async (
  page: Page,
  user: {
    email: string;
    password: string;
  }
) => {
  await page.goto('/login');

  await page.getByLabel('Почта').fill(user.email);
  await page.getByLabel('Пароль').fill(user.password);

  await page.getByRole('button', { name: /войти/i }).click();

  await expect(page).toHaveURL(/\/$/);
};

test.describe('Places search and filters', () => {
  test('user can search places and filter by visibility', async ({
    page,
    request,
  }) => {
    const user = createTestUser();

    const { accessToken } = await registerUserViaApi(request, user);

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Cairo',
      description: 'Ancient pyramids and desert trip',
      isPublic: true,
      lat: 30.0444,
      lng: 31.2357,
    });

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Rome',
      description: 'Colosseum weekend memories',
      isPublic: false,
      lat: 41.9028,
      lng: 12.4964,
    });

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Paris',
      description: 'Croissant and museum walk',
      isPublic: true,
      lat: 48.8566,
      lng: 2.3522,
    });

    await loginViaUi(page, user);

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(3);

    await page.getByRole('button', { name: /поиск|поиск и фильтры/i }).click();

    await page
      .getByPlaceholder('Поиск по месту, стране, описанию')
      .fill('Cairo');

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);
    await expect(page.getByText(/Найдено 1 из 3/i)).toBeVisible();

    await page.getByPlaceholder('Поиск по месту, стране, описанию').fill('');

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(3);

    await page.getByRole('button', { name: 'Публичные' }).click();

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
    await expect(page.getByText(/Найдено 2 из 3/i)).toBeVisible();

    await page.getByRole('button', { name: 'Скрытые' }).click();

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);
    await expect(page.getByText(/Найдено 1 из 3/i)).toBeVisible();

    await page.getByRole('button', { name: 'Сбросить' }).click();

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(3);
    await expect(page.getByText(/Найдено 3 из 3/i)).toBeVisible();
  });
});
