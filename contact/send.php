<?php
declare(strict_types=1);

const MAIL_TO = 'yokoshima-cpta@nifty.com';
const MAIL_FROM = 'info@yokoshima-cpta.com';
const OFFICE_NAME = 'よこしま税理士事務所';
const RATE_LIMIT_SECONDS = 60;
const AUDIENCES = ['法人', '個人事業主', '個人', '士業の方'];

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $key, int $max): string
{
    $value = trim(str_replace("\r\n", "\n", (string)($_POST[$key] ?? '')));
    if (mb_strlen($value) > $max) {
        respond(422, ['ok' => false, 'error' => '入力内容が長すぎます。']);
    }
    return $value;
}

function singleLine(string $value): string
{
    return preg_replace('/[\r\n\t]+/', ' ', $value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => '不正なリクエストです。']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '')) {
    respond(403, ['ok' => false, 'error' => '不正なリクエストです。']);
}

if (field('website', 200) !== '') {
    respond(200, ['ok' => true]);
}

$audience = field('audience', 20);
$name = singleLine(field('name', 150));
$email = singleLine(field('email', 254));
$subject = singleLine(field('subject', 150));
$message = field('message', 5000);

if (!in_array($audience, AUDIENCES, true) || $name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => '入力内容をご確認ください。']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/yokoshima-contact-' . hash('sha256', $ip);
if (is_file($lockFile) && time() - (int)filemtime($lockFile) < RATE_LIMIT_SECONDS) {
    respond(429, ['ok' => false, 'error' => '短時間に連続して送信されました。しばらく時間をおいてお試しください。']);
}

mb_language('uni');
mb_internal_encoding('UTF-8');

$fromHeader = 'From: ' . mb_encode_mimeheader(OFFICE_NAME) . ' <' . MAIL_FROM . '>';
$sentAt = date('Y年n月j日 H:i');
$details = "■ご相談者の区分\n{$audience}\n\n■お名前\n{$name}\n\n■メールアドレス\n{$email}\n\n■件名\n" . ($subject !== '' ? $subject : '（未入力）') . "\n\n■お問い合わせ内容\n{$message}\n";

$adminBody = "ホームページのお問い合わせフォームから送信がありました。\n\n{$details}\n――――――――――\n送信日時：{$sentAt}\n送信元IP：{$ip}\n";
$adminSubject = '【HPお問い合わせ】' . ($subject !== '' ? $subject : $name . ' 様');

$sent = mb_send_mail(
    MAIL_TO,
    $adminSubject,
    $adminBody,
    $fromHeader . "\r\nReply-To: " . $email,
    '-f' . MAIL_FROM
);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => '送信に失敗しました。お手数ですがお電話にてお問い合わせください。']);
}

touch($lockFile);

$autoReplyBody = "{$name} 様\n\nこのたびは" . OFFICE_NAME . "へお問い合わせいただき、ありがとうございます。\n以下の内容で受け付けいたしました。\n内容を確認のうえ、担当者よりご連絡いたします。\n\n{$details}\n――――――――――\n※本メールは自動でお送りしています。\n　お心当たりのない場合は、お手数ですが本メールを破棄してください。\n\n" . OFFICE_NAME . "\n〒305-0041 茨城県つくば市上広岡527-146\nTEL：029-875-6970（平日 9:00–18:00）\nhttps://yokoshima-cpta.com/\n";

mb_send_mail($email, '【' . OFFICE_NAME . '】お問い合わせを受け付けました', $autoReplyBody, $fromHeader, '-f' . MAIL_FROM);

respond(200, ['ok' => true]);
