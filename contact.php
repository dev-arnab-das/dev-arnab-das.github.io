<?php
/**
 * Contact Form Handler - Arnab Das Portfolio
 * Uses PHP mail() with optional PHPMailer fallback
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// ── Configuration ──────────────────────────────
define('RECIPIENT_EMAIL', 'arnabdas@email.com');   // <-- Change to your email
define('RECIPIENT_NAME',  'Arnab Das');
define('SITE_NAME',       'Arnab Das Portfolio');
// ──────────────────────────────────────────────

/**
 * Sanitize & validate helpers
 */
function sanitize(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ── Collect & sanitize inputs ──────────────────
$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$phone   = sanitize($_POST['phone']   ?? '');
$service = sanitize($_POST['service'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// ── Validation ────────────────────────────────
$errors = [];

if (empty($name))                   $errors[] = 'Name is required.';
if (!isValidEmail($email))          $errors[] = 'Valid email is required.';
if (empty($subject))                $errors[] = 'Subject is required.';
if (empty($message))                $errors[] = 'Message is required.';
if (strlen($message) < 10)         $errors[] = 'Message is too short.';
if (strlen($name) > 100)           $errors[] = 'Name is too long.';
if (strlen($message) > 5000)       $errors[] = 'Message is too long.';

// Basic spam check (honeypot — add <input name="website" style="display:none"> to form)
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo json_encode(['status' => 'success']); // Silent discard
    exit;
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

// ── Build email ───────────────────────────────
$to      = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
$subLine = '[' . SITE_NAME . '] ' . $subject;

$body  = "You have received a new message from your portfolio website.\n\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "Name    : {$name}\n";
$body .= "Email   : {$email}\n";
if ($phone)   $body .= "Phone   : {$phone}\n";
if ($service) $body .= "Service : {$service}\n";
$body .= "Subject : {$subject}\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "Sent: " . date('Y-m-d H:i:s') . " (Server Time)\n";
$body .= "IP  : " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

// HTML version
$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#050509;color:#f0f0ff;padding:0;margin:0}
  .wrap{max-width:600px;margin:0 auto;padding:30px 20px}
  .header{background:linear-gradient(135deg,#00d4ff,#7b2fff);padding:30px;border-radius:12px 12px 0 0;text-align:center}
  .header h1{color:#fff;font-size:1.5rem;margin:0}
  .body{background:#0a0a14;border:1px solid rgba(255,255,255,0.07);padding:30px;border-radius:0 0 12px 12px}
  .row{margin-bottom:14px}
  .label{font-size:0.75rem;color:#00d4ff;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px}
  .value{font-size:0.95rem;color:#f0f0ff;font-weight:500}
  .msg-box{background:rgba(255,255,255,0.03);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:16px;margin-top:16px;line-height:1.7;white-space:pre-wrap}
  .footer{text-align:center;font-size:0.78rem;color:#555;margin-top:20px}
</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>📨 New Message — {$name}</h1></div>
  <div class="body">
    <div class="row"><div class="label">From</div><div class="value">{$name} &lt;{$email}&gt;</div></div>
    <div class="row"><div class="label">Phone</div><div class="value">{$phone}</div></div>
    <div class="row"><div class="label">Service Requested</div><div class="value">{$service}</div></div>
    <div class="row"><div class="label">Subject</div><div class="value">{$subject}</div></div>
    <div class="msg-box">{$message}</div>
  </div>
  <div class="footer">Sent via arnabdas.com portfolio contact form</div>
</div>
</body></html>
HTML;

// ── Headers ───────────────────────────────────
$boundary = md5(time());
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
$headers .= "From: {$name} <noreply@arnabdas.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 1\r\n";

$fullBody  = "--{$boundary}\r\n";
$fullBody .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n{$body}\r\n";
$fullBody .= "--{$boundary}\r\n";
$fullBody .= "Content-Type: text/html; charset=UTF-8\r\n\r\n{$htmlBody}\r\n";
$fullBody .= "--{$boundary}--";

// ── Send ──────────────────────────────────────
$sent = mail(RECIPIENT_EMAIL, $subLine, $fullBody, $headers);

// Auto-reply to sender
$autoReplySubject = "Thank you for contacting Arnab Das!";
$autoReplyBody = <<<TEXT
Hi {$name},

Thank you for reaching out! I've received your message and will get back to you within 24 hours.

Your message: "{$subject}"

Best regards,
Arnab Das
Creative Web Developer & WordPress Expert
📧 arnabdas@email.com
📱 +91 98765 43210
🌐 arnabdas.com
TEXT;

$autoHeaders  = "From: Arnab Das <arnabdas@email.com>\r\n";
$autoHeaders .= "Reply-To: arnabdas@email.com\r\n";
$autoHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
@mail($email, $autoReplySubject, $autoReplyBody, $autoHeaders);

// ── Response ──────────────────────────────────
if ($sent) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Message sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send email. Please try again.']);
}
