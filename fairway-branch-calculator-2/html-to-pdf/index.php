<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
	      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Document</title>
</head>
<body>

<div style="padding: 30px;">
	<a id="download" href="./dompdf.php
	?cls=single-f-1
	&type=Single
	&cost=$1367
	&home-value=$192,000
	&down-payment=$10,000
	&rate=3.5%
	&term=15
	&kind=No Benefits
	&principal-interest=$1,301
	&insurance=$66
	&fees=$0
	&total=$1,367" target="_blank">download</a>
</div>

<script>
	const link = document.querySelector('#download');
	let query = '';
	const params = {
		'cls': "multi-3",
		'type': "Single Family",
		'cost': "$1,367",
		'home-value': "$192,000",
		'down-payment': "$10,000",
		'rate': "3.5%",
		'term': "15",
		'kind': "Veteran",
		'principal-interest': "$1,301",
		'insurance': "$66",
		'fees': "$0",
		'total': "$1,367"
	};
	let count = 0;

	for (const [key, value] of Object.entries(params)) {
		const symbol = count === 0 ? '' : '&';
		query += `${symbol}${key}=${value}`
		count++;
	}

	link.addEventListener('click', (e) => {
		e.preventDefault();
		window.open(
				`./dompdf.php?${query}`,
				'_blank'
		);
	})
</script>
</body>
</html>
