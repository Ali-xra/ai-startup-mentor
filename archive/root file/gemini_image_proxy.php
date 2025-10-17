<?php

// gemini_image_proxy.php

// این اسکریپت به عنوان یک واسطه امن برای API ساخت تصویر (Imagen) عمل می‌کند.

require_once 'config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
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

// ۳. دریافت و اعتبارسنجی بدنه درخواست
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($requestData['payload'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload or missing payload.']);
    exit;
}

// ۴. آماده‌سازی درخواست برای API ساخت تصویر
$url = 'https://generativelanguage.googleapis.com/v1/models/imagen-4.0-generate-001:generateImages?key=' . $apiKey;
$payload = $requestData['payload'];

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

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $curlError]);
    exit;
}

// ۶. پردازش پاسخ و ساده‌سازی آن برای فرانت‌اند
http_response_code($httpcode);
echo $response; // پاسخ API را مستقیماً به فرانت‌اند ارسال می‌کنیم.

?>