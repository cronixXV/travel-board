import { expect, test } from '@playwright/test';
import {
  createPlaceViaApi,
  createTestUser,
  registerUserViaApi,
} from './helpers/api';

test.describe('Public map', () => {
  test('shows only public places', async ({ page, request }) => {
    const user = createTestUser();

    const { accessToken } = await registerUserViaApi(request, user);

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Public Place',
      description: 'Visible on public map',
      isPublic: true,
      lat: 48.8566,
      lng: 2.3522,
    });

    await createPlaceViaApi({
      request,
      accessToken,
      name: 'E2E Hidden Place',
      description: 'Should not be visible on public map',
      isPublic: false,
      lat: 52.52,
      lng: 13.405,
    });

    await page.goto(`/map/${user.username}`);

    await expect(page.getByText(`@${user.username}`)).toBeVisible();
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);

    await page.locator('.leaflet-marker-icon').first().click();

    await expect(page.getByText('E2E Public Place')).toBeVisible();
    await expect(page.getByText('E2E Hidden Place')).not.toBeVisible();
  });
});
