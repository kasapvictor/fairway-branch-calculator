/**
 * Возвращает число в денежном формате
 * @param value
 * @return {string}
 * {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat}
 */
function toMoney ( value = null ) {
	let out = '';

	if ( value === '0' ) return '0';

	if ( +value ) {
		const formatter = new Intl.NumberFormat ( 'en-US', {
			style: 'decimal',
			currency: 'USD',
		} );

		out = `${ formatter.format ( value ) }`;
	}

	return out;
}

export default toMoney;
