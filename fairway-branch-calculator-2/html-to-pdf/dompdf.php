<?php
//	ini_set('display_errors', 1);
//	error_reporting(E_ALL);
//	error_reporting(E_ERROR);
	header ( "Access-Control-Allow-Origin: *" );
	header ( "Access-Control-Allow-Headers: *" );

	use Dompdf\Dompdf;
	use Dompdf\Options;
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
	use Wa72\HtmlPageDom\HtmlPage;

	require_once __DIR__ . '/vendor/autoload.php';

	if ( isset( $_POST ) && empty( $_POST['params'] ) && empty( $_POST['name'] && empty( $_POST['email'] ) ) ) {
		return false;
	}
	// echo "<pre>"; print_r ( $_POST ); echo "</pre>"; die();


	/* CALC OPTIONS FROM $_POST*/
	$PARAMS = json_decode ( $_POST['params'], true );
	// echo "<pre>";print_r ( $PARAMS );echo "</pre>";die();

	/* DATA OF CALCULATOR
	 * ?cls=single-f-3
	 * &type=Single%20Family
	 * &cost=$1,367
	 * &home-value=$192,000
	 * &down-payment=$10,000
	 * &rate=3.5%
	 * &term=15
	 * &kind=No%20Benefits
	 * &principal-interest=$1,301
	 * &insurance=$66
	 * &fees=$0&total=$1,367
	 */
	$cls = !empty( trim ( $PARAMS['cls'] ) ) ? htmlspecialchars ( trim ( $PARAMS['cls'] ) ) : "no-choose";
	$type = !empty( trim ( $PARAMS['type'] ) ) ? htmlspecialchars ( trim ( $PARAMS['type'] ) ) : "Single";
	$cost = !empty( trim ( $PARAMS['type'] ) ) ? htmlspecialchars ( trim ( $PARAMS['cost'] ) ) : "Single";
	$home_value = !empty( trim ( $PARAMS['home-value'] ) ) ? htmlspecialchars ( trim ( $PARAMS['home-value'] ) ) : "$192,000";
	$down_payment = !empty( trim ( $PARAMS['down-payment'] ) ) ? htmlspecialchars ( trim ( $PARAMS['down-payment'] ) ) : "$10,000";
	$rate = !empty( trim ( $PARAMS['rate'] ) ) ? htmlspecialchars ( trim ( $PARAMS['rate'] ) ) : "3.5%";
	$term = !empty( trim ( $PARAMS['term'] ) ) ? htmlspecialchars ( trim ( $PARAMS['term'] ) ) : "15";
	$kind = !empty( trim ( $PARAMS['kind'] ) ) ? htmlspecialchars ( trim ( $PARAMS['kind'] ) ) : "No Benefits";
	$principal_interest = !empty( trim ( $PARAMS['principal-interest'] ) ) ? htmlspecialchars ( trim ( $PARAMS['principal-interest'] ) ) : "$1,301";
	$insurance = !empty( trim ( $PARAMS['insurance'] ) ) ? htmlspecialchars ( trim ( $PARAMS['insurance'] ) ) : "$66";
	$fees = !empty( trim ( $PARAMS['fees'] ) ) ? htmlspecialchars ( trim ( $PARAMS['fees'] ) ) : "$0";
	$total = !empty( trim ( $PARAMS['total'] ) ) ? htmlspecialchars ( trim ( $PARAMS['total'] ) ) : "$1,367";

	/* TEMPLATE */
	$URL = 'https://dev.kasapvictor.ru/digitalbutlers/html-to-pdf/template1/';
	$HTML = file_get_contents ( $URL );
	$CONTENT = new HtmlPage( $HTML );

	/* UPDATE DATA OF TEMPLATE BY CALCULATOR DATA */
	$CONTENT -> filter ( '.content__build' ) -> addClass ( $cls );
	$CONTENT -> filter ( '[data-type-of-property]' ) -> setText ( $type );
	$CONTENT -> filter ( '[data-price-of-property]' ) -> setText ( $cost );
	$CONTENT -> filter ( '[data-homevalue]' ) -> setText ( $home_value );
	$CONTENT -> filter ( '[data-downpayment]' ) -> setText ( $down_payment );
	$CONTENT -> filter ( '[data-rate]' ) -> setText ( $rate );
	$CONTENT -> filter ( '[data-term]' ) -> setText ( $term );
	$CONTENT -> filter ( '[data-kind]' ) -> setText ( $kind );
	$CONTENT -> filter ( '[data-total-principal-interest]' ) -> setText ( $principal_interest );
	$CONTENT -> filter ( '[data-total-insurance]' ) -> setText ( $insurance );
	$CONTENT -> filter ( '[data-total-fees]' ) -> setText ( $fees );
	$CONTENT -> filter ( '[data-total-monthly]' ) -> setText ( $total );
	$CONTENT -> save ();
	// echo "<pre>";print_r ( $CONTENT );echo "</pre>";die();

	/**
	 * DOMPDF
	 * https://github.com/dompdf/dompdf
	 * http://eclecticgeek.com/dompdf/debug.php
	 */
	$options = new Options();
	$options -> set ( 'isRemoteEnabled', true );
	$options -> setDpi ( 150 );

	$dompdf = new Dompdf( $options );
	$dompdf -> loadHtml ( $CONTENT );

	$dompdf -> setPaper ( 'A4', 'portrait' );

	$dompdf -> render ();

	// 0 открыть в браузере,
	// 1 скачать
	// $dompdf -> stream ( 'Fairway_Branch_Mortgage_Calculator.pdf', [ "Attachment" => 0 ] );

	/* SEND PDF TO MAIL */
	unset ( $_POST['params'] );

	/* SAVE PDF FILE */
	$file = $dompdf -> output ();
	$filename = 'Fairway_Branch_Mortgage_Calculator.pdf';
	$type = 'application/pdf';
	file_put_contents ( __DIR__ . '/temp/' . $filename, $file );

	/* CUSTOMER DATA */
	$name = !empty( trim ( $_POST['name'] ) ) ? htmlspecialchars ( trim ( $_POST['name'] ) ) : "no-name";
	$email = !empty( trim ( $_POST['email'] ) ) ? htmlspecialchars ( trim ( $_POST['email'] ) ) : "";
	$phone = !empty( trim ( $_POST['phone'] ) ) ? htmlspecialchars ( trim ( $_POST['phone'] ) ) : "";
	$zip = !empty( trim ( $_POST['zip'] ) ) ? htmlspecialchars ( trim ( $_POST['zip'] ) ) : "";

	/* ACCOUNT */
	$from = "kasap.victor@yandex.ru";
	$mailName = "Fairway Branch";
	$subject = "Fairway Branch Mortgage Calculator";
	$smtpLogin = "kasap.victor@yandex.ru";
	$smtp = "smtp.yandex.ru";
	$password = "-----";
	$owner = "kasap.victor@yandex.ru";

	/* SEND MAIL PDF */
	send ( $from, $smtpLogin, $smtp, $password, $owner, $mailName, $subject, $filename, $type, $name, $email, $phone, $zip );

	/* SEND MAIL */
	function send ( $from, $smtpLogin, $smtp, $password, $owner, $mailName, $subject, $filename, $type, $name, $email, $phone, $zip )
	{
		/* TO CUSTOMER */
		$message_customer_html = <<<EOT
					<html lang="en">
						<body>
							<h3>Dear Customer</h3>
							<p>You get this message because we love YOU!</p>
						</body>
					</html>
					EOT;

		$messageToCustomer = ( new MessageBodyCollection( $message_customer_html ) )
			-> withAttachment ( new FileAttachment( __DIR__ . "/temp/$filename", new ContentType( $type ) ) )
			-> createMessage ()
			-> withHeader ( new Subject( $subject ) )
			-> withHeader ( From ::fromAddress ( $from, $mailName ) )
			-> withHeader ( To ::fromSingleRecipient ( $email, 'Dear Customer' ) );
		// -> withHeader ( Bcc ::fromSingleRecipient ( 'kasap.victor@icloud.com', 'BCC' ) );


		/* TO OWNER */
		$date = date ( 'm.d.y H:m:s' );
		$message_owner_html = <<<EOT
					<html lang="en">
						<body>
							<h3>Report of mortgage calculator</h3>
							<p>from $date</p>
							<ul>
								<li><strong>Name: </strong>$name</li>
								<li><strong>Email: </strong>$email</li>
								<li><strong>Phone: </strong>$phone</li>
								<li><strong>ZIP: </strong>$zip</li>
							</ul>
						</body>
					</html>
					EOT;
		$messageToOwner = ( new MessageBodyCollection( $message_owner_html ) )
			-> withAttachment ( new FileAttachment( __DIR__ . "/temp/$filename", new ContentType( $type ) ) )
			-> createMessage ()
			-> withHeader ( new Subject( "New report of calculator ::: $date" ) )
			-> withHeader ( From ::fromAddress ( $from, $mailName ) )
			-> withHeader ( To ::fromSingleRecipient ( $owner, 'New report of calculator' ) );

		$transport = new SmtpTransport(
			ClientFactory ::fromString ( "smtp://$smtpLogin:$password@$smtp/" ) -> newClient (),
			EnvelopeFactory ::useExtractedHeader ()
		);

		try {
			$transport -> send ( $messageToCustomer );
			$transport -> send ( $messageToOwner );
			echo json_encode ( [ 'success' =>
				[
					'message' => 'Thank you for choosing us! Your report has been sent to your email!',
					'redirect' => ''
				]
			] );
		} catch ( Exception $e ) {
			// echo 'Ошибка отправки: ',  $e->getMessage(), "\n"; // для отладки
			echo json_encode ( [ 'errors' => [
					'An error occurred while sending your message.'
				]
				]
			);
		}

		unlink ( __DIR__ . '/temp/' . $filename );
	}








