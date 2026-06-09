import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Place } from '../database/models/place';
import { PlacePhoto } from '../database/models/place-photo';
import { User } from '../database/models/user';
import { env } from '../config/env';
import { getLocationByCoords } from '../utils/geocoding';
import { getContinentByCountryName } from '../utils/continent';

dotenv.config({
  path: path.resolve(process.cwd(), '../.env'),
});

const GEOCODING_DELAY_MS = 1200;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const isDryRun = process.argv.includes('--dry-run');
const isForce = process.argv.includes('--force');

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  models: [User, Place, PlacePhoto],
  dialectOptions:
    env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
});

const run = async () => {
  console.log('Starting continents backfill...');
  console.log(`Mode: ${isDryRun ? 'dry-run' : 'write'}`);
  console.log(`Force: ${isForce ? 'yes' : 'no'}`);

  await sequelize.authenticate();

  const places = await Place.findAll({
    where: isForce
      ? {}
      : {
          [Op.or]: [{ continent: null }, { continent: '' }],
        },
    order: [['id', 'ASC']],
  });

  console.log(`Found ${places.length} places to process.`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const place of places) {
    try {
      const location = await getLocationByCoords(place.lat, place.lng);

      const nextCountry = location.country || place.country || null;
      const nextContinent =
        location.continent || getContinentByCountryName(nextCountry);

      if (!nextContinent) {
        skipped += 1;

        console.log(
          `[skip] place=${place.id} "${place.name}" country=${nextCountry || 'unknown'} continent=unknown`
        );

        await sleep(GEOCODING_DELAY_MS);
        continue;
      }

      if (isDryRun) {
        console.log(
          `[dry-run] place=${place.id} "${place.name}" country="${nextCountry}" continent="${nextContinent}"`
        );
      } else {
        await place.update({
          country: nextCountry,
          continent: nextContinent,
        });

        console.log(
          `[updated] place=${place.id} "${place.name}" country="${nextCountry}" continent="${nextContinent}"`
        );
      }

      updated += 1;

      await sleep(GEOCODING_DELAY_MS);
    } catch (error) {
      failed += 1;

      console.error(`[failed] place=${place.id} "${place.name}"`, error);

      await sleep(GEOCODING_DELAY_MS);
    }
  }

  console.log('Backfill finished.');
  console.log({
    processed: places.length,
    updated,
    skipped,
    failed,
  });
};

run()
  .catch((error) => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
