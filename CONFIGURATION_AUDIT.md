# 📊 Configuration Audit Report

**تاریخ:** 2025-10-20
**Task:** 1.9 - Configuration Consolidation
**وضعیت:** در حال بررسی و یکپارچه‌سازی

---

## 🔍 مشکلات پیدا شده

### 1️⃣ **Duplicate Type Definitions**

#### **Stage enum** - تعریف شده در 3 جا:

| فایل                                | نوع                                            | مشکل                                       |
| ----------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `src/types.ts` (خط 4-143)           | `export enum Stage { ... }`                    | ✅ این فایل استاندارد است - باید نگه داریم |
| `types-new-structure.ts` (خط 14-21) | `export interface Stage { id, titleKey, ... }` | ❌ رویکرد متفاوت - interface vs enum       |
| `types.ts` (root)                   | احتمال duplicate                               | ⚠️ نیاز به بررسی دقیق‌تر                   |

**توضیح:**

- `src/types.ts` از **enum** استفاده می‌کنه → برای identifier stages
- `types-new-structure.ts` از **interface** استفاده می‌کنه → برای structure داده

این دو رویکرد متفاوت هستند و باعث confusion می‌شن!

---

#### **Phase/Section/Subsection structures** - 2 رویکرد متفاوت:

| رویکرد                | فایل                       | Structure                                      |
| --------------------- | -------------------------- | ---------------------------------------------- |
| **رویکرد 1** (فعلی)   | `src/types/stage.types.ts` | `PhaseConfig → SubsectionConfig → StageConfig` |
| **رویکرد 2** (قدیمی؟) | `types-new-structure.ts`   | `Phase → Section → SubSection → Stage`         |

**مشکل:**

- دو معماری کاملاً متفاوت!
- `types-new-structure.ts` یک **Section** اضافی داره که در رویکرد 1 نیست
- نام‌گذاری متفاوت: `SubsectionConfig` vs `SubSection`

---

### 2️⃣ **Duplicate Stage Configurations**

#### **ALL_STAGES array** - تعریف شده در چند جا:

| فایل                           | خط      | محتوا                                                          |
| ------------------------------ | ------- | -------------------------------------------------------------- |
| `src/hooks/useStageManager.ts` | 22-100  | `ALL_STAGES: Stage[] = [Stage.INITIAL, Stage.IDEA_TITLE, ...]` |
| `types-new-structure.ts`       | 55-1448 | `PHASES_STRUCTURE: Phase[] = [...]`                            |

**مشکل:**

- `useStageManager.ts` یک array ساده از enum Stage ها داره
- `types-new-structure.ts` یک nested structure کامل داره با translations
- این دو سینک نیستند!

---

### 3️⃣ **Configuration Files Organization**

```
پروژه/
├── src/
│   ├── config/
│   │   ├── stages/
│   │   │   ├── index.ts        ✅ خوب - exports همه phases
│   │   │   ├── phase1.ts       ✅ خوب - PHASE_1 configuration
│   │   │   ├── phase2.ts       ✅ خوب - PHASE_2 configuration
│   │   │   └── ...             ✅ phase3-8
│   │   └── index.ts            ✅ جدید ساخته شد - central hub
│   ├── types/
│   │   └── stage.types.ts      ✅ خوب - type definitions
│   └── types.ts                ✅ خوب - Stage enum + interfaces
├── types.ts (root)             ⚠️ duplicate احتمالی
└── types-new-structure.ts      ❌ قدیمی - رویکرد متفاوت
```

**نتیجه:**

- فایل‌های داخل `src/config/stages/` خوب و organized هستند ✅
- فایل `types-new-structure.ts` باید حذف یا migrate بشه ❌
- فایل `types.ts` در root باید بررسی بشه ⚠️

---

## 🎯 راه‌حل پیشنهادی

### **مرحله 1: تعیین Single Source of Truth**

استفاده از معماری فعلی که در `src/` هست:

```typescript
// Type definitions
src/types.ts                    → Stage enum + core types
src/types/stage.types.ts        → PhaseConfig, StageConfig, etc.

// Configuration
src/config/stages/index.ts      → Exports all phases
src/config/stages/phase1-8.ts   → Individual phase configs

// Central hub
src/config/index.ts             → Re-exports + utilities
```

---

### **مرحله 2: Migration Plan**

#### **2.1. فایل‌های قدیمی که باید حذف شوند:**

- [ ] `types-new-structure.ts` (root)
- [ ] `types.ts` (root) - اگه duplicate باشه

#### **2.2. فایل‌های که باید update شوند:**

فایل‌هایی که از imports قدیمی استفاده می‌کنند باید به central config تغییر پیدا کنند:

**قبل:**

```typescript
import { getStageById } from '../config/stages';
import { StageConfig } from '../types/stage.types';
```

**بعد:**

```typescript
import { getStageById, type StageConfig } from '../config';
```

#### **2.3. بررسی فایل‌هایی که تغییر نیاز دارند:**

تعداد فایل‌هایی که import می‌کنند: **51 فایل** (از grep قبلی)

---

### **مرحله 3: Checklist اجرایی**

- [x] ایجاد `src/config/index.ts` - ✅ انجام شد
- [ ] بررسی `types.ts` در root
- [ ] بررسی `types-new-structure.ts` - آیا جایی استفاده شده؟
- [ ] تست build با configs جدید
- [ ] Migration imports در فایل‌های اصلی
- [ ] حذف فایل‌های duplicate
- [ ] Update مستندات

---

## 📝 یادداشت‌ها

### **Stage enum vs Stage interface:**

این دو رویکرد مختلف هستند:

1. **Stage enum** (src/types.ts):
   - برای identifier
   - مثال: `Stage.IDEA_TITLE`, `Stage.ELEVATOR_PITCH`
   - استفاده: در state management, progression logic

2. **Stage interface** (types-new-structure.ts):
   - برای data structure
   - مثال: `{ id: 'stage_1_1_1', titleKey: '...', status: ... }`
   - استفاده: در UI components, storage

**نتیجه:**
ما به **هر دو** نیاز داریم! یکی identifier, یکی data structure.

اما باید naming inconsistency رو حل کنیم:

- `Stage` (enum) → OK
- `Stage` (interface) → باید rename بشه به `StageData` یا `StageNode`

---

## 🚀 بعدی کار چیه؟

1. ✅ Central config hub ساخته شد
2. 🔜 بررسی duplicate files در root
3. 🔜 تصمیم‌گیری درباره migration strategy
4. 🔜 تست و validation

---

**آخرین به‌روزرسانی:** 2025-10-20 14:30
