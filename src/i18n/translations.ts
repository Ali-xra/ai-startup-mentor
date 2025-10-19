import { LanguageCode } from '../services/translationService';

// Static UI translations (not dynamic content from AI)
export interface Translations {
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  close: string;

  // Navigation
  next: string;
  previous: string;
  back: string;
  continue: string;

  // Auth
  login: string;
  logout: string;
  signup: string;
  email: string;
  password: string;
  forgotPassword: string;

  // Welcome Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  getStarted: string;

  // Chat Interface
  typeMessage: string;
  send: string;
  thinking: string;
  chat_current_prompt: string;
  chat_current_question: string;
  chat_awaiting_input: string;
  chat_welcome_message: string;
  chat_start_question: string;
  chat_placeholder_default: string;
  chat_placeholder_awaiting_suggestion: string;
  chat_send_button_tooltip: string;
  chat_suggest_button_tooltip: string;
  chat_complete_title: string;
  chat_continue_to_next_section: string;

  // Stage Navigation
  stage: string;
  of: string;
  complete: string;
  incomplete: string;

  // AI Response
  acceptResponse: string;
  regenerate: string;
  aiSuggestion: string;

  // Settings
  settings: string;
  language: string;
  theme: string;
  theme_light: string;
  theme_dark: string;
  profile: string;

  // Errors
  errorLoadingData: string;
  errorSavingData: string;
  errorGeneratingResponse: string;
  pleaseTryAgain: string;

  // Blueprint
  downloadBlueprint: string;
  viewBlueprint: string;
  blueprintReady: string;

  // Export Options
  settings_export_options: string;
  export_pdf: string;
  export_word: string;
  export_csv: string;
  export_excel: string;

  // Search
  search_placeholder: string;
}

const translations: Record<LanguageCode, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',

    // Navigation
    next: 'Next',
    previous: 'Previous',
    back: 'Back',
    continue: 'Continue',

    // Auth
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',

    // Welcome Screen
    welcomeTitle: 'Welcome to AI Startup Mentor',
    welcomeSubtitle: 'Your AI-powered guide to building a successful startup',
    getStarted: 'Get Started',

    // Chat Interface
    typeMessage: 'Type your message...',
    send: 'Send',
    thinking: 'AI is thinking...',
    chat_current_prompt: 'Current Prompt',
    chat_current_question: 'Current Question',
    chat_awaiting_input: 'Awaiting your input...',
    chat_welcome_message: "Welcome! Let's start building your startup idea.",
    chat_start_question: 'What is your startup idea?',
    chat_placeholder_default: 'Type your response...',
    chat_placeholder_awaiting_suggestion: 'Waiting for AI suggestion...',
    chat_send_button_tooltip: 'Send message',
    chat_suggest_button_tooltip: 'Get AI suggestion',
    chat_complete_title: 'Journey Complete!',
    chat_continue_to_next_section: 'Continue to Next Section',

    // Stage Navigation
    stage: 'Stage',
    of: 'of',
    complete: 'Complete',
    incomplete: 'Incomplete',

    // AI Response
    acceptResponse: 'Accept',
    regenerate: 'Regenerate',
    aiSuggestion: 'AI Suggestion',

    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    profile: 'Profile',

    // Errors
    errorLoadingData: 'Error loading data',
    errorSavingData: 'Error saving data',
    errorGeneratingResponse: 'Error generating response',
    pleaseTryAgain: 'Please try again',

    // Blueprint
    downloadBlueprint: 'Download Blueprint',
    viewBlueprint: 'View Blueprint',
    blueprintReady: 'Blueprint Ready',

    // Export Options
    settings_export_options: 'Export Options',
    export_pdf: 'Export PDF',
    export_word: 'Export Word',
    export_csv: 'Export CSV',
    export_excel: 'Export Excel',

    // Search
    search_placeholder: 'Search business plan...',
  },

  fa: {
    // Common
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',
    cancel: 'لغو',
    confirm: 'تأیید',
    save: 'ذخیره',
    delete: 'حذف',
    edit: 'ویرایش',
    close: 'بستن',

    // Navigation
    next: 'بعدی',
    previous: 'قبلی',
    back: 'بازگشت',
    continue: 'ادامه',

    // Auth
    login: 'ورود',
    logout: 'خروج',
    signup: 'ثبت‌نام',
    email: 'ایمیل',
    password: 'رمز عبور',
    forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',

    // Welcome Screen
    welcomeTitle: 'به مربی هوشمند استارتاپ خوش آمدید',
    welcomeSubtitle: 'راهنمای هوشمند شما برای ساخت یک استارتاپ موفق',
    getStarted: 'شروع کنید',

    // Chat Interface
    typeMessage: 'پیام خود را بنویسید...',
    send: 'ارسال',
    thinking: 'هوش مصنوعی در حال فکر کردن...',
    chat_current_prompt: 'دستورالعمل فعلی',
    chat_current_question: 'سوال فعلی',
    chat_awaiting_input: 'در انتظار پاسخ شما...',
    chat_welcome_message: 'خوش آمدید! بیایید ایده استارتاپ شما را بسازیم.',
    chat_start_question: 'ایده استارتاپ شما چیست؟',
    chat_placeholder_default: 'پاسخ خود را بنویسید...',
    chat_placeholder_awaiting_suggestion: 'در انتظار پیشنهاد هوش مصنوعی...',
    chat_send_button_tooltip: 'ارسال پیام',
    chat_suggest_button_tooltip: 'دریافت پیشنهاد هوش مصنوعی',
    chat_complete_title: 'مسیر تکمیل شد!',
    chat_continue_to_next_section: 'ادامه به بخش بعدی',

    // Stage Navigation
    stage: 'مرحله',
    of: 'از',
    complete: 'تکمیل شده',
    incomplete: 'ناتمام',

    // AI Response
    acceptResponse: 'قبول',
    regenerate: 'ساخت مجدد',
    aiSuggestion: 'پیشنهاد هوش مصنوعی',

    // Settings
    settings: 'تنظیمات',
    language: 'زبان',
    theme: 'تم',
    theme_light: 'روشن',
    theme_dark: 'تیره',
    profile: 'پروفایل',

    // Errors
    errorLoadingData: 'خطا در بارگذاری اطلاعات',
    errorSavingData: 'خطا در ذخیره اطلاعات',
    errorGeneratingResponse: 'خطا در تولید پاسخ',
    pleaseTryAgain: 'لطفاً دوباره تلاش کنید',

    // Blueprint
    downloadBlueprint: 'دانلود نقشه',
    viewBlueprint: 'مشاهده نقشه',
    blueprintReady: 'نقشه آماده است',

    // Export Options
    settings_export_options: 'گزینه‌های خروجی',
    export_pdf: 'خروجی PDF',
    export_word: 'خروجی ورد',
    export_csv: 'خروجی CSV',
    export_excel: 'خروجی اکسل',

    // Search
    search_placeholder: 'جستجو در طرح کسب و کار...',
  },

  // TODO: Add FR, ES, DE translations when ready
  /*
  fr: {
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',

    // Navigation
    next: 'Suivant',
    previous: 'Précédent',
    back: 'Retour',
    continue: 'Continuer',

    // Auth
    login: 'Connexion',
    logout: 'Déconnexion',
    signup: 'S\'inscrire',
    email: 'Email',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié?',

    // Welcome Screen
    welcomeTitle: 'Bienvenue sur AI Startup Mentor',
    welcomeSubtitle: 'Votre guide intelligent pour créer une startup réussie',
    getStarted: 'Commencer',

    // Chat Interface
    typeMessage: 'Tapez votre message...',
    send: 'Envoyer',
    thinking: 'L\'IA réfléchit...',

    // Stage Navigation
    stage: 'Étape',
    of: 'sur',
    complete: 'Terminé',
    incomplete: 'Incomplet',

    // AI Response
    acceptResponse: 'Accepter',
    regenerate: 'Régénérer',
    aiSuggestion: 'Suggestion IA',

    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    profile: 'Profil',

    // Errors
    errorLoadingData: 'Erreur de chargement des données',
    errorSavingData: 'Erreur de sauvegarde des données',
    errorGeneratingResponse: 'Erreur de génération de réponse',
    pleaseTryAgain: 'Veuillez réessayer',

    // Blueprint
    downloadBlueprint: 'Télécharger le plan',
    viewBlueprint: 'Voir le plan',
    blueprintReady: 'Plan prêt'
  },

  es: {
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',

    // Navigation
    next: 'Siguiente',
    previous: 'Anterior',
    back: 'Volver',
    continue: 'Continuar',

    // Auth
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',

    // Welcome Screen
    welcomeTitle: 'Bienvenido a AI Startup Mentor',
    welcomeSubtitle: 'Tu guía inteligente para construir una startup exitosa',
    getStarted: 'Comenzar',

    // Chat Interface
    typeMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    thinking: 'La IA está pensando...',

    // Stage Navigation
    stage: 'Etapa',
    of: 'de',
    complete: 'Completo',
    incomplete: 'Incompleto',

    // AI Response
    acceptResponse: 'Aceptar',
    regenerate: 'Regenerar',
    aiSuggestion: 'Sugerencia de IA',

    // Settings
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    profile: 'Perfil',

    // Errors
    errorLoadingData: 'Error al cargar datos',
    errorSavingData: 'Error al guardar datos',
    errorGeneratingResponse: 'Error al generar respuesta',
    pleaseTryAgain: 'Por favor, inténtalo de nuevo',

    // Blueprint
    downloadBlueprint: 'Descargar plano',
    viewBlueprint: 'Ver plano',
    blueprintReady: 'Plano listo'
  },

  de: {
    // Common
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',

    // Navigation
    next: 'Weiter',
    previous: 'Zurück',
    back: 'Zurück',
    continue: 'Fortfahren',

    // Auth
    login: 'Anmelden',
    logout: 'Abmelden',
    signup: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen?',

    // Welcome Screen
    welcomeTitle: 'Willkommen bei AI Startup Mentor',
    welcomeSubtitle: 'Ihr intelligenter Leitfaden für ein erfolgreiches Startup',
    getStarted: 'Loslegen',

    // Chat Interface
    typeMessage: 'Nachricht eingeben...',
    send: 'Senden',
    thinking: 'KI denkt nach...',

    // Stage Navigation
    stage: 'Phase',
    of: 'von',
    complete: 'Abgeschlossen',
    incomplete: 'Unvollständig',

    // AI Response
    acceptResponse: 'Akzeptieren',
    regenerate: 'Neu generieren',
    aiSuggestion: 'KI-Vorschlag',

    // Settings
    settings: 'Einstellungen',
    language: 'Sprache',
    theme: 'Design',
    profile: 'Profil',

    // Errors
    errorLoadingData: 'Fehler beim Laden der Daten',
    errorSavingData: 'Fehler beim Speichern der Daten',
    errorGeneratingResponse: 'Fehler beim Generieren der Antwort',
    pleaseTryAgain: 'Bitte versuchen Sie es erneut',

    // Blueprint
    downloadBlueprint: 'Plan herunterladen',
    viewBlueprint: 'Plan ansehen',
    blueprintReady: 'Plan bereit'
  }
  */
};

// Helper function to get translations for a specific language
export const getTranslations = (language: LanguageCode): Translations => {
  return translations[language] || translations.en;
};

// Helper hook for use in components
export const useTranslations = (language: LanguageCode) => {
  return getTranslations(language);
};

export default translations;
