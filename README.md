# ECO COMPANY sayt

React + TypeScript + Vite mijoz sayti: uch til, mahsulotlar, galereya, sertifikatlar, aloqa va AI chatbot.

```sh
npm ci
npm run dev
```

Sayt `http://localhost:8080` da ishlaydi. `.env` uchun `VITE_API_URL=http://localhost:8000/api/v1` qo‘ying va backend CORS ro‘yxatiga sayt originini qo‘shing. Production uchun `.env.production.example` dagi API va sayt domenlarini sozlang. `VITE_GOOGLE_SITE_VERIFICATION` ixtiyoriy; bo‘sh bo‘lsa HTML ga verification meta qo‘shilmaydi.

```sh
npm run typecheck
npm run lint
npm test
npm run test:sitemap
npm run build
```

Build TypeScript tekshiradi, `.env.production` qiymatlarini o‘qib sitemap yaratadi va `dist/` ni yig‘adi. Sitemap mahsulotlar uchun API ga so‘rov yuboradi; `SITEMAP_API_URL` bilan alohida manzil berish mumkin. Har so‘rov timeouti 10 soniya. API ishlamasa shu domenga tegishli oldingi sitemap saqlanadi; oldingi sitemap bo‘lmasa statik sahifalar yoziladi. Har ikki holatda warning chiqariladi. Mahsulotlar o‘zgarganda qayta build qiling yoki backendning dinamik sitemapini tegishli proxy orqali bering.

Statik hostingda SPA route lar uchun `index.html` fallback kerak. Chat pastki o‘ng tugmada; DeepSeek kaliti faqat backend `.env` da sozlanadi. Chat regression testi keyingi xabar server qaytargan sessiya ID si bilan yuborilishini tekshiradi.
