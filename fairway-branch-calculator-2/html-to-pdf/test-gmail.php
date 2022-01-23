<?php
	header('Content-Type: text/html; charset=utf-8');

	/**
	 * MANUAL
	 * https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4PexucHVfE85d2Y9_JTWu2vqDjYOGm4HK37xcZ2brqDDh8bibZjb2JFpemH_pXBUvIOs52NHhghMILsDPmKrS9Sypibgw
	 * ПРЕДОСТАВИТЬ ДОСТУП ПРИЛОЖЕНИЯМ https://myaccount.google.com/u/0/lesssecureapps?pli=1&rapt=AEjHL4OptACdw6G6pbCKy0pC48gwMnNpIGxdm-la-OtA5SfQkEZ-Qhx7nNcNbbCOaPiJn4SKXXcF2YMG1q5fOeu7ZD4ARXRaAg
	 * РАЗБЛОКИРОВАТЬ ДОСТУП https://accounts.google.com/DisplayUnlockCaptcha
	 * SMTP Сервер: smtp.gmail.com
	 * SMTP Имя пользователя: ваше полное имя пользователя Gmail (электронный адрес), к примеру, vashemail@gmail.com
	 * SMTP Пароль: пароль от вашего Gmail.
	 * SMTP Порт: 465
	 * TLS/SSL: требуется
	 */

	use Genkgo\Mail\Header\Bcc;
	use Genkgo\Mail\Header\ContentType;
	use Genkgo\Mail\Header\From;
	use Genkgo\Mail\Header\Subject;
	use Genkgo\Mail\Header\To;
	use Genkgo\Mail\MessageBodyCollection;
	use Genkgo\Mail\Mime\FileAttachment;
	use Genkgo\Mail\Protocol\Smtp\ClientFactory;
	use Genkgo\Mail\Transport\EnvelopeFactory;
	use Genkgo\Mail\Transport\SmtpTransport;

	require_once __DIR__ . '/vendor/autoload.php';

	$message_customer_html = <<<EOT
					<html lang="en">
						<body>
							<h3>Dear Customer</h3>
							<p>You get this message because we love YOU!</p>
						</body>
					</html>
					EOT;
	$messageToCustomer = ( new MessageBodyCollection( $message_customer_html ) )
		//-> withAttachment ( new FileAttachment( __DIR__ . "/temp/$filename", new ContentType( $type ) ) )
		-> createMessage ()
		-> withHeader ( new Subject( "My message to YOU" ) )
		-> withHeader ( From ::fromAddress ( "kasap.victor@gmail.com", "my gmail message" ) )
		-> withHeader ( To ::fromSingleRecipient ( "kasap.victor@yandex.ru", 'For you my friend' ) );

	$config = [
		'smtp' => "smtps://email:password@smtp.gmail.com/"
	];
	$transport = new SmtpTransport(
		ClientFactory ::fromString ( $config['smtp'] ) -> newClient (),
		EnvelopeFactory ::useExtractedHeader ()
	);

	try {
		$transport -> send ( $messageToCustomer );
		echo "SUCCESS!!!";
	} catch ( Exception $e ) {
		 echo 'Ошибка отправки: ',  $e->getMessage(), "\n"; // для отладки
	}

