/** Shared API response & domain types for the ECO COMPANY frontend */

export type Lang = 'uz' | 'ru' | 'en';

/* ── Product ── */
export interface Category {
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    slug?: string;
}

export interface Product {
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    desc_uz?: string;
    desc_ru?: string;
    desc_en?: string;
    description_uz?: string;
    description_ru?: string;
    description_en?: string;
    image_url?: string;
    images?: string[];
    original_price?: number;
    discount_price?: number;
    discount_percent?: number;
    discount_until?: string;
    is_new?: boolean;
    is_on_sale?: boolean;
    is_discount_active?: boolean;
    category_id?: string;
    category?: Category;
}

export interface PaginatedResponse<T> {
    items: T[];
    total?: number;
    total_pages?: number;
    pages?: number;
    page?: number;
    per_page?: number;
}

/* ── Gallery ── */
export interface AlbumItem {
    id: string;
    file_url?: string;
    thumbnail_url?: string;
    url?: string;
    image_url?: string;
    file_type?: 'image' | 'video';
}

export interface Album {
    id: string;
    title_uz: string;
    title_ru: string;
    title_en: string;
    cover_url?: string;
    cover_image?: string;
    items_count?: number;
    items?: AlbumItem[];
}

/* ── Certificate ── */
export interface Certificate {
    id: string;
    title_uz: string;
    title_ru: string;
    title_en: string;
    file_url?: string;
    preview_url?: string;
    image_url?: string;
    file_type?: 'image' | 'pdf';
    is_downloadable?: boolean;
    issued_by?: string;
}

export interface InstagramVideo {
    id: string;
    url: string;
    permalink: string;
    embed_url: string;
    media_type: 'VIDEO';
    kind: 'reel' | 'p' | 'tv' | string;
}

/* ── Contact ── */
export interface ContactFormData {
    name: string;
    email?: string;
    phone: string;
    subject?: string;
    message: string;
}

/* ── Settings ── */
export interface SiteSettings {
    logo_url?: string;
    phone_1?: string;
    phone_2?: string;
    email?: string;
    whatsapp_url?: string;
    telegram_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    youtube_url?: string;
    map_embed?: string;
    working_hours?: string;
    address_uz?: string;
    address_ru?: string;
    address_en?: string;
    about_text_uz?: string;
    about_text_ru?: string;
    about_text_en?: string;
    about_page_title_uz?: string;
    about_page_title_ru?: string;
    about_page_title_en?: string;
    about_section_badge_uz?: string;
    about_section_badge_ru?: string;
    about_section_badge_en?: string;
    about_section_title_uz?: string;
    about_section_title_ru?: string;
    about_section_title_en?: string;
    about_values_badge_uz?: string;
    about_values_badge_ru?: string;
    about_values_badge_en?: string;
    about_values_title_uz?: string;
    about_values_title_ru?: string;
    about_values_title_en?: string;
    hero_title_uz?: string;
    hero_title_ru?: string;
    hero_title_en?: string;
    hero_badge?: string;
    hero_subtitle_uz?: string;
    hero_subtitle_ru?: string;
    hero_subtitle_en?: string;
    stats_years?: string | number;
    stats_clients?: string | number;
    stats_products?: string | number;
    stats_cities?: string | number;
    [key: string]: unknown; // allow extra fields from backend
}
