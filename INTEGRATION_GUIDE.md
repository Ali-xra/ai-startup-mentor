# 🔄 Integration Guide - Phase 1 New Structure

این فایل راهنمای کامل برای ادغام ساختار جدید فاز ۱ به پروژه است.

## ✅ کارهای انجام شده:

### 1. فایل‌های جدید ایجاد شده:
- ✅ `types/stage.types.ts` - تمام interface‌ها
- ✅ `config/stages/phase1.ts` - داده‌های کامل فاز ۱
- ✅ `config/stages/index.ts` - export و helpers
- ✅ `config/stages/README.md` - مستندات
- ✅ `test-phase1.ts` - تست‌های خودکار

### 2. فایل‌های به‌روزرسانی شده:
- ✅ `types.ts` - Stage enum و StartupData interface (فقط فاز ۱)
- ✅ `hooks/useStartupJourney.ts` - STAGE_TO_DATA_KEY (فقط فاز ۱)

---

## ⏳ کارهای باقیمانده:

### 3. StageIndicator.tsx
**فایل:** `components/StageIndicator.tsx`

**تغییرات لازم:**

```typescript
// خط ۱۴-۲۲: تغییر Stage names
const STAGES_BY_SECTION: Record<MajorSection, Stage[]> = {
    [MajorSection.CORE_CONCEPT]: [
        Stage.IDEA_TITLE,                    // قبلاً: CORE_CONCEPT_IDEA_TITLE
        Stage.ELEVATOR_PITCH,                // قبلاً: CORE_CONCEPT_IDEA_ABSTRACT
        Stage.EXECUTIVE_SUMMARY,             // قبلاً: (نبود)
        Stage.PROBLEM_DESCRIPTION,           // قبلاً: CORE_CONCEPT_PROBLEM_STATEMENT
        Stage.PROBLEM_MAGNITUDE,             // قبلاً: (نبود)
        Stage.CURRENT_SOLUTIONS,             // قبلاً: (نبود)
        Stage.CUSTOMER_SEGMENTS,             // قبلاً: CORE_CONCEPT_INITIAL_TARGET_AUDIENCE
        Stage.EARLY_ADOPTER_PERSONA,         // قبلاً: (نبود)
        Stage.PRODUCT_DESCRIPTION,           // قبلاً: CORE_CONCEPT_PROPOSED_SOLUTION
        Stage.HOW_IT_WORKS,                  // قبلاً: (نبود)
        Stage.UVP_STATEMENT,                 // قبلاً: CORE_CONCEPT_VALUE_PROPOSITION
        Stage.UNFAIR_ADVANTAGE,              // قبلاً: (نبود)
        Stage.VALIDATION_SUMMARY,            // قبلاً: (نبود)
        Stage.BUSINESS_GOALS_TIMELINE,       // قبلاً: CORE_CONCEPT_BUSINESS_GOALS
    ],
    // ... بقیه فازها بدون تغییر
};
```

---

### 4. BlueprintPreview.tsx
**فایل:** `components/BlueprintPreview.tsx`

**تغییرات لازم:**

```typescript
// خط ۱۵۶-۱۹۳: تغییر data keys

// قدیمی:
startupData.coreConcept_ideaTitle
startupData.coreConcept_ideaAbstract
startupData.coreConcept_problemStatement
startupData.coreConcept_initialTargetAudience
startupData.coreConcept_proposedSolution
startupData.coreConcept_valueProposition
startupData.coreConcept_businessGoals
startupData.coreConceptSummary

// جدید:
startupData.idea_title
startupData.elevator_pitch || startupData.executive_summary
startupData.problem_description
startupData.customer_segments || startupData.early_adopter_persona
startupData.product_description
startupData.uvp_statement
startupData.business_goals
// (summary حذف شد - می‌تونیم بعداً اضافه کنیم)
```

---

### 5. ProjectSelectionScreen.tsx
**فایل:** `components/ProjectSelectionScreen.tsx`

**خط ۸۳:** تغییر initial stage

```typescript
// قدیمی:
stage: Stage.CORE_CONCEPT_IDEA_TITLE

// جدید:
stage: Stage.IDEA_TITLE
```

---

### 6. useStartupJourney.ts - بخش سوالات
**فایل:** `hooks/useStartupJourney.ts`

**خط ~۴۵۷:** تغییر stage check

```typescript
// قدیمی:
if (stage === Stage.CORE_CONCEPT_IDEA_TITLE) {

// جدید:
if (stage === Stage.IDEA_TITLE) {
```

---

## 🎯 مراحل اجرا:

### مرحله ۱: تغییر StageIndicator
```bash
# باز کن: components/StageIndicator.tsx
# خط ۱۴-۲۲ رو عوض کن طبق بالا
```

### مرحله ۲: تغییر BlueprintPreview
```bash
# باز کن: components/BlueprintPreview.tsx
# خط ۱۵۶-۱۹۳ رو عوض کن
# Find & Replace:
#   coreConcept_ideaTitle → idea_title
#   coreConcept_ideaAbstract → elevator_pitch
#   coreConcept_problemStatement → problem_description
#   coreConcept_initialTargetAudience → early_adopter_persona
#   coreConcept_proposedSolution → product_description
#   coreConcept_valueProposition → uvp_statement
#   coreConcept_businessGoals → business_goals
#   coreConceptSummary → (حذف یا comment)
```

### مرحله ۳: تغییر ProjectSelectionScreen
```bash
# باز کن: components/ProjectSelectionScreen.tsx
# خط ۸۳:
#   Stage.CORE_CONCEPT_IDEA_TITLE → Stage.IDEA_TITLE
```

### مرحله ۴: تغییر useStartupJourney checks
```bash
# باز کن: hooks/useStartupJourney.ts
# پیدا کن تمام جاهایی که:
#   Stage.CORE_CONCEPT_* استفاده شده
# عوض کن به:
#   Stage.IDEA_TITLE, Stage.ELEVATOR_PITCH, etc.
```

### مرحله ۵: بیلد و تست
```bash
npm run build
npm run dev
```

---

## 🔍 چک‌لیست نهایی:

- [ ] StageIndicator.tsx updated
- [ ] BlueprintPreview.tsx updated
- [ ] ProjectSelectionScreen.tsx updated
- [ ] useStartupJourney.ts checks updated
- [ ] Build successful (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Can create new project
- [ ] Can see Phase 1 stages in sidebar
- [ ] Can answer questions
- [ ] Data saves correctly

---

## 📝 نکات:

1. **فقط فاز ۱** عوض شده - فازهای ۲-۸ همونطور که بودن
2. **Backward compatibility:** پروژه‌های قدیمی با data key‌های قدیمی کار نمی‌کنن (نیاز به migration)
3. **i18n:** هنوز از `i18n.ts` قدیمی استفاده می‌کنیم - بعداً به config جدید وصل می‌کنیم

---

## 🚨 مشکلات احتمالی:

### Error: "Property 'CORE_CONCEPT_IDEA_TITLE' does not exist"
**راه حل:** همه جاها رو عوض کن به Stage names جدید

### Error: "Property 'coreConcept_ideaTitle' does not exist"
**راه حل:** data keys رو در BlueprintPreview عوض کن

### Build موفق ولی صفحه سفید
**راه حل:** Console رو چک کن - احتمالاً runtime error هست

---

این راهنما رو دنبال کن تا ادغام کامل بشه! 🚀
