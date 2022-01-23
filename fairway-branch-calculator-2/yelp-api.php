<?php
	ini_set('display_errors', 1);
//	error_reporting(E_ALL);
	error_reporting(E_ERROR);
	header ( "Access-Control-Allow-Origin: *" );
	header ( "Access-Control-Allow-Headers: *" );

	// TODO добавить проверку откуда пришел запрос >>> $_SERVER(['HTTP_ORIGIN']) === https://fraiway-branch.io

	/**
	 * Yelp Fusion API code sample.
	 *
	 * This program demonstrates the capability of the Yelp Fusion API
	 * by using the Business Search API to query for businesses by a
	 * search term and location, and the Business API to query additional
	 * information about the top result from the search query.
	 *
	 * Please refer to http://www.yelp.com/developers/v3/documentation
	 * for the API documentation.
	 *
	 * Sample usage of the program:
	 * `php sample.php --term="dinner" --location="San Francisco, CA"`
	 */

// API key placeholders that must be filled in by users.
// You can find it on
// https://www.yelp.com/developers/v3/manage_app
	$API_KEY = "N1q_EAzAkbG6MFMwms1B-dUIX0XmKXAUxtMXYXYx";

// API constants, you shouldn't have to change these.
	$API_HOST = "https://api.yelp.com";
	$SEARCH_PATH = "/v3/businesses/search";
	$BUSINESS_PATH = "/v3/businesses/";  // Business ID will come after slash.

// Defaults for our simple example.
	$DEFAULT_TERM = "dinner";
	$DEFAULT_LOCATION = "San Francisco";
	$SEARCH_LIMIT = 3;

	function request ( $host, $path, $url_params = array () )
	{
		// Send Yelp API Call
		try {
			$curl = curl_init ();
			if ( FALSE === $curl )
				throw new Exception( 'Failed to initialize' );

			$url = $host . $path . "?" . http_build_query ( $url_params );
			curl_setopt_array ( $curl, array (
				CURLOPT_URL => $url,
				CURLOPT_RETURNTRANSFER => true,  // Capture response.
				CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
				CURLOPT_MAXREDIRS => 10,
				CURLOPT_TIMEOUT => 30,
				CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				CURLOPT_CUSTOMREQUEST => "GET",
				CURLOPT_HTTPHEADER => array (
					"authorization: Bearer " . $GLOBALS['API_KEY'],
					"cache-control: no-cache",
				),
			) );

			$response = curl_exec ( $curl );

			if ( FALSE === $response )
				throw new Exception( curl_error ( $curl ), curl_errno ( $curl ) );
			$http_status = curl_getinfo ( $curl, CURLINFO_HTTP_CODE );
			if ( 200 != $http_status )
				throw new Exception( $response, $http_status );

			curl_close ( $curl );
		} catch ( Exception $e ) {
			trigger_error ( sprintf (
				'Curl failed with error #%d: %s',
				$e -> getCode (), $e -> getMessage () ),
				E_USER_ERROR );
		}

		return $response;
	}

	function search ( $term, $location )
	{
		$url_params = array ();

		$url_params['term'] = $term;
		$url_params['location'] = $location;
		$url_params['limit'] = $GLOBALS['SEARCH_LIMIT'];

		return request ( $GLOBALS['API_HOST'], $GLOBALS['SEARCH_PATH'], $url_params );
	}

	function reviews ( $id )
	{
		$url_params = array ();

		return request ( $GLOBALS['API_HOST'], $GLOBALS['BUSINESS_PATH'] . $id . '/reviews', $url_params );
	}

// тестирование получение всех отзывов
//	echo"<pre>";print_r(json_decode (reviews('8kck3-K4zYKTJbJko0JlXQ'), true));echo "</pre>";
//	die();

// тестирование отзывов по id компании
//	$out = [];
//	$search = json_decode ( search ( 'delivery', 'San Francisco' ), true );
//	$businesses = $search['businesses'];
//	foreach ( $businesses as $business ) {
//		$id = $business['id'];
//		$reviews = reviews ( $id );
//		$out[ $id ] = [ 'business' => $business, 'reviews' => json_decode ( $reviews, true )['reviews'] ];
//	}
//
//		echo"<pre>";print_r($out);echo "</pre>";
//		die();

	function getLocation () : string
	{
		$user_ip = getenv ( 'REMOTE_ADDR' );
		$geo = unserialize ( file_get_contents ( "http://www.geoplugin.net/php.gp?ip=$user_ip" ) );
//		$country_code = $geo['geoplugin_countryCode'];
		$country = $geo["geoplugin_countryName"];
		$city = $geo["geoplugin_city"];

		return $country === "US" ? $city : "San Francisco";
	}

	if ( isset( $_POST ) && !empty( $_POST ) && !empty( $_POST['term'] ) ) {
		$term = $_POST['term']; // что искать 'delivery'
		$location = getLocation(); // в каком городе 'San Francisco'
		$out = [];
		$search = json_decode ( search ( $term, $location ), true );
		$businesses = $search['businesses'];

		foreach ( $businesses as $business ) {
			$id = $business['id'];
			$reviews = reviews ( $id );
			$out[ $id ] = [ 'business' => $business, 'reviews' => json_decode ( $reviews, true )['reviews'] ];
		}

// 		тестирование данных для вывода
//		echo"<pre>";print_r($out);echo "</pre>";
//		die();
		echo json_encode ( [ 'success' => 1, 'data' => $out ] );
	} else {
		echo json_encode ( [ 'error' => 1, 'data' => 'some error' ] );
	}





