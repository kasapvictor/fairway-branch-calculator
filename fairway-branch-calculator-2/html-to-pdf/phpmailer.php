<?php
	// date_default_timezone_set('Etc/UTC');

	/*
	 * GITHUB
	 * https://github.com/Synchro/PHPMailer
	 * gmail example https://github.com/Synchro/PHPMailer/blob/master/examples/gmail.phps
	 * ПРЕДОСТАВИТЬ ДОСТУП ПРИЛОЖЕНИЯМ https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4OptACdw6G6pbCKy0pC48gwMnNpIGxdm-la-OtA5SfQkEZ-Qhx7nNcNbbCOaPiJn4SKXXcF2YMG1q5fOeu7ZD4ARXRaAg
	 * РАЗБЛОКИРОВАТЬ ДОСТУП https://accounts.google.com/DisplayUnlockCaptcha
	 * SMTP Сервер: smtp.gmail.com
	 * SMTP Имя пользователя: ваше полное имя пользователя Gmail (электронный адрес), к примеру, vashemail@gmail.com
	 * SMTP Пароль: пароль от вашего Gmail.
	 * SMTP Порт: 465
	 * TLS/SSL: требуется.
	 */
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;

	require_once __DIR__ . '/vendor/autoload.php';

//	echo"<pre>";print_r(file_get_contents(__DIR__ . '/template1/index.html'));echo"</pre>";die();

	$email  = "email@gmail.com";
	$password   = "password";

	$mail = new PHPMailer();
	$mail->isSMTP();
	$mail->SMTPDebug = SMTP::DEBUG_SERVER;
	$mail->Host = 'smtp.gmail.com';
	$mail->Port = 465;
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
	$mail->SMTPAuth = true;
	$mail->Username = $email;
	$mail->Password = $password;
	$mail->setFrom($email, 'First Last');
	$mail->addReplyTo($email, 'First Last');
	$mail->addAddress('kasap.victor@yandex.ru', 'John Victor Doe');
	$mail->Subject = 'PHPMailer GMail SMTP test';
//	$mail->msgHTML(file_get_contents(__DIR__ . '/template1/index.html'));
//	$mail->msgHTML(file_get_contents(__DIR__ . '/gmail.html'));
	$content = "<b> Это тестовое электронное письмо, отправленное через SMTP-сервер Gmail с использованием класса почтовой программы PHP. </b>";
	$mail-> msgHTML ($content);
	$mail->AltBody = 'This is a plain-text message body';
	if (!$mail->send()) {
		echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		echo 'Message sent!';
	}
