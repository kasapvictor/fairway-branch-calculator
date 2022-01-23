const terms = document.querySelectorAll ( '[data-yelp-term]' );
// const URL = 'http://localhost:9000/fraiway-branch-calculator-2/yelp-api.php';
// const URL = 'https://dev.kasapvictor.ru/digitalbutlers/yelp-api.php';
const URL = 'https://digitalbutlers.me/any_scripts/WOWMI_fairway/yelp-api.php';
const parseOnSubmit = async ( url, term = 'delivery' ) => {
	const formData = new FormData ();
	formData.append ( 'term', term );

	const response = await fetch ( url, {
		method: 'POST',
		body: formData
	} );

	return await response.json ();
}


const html = ( name, imageUrl, rating, reviewCount, comment, url, phone, location ) => {
	return `
		<div class="tabs__card--inner">
			<div class="tabs__img">
				<img src="${ imageUrl }" loading="lazy" alt="${ name }" class="image-3">
			 </div>
			 
			<div class="tabs__info yelp">
		
				<div class="yelp__title">${ name }</div>
		
				<div class="yelp__rate">
					<div class="yelp__rate--${ rating.toString().replace(/\./gm, '-') }">${ rating }</div>
					<div class="yelp__rate-text">${ reviewCount } reviews</div>
				</div>
			
	            <p class="yelp__text">${ comment }</p>
	            
				<a href="${ url }" class="link-block w-inline-block" target="_blank">
					<div class="yelp-logo__text">
						Read more on &nbsp; <span class="yelp-logo__icon"> </span>Yelp
					</div>
				</a>
	        </div>
			
			<div class="tabs__phone">
				<div class="tabs__phone-icon"></div>
	            <a href="tel:${ phone }" class="phone-number">${ phone }</a>
	            <div class="tabs__address">${ location.city }, ${ location.state }<br>${ location.address1 }</div>
			</div>
		</div>
	 `;
}

const renderDataYelp = async () => {

	if ( terms.length === 0 ) {
		return false;
	}

	for ( const term of terms ) {
		const termName = term.dataset.yelpTerm;
		const response = await parseOnSubmit ( URL, termName );



			if ( response.success ) {
				let count = 0;
				for ( const [ id, data ] of Object.entries ( response.data ) ) {

					const wrap = document.querySelector(`[data-yelp-term-out-${termName.replace(/\s/gm, '-')}="${count}"]`);
					// console.log(`[data-yelp-term-out-${termName.replace(/\s/gm, '-')}="${count}"]`);
					const name = data.business.name;
					const imageUrl = data.business.image_url;
					const rating = data.business.rating;
					const reviewCount = data.business.review_count;
					const comment = data.reviews[0].text;
					const url = data.business.url;
					// const phone = data.business.phone;
					const phone = data.business.display_phone;
					const location = data.business.location;

					const outHtml = html (
						name,
						imageUrl,
						rating,
						reviewCount,
						comment,
						url,
						phone,
						location
					);

					wrap.innerHTML = '';
					wrap.innerHTML = outHtml;
					count++;

				}
			}

			if ( response.error ) {
				console.log ( response.data );
			}
	}
}

renderDataYelp ();



