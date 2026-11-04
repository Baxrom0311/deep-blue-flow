import type { Lang } from '@/lib/i18n';

/** All regions of Uzbekistan the company delivers to (shown on the site and in structured data). */
export const REGIONS: Record<Lang, string>[] = [
  { uz: 'Toshkent shahri', ru: 'Ташкент', en: 'Tashkent city' },
  { uz: 'Toshkent viloyati', ru: 'Ташкентская область', en: 'Tashkent Region' },
  { uz: 'Andijon', ru: 'Андижан', en: 'Andijan' },
  { uz: 'Buxoro', ru: 'Бухара', en: 'Bukhara' },
  { uz: "Farg'ona", ru: 'Фергана', en: 'Fergana' },
  { uz: 'Jizzax', ru: 'Джизак', en: 'Jizzakh' },
  { uz: 'Namangan', ru: 'Наманган', en: 'Namangan' },
  { uz: 'Navoiy', ru: 'Навои', en: 'Navoi' },
  { uz: 'Qashqadaryo', ru: 'Кашкадарья', en: 'Kashkadarya' },
  { uz: 'Samarqand', ru: 'Самарканд', en: 'Samarkand' },
  { uz: 'Sirdaryo', ru: 'Сырдарья', en: 'Syrdarya' },
  { uz: 'Surxondaryo', ru: 'Сурхандарья', en: 'Surkhandarya' },
  { uz: 'Xorazm', ru: 'Хорезм', en: 'Khorezm' },
  { uz: "Qoraqalpog'iston", ru: 'Каракалпакстан', en: 'Karakalpakstan' },
];

export const areaServedSchema = (lang: Lang) => [
  { '@type': 'Country', name: 'Uzbekistan' },
  ...REGIONS.map((region) => ({ '@type': 'AdministrativeArea', name: region[lang] })),
];
