<?php

// gemini_proxy.php

// این اسکریپت به عنوان یک واسطه امن برای API جمنای عمل می‌کند.
// این کار از افشای کلید API شما در کد فرانت‌اند جلوگیری می‌کند.

// فایل تنظیمات امن را فراخوانی می‌کند تا به کلید API دسترسی پیدا کند.
require_once 'config.php';

// تنظیم هدرهای لازم برای ارتباط صحیح با فرانت‌اند
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // موقت برای تست
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin");
header("Access-Control-Max-Age: 86400"); // کش کردن preflight برای 24 ساعت

// رسیدگی به درخواست‌های preflight برای CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin");
    header("Access-Control-Max-Age: 86400");
    exit(0);
}

// ۱. بررسی وجود کلید API
if (!defined('GEMINI_API_KEY') || GEMINI_API_KEY === 'AIza...................................') {
    http_response_code(500);
    echo json_encode(['error' => 'API key is not configured in config.php on the server.']);
    exit;
}
$apiKey = GEMINI_API_KEY;

// ۲. اعتبارسنجی متد درخواست
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// ۳. دریافت و اعتبارسنجی بدنه درخواست از فرانت‌اند
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload.']);
    exit;
}

// ۴. آماده‌سازی درخواست برای API جمنای
// فرانت‌اند ممکن است 'action' و 'payload' بفرستد (قدیمی) یا مستقیم payload بفرستد (جدید)
$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' . $apiKey;

// اگر action وجود داشت، از payload استفاده کن، در غیر این صورت کل requestData رو بفرست
if (isset($requestData['action']) && isset($requestData['payload'])) {
    $payload = $requestData['payload'];
} else {
    $payload = $requestData;
}

// ۵. ارسال درخواست با cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// ۶. رسیدگی به خطاهای احتمالی و ارسال پاسخ نهایی
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $curlError]);
    exit;
}

// پردازش پاسخ از Gemini
$geminiResponse = json_decode($response, true);

// استخراج متن از پاسخ Gemini
$text = '';
$sources = [];

if (isset($geminiResponse['candidates'][0]['content']['parts'][0]['text'])) {
    $text = $geminiResponse['candidates'][0]['content']['parts'][0]['text'];
}

// استخراج sources اگر وجود داشته باشد
if (isset($geminiResponse['candidates'][0]['groundingMetadata']['groundingChunks'])) {
    foreach ($geminiResponse['candidates'][0]['groundingMetadata']['groundingChunks'] as $chunk) {
        if (isset($chunk['web'])) {
            $sources[] = [
                'uri' => $chunk['web']['uri'] ?? '',
                'title' => $chunk['web']['title'] ?? ''
            ];
        }
    }
}

// تنظیم کد وضعیت HTTP مشابه پاسخی که از API جمنای دریافت شده
http_response_code($httpcode);

// ارسال پاسخ ساده شده به فرانت‌اند
echo json_encode([
    'text' => $text,
    'sources' => $sources
]);

?>
