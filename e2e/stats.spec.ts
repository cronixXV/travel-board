import { APIRequestContext, expect, test, type Page } from '@playwright/test';

import { API_URL, createTestUser, registerUserViaApi } from './helpers/api';
import { insertPlaceForUser, isExternalE2ERun } from './helpers/db';

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

const getCurrentUserId = async (
  request: APIRequestContext,
  accessToken: string
) => {
  const response = await request.get(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as {
    user: {
      id: number;
    };
  };

  return body.user.id;
};

test.describe('Extended travel statistics', () => {
  test.skip(
    isExternalE2ERun(),
    'Stats E2E seeds local test database directly and is skipped for external deployments.'
  );

  test('shows countries, continents, visibility and years', async ({
    page,
    request,
  }) => {
    const user = createTestUser();
    const { accessToken } = await registerUserViaApi(request, user);
    const userId = await getCurrentUserId(request, accessToken);

    const prefix = `E2E Stats ${Date.now()}`;

    await insertPlaceForUser({
      userId,
      name: `${prefix} Paris`,
      description: 'Museum walk',
      lat: 48.8566,
      lng: 2.3522,
      country: 'Франция',
      continent: 'Европа',
      visitedAt: '2025-04-10',
      isPublic: true,
    });

    await insertPlaceForUser({
      userId,
      name: `${prefix} Rome`,
      description: 'Colosseum weekend',
      lat: 41.9028,
      lng: 12.4964,
      country: 'Италия',
      continent: 'Европа',
      visitedAt: '2025-06-15',
      isPublic: false,
    });

    await insertPlaceForUser({
      userId,
      name: `${prefix} Cairo`,
      description: 'Pyramids trip',
      lat: 30.0444,
      lng: 31.2357,
      country: 'Египет',
      continent: 'Африка',
      visitedAt: '2026-01-20',
      isPublic: true,
    });

    await insertPlaceForUser({
      userId,
      name: `${prefix} Tokyo`,
      description: 'Spring trip',
      lat: 35.6762,
      lng: 139.6503,
      country: 'Япония',
      continent: 'Азия',
      visitedAt: '2024-03-05',
      isPublic: false,
    });

    await loginViaUi(page, user);

    await page
      .getByRole('button', { name: /статистика путешествий|статистика/i })
      .click();

    const panel = page.getByRole('dialog', {
      name: /статистика путешествий/i,
    });

    await expect(panel).toBeVisible();

    await expect(page.getByTestId('stats-total-places')).toContainText('4');
    await expect(page.getByTestId('stats-total-countries')).toContainText('4');
    await expect(page.getByTestId('stats-total-continents')).toContainText('3');
    await expect(page.getByTestId('stats-total-photos')).toContainText('0');

    await expect(page.getByTestId('stats-public-places')).toContainText('2');
    await expect(page.getByTestId('stats-private-places')).toContainText('2');

    const continents = page.getByTestId('stats-by-continent');

    await expect(continents).toContainText('Европа');
    await expect(continents).toContainText('Африка');
    await expect(continents).toContainText('Азия');

    const countries = page.getByTestId('stats-by-country');

    await expect(countries).toContainText('Франция');
    await expect(countries).toContainText('Италия');
    await expect(countries).toContainText('Египет');
    await expect(countries).toContainText('Япония');

    const years = page.getByTestId('stats-by-year');

    await expect(years).toContainText('2026');
    await expect(years).toContainText('2025');
    await expect(years).toContainText('2024');
  });
});
