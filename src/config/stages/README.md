# Stage Configuration System

این سیستم برای مدیریت تمام فازها، زیربخش‌ها، و مراحل استارتاپ طراحی شده است.

## 📁 ساختار فایل‌ها

```
config/stages/
├── index.ts          # Export اصلی و helper functions
├── phase1.ts         # فاز ۱: Core Concept & Validation
├── phase2.ts         # فاز ۲: Market Analysis (آینده)
├── phase3.ts         # فاز ۳: Business Modeling (آینده)
└── README.md         # این فایل
```

## 🎯 نحوه استفاده

### ۱. Import کردن

```typescript
import { PHASE_1, ALL_PHASES, getStageById } from '@/config/stages';
```

### ۲. دسترسی به اطلاعات فاز

```typescript
// دریافت فاز ۱
const phase1 = PHASE_1;

console.log(phase1.title_en); // "Core Concept & Validation"
console.log(phase1.title_fa); // "مفهوم اصلی و اعتبارسنجی ایده"
```

### ۳. دسترسی به زیربخش‌ها

```typescript
// دریافت اولین زیربخش (Idea Definition)
const ideaDefinition = PHASE_1.subsections[0];

console.log(ideaDefinition.title_en); // "Idea Definition"
console.log(ideaDefinition.stages.length); // 3 مرحله
```

### ۴. دسترسی به یک مرحله خاص

```typescript
// دریافت مرحله Elevator Pitch
const elevatorPitch = PHASE_1.subsections[0].stages[1];

console.log(elevatorPitch.title_en); // "Elevator Pitch"
console.log(elevatorPitch.guidance_en); // توضیحات
console.log(elevatorPitch.question_en); // سوال
console.log(elevatorPitch.dataKey); // "elevator_pitch"
```

### ۵. استفاده از Helper Functions

```typescript
// پیدا کردن یک مرحله با ID
const stage = getStageById('ELEVATOR_PITCH');

// دریافت تمام مراحل به صورت تخت
const allStages = getAllStagesFlat();
```

## 🔧 ساختار هر Stage

هر `StageConfig` شامل موارد زیر است:

```typescript
{
  // شناسایی
  id: 'ELEVATOR_PITCH',

  // نمایش UI
  title_en: 'Elevator Pitch',
  title_fa: 'خلاصه اجرایی',

  // راهنمایی (قبل از سوال)
  guidance_en: 'An elevator pitch is...',
  guidance_fa: 'خلاصه اجرایی یک...',

  // سوال
  question_en: 'Write your elevator pitch...',
  question_fa: 'خلاصه اجرایی خود را بنویسید...',

  // ورودی کاربر
  userInputRequired: false,  // آیا اجباری است؟

  // پیکربندی AI
  promptConfig: {
    role: 'You are a startup mentor...',
    contextKeys: ['initialIdea', 'idea_title'],
    goal: 'Create a compelling pitch',
    constraints: {
      length: '50-75 words',
      tone: 'professional',
    },
    // و بقیه موارد...
  },

  // نوع خروجی
  outputType: 'text',  // یا 'selection', 'list', 'analysis'

  // ذخیره‌سازی
  dataKey: 'elevator_pitch',  // کلید در StartupData
}
```

## 📊 نمایش در UI

### نمایش توضیحات

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const { language } = useLanguage();
const stage = getStageById('ELEVATOR_PITCH');

// نمایش توضیحات به زبان مناسب
const guidance = language === 'fa'
  ? stage.guidance_fa
  : stage.guidance_en;

return <div className="guidance">{guidance}</div>;
```

### نمایش سوال

```typescript
const question = language === 'fa'
  ? stage.question_fa
  : stage.question_en;

return <h3>{question}</h3>;
```

### نمایش StageIndicator

```typescript
// برای نمایش سلسله مراتبی
const renderPhase = (phase: PhaseConfig) => {
  return (
    <div>
      <h2>{language === 'fa' ? phase.title_fa : phase.title_en}</h2>
      {phase.subsections.map(subsection => (
        <div key={subsection.id}>
          <h3>{language === 'fa' ? subsection.title_fa : subsection.title_en}</h3>
          {subsection.stages.map(stage => (
            <div key={stage.id}>
              {language === 'fa' ? stage.title_fa : stage.title_en}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

## 🤖 ساخت Prompt برای AI

```typescript
const buildAIPrompt = (stage: StageConfig, startupData: any, userInput: string) => {
  const config = stage.promptConfig;

  if (!config) return '';

  // شروع با نقش
  let prompt = config.role ? `${config.role}\n\n` : '';

  // اضافه کردن Context
  if (config.contextKeys) {
    prompt += 'Context:\n';
    config.contextKeys.forEach((key) => {
      if (startupData[key]) {
        prompt += `- ${key}: ${startupData[key]}\n`;
      }
    });
    prompt += '\n';
  }

  // اضافه کردن ورودی کاربر
  if (userInput) {
    prompt += `User input: ${userInput}\n\n`;
  }

  // اضافه کردن هدف
  if (config.goal) {
    prompt += `Goal: ${config.goal}\n\n`;
  }

  // اضافه کردن محدودیت‌ها
  if (config.constraints) {
    prompt += 'Constraints:\n';
    if (config.constraints.length) prompt += `- Length: ${config.constraints.length}\n`;
    if (config.constraints.tone) prompt += `- Tone: ${config.constraints.tone}\n`;
    if (config.constraints.count) prompt += `- Count: ${config.constraints.count} items\n`;
    prompt += '\n';
  }

  // قالب خروجی
  if (config.outputFormat) {
    prompt += `Output format: ${config.outputFormat}\n`;
  }

  return prompt;
};
```

## 🔄 مثال کامل: جریان یک مرحله

```typescript
// ۱. دریافت مرحله فعلی
const currentStage = getStageById('ELEVATOR_PITCH');

// ۲. نمایش توضیحات
showGuidance(currentStage.guidance_fa);

// ۳. نمایش سوال
showQuestion(currentStage.question_fa);

// ۴. دریافت ورودی کاربر (اختیاری)
const userInput = await getUserInput();

// ۵. ساخت Prompt برای AI
const aiPrompt = buildAIPrompt(currentStage, startupData, userInput);

// ۶. ارسال به Gemini
const aiResponse = await gemini.generate(aiPrompt);

// ۷. ذخیره در StartupData
startupData[currentStage.dataKey] = aiResponse;

// ۸. رفتن به مرحله بعدی
goToNextStage();
```

## 📝 نکات مهم

### ۱. dataKey ها باید منحصر به فرد باشند

```typescript
// ✅ درست
dataKey: 'elevator_pitch';

// ❌ غلط - تکراری
dataKey: 'pitch';
```

### ۲. userInputRequired

- `true`: کاربر باید چیزی بنویسه
- `false`: اگه کاربر چیزی ننوشت، AI خودش تولید می‌کنه

### ۳. outputType تعیین‌کننده UI است

- `text`: یک متن کامل
- `selection`: لیست گزینه‌ها برای انتخاب
- `list`: لیست bullet points
- `analysis`: تحلیل چند بخشی

### ۴. promptConfig.contextKeys

- باید به ترتیب مراحل قبلی باشن
- مثلاً: `['initialIdea', 'elevator_pitch', 'executive_summary']`

## 🚀 اضافه کردن فاز جدید

۱. فایل جدید بساز: `phase2.ts`
۲. ساختار مشابه `phase1.ts` بنویس
۳. در `index.ts` اضافه کن:

```typescript
import { PHASE_2 } from './phase2';

export const ALL_PHASES: AllPhasesConfig = {
  phases: [
    PHASE_1,
    PHASE_2, // ← جدید
  ],
};

export { PHASE_1, PHASE_2 };
```

## ✅ تست کردن

```typescript
// تست ساختار
console.log('Total phases:', ALL_PHASES.phases.length);
console.log('Phase 1 subsections:', PHASE_1.subsections.length);
console.log('Total stages in Phase 1:', getAllStagesFlat().length);

// تست یک مرحله
const stage = getStageById('ELEVATOR_PITCH');
console.log('Stage found:', !!stage);
console.log('Has guidance:', !!stage?.guidance_en);
console.log('Has question:', !!stage?.question_en);
console.log('Data key:', stage?.dataKey);
```

---

## 🆘 سوالات متداول

### چطور ترجمه‌ها کار می‌کنن؟

هر فیلد دو نسخه داره: `_en` و `_fa`

### چطور prompts رو بعداً بهینه کنیم؟

فقط `promptConfig` رو تو `phase1.ts` ویرایش کن.

### چطور مثال اضافه کنیم؟

آرایه `examples` رو پر کن:

```typescript
examples: [
  'Airbnb connects travelers with unique local accommodations...',
  'Uber provides on-demand transportation...',
];
```

### چطور constraint جدید اضافه کنم؟

در `PromptConstraints` (فایل `stage.types.ts`) فیلد جدید اضافه کن.
