<?php

	require_once __DIR__ . '/vendor/autoload.php';

	$URL = 'https://dev.kasapvictor.ru/digitalbutlers/html-to-pdf/';

	/**
	 * TCPDF
	 * https://tcpdf.org/examples
	 */
	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

	// атрибуты документа
	$pdf->SetCreator(PDF_CREATOR);
	$pdf->SetAuthor('Fairway Branch');
	$pdf->SetTitle('Fairway Branch Mortgage Calculator');
	$pdf->SetSubject('---');
	$pdf->SetKeywords('calculator, mortgage');

	// хедер и футер
	$pdf->setPrintHeader(false);
	$pdf->setPrintFooter(false);

	// внутренние отступы страницы дот контента до края
//	$pdf->SetMargins(0, 0, 0, true);

	// создание документа
	$pdf->AddPage();
	$html = file_get_contents($URL);
	$pdf->writeHTML($html);
	$pdf->Output('Fairway_Branch_Mortgage_Calculator.pdf', 'I');

