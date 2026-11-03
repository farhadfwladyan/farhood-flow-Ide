# farh∞d Cloud Studio — Cloudflare Worker package

این بسته برای نگه‌داشتن کلید Groq در سمت سرور و حذف آن از مرورگر آماده شده است.

## محتویات
- `index.html`: نسخه اصلاح‌شده فرانت‌اند؛ دیگر کلید Groq داخل HTML نیست.
- `worker/worker.js`: درگاه امن و استریم هوش مصنوعی روی Cloudflare Workers.
- `worker/wrangler.toml`: تنظیمات اختیاری برای انتشار با Wrangler.

## مرحله ۱ — انتشار Worker
1. وارد https://dash.cloudflare.com/ شوید.
2. از منو **Workers & Pages** را باز کنید.
3. **Create application** و سپس **Create Worker** را انتخاب کنید.
4. یک نام مانند `farhood-ai-gateway` بدهید و Worker را بسازید.
5. در صفحه Worker گزینه **Edit code** را باز کنید.
6. محتوای فایل `worker/worker.js` را جایگزین کد نمونه کنید و **Deploy** بزنید.
7. آدرس Worker شبیه `https://farhood-ai-gateway.<subdomain>.workers.dev` خواهد بود.

## مرحله ۲ — افزودن کلید محرمانه
1. در Worker وارد **Settings → Variables and Secrets** شوید.
2. گزینه **Add** را بزنید و نوع **Secret** را انتخاب کنید.
3. نام را دقیقاً `GROQ_API_KEY` بگذارید.
4. کلید تازه‌ای که در پنل Groq ساخته‌اید را وارد کنید و **Deploy** بزنید.
5. یک متغیر معمولی (Text) با نام `ALLOWED_ORIGIN` و مقدار `https://farhood-flow-ide.vercel.app` اضافه کنید؛ سپس Deploy کنید.

کلید را داخل HTML، GitHub یا چت قرار ندهید.

## مرحله ۳ — اتصال سایت Vercel به Worker
1. فایل `index.html` این بسته را در مخزن Vercel جایگزین فایل اصلی صفحه کنید.
2. Commit و Push کنید تا Vercel دوباره Deploy کند.
3. سایت را باز کنید و وارد **تنظیمات** شوید.
4. در فیلد «آدرس Cloudflare Worker» آدرس کامل Worker را وارد کنید؛ فقط دامنه، بدون `/api/...`.
5. تنظیمات را ببندید و یک پیام به farh∞d AI بفرستید.

## تست Worker
این آدرس را باز کنید:
`https://YOUR-WORKER.workers.dev/health`

باید پاسخی شبیه `{"ok":true,"service":"farhood-ai-worker"}` ببینید.

## نکته مهم درباره اجرای کد
در نسخه فعلی HTML، اجرای JavaScript و SQL محلی است و موتورهای Piston و Wandbox مستقیماً از مرورگر فراخوانی می‌شوند. این Worker فعلاً درگاه امن farh∞d AI است؛ فایل `server.js` قدیمی به‌صورت Express روی Workers اجرا نمی‌شود و برای این روش لازم نیست.

## امنیت
نسخه HTML قبلی حاوی یک کلید Groq ثابت بود. آن کلید را در پنل Groq فوراً Revoke کنید و یک کلید جدید بسازید. این بسته مقدار کلید قبلی را نگه نمی‌دارد.
