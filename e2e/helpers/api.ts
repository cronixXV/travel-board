import { APIRequestContext, expect } from '@playwright/test';

export type TestUser = {
  email: string;
  username: string;
  password: string;
};

export const API_URL = process.env.E2E_API_URL || 'http://localhost:3000';

export const createTestUser = (): TestUser => {
  const unique = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  return {
    email: `e2e_${unique}@test.com`,
    username: `e2e_${unique}`,
    password: 'password123',
  };
};

const expectOkResponse = async (
  response: Awaited<ReturnType<APIRequestContext['post']>>
) => {
  if (!response.ok()) {
    const body = await response.text();

    throw new Error(
      `API request failed: ${response.status()} ${response.statusText()}\n${body}`
    );
  }
};

export const registerUserViaApi = async (
  request: APIRequestContext,
  user: TestUser
) => {
  const response = await request.post(`${API_URL}/api/auth/register`, {
    data: user,
  });

  await expectOkResponse(response);

  const body = (await response.json()) as {
    accessToken: string;
    user: {
      id: number;
      email: string;
      username: string;
    };
  };

  return body;
};

export const createPlaceViaApi = async ({
  request,
  accessToken,
  name,
  description = 'E2E test place description',
  isPublic = false,
  lat = 48.8566,
  lng = 2.3522,
}: {
  request: APIRequestContext;
  accessToken: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  lat?: number;
  lng?: number;
}) => {
  const response = await request.post(`${API_URL}/api/places`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      name,
      description,
      lat,
      lng,
      isPublic,
    },
  });

  await expectOkResponse(response);

  const body = (await response.json()) as {
    place: {
      id: number;
      name: string;
      description?: string;
      isPublic: boolean;
    };
  };

  return body.place;
};
