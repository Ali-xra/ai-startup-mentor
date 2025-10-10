// ========================================
// NEW HIERARCHICAL STRUCTURE FOR PHASES
// ========================================

export type Locale = 'en' | 'fa';

// Stage status for tracking completion
export enum StageStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

// Individual stage (the smallest unit of work)
export interface Stage {
    id: string;
    titleKey: string; // Key for i18n translation
    descriptionKey?: string;
    status: StageStatus;
    order: number;
}

// SubSection contains multiple stages
export interface SubSection {
    id: string;
    titleKey: string;
    stages: Stage[];
    isExpanded: boolean;
    order: number;
}

// Section contains multiple subsections
export interface Section {
    id: string;
    titleKey: string;
    subSections: SubSection[];
    isExpanded: boolean;
    order: number;
}

// Phase is the top level (8 main phases)
export interface Phase {
    id: string;
    titleKey: string;
    descriptionKey?: string;
    sections: Section[];
    isExpanded: boolean;
    order: number;
}

// ========================================
// PHASE STRUCTURE DEFINITION
// ========================================

export const PHASES_STRUCTURE: Phase[] = [
    // ========================================
    // فاز ۱: مفهوم اصلی و اعتبارسنجی ایده
    // ========================================
    {
        id: 'phase_1',
        titleKey: 'phase_1_title',
        descriptionKey: 'phase_1_description',
        order: 1,
        isExpanded: false,
        sections: [
            {
                id: 'phase_1_section_1',
                titleKey: 'phase_1_section_1_title', // ۱.۱. تعریف ایده
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_1_subsection_1',
                        titleKey: 'phase_1_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_1_1',
                                titleKey: 'stage_1_1_1_title', // ۱.۱.۱. عنوان ایده
                                descriptionKey: 'stage_1_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_1_2',
                                titleKey: 'stage_1_1_2_title', // ۱.۱.۲. خلاصه اجرایی
                                descriptionKey: 'stage_1_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_1_1_3',
                                titleKey: 'stage_1_1_3_title', // ۱.۱.۳. چکیده ایده
                                descriptionKey: 'stage_1_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_2',
                titleKey: 'phase_1_section_2_title', // ۱.۲. بیان مسئله
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_2_subsection_1',
                        titleKey: 'phase_1_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_2_1',
                                titleKey: 'stage_1_2_1_title', // ۱.۲.۱. مشکلی که حل می‌کنید
                                descriptionKey: 'stage_1_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_2_2',
                                titleKey: 'stage_1_2_2_title', // ۱.۲.۲. اندازه مشکل
                                descriptionKey: 'stage_1_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_1_2_3',
                                titleKey: 'stage_1_2_3_title', // ۱.۲.۳. راه‌حل‌های فعلی
                                descriptionKey: 'stage_1_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_3',
                titleKey: 'phase_1_section_3_title', // ۱.۳. مخاطب هدف
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_3_subsection_1',
                        titleKey: 'phase_1_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_3_1',
                                titleKey: 'stage_1_3_1_title', // ۱.۳.۱. تعریف بخش‌های مشتریان
                                descriptionKey: 'stage_1_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_3_2',
                                titleKey: 'stage_1_3_2_title', // ۱.۳.۲. ساخت پرسونا
                                descriptionKey: 'stage_1_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_4',
                titleKey: 'phase_1_section_4_title', // ۱.۴. راه‌حل پیشنهادی
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_4_subsection_1',
                        titleKey: 'phase_1_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_4_1',
                                titleKey: 'stage_1_4_1_title', // ۱.۴.۱. شرح کامل محصول
                                descriptionKey: 'stage_1_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_4_2',
                                titleKey: 'stage_1_4_2_title', // ۱.۴.۲. نحوه عملکرد
                                descriptionKey: 'stage_1_4_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_5',
                titleKey: 'phase_1_section_5_title', // ۱.۵. ارزش پیشنهادی
                order: 5,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_5_subsection_1',
                        titleKey: 'phase_1_section_5_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_5_1',
                                titleKey: 'stage_1_5_1_title', // ۱.۵.۱. چرا راه‌حل شما بهتر است
                                descriptionKey: 'stage_1_5_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_5_2',
                                titleKey: 'stage_1_5_2_title', // ۱.۵.۲. مزیت رقابتی
                                descriptionKey: 'stage_1_5_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_6',
                titleKey: 'phase_1_section_6_title', // ۱.۶. اعتبارسنجی عملی
                order: 6,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_6_subsection_1',
                        titleKey: 'phase_1_section_6_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_6_1',
                                titleKey: 'stage_1_6_1_title', // ۱.۶.۱. مصاحبه‌های کشف مشتری
                                descriptionKey: 'stage_1_6_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_6_2',
                                titleKey: 'stage_1_6_2_title', // ۱.۶.۲. ساخت صفحه فرود
                                descriptionKey: 'stage_1_6_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_1_6_3',
                                titleKey: 'stage_1_6_3_title', // ۱.۶.۳. نتایج اولیه
                                descriptionKey: 'stage_1_6_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_1_section_7',
                titleKey: 'phase_1_section_7_title', // ۱.۷. اهداف کسب‌وکار
                order: 7,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_1_section_7_subsection_1',
                        titleKey: 'phase_1_section_7_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_1_7_1',
                                titleKey: 'stage_1_7_1_title', // ۱.۷.۱. اهداف کوتاه، میان و بلندمدت
                                descriptionKey: 'stage_1_7_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_1_7_2',
                                titleKey: 'stage_1_7_2_title', // ۱.۷.۲. تعریف اهداف SMART
                                descriptionKey: 'stage_1_7_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۲: تحلیل بازار، رقبا و ریسک
    // ========================================
    {
        id: 'phase_2',
        titleKey: 'phase_2_title',
        descriptionKey: 'phase_2_description',
        order: 2,
        isExpanded: false,
        sections: [
            {
                id: 'phase_2_section_1',
                titleKey: 'phase_2_section_1_title', // ۲.۱. محیط و اندازه بازار
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_2_section_1_subsection_1',
                        titleKey: 'phase_2_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_2_1_1',
                                titleKey: 'stage_2_1_1_title', // ۲.۱.۱. تحلیل PESTEL
                                descriptionKey: 'stage_2_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_2_1_2',
                                titleKey: 'stage_2_1_2_title', // ۲.۱.۲. TAM
                                descriptionKey: 'stage_2_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_2_1_3',
                                titleKey: 'stage_2_1_3_title', // ۲.۱.۳. SAM
                                descriptionKey: 'stage_2_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_2_1_4',
                                titleKey: 'stage_2_1_4_title', // ۲.۱.۴. SOM
                                descriptionKey: 'stage_2_1_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_2_section_2',
                titleKey: 'phase_2_section_2_title', // ۲.۲. روندها، فرصت‌ها و تهدیدها
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_2_section_2_subsection_1',
                        titleKey: 'phase_2_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_2_2_1',
                                titleKey: 'stage_2_2_1_title', // ۲.۲.۱. روندهای کلیدی بازار
                                descriptionKey: 'stage_2_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_2_2_2',
                                titleKey: 'stage_2_2_2_title', // ۲.۲.۲. فرصت‌ها
                                descriptionKey: 'stage_2_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_2_2_3',
                                titleKey: 'stage_2_2_3_title', // ۲.۲.۳. تهدیدها
                                descriptionKey: 'stage_2_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_2_section_3',
                titleKey: 'phase_2_section_3_title', // ۲.۳. چشم‌انداز رقابتی
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_2_section_3_subsection_1',
                        titleKey: 'phase_2_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_2_3_1',
                                titleKey: 'stage_2_3_1_title', // ۲.۳.۱. شناسایی رقبا
                                descriptionKey: 'stage_2_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_2_3_2',
                                titleKey: 'stage_2_3_2_title', // ۲.۳.۲. تحلیل رقبا
                                descriptionKey: 'stage_2_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_2_3_3',
                                titleKey: 'stage_2_3_3_title', // ۲.۳.۳. ماتریس رقابتی
                                descriptionKey: 'stage_2_3_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_2_section_4',
                titleKey: 'phase_2_section_4_title', // ۲.۴. تحلیل SWOT
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_2_section_4_subsection_1',
                        titleKey: 'phase_2_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_2_4_1',
                                titleKey: 'stage_2_4_1_title', // ۲.۴.۱. نقاط قوت
                                descriptionKey: 'stage_2_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_2_4_2',
                                titleKey: 'stage_2_4_2_title', // ۲.۴.۲. نقاط ضعف
                                descriptionKey: 'stage_2_4_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_2_4_3',
                                titleKey: 'stage_2_4_3_title', // ۲.۴.۳. فرصت‌ها
                                descriptionKey: 'stage_2_4_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_2_4_4',
                                titleKey: 'stage_2_4_4_title', // ۲.۴.۴. تهدیدها
                                descriptionKey: 'stage_2_4_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_2_section_5',
                titleKey: 'phase_2_section_5_title', // ۲.۵. تحلیل و مدیریت ریسک
                order: 5,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_2_section_5_subsection_1',
                        titleKey: 'phase_2_section_5_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_2_5_1',
                                titleKey: 'stage_2_5_1_title', // ۲.۵.۱. ریسک‌های محصول/فناوری
                                descriptionKey: 'stage_2_5_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_2_5_2',
                                titleKey: 'stage_2_5_2_title', // ۲.۵.۲. ریسک‌های بازار/مشتری
                                descriptionKey: 'stage_2_5_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_2_5_3',
                                titleKey: 'stage_2_5_3_title', // ۲.۵.۳. ریسک‌های تیم/اجرایی
                                descriptionKey: 'stage_2_5_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_2_5_4',
                                titleKey: 'stage_2_5_4_title', // ۲.۵.۴. ریسک‌های مالی
                                descriptionKey: 'stage_2_5_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                            {
                                id: 'stage_2_5_5',
                                titleKey: 'stage_2_5_5_title', // ۲.۵.۵. برنامه کاهش ریسک
                                descriptionKey: 'stage_2_5_5_description',
                                status: StageStatus.NOT_STARTED,
                                order: 5,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۳: مدل‌سازی کسب‌وکار (BMC)
    // ========================================
    {
        id: 'phase_3',
        titleKey: 'phase_3_title',
        descriptionKey: 'phase_3_description',
        order: 3,
        isExpanded: false,
        sections: [
            {
                id: 'phase_3_section_1',
                titleKey: 'phase_3_section_1_title', // ۳.۱. بوم مدل کسب‌وکار
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_3_section_1_subsection_1',
                        titleKey: 'phase_3_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_3_1_1',
                                titleKey: 'stage_3_1_1_title', // ۳.۱.۱. بخش‌های مشتریان
                                descriptionKey: 'stage_3_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_3_1_2',
                                titleKey: 'stage_3_1_2_title', // ۳.۱.۲. ارزش‌های پیشنهادی
                                descriptionKey: 'stage_3_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_3_1_3',
                                titleKey: 'stage_3_1_3_title', // ۳.۱.۳. کانال‌ها
                                descriptionKey: 'stage_3_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_3_1_4',
                                titleKey: 'stage_3_1_4_title', // ۳.۱.۴. ارتباط با مشتریان
                                descriptionKey: 'stage_3_1_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                            {
                                id: 'stage_3_1_5',
                                titleKey: 'stage_3_1_5_title', // ۳.۱.۵. جریان‌های درآمدی
                                descriptionKey: 'stage_3_1_5_description',
                                status: StageStatus.NOT_STARTED,
                                order: 5,
                            },
                            {
                                id: 'stage_3_1_6',
                                titleKey: 'stage_3_1_6_title', // ۳.۱.۶. فعالیت‌های کلیدی
                                descriptionKey: 'stage_3_1_6_description',
                                status: StageStatus.NOT_STARTED,
                                order: 6,
                            },
                            {
                                id: 'stage_3_1_7',
                                titleKey: 'stage_3_1_7_title', // ۳.۱.۷. منابع کلیدی
                                descriptionKey: 'stage_3_1_7_description',
                                status: StageStatus.NOT_STARTED,
                                order: 7,
                            },
                            {
                                id: 'stage_3_1_8',
                                titleKey: 'stage_3_1_8_title', // ۳.۱.۸. مشارکت‌های کلیدی
                                descriptionKey: 'stage_3_1_8_description',
                                status: StageStatus.NOT_STARTED,
                                order: 8,
                            },
                            {
                                id: 'stage_3_1_9',
                                titleKey: 'stage_3_1_9_title', // ۳.۱.۹. ساختار هزینه‌ها
                                descriptionKey: 'stage_3_1_9_description',
                                status: StageStatus.NOT_STARTED,
                                order: 9,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۴: برندینگ و هویت‌سازی
    // ========================================
    {
        id: 'phase_4',
        titleKey: 'phase_4_title',
        descriptionKey: 'phase_4_description',
        order: 4,
        isExpanded: false,
        sections: [
            {
                id: 'phase_4_section_1',
                titleKey: 'phase_4_section_1_title', // ۴.۱. استراتژی برند
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_4_section_1_subsection_1',
                        titleKey: 'phase_4_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_4_1_1',
                                titleKey: 'stage_4_1_1_title', // ۴.۱.۱. چشم‌انداز برند
                                descriptionKey: 'stage_4_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_4_1_2',
                                titleKey: 'stage_4_1_2_title', // ۴.۱.۲. ماموریت برند
                                descriptionKey: 'stage_4_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_4_1_3',
                                titleKey: 'stage_4_1_3_title', // ۴.۱.۳. ارزش‌های اصلی
                                descriptionKey: 'stage_4_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_4_1_4',
                                titleKey: 'stage_4_1_4_title', // ۴.۱.۴. شخصیت برند
                                descriptionKey: 'stage_4_1_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                            {
                                id: 'stage_4_1_5',
                                titleKey: 'stage_4_1_5_title', // ۴.۱.۵. جایگاه‌یابی برند
                                descriptionKey: 'stage_4_1_5_description',
                                status: StageStatus.NOT_STARTED,
                                order: 5,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_4_section_2',
                titleKey: 'phase_4_section_2_title', // ۴.۲. هویت کلامی
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_4_section_2_subsection_1',
                        titleKey: 'phase_4_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_4_2_1',
                                titleKey: 'stage_4_2_1_title', // ۴.۲.۱. نام برند
                                descriptionKey: 'stage_4_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_4_2_2',
                                titleKey: 'stage_4_2_2_title', // ۴.۲.۲. شعار
                                descriptionKey: 'stage_4_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_4_2_3',
                                titleKey: 'stage_4_2_3_title', // ۴.۲.۳. لحن صدا
                                descriptionKey: 'stage_4_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_4_2_4',
                                titleKey: 'stage_4_2_4_title', // ۴.۲.۴. پیام‌های کلیدی
                                descriptionKey: 'stage_4_2_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_4_section_3',
                titleKey: 'phase_4_section_3_title', // ۴.۳. هویت بصری
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_4_section_3_subsection_1',
                        titleKey: 'phase_4_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_4_3_1',
                                titleKey: 'stage_4_3_1_title', // ۴.۳.۱. طراحی لوگو
                                descriptionKey: 'stage_4_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_4_3_2',
                                titleKey: 'stage_4_3_2_title', // ۴.۳.۲. پالت رنگی
                                descriptionKey: 'stage_4_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_4_3_3',
                                titleKey: 'stage_4_3_3_title', // ۴.۳.۳. تایپوگرافی
                                descriptionKey: 'stage_4_3_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_4_section_4',
                titleKey: 'phase_4_section_4_title', // ۴.۴. خروجی نهایی برند
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_4_section_4_subsection_1',
                        titleKey: 'phase_4_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_4_4_1',
                                titleKey: 'stage_4_4_1_title', // ۴.۴.۱. راهنمای جامع برند
                                descriptionKey: 'stage_4_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۵: توسعه محصول
    // ========================================
    {
        id: 'phase_5',
        titleKey: 'phase_5_title',
        descriptionKey: 'phase_5_description',
        order: 5,
        isExpanded: false,
        sections: [
            {
                id: 'phase_5_section_1',
                titleKey: 'phase_5_section_1_title', // ۵.۱. مشخصات و ویژگی‌های محصول
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_5_section_1_subsection_1',
                        titleKey: 'phase_5_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_5_1_1',
                                titleKey: 'stage_5_1_1_title', // ۵.۱.۱. شرح کامل عملکرد
                                descriptionKey: 'stage_5_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_5_1_2',
                                titleKey: 'stage_5_1_2_title', // ۵.۱.۲. لیست ویژگی‌ها
                                descriptionKey: 'stage_5_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_5_1_3',
                                titleKey: 'stage_5_1_3_title', // ۵.۱.۳. مزایای هر ویژگی
                                descriptionKey: 'stage_5_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_5_1_4',
                                titleKey: 'stage_5_1_4_title', // ۵.۱.۴. نقشه راه محصول
                                descriptionKey: 'stage_5_1_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_5_section_2',
                titleKey: 'phase_5_section_2_title', // ۵.۲. MVP
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_5_section_2_subsection_1',
                        titleKey: 'phase_5_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_5_2_1',
                                titleKey: 'stage_5_2_1_title', // ۵.۲.۱. تعریف دقیق محدوده MVP
                                descriptionKey: 'stage_5_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_5_2_2',
                                titleKey: 'stage_5_2_2_title', // ۵.۲.۲. جریان کاربری
                                descriptionKey: 'stage_5_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_5_2_3',
                                titleKey: 'stage_5_2_3_title', // ۵.۲.۳. وایرفریم و پروتوتایپ
                                descriptionKey: 'stage_5_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_5_2_4',
                                titleKey: 'stage_5_2_4_title', // ۵.۲.۴. برنامه تست
                                descriptionKey: 'stage_5_2_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_5_section_3',
                titleKey: 'phase_5_section_3_title', // ۵.۳. جنبه‌های فنی
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_5_section_3_subsection_1',
                        titleKey: 'phase_5_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_5_3_1',
                                titleKey: 'stage_5_3_1_title', // ۵.۳.۱. پشته فناوری
                                descriptionKey: 'stage_5_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_5_3_2',
                                titleKey: 'stage_5_3_2_title', // ۵.۳.۲. معماری سیستم
                                descriptionKey: 'stage_5_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_5_3_3',
                                titleKey: 'stage_5_3_3_title', // ۵.۳.۳. برنامه کنترل کیفیت
                                descriptionKey: 'stage_5_3_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_5_3_4',
                                titleKey: 'stage_5_3_4_title', // ۵.۳.۴. منابع مورد نیاز
                                descriptionKey: 'stage_5_3_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۶: استراتژی بازاریابی و فروش
    // ========================================
    {
        id: 'phase_6',
        titleKey: 'phase_6_title',
        descriptionKey: 'phase_6_description',
        order: 6,
        isExpanded: false,
        sections: [
            {
                id: 'phase_6_section_1',
                titleKey: 'phase_6_section_1_title', // ۶.۱. اهداف و شاخص‌ها
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_6_section_1_subsection_1',
                        titleKey: 'phase_6_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_6_1_1',
                                titleKey: 'stage_6_1_1_title', // ۶.۱.۱. اهداف بازاریابی
                                descriptionKey: 'stage_6_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_6_1_2',
                                titleKey: 'stage_6_1_2_title', // ۶.۱.۲. KPIs
                                descriptionKey: 'stage_6_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_6_section_2',
                titleKey: 'phase_6_section_2_title', // ۶.۲. استراتژی‌های بازاریابی
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_6_section_2_subsection_1',
                        titleKey: 'phase_6_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_6_2_1',
                                titleKey: 'stage_6_2_1_title', // ۶.۲.۱. بازاریابی محتوایی
                                descriptionKey: 'stage_6_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_6_2_2',
                                titleKey: 'stage_6_2_2_title', // ۶.۲.۲. SEO
                                descriptionKey: 'stage_6_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_6_2_3',
                                titleKey: 'stage_6_2_3_title', // ۶.۲.۳. شبکه‌های اجتماعی
                                descriptionKey: 'stage_6_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_6_2_4',
                                titleKey: 'stage_6_2_4_title', // ۶.۲.۴. تبلیغات پولی
                                descriptionKey: 'stage_6_2_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                            {
                                id: 'stage_6_2_5',
                                titleKey: 'stage_6_2_5_title', // ۶.۲.۵. بازاریابی ایمیلی
                                descriptionKey: 'stage_6_2_5_description',
                                status: StageStatus.NOT_STARTED,
                                order: 5,
                            },
                            {
                                id: 'stage_6_2_6',
                                titleKey: 'stage_6_2_6_title', // ۶.۲.۶. روابط عمومی
                                descriptionKey: 'stage_6_2_6_description',
                                status: StageStatus.NOT_STARTED,
                                order: 6,
                            },
                            {
                                id: 'stage_6_2_7',
                                titleKey: 'stage_6_2_7_title', // ۶.۲.۷. اینفلوئنسر مارکتینگ
                                descriptionKey: 'stage_6_2_7_description',
                                status: StageStatus.NOT_STARTED,
                                order: 7,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_6_section_3',
                titleKey: 'phase_6_section_3_title', // ۶.۳. استراتژی فروش
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_6_section_3_subsection_1',
                        titleKey: 'phase_6_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_6_3_1',
                                titleKey: 'stage_6_3_1_title', // ۶.۳.۱. کانال‌های فروش
                                descriptionKey: 'stage_6_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_6_3_2',
                                titleKey: 'stage_6_3_2_title', // ۶.۳.۲. فرآیند فروش
                                descriptionKey: 'stage_6_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_6_3_3',
                                titleKey: 'stage_6_3_3_title', // ۶.۳.۳. استراتژی قیمت‌گذاری
                                descriptionKey: 'stage_6_3_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_6_section_4',
                titleKey: 'phase_6_section_4_title', // ۶.۴. برنامه اجرایی
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_6_section_4_subsection_1',
                        titleKey: 'phase_6_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_6_4_1',
                                titleKey: 'stage_6_4_1_title', // ۶.۴.۱. کمپین عرضه
                                descriptionKey: 'stage_6_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_6_4_2',
                                titleKey: 'stage_6_4_2_title', // ۶.۴.۲. تقویم محتوایی
                                descriptionKey: 'stage_6_4_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_6_4_3',
                                titleKey: 'stage_6_4_3_title', // ۶.۴.۳. بودجه بازاریابی
                                descriptionKey: 'stage_6_4_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۷: سازمان، عملیات و امور مالی
    // ========================================
    {
        id: 'phase_7',
        titleKey: 'phase_7_title',
        descriptionKey: 'phase_7_description',
        order: 7,
        isExpanded: false,
        sections: [
            {
                id: 'phase_7_section_1',
                titleKey: 'phase_7_section_1_title', // ۷.۱. سازمان و تیم
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_7_section_1_subsection_1',
                        titleKey: 'phase_7_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_7_1_1',
                                titleKey: 'stage_7_1_1_title', // ۷.۱.۱. تیم موسس
                                descriptionKey: 'stage_7_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_7_1_2',
                                titleKey: 'stage_7_1_2_title', // ۷.۱.۲. نقش‌ها و مسئولیت‌ها
                                descriptionKey: 'stage_7_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_7_1_3',
                                titleKey: 'stage_7_1_3_title', // ۷.۱.۳. ساختار سازمانی
                                descriptionKey: 'stage_7_1_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_7_1_4',
                                titleKey: 'stage_7_1_4_title', // ۷.۱.۴. برنامه استخدام
                                descriptionKey: 'stage_7_1_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_7_section_2',
                titleKey: 'phase_7_section_2_title', // ۷.۲. امور حقوقی
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_7_section_2_subsection_1',
                        titleKey: 'phase_7_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_7_2_1',
                                titleKey: 'stage_7_2_1_title', // ۷.۲.۱. ساختار حقوقی
                                descriptionKey: 'stage_7_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_7_2_2',
                                titleKey: 'stage_7_2_2_title', // ۷.۲.۲. توافق‌نامه موسسین
                                descriptionKey: 'stage_7_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_7_2_3',
                                titleKey: 'stage_7_2_3_title', // ۷.۲.۳. مالکیت معنوی
                                descriptionKey: 'stage_7_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_7_2_4',
                                titleKey: 'stage_7_2_4_title', // ۷.۲.۴. شرایط استفاده و حریم خصوصی
                                descriptionKey: 'stage_7_2_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_7_section_3',
                titleKey: 'phase_7_section_3_title', // ۷.۳. طرح عملیاتی
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_7_section_3_subsection_1',
                        titleKey: 'phase_7_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_7_3_1',
                                titleKey: 'stage_7_3_1_title', // ۷.۳.۱. فرآیندهای کلیدی
                                descriptionKey: 'stage_7_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_7_3_2',
                                titleKey: 'stage_7_3_2_title', // ۷.۳.۲. ابزارها و نرم‌افزارها
                                descriptionKey: 'stage_7_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_7_3_3',
                                titleKey: 'stage_7_3_3_title', // ۷.۳.۳. نقاط عطف
                                descriptionKey: 'stage_7_3_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_7_section_4',
                titleKey: 'phase_7_section_4_title', // ۷.۴. برنامه‌ریزی مالی
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_7_section_4_subsection_1',
                        titleKey: 'phase_7_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_7_4_1',
                                titleKey: 'stage_7_4_1_title', // ۷.۴.۱. مفروضات مالی
                                descriptionKey: 'stage_7_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_7_4_2',
                                titleKey: 'stage_7_4_2_title', // ۷.۴.۲. هزینه‌های راه‌اندازی
                                descriptionKey: 'stage_7_4_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_7_4_3',
                                titleKey: 'stage_7_4_3_title', // ۷.۴.۳. پیش‌بینی فروش
                                descriptionKey: 'stage_7_4_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                            {
                                id: 'stage_7_4_4',
                                titleKey: 'stage_7_4_4_title', // ۷.۴.۴. سود و زیان
                                descriptionKey: 'stage_7_4_4_description',
                                status: StageStatus.NOT_STARTED,
                                order: 4,
                            },
                            {
                                id: 'stage_7_4_5',
                                titleKey: 'stage_7_4_5_title', // ۷.۴.۵. جریان وجوه نقد
                                descriptionKey: 'stage_7_4_5_description',
                                status: StageStatus.NOT_STARTED,
                                order: 5,
                            },
                            {
                                id: 'stage_7_4_6',
                                titleKey: 'stage_7_4_6_title', // ۷.۴.۶. نقطه سر به سر
                                descriptionKey: 'stage_7_4_6_description',
                                status: StageStatus.NOT_STARTED,
                                order: 6,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ========================================
    // فاز ۸: خروجی‌های نهایی و جذب سرمایه
    // ========================================
    {
        id: 'phase_8',
        titleKey: 'phase_8_title',
        descriptionKey: 'phase_8_description',
        order: 8,
        isExpanded: false,
        sections: [
            {
                id: 'phase_8_section_1',
                titleKey: 'phase_8_section_1_title', // ۸.۱. نیازهای مالی
                order: 1,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_8_section_1_subsection_1',
                        titleKey: 'phase_8_section_1_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_8_1_1',
                                titleKey: 'stage_8_1_1_title', // ۸.۱.۱. مبلغ سرمایه
                                descriptionKey: 'stage_8_1_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_8_1_2',
                                titleKey: 'stage_8_1_2_title', // ۸.۱.۲. نحوه استفاده از سرمایه
                                descriptionKey: 'stage_8_1_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_8_section_2',
                titleKey: 'phase_8_section_2_title', // ۸.۲. اسناد و مدارک
                order: 2,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_8_section_2_subsection_1',
                        titleKey: 'phase_8_section_2_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_8_2_1',
                                titleKey: 'stage_8_2_1_title', // ۸.۲.۱. طرح کسب‌وکار کامل
                                descriptionKey: 'stage_8_2_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_8_2_2',
                                titleKey: 'stage_8_2_2_title', // ۸.۲.۲. پیچ دک
                                descriptionKey: 'stage_8_2_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                            {
                                id: 'stage_8_2_3',
                                titleKey: 'stage_8_2_3_title', // ۸.۲.۳. خلاصه یک صفحه‌ای
                                descriptionKey: 'stage_8_2_3_description',
                                status: StageStatus.NOT_STARTED,
                                order: 3,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_8_section_3',
                titleKey: 'phase_8_section_3_title', // ۸.۳. استراتژی جذب سرمایه
                order: 3,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_8_section_3_subsection_1',
                        titleKey: 'phase_8_section_3_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_8_3_1',
                                titleKey: 'stage_8_3_1_title', // ۸.۳.۱. شناسایی سرمایه‌گذاران
                                descriptionKey: 'stage_8_3_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_8_3_2',
                                titleKey: 'stage_8_3_2_title', // ۸.۳.۲. برنامه زمان‌بندی
                                descriptionKey: 'stage_8_3_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'phase_8_section_4',
                titleKey: 'phase_8_section_4_title', // ۸.۴. استراتژی خروج
                order: 4,
                isExpanded: false,
                subSections: [
                    {
                        id: 'phase_8_section_4_subsection_1',
                        titleKey: 'phase_8_section_4_subsection_1_title',
                        order: 1,
                        isExpanded: false,
                        stages: [
                            {
                                id: 'stage_8_4_1',
                                titleKey: 'stage_8_4_1_title', // ۸.۴.۱. گزینه‌های خروج
                                descriptionKey: 'stage_8_4_1_description',
                                status: StageStatus.NOT_STARTED,
                                order: 1,
                            },
                            {
                                id: 'stage_8_4_2',
                                titleKey: 'stage_8_4_2_title', // ۸.۴.۲. چشم‌انداز زمانی
                                descriptionKey: 'stage_8_4_2_description',
                                status: StageStatus.NOT_STARTED,
                                order: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

// Get all stages from all phases (flattened list)
export const getAllStages = (phases: Phase[]): Stage[] => {
    const stages: Stage[] = [];
    phases.forEach(phase => {
        phase.sections.forEach(section => {
            section.subSections.forEach(subSection => {
                stages.push(...subSection.stages);
            });
        });
    });
    return stages;
};

// Get stage by ID
export const getStageById = (phases: Phase[], stageId: string): Stage | null => {
    const allStages = getAllStages(phases);
    return allStages.find(stage => stage.id === stageId) || null;
};

// Calculate progress percentage
export const calculateProgress = (phases: Phase[]): number => {
    const allStages = getAllStages(phases);
    const completedStages = allStages.filter(stage => stage.status === StageStatus.COMPLETED);
    return Math.round((completedStages.length / allStages.length) * 100);
};
