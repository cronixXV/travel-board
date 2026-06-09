import { Client } from 'pg';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/wanderboard';

const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
};

export const isExternalE2ERun = () => {
  const baseUrl = process.env.E2E_BASE_URL || '';

  return (
    Boolean(baseUrl) &&
    !baseUrl.includes('localhost') &&
    !baseUrl.includes('127.0.0.1')
  );
};

const withDb = async <T>(callback: (client: Client) => Promise<T>) => {
  const client = new Client({
    connectionString: getDatabaseUrl(),
  });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
};

export const insertPlaceForUser = async ({
  userId,
  name,
  description,
  lat,
  lng,
  country,
  continent,
  visitedAt,
  isPublic,
}: {
  userId: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  country: string;
  continent: string;
  visitedAt: string;
  isPublic: boolean;
}) => {
  return withDb(async (client) => {
    const result = await client.query<{ id: number }>(
      `
        INSERT INTO places (
          "userId",
          name,
          description,
          lat,
          lng,
          country,
          continent,
          "visitedAt",
          "isPublic",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          NOW(),
          NOW()
        )
        RETURNING id;
      `,
      [
        userId,
        name,
        description,
        lat,
        lng,
        country,
        continent,
        visitedAt,
        isPublic,
      ]
    );

    return result.rows[0];
  });
};
