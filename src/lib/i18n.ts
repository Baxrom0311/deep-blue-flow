export type Lang = 'uz' | 'ru' | 'en';
export const LANGS: Lang[] = ['uz', 'ru', 'en'];
export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

const translations: Record<string, Record<Lang, string>> = {
  nav_home: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  nav_products: { uz: "Mahsulotlar", ru: "Продукты", en: "Products" },
  nav_about: { uz: "Biz haqimizda", ru: "О нас", en: "About" },
  nav_certificates: { uz: "Sertifikatlar", ru: "Сертификаты", en: "Certificates" },
  nav_gallery: { uz: "Galereya", ru: "Галерея", en: "Gallery" },
  nav_contact: { uz: "Aloqa", ru: "Контакты", en: "Contact" },
  hero_badge: { uz: "Teskari osmos tizimlari va kartridjlar", ru: "Обратный осмос и картриджи", en: "Reverse Osmosis and Cartridges" },
  seo_home_title: { uz: "Suv filtrlari va teskari osmos tizimlari", ru: "Фильтры для очистки воды и обратный осмос", en: "Water Filters and Reverse Osmosis Systems" },
  seo_home_description: { uz: "Suv tozalash filtrlari, teskari osmos (obratniy osmos) tizimlari va kartridjlar. O'zbekistonning barcha viloyatlariga yetkazib berish — ECO COMPANY.", ru: "ECO COMPANY — фильтры для очистки воды, системы обратного осмоса и картриджи. Доставка во все регионы Узбекистана.", en: "ECO COMPANY — water purification filters, reverse osmosis systems and cartridges. Delivery to every region of Uzbekistan." },
  hero_title: { uz: "Toza suv — hayot manbai", ru: "Чистая вода — источник жизни", en: "Pure water — source of life" },
  hero_subtitle: { uz: "Uy va ofis uchun suv filtrlari, teskari osmos tizimlari va almashtiriladigan kartridjlar", ru: "Фильтры для воды, системы обратного осмоса и сменные картриджи для дома и офиса", en: "Water filters, reverse osmosis systems and replacement cartridges for home and office" },
  hero_btn_products: { uz: "Mahsulotlar", ru: "Продукты", en: "Products" },
  hero_btn_about: { uz: "Biz haqimizda", ru: "О нас", en: "About us" },
  stats_years: { uz: "Yillik tajriba", ru: "Лет опыта", en: "Years experience" },
  stats_clients: { uz: "Mijozlar", ru: "Клиентов", en: "Clients" },
  stats_products: { uz: "Mahsulotlar", ru: "Продуктов", en: "Products" },
  stats_cities: { uz: "Shaharlar", ru: "Городов", en: "Cities" },
  featured_title: { uz: "Mashhur mahsulotlar", ru: "Популярные продукты", en: "Featured Products" },
  view_all: { uz: "Barcha mahsulotlar", ru: "Все продукты", en: "All products" },
  detail_btn: { uz: "Batafsil", ru: "Подробнее", en: "Details" },
  new_badge: { uz: "YANGI", ru: "НОВЫЙ", en: "NEW" },
  sale_badge: { uz: "Aksiya", ru: "Акция", en: "Sale" },
  days_left: { uz: "kun qoldi", ru: "дней осталось", en: "days left" },
  order_btn: { uz: "Buyurtma berish", ru: "Заказать", en: "Order" },
  contact_title: { uz: "Biz bilan bog'laning", ru: "Свяжитесь с нами", en: "Contact Us" },
  questions_call: { uz: "Biz bilan bog'lanish", ru: "Связаться с нами", en: "Contact us" },
  contact_name: { uz: "Ismingiz", ru: "Ваше имя", en: "Your name" },
  contact_email: { uz: "Elektron pochta", ru: "Эл. почта", en: "Email" },
  contact_phone: { uz: "Telefon", ru: "Телефон", en: "Phone" },
  contact_subject: { uz: "Mavzu", ru: "Тема", en: "Subject" },
  contact_message: { uz: "Xabar", ru: "Сообщение", en: "Message" },
  contact_send: { uz: "Yuborish", ru: "Отправить", en: "Send" },
  contact_success: { uz: "Xabaringiz yuborildi!", ru: "Сообщение отправлено!", en: "Message sent!" },
  footer_desc: { uz: "Suv tozalash filtrlari ishlab chiqaruvchisi", ru: "Производитель фильтров для очистки воды", en: "Water purification filter manufacturer" },
  footer_rights: { uz: "Barcha huquqlar himoyalangan", ru: "Все права защищены", en: "All rights reserved" },
  chat_title: { uz: "ECO Yordamchi 💧", ru: "ECO Помощник 💧", en: "ECO Assistant 💧" },
  chat_placeholder: { uz: "Xabar yozing...", ru: "Напишите сообщение...", en: "Type a message..." },
  chat_online: { uz: "Online", ru: "Онлайн", en: "Online" },
  no_products: { uz: "Mahsulotlar topilmadi", ru: "Продукты не найдены", en: "No products found" },
  search: { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
  sort_default: { uz: "Tartib", ru: "Сортировка", en: "Sort" },
  download: { uz: "Yuklab olish", ru: "Скачать", en: "Download" },
  instagram_title: { uz: "Bizni kuzating", ru: "Следите за нами", en: "Follow Our Flow" },
  cta_title: { uz: "Suv filtriga buyurtma bering", ru: "Закажите фильтр для воды", en: "Order a Water Filter" },
  cta_subtitle: { uz: "Biz bilan bog'laning — tez va qulay yetkazib berish", ru: "Свяжитесь с нами — быстрая и удобная доставка", en: "Contact us — fast and convenient delivery" },
  about_title: { uz: "Kompaniya haqida", ru: "О компании", en: "About Company" },
  certificates_title: { uz: "Sertifikatlar", ru: "Сертификаты", en: "Certificates" },
  gallery_title: { uz: "Galereya", ru: "Галерея", en: "Gallery" },
  regions_title: { uz: "O'zbekistonning barcha viloyatlariga", ru: "Доставка по всему Узбекистану", en: "Delivery Across Uzbekistan" },
  regions_subtitle: { uz: "Suv filtrlari, teskari osmos tizimlari va kartridjlarni quyidagi hududlarga yetkazib beramiz", ru: "Доставляем фильтры для воды, системы обратного осмоса и картриджи во все регионы", en: "We deliver water filters, reverse osmosis systems and cartridges to every region" },
  partners_title: { uz: "Hamkorlar", ru: "Партнеры", en: "Partners" },
  all: { uz: "Barchasi", ru: "Все", en: "All" },
  breadcrumb_home: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}

export function localizedField(obj: object | null | undefined, field: string, lang: Lang): string {
  const values = obj as Record<string, unknown> | null | undefined;
  return [values?.[`${field}_${lang}`], values?.[`${field}_uz`], values?.[field]]
    .find((value): value is string => typeof value === 'string' && value.length > 0) || '';
}
