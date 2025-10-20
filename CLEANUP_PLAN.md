# 🧹 Cleanup Plan - Configuration Consolidation

**Task:** 1.9 - Configuration Consolidation
**تاریخ:** 2025-10-20

---

## ✅ انجام شد

1. ✅ ایجاد `src/config/index.ts` - Central configuration hub
2. ✅ تهیه گزارش `CONFIGURATION_AUDIT.md`
3. ✅ شناسایی duplicate files

---

## 🎯 Cleanup Strategy

### **فایل‌های Duplicate که باید حذف شوند:**

#### 1. `types.ts` (root)

- **وضعیت:** Duplicate کامل از `src/types.ts`
- **Action:** حذف یا انتقال به `old/`
- **Reason:** فایل اصلی در `src/types.ts` است

#### 2. `types-new-structure.ts` (root)

- **وضعیت:** رویکرد قدیمی/آزمایشی
- **استفاده شده در:**
  - `demo-new-structure.tsx` (دمو)
  - `src/components/StageIndicatorNew.tsx` (کامپوننت آزمایشی)
- **Action:** انتقال به `old/experimental/`
- **Reason:** رویکرد جدید در `src/config/stages/` است

#### 3. `demo-new-structure.tsx` (root)

- **وضعیت:** فایل دمو
- **Action:** انتقال به `old/demos/`
- **Reason:** فقط برای تست بوده

#### 4. `i18n-new-phases.ts` (root)

- **وضعیت:** نیاز به بررسی
- **استفاده شده:** در `demo-new-structure.tsx` و ممکنه `StageIndicatorNew.tsx`
- **Action:** بررسی و تصمیم‌گیری

---

## 📋 Migration Checklist

### **Phase 1: بررسی و Backup**

- [x] شناسایی تمام duplicates
- [x] بررسی dependencies
- [ ] ایجاد backup از فایل‌های مهم
- [ ] تست build قبل از تغییرات

### **Phase 2: Cleanup**

#### **2.1. فایل‌های Root:**

```bash
# حذف duplicate
rm types.ts  # duplicate کامل

# انتقال فایل‌های experimental
mkdir -p old/experimental
mv types-new-structure.ts old/experimental/
mv demo-new-structure.tsx old/experimental/
mv i18n-new-phases.ts old/experimental/  # اگه فقط در demo استفاده شده
```

#### **2.2. کامپوننت‌های Experimental:**

- [ ] بررسی `src/components/StageIndicatorNew.tsx`
  - آیا در جای دیگه‌ای استفاده شده؟
  - اگه نه → انتقال به `old/experimental/components/`

### **Phase 3: Documentation Update**

- [ ] Update README.md
- [ ] Update PROJECT_PROGRESS.md
- [ ] اضافه کردن CHANGELOG

### **Phase 4: Testing**

- [ ] `npm run build` موفق باشه
- [ ] هیچ import error نداشته باشیم
- [ ] تست عملکرد app

---

## 🚀 اجرا

اجرای این plan در مرحله بعدی...

**پیش‌نیاز:**

- تست build فعلی
- بررسی آخر dependencies

---

**تاریخ:** 2025-10-20 14:45
