'use server';

import { ISettingInput } from '@/types';
import Setting from '@/lib/db/models/setting.model';
import { connectToDatabase } from '@/lib/db';
import { formatError } from '@/lib/utils';
import { cookies } from 'next/headers';

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null;
};

export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase();
  const setting = await Setting.findOne() || {
    site: {
      name: "MGZon",
      slogan: "The Best E-Commerce Platform",
      description: "Premium online shopping experience",
      url: "https://mg-zon.vercel.app"
    }
  };
  return JSON.parse(JSON.stringify(setting)) as ISettingInput;
};

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    await connectToDatabase();
    const setting = await Setting.findOne().lean() || {
      site: {
        name: "MGZon",
        slogan: "The Best E-Commerce Platform",
        description: "Premium online shopping experience",
        url: "https://mg-zon.vercel.app"
      }
    };
    globalForSettings.cachedSettings = JSON.parse(JSON.stringify(setting));
  }
  return globalForSettings.cachedSettings as ISettingInput;
};

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase();
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean();
    globalForSettings.cachedSettings = JSON.parse(JSON.stringify(updatedSetting));
    return { success: true, message: 'Setting updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server';
  cookies().set('currency', newCurrency);
  return { success: true, message: 'Currency updated successfully' };
};
