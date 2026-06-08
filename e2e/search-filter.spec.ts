import { expect, test, type Page } from '@playwright/test';

import {
  createPlaceViaApi,
  createTestUser,
  registerUserViaApi,
} from './helpers/api';

const getRenderedPlacesCount = async (page: Page) => {
  return page.evaluate(() => {
    const clusterElements = Array.from(
      document.querySelectorAll('.wanderboard-cluster, .marker-cluster')
    );

    const clusterCount = clusterElements.reduce((sum, cluster) => {
      const text = cluster.textContent?.trim() || '';
      const match = text.match(/\d+/);
      const count = match ? Number.parseInt(match[0], 10) : 0;

      return sum + (Number.isFinite(count) ? count : 0);
    }, 0);

    const markerCount = Array.from(
      document.querySelectorAll('.leaflet-marker-icon')
    ).filter((marker) => {
      return (
        !marker.classList.contains('wanderboard-cluster-wrapper') &&
        !marker.classList.contains('marker-cluster')
      );
    }).length;

    return clusterCount + markerCount;
  });
};

const expectRenderedPlacesCount = async (page: Page, count: number) => {
  await expect
    .poll(() => getRenderedPlacesCount(page), {
      timeout: 10_000,
    })
    .toBe(count);
};

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
      visitedAt: '2026-01-10',
    });

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Rome',
      description: 'Colosseum weekend memories',
      isPublic: false,
      lat: 41.9028,
      lng: 12.4964,
      visitedAt: '2025-05-15',
    });

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Paris',
      description: 'Croissant and museum walk',
      isPublic: true,
      lat: 48.8566,
      lng: 2.3522,
      visitedAt: '2024-09-20',
    });

    await loginViaUi(page, user);

    await expectRenderedPlacesCount(page, 3);

    await page.getByRole('button', { name: /поиск|поиск и фильтры/i }).click();

    await page
      .getByPlaceholder('Поиск по месту, стране, описанию')
      .fill('Cairo');

    await expectRenderedPlacesCount(page, 1);
    await expect(page.getByText(/Найдено 1 из 3/i)).toBeVisible();

    await page.getByPlaceholder('Поиск по месту, стране, описанию').fill('');

    await expectRenderedPlacesCount(page, 3);

    await page.getByRole('button', { name: 'Публичные' }).click();

    await expectRenderedPlacesCount(page, 2);
    await expect(page.getByText(/Найдено 2 из 3/i)).toBeVisible();

    await page.getByRole('button', { name: 'Скрытые' }).click();

    await expectRenderedPlacesCount(page, 1);
    await expect(page.getByText(/Найдено 1 из 3/i)).toBeVisible();

    await page.getByRole('button', { name: 'Сбросить' }).click();

    await expectRenderedPlacesCount(page, 3);
    await expect(page.getByText(/Найдено 3 из 3/i)).toBeVisible();
  });
});
