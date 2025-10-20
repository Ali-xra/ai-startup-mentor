# 🧪 Experimental & Duplicate Files

این پوشه شامل فایل‌هایی است که در cleanup Task 1.9 (Configuration Consolidation) به اینجا منتقل شده‌اند.

**تاریخ انتقال:** 2025-10-20

---

## 📂 ساختار

### `demos/`
- **demo-new-structure.tsx** - یک demo page برای تست ساختار جدید hierarchical

### `components/`
- **StageIndicatorNew.tsx** - یک کامپوننت آزمایشی برای نمایش tree structure

### فایل‌های Root:
- **types-root-duplicate.ts** - duplicate کامل از `src/types.ts`
- **types-new-structure.ts** - رویکرد آزمایشی با Phase → Section → SubSection → Stage
- **i18n-new-phases.ts** - translations برای ساختار جدید

---

## ⚠️ چرا منتقل شدند؟

1. **Duplicate Types:**
   - `types-root-duplicate.ts` دقیقاً همان `src/types.ts` بود
   - باعث confusion می‌شد

2. **Experimental Approach:**
   - `types-new-structure.ts` یک معماری متفاوت پیاده‌سازی می‌کرد:
     - Phase → Section → SubSection → Stage (۴ لایه)
   - در حالی که رویکرد نهایی:
     - PhaseConfig → SubsectionConfig → StageConfig (۳ لایه)
   - این دو رویکرد incompatible بودند

3. **Unused Components:**
   - فقط در demo استفاده می‌شدند
   - در production code استفاده نشده‌اند

---

## 🎯 رویکرد نهایی

معماری نهایی که در `src/` استفاده میشه:

```
src/
├── config/
│   ├── index.ts                  ← Central hub
│   └── stages/
│       ├── index.ts              ← Exports all phases
│       ├── phase1.ts ... phase8.ts
│
├── types/
│   └── stage.types.ts            ← Type definitions
│
└── types.ts                      ← Stage enum + core types
```

**Types:**
- `Stage` enum - برای identifiers
- `StageConfig` interface - برای configuration
- `PhaseConfig`, `SubsectionConfig` - برای hierarchy

---

## 🔄 آیا نیاز به Migration هست؟

**نه!** این فایل‌ها آزمایشی بودند و در production استفاده نشده‌اند.

اگه بخواهید feature های این رویکرد رو به production ببرید:
1. بررسی کنید کدوم قسمت‌ها مفیدند
2. با رویکرد فعلی integrate کنید
3. از types موجود در `src/types/` استفاده کنید

---

## 📜 تاریخچه

- **2025-10-19:** ایجاد اولیه این فایل‌ها برای experiment
- **2025-10-20:** انتقال به `old/experimental/` در Task 1.9

---

**نکته:** این فایل‌ها حذف نشدند بلکه نگهداری شدند برای reference آینده.
