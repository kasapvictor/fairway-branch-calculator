import toMoney from "./toMoney";
import { RANGES } from './setup';

/**
 * проверка на существование элемента
 * @return {Element|boolean}
 */
function isExist () {
	return RANGES.wrap;
}

function initRanges () {
	if ( !isExist () ) return false;

	const homeValue = RANGES.homeValue;
	const downPayment = RANGES.downPayment;
	const interestRate = RANGES.interestRate;

	setRangeHomeValue ( homeValue );
	setRangeDownPayment ( downPayment );
	setRangeInterestRate ( interestRate );

	rangeHomeValueHandler ( homeValue );
	rangeDownPaymentHandler ( downPayment );
	rangeInterestRateHandler ( interestRate );
}

export function setRangeHomeValue ( range ) {
	const input = range.input ();
	input.min = range.min;
	input.max = range.max;
	input.value = range.value;
	input.step = range.step;

	range.htmlOut ().innerHTML = toMoney ( input.value );
	range.htmlMin ().innerHTML = toMoney ( input.min );
	range.htmlMax ().innerHTML = toMoney ( input.max );

	/* FILL */
	const newValue = Number ( (input.value - input.min) * 100 / (input.max - input.min) );
	const newPosition = 10 - (newValue * 0.2);
	range.fill ().style.width = `calc(${ newValue }% + (${ newPosition }px))`;

	/*  DOWN PAYMENT */
	setRangeDownPayment ( RANGES.downPayment );
}

export function setRangeDownPayment ( range, veteran = false ) {
	const input = range.input ();
	const isVeteran = document.querySelector ( '[data-kind="veteran"]' ).dataset.kindCheck;

	if ( isVeteran === 'true' || veteran ) {
		range.min = 0;
	} else {
		range.min = RANGES.homeValue.min / 100 * 5;
	}

	// если стоимость дома выше 800.000 то включить минимальный взнос от 5.000 --- 5% от максимальной стоимости
	if ( RANGES.homeValue.value > 800000 ) {
		range.min = RANGES.homeValue.min / 100 * 5;
		range.value = input.value;
	}


	input.min = range.min;
	range.max = RANGES.homeValue.value / 100 * 25;
	input.max = range.max;
	input.value = range.value;
	input.step = range.step;

	// если текущее значение больше или равно максимальному
	// то перезаписать range.value равному input.max
	if ( +range.value >= input.max ) {
		range.value = input.max;
	}

	range.htmlOut ().innerHTML = toMoney ( input.value );
	range.htmlMin ().innerHTML = toMoney ( input.min );
	range.htmlMax ().innerHTML = toMoney ( input.max );

	/* FILL */
	const newValue = Number ( (input.value - input.min) * 100 / (input.max - input.min) );
	const newPosition = 10 - (newValue * 0.2);

	range.fill ().style.width = `calc(${ newValue }% + (${ newPosition }px))`;
}

export function setRangeInterestRate ( range ) {
	const input = range.input ();
	input.min = range.min;
	input.max = range.max;
	input.value = range.value;
	input.step = range.step;

	range.htmlOut ().innerHTML = input.value;
	range.htmlMin ().innerHTML = input.min;
	range.htmlMax ().innerHTML = input.max;
	// range.fill ().style.width = `${ input.value * 2.5 }%`;

	const newValue = Number ( (input.value - input.min) * 100 / (input.max - input.min) );
	const newPosition = 10 - (newValue * 0.2);

	range.fill ().style.width = `calc(${ newValue }% + (${ newPosition }px))`;
}

function rangeHomeValueHandler ( range ) {
	const input = range.input ();

	input.addEventListener ( 'input', () => {
		range.value = input.value;
		setRangeHomeValue ( range );
	} )
}

function rangeDownPaymentHandler ( range ) {
	const input = range.input ();

	input.addEventListener ( 'input', () => {
		range.value = input.value;
		setRangeDownPayment ( range );
	} )
}

function rangeInterestRateHandler ( range ) {
	const input = range.input ();

	input.addEventListener ( 'input', () => {
		range.value = input.value;
		setRangeInterestRate ( range );
	} )
}

initRanges ();

