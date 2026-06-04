/// <reference types="node" />

import path from 'path';
import { expect, test, type Page } from '@playwright/test';
import { API_URL, createTestUser, registerUserViaApi } from './helpers/api';

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

  await expect(page).toHaveURL('/');
};

test.describe('Places', () => {
  test('user can create place from map', async ({ page, request }) => {
    const user = createTestUser();

    await registerUserViaApi(request, user);
    await loginViaUi(page, user);

    await expect(page.locator('.leaflet-container')).toBeVisible();

    await page.locator('.leaflet-container').dblclick({
      position: {
        x: 500,
        y: 300,
      },
    });

    await expect(page.getByText('Новое место')).toBeVisible();

    await page.getByLabel('Название').fill('E2E Paris');
    await page.getByLabel('Описание').fill('Created from Playwright test');

    const createPlaceResponse = page.waitForResponse((response) => {
      return (
        response.url().includes('/api/places') &&
        response.request().method() === 'POST' &&
        response.status() === 201
      );
    });

    await page.getByRole('button', { name: 'Добавить' }).click();

    await createPlaceResponse;

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);
  });

  test('user can upload photo to place', async ({ page, request }) => {
    const user = createTestUser();

    await registerUserViaApi(request, user);
    await loginViaUi(page, user);

    await expect(page.locator('.leaflet-container')).toBeVisible();

    await page.locator('.leaflet-container').dblclick({
      position: {
        x: 500,
        y: 300,
      },
    });

    await page.getByLabel('Название').fill('E2E Photo Place');
    await page.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);

    await page.locator('.leaflet-marker-icon').first().click();

    const fileInput = page.locator('input[aria-label="Загрузка фото"]');
    await expect(fileInput).toBeAttached();

    const uploadResponse = page.waitForResponse((response) => {
      return (
        response.url().includes('/photos') &&
        response.request().method() === 'POST' &&
        response.status() === 201
      );
    });

    await fileInput.setInputFiles(path.resolve('e2e/fixtures/test-photo.png'));

    const response = await uploadResponse;
    const body = await response.json();

    const filename =
      body.photo?.filename || body.photos?.[0]?.filename || body.filename;

    expect(filename).toBeTruthy();

    const uploadedFileResponse = await request.get(
      `${API_URL}/uploads/${filename}`
    );

    expect(uploadedFileResponse.ok()).toBeTruthy();
  });
});
