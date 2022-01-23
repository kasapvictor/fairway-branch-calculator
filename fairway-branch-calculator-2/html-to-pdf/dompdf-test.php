<?php
//	ini_set('display_errors', 1);
//	error_reporting(E_ALL);
//	error_reporting(E_ERROR);
	header ( "Access-Control-Allow-Origin: *" );
	header ( "Access-Control-Allow-Headers: *" );

	// ЗАХОДИТЬ ПО ПРЯМОЙ ССЫЛКЕ
	// http://localhost:9000/dompdf-test.php?cls=single-f-1&type=Single%20Family&cost=$1,946&home-value=$300,000&down-payment=$10,000&rate=2.1%&term=15&kind=No&principal-interest=$$1,880&insurance=$66&fees=$0&total=$1,946

	/*
	 * http://localhost:9000/html-to-pdf/dompdf-test.php
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

	use Dompdf\Dompdf;
	use Dompdf\Options;
	use Wa72\HtmlPageDom\HtmlPage;

	require_once __DIR__ . '/vendor/autoload.php';

	 $URL = __DIR__.'/template1/index.html';
//	$URL = 'https://dev.kasapvictor.ru/digitalbutlers/html-to-pdf/template1/index.html';
	$HTML = file_get_contents ( $URL );
	$CONTENT = new HtmlPage($HTML);

	$cls = !empty(trim($_GET['cls'])) ? htmlspecialchars (trim($_GET['cls'])) : "no-choose";
	$type = !empty(trim($_GET['type'])) ? htmlspecialchars (trim($_GET['type'])) : "Single";
	$cost = !empty(trim($_GET['type'])) ? htmlspecialchars (trim($_GET['cost'])) : "Single";
	$home_value = !empty(trim($_GET['home-value'])) ? htmlspecialchars (trim($_GET['home-value'])) : "$192,000";
	$down_payment = !empty(trim($_GET['down-payment'])) ? htmlspecialchars (trim($_GET['down-payment'])) : "$10,000";
	$rate = !empty(trim($_GET['rate'])) ? htmlspecialchars (trim($_GET['rate'])) : "3.5%";
	$term = !empty(trim($_GET['term'])) ? htmlspecialchars (trim($_GET['term'])) : "15";
	$kind = !empty(trim($_GET['kind'])) ? htmlspecialchars (trim($_GET['kind'])) : "No Benefits";
	$principal_interest = !empty(trim($_GET['principal-interest'])) ? htmlspecialchars (trim($_GET['principal-interest'])) : "$1,301";
	$insurance = !empty(trim($_GET['insurance'])) ? htmlspecialchars (trim($_GET['insurance'])) : "$66";
	$fees = !empty(trim($_GET['fees'])) ? htmlspecialchars (trim($_GET['fees'])) : "$0";
	$total = !empty(trim($_GET['total'])) ? htmlspecialchars (trim($_GET['total'])) : "$1,367";

	// UPDATE DATA
	$CONTENT->filter ('.content__build')->addClass ($cls);
	$CONTENT->filter ('[data-type-of-property]')->setText($type);
	$CONTENT->filter ('[data-price-of-property]')->setText($cost);
	$CONTENT->filter ('[data-homevalue]')->setText($home_value);
	$CONTENT->filter ('[data-downpayment]')->setText($down_payment);
	$CONTENT->filter ('[data-rate]')->setText($rate);
	$CONTENT->filter ('[data-term]')->setText($term);
	$CONTENT->filter ('[data-kind]')->setText($kind);
	$CONTENT->filter ('[data-total-principal-interest]')->setText($principal_interest);
	$CONTENT->filter ('[data-total-insurance]')->setText($insurance);
	$CONTENT->filter ('[data-total-fees]')->setText($fees);
	$CONTENT->filter ('[data-total-monthly]')->setText($total);

	$CONTENT->save ();

//	echo $CONTENT;
//	echo"<pre>";print_r($CONTENT);echo"</pre>";die();
//	echo "<pre>";print_r($HTML);echo"</pre>";

	/**
	 * DOMPDF
	 * https://github.com/dompdf/dompdf
	 * http://eclecticgeek.com/dompdf/debug.php
	 */

	$options = new Options();
	$options -> set ( 'isRemoteEnabled', true );
	$options->setDpi(150);

	$dompdf = new Dompdf( $options );
//	$dompdf -> loadHtml ( $HTML );
	$dompdf -> loadHtml ( $CONTENT );

	$dompdf -> setPaper ( 'A4', 'portrait' );

	$dompdf -> render ();
	$dompdf -> stream ( 'Fairway_Branch_Mortgage_Calculator.pdf', [ "Attachment" => 0 ] ); // 0 открыть в браузере, 1 скачать
