import toMoney from "./toMoney";
import { CLASSES, CALC_UI, CALC_VALUES, RANGES } from './setup';
import { setRangeHomeValue, setRangeDownPayment, setRangeInterestRate } from './ranges';

/**
 * Начальная проверка на наличие элементов
 * @return {boolean}
 */
function isExist () {
	const buttons = [ ...CALC_UI.buttonsOfTypes () ];
	return buttons.length > 0;
}

/* BUTTONS FUNCTIONS OF CALC */
/**
 * инициализация клика на выбор типа собственности
 * @return {boolean}
 */
function initButtonTypesHandler () {
	if ( !isExist () ) {
		return false;
	}

	const buttons = [ ...CALC_UI.buttonsOfTypes () ];

	// событие при клике на кнопку типа собственности
	buttons.forEach ( button => button.addEventListener ( 'click', () => buttonTypesHandler ( button ) ) )
}

/**
 * data-type-of-property="single"
 * data-type-of-property="condominium"
 * data-type-of-property="town"
 * data-type-of-property="multi"
 * @param button
 */
function buttonTypesHandler ( button ) {
	const type = button.dataset.typeOfProperty;

	// задаем значение типа собственности
	setCalcValuesOpt ( type );

	// Функция меняет zIndex у зеленой кнопки
	changeCircleBtnZIndex ( type );

	// обновление класса в UI_CALS.calcBody()
	updateClsOfBody ();
}

/**
 * Функция меняет zIndex у зеленой кнопки
 * @param type
 * @return {boolean}
 */
function changeCircleBtnZIndex ( type ) {
	const btns = document.querySelectorAll ( '[data-circle-type-of-property]' );
	if ( btns.length === 0 ) {
		return false;
	}
	btns.forEach ( btn => btn.style.zIndex = 0 );
	const circle = [ ...btns ].find ( btn => btn.dataset.circleTypeOfProperty === type );

	if ( circle ) {
		circle.style.zIndex = 40;
	}
}

/* CHECKBOXES OF CALC */
/**
 * События по клику на veteran + 1st
 */
function kindHandler () {
	if ( !isExist () ) {
		return false;
	}

	const buttons = [ ...CALC_UI.buttonsOfTypes () ];

	if ( buttons.length === 0 ) {
		return false;
	}

	const items = CALC_UI.kind ();

	items.forEach ( item => {
		item.addEventListener ( 'click', () => {
			const kind = item.dataset.kind;
			const term = +CALC_VALUES.term;

			if ( item.classList.contains ( 'calc__radio-btn--active' ) ) {
				item.classList.remove ( 'calc__radio-btn--active' );
				item.dataset.kindCheck = 'false';
				CALC_UI.kindDesc ().innerHTML = 'I have no benefits';
			} else {
				removeActiveOfKind ();

				switch ( true ) {
					case kind === 'veteran' && term === 15:
						recalcVeteran ( 15 );
						break;
					case kind === 'veteran' && term === 30:
						recalcVeteran ( 30 );
						break;
					case kind === 'first':
						RANGES.downPayment.value = RANGES.homeValue.min / 100 * 10;
						RANGES.interestRate.value = CALC_VALUES._1st[0];
						// RANGES.homeValue.value = CALC_VALUES._1st[1];
						break;
				}

				item.classList.add ( 'calc__radio-btn--active' );
				item.dataset.kindCheck = 'true';
				CALC_UI.kindDesc ().innerHTML = item.dataset.kindDesc;
			}

			setRangeInterestRate ( RANGES.interestRate );
			setRangeDownPayment ( RANGES.downPayment );
			setRangeHomeValue ( RANGES.homeValue );

			setCalcValuesOpt (); // обновляем значение в опциях
		} );
	} );
}

/**
 * Перерасчет значений для ветерана
 * @param term
 */
function recalcVeteran ( term ) {
	RANGES.interestRate.value = CALC_VALUES[`va${ term }`][0];
	// RANGES.homeValue.value = CALC_VALUES[`va${ term }`][1];
	RANGES.downPayment.min = 0;
	RANGES.downPayment.value = 0;

	// setRangeHomeValue ( RANGES.homeValue );
	setRangeDownPayment ( RANGES.downPayment, true );
	setRangeInterestRate ( RANGES.interestRate );
}

/**
 *  Удаляет активный класс у kind
 */
function removeActiveOfKind () {
	const items = CALC_UI.kind ();
	items.forEach ( item => {
		item.classList.remove ( 'calc__radio-btn--active' );
		item.dataset.kindCheck = 'false';
	} );
}

/* MORTGAGE FUNCTIONS OF CALC */
/**
 * Инициализация выбора срока кредитования
 */
function initTerm () {
	if ( !isExist () ) {
		return false;
	}

	[ ...CALC_UI.term () ].forEach ( item => {
		item.addEventListener ( 'click', () => {
			const term = getTerm () ? getTerm ().dataset.term : 15;
			const isVeteran = getKind () === 'veteran';

			// если ветеран, то пересчитать значения
			if ( isVeteran ) recalcVeteran ( term );

			CALC_UI.termDesc ().innerHTML = term;
			CALC_VALUES.term = term;
			calcResult (); // пересчет значений
		} );
	} );
}

/**
 * Возвращает активный выбор периода кредитования
 * @return {*}
 */
function getTerm () {
	return [ ...CALC_UI.term () ].find ( item => {
		const input = item.querySelector ( 'input' );
		if ( input.checked ) {
			return item;
		}
	} );
}

/* CALC FUNCTIONS */
/**
 * Расчет и вывод значений
 */
function calcResult () {
	const cost = RANGES.homeValue.value - RANGES.downPayment.value;
	const rate = RANGES.interestRate.value / 1200;
	const term = CALC_VALUES.term * 12;
	let result = 0;

	result = cost * (rate * Math.pow ( (1 + rate), term )) / (Math.pow ( (1 + rate), term ) - 1);
	result = result === 0 || isNaN ( result ) ? '$0' : result.toFixed ( 0 );

	if ( result <= 0 ) {
		result = 0;
	}

	const homeownerInsurance = +CALC_UI.homeownerInsurance () + (isNaN ( +result ) ? 0 : +result);

	result = toMoney ( result );
	CALC_UI.outResult ().innerHTML = `$${ toMoney ( homeownerInsurance ) }`;
	CALC_UI.totalMonthlyPayment ().innerHTML = `$${ toMoney ( homeownerInsurance ) }`;
	CALC_UI.principalInterest ().innerHTML = `$${ result }`;
}

/* HELPERS FUNCTION FOR CALC */
/**
 * Удаляет старый класс у CALC_UI.calcBody
 * @return {DOMTokenList}
 */
function removeOldClsOfBody () {
	const body = CALC_UI.calcBody ();
	const clsOfBody = body.classList;
	const classesFlat = getFlatArrayOfClasses ();

	clsOfBody.forEach ( cls => {
		if ( classesFlat.indexOf ( cls ) > -1 ) {
			CALC_UI.calcBody ().classList.remove ( cls );
		}
	} );
}

/**
 * Устанавливает новый класс для CALC_UI.calcBody()
 */
function updateClsOfBody () {
	removeOldClsOfBody ();

	CALC_VALUES.options.cls = getClsOfCost ();
	CALC_UI.calcBody ().classList.add ( CALC_VALUES.options.cls );

	// перерасчет значений
	calcResult ();
}

/**
 * Возвращает текущий тип:
 * простой - simple
 * ветеран - veteran
 * первый - first
 * @return {string|string}
 */
function getKind () {
	let kind = [ ...CALC_UI.kind () ].find ( item => item.dataset.kindCheck === "true" );
	return kind ? kind.dataset.kind : 'simple';
}

/**
 * Возвращает название класса в зависимости от параметров цены
 */
function getClsOfCost () {
	const _3 = RANGES.homeValue.max / 100 * 33;
	const _6 = RANGES.homeValue.max / 100 * 66;
	const current = RANGES.homeValue.value;
	const type = CALC_VALUES.options.type;
	const kind = CALC_VALUES.options.kind;
	let cls;


	switch ( true ) {
		case current < _3:
			cls = CLASSES[type][kind][0];
			break;
		case current >= _3 && current < _6:
			cls = CLASSES[type][kind][1];
			break;
		case current >= _6:
			cls = CLASSES[type][kind][2];
			break;
		default:
			cls = CLASSES[type][kind][0];
	}

	return cls;
}

/**
 * Возвращает плоский массив из объекта classes
 * Для поиска и удаления классов в UI_CALS.calcBody()
 * @return {FlatArray<*[], 1>[]}
 */
function getFlatArrayOfClasses () {
	const c = Object.values ( CLASSES );
	return c.reduce ( ( prev, curr ) => {
		const a = Object.values ( curr );
		return [ ...prev, ...a ];
	}, [] ).flat ();
}

/**
 * Установка значений по умолчанию в CALC_VALUES
 * @param name
 */
function setCalcValues ( name ) {

	CALC_VALUES[`${ name }`].min = RANGES[name].min;
	CALC_VALUES[`${ name }`].max = RANGES[name].max;
	CALC_VALUES[`${ name }`].value = RANGES[name].value;

	//  обновление опций CALC_VALUES.options
	setCalcValuesOpt ();
}

/**
 * Обновление опций
 * @param t type
 */
function setCalcValuesOpt ( t ) {
	const type = t ? t : CALC_VALUES.options.type;
	const kind = getKind ();

	CALC_VALUES.options.type = type;
	CALC_VALUES.options.kind = kind;
	CALC_VALUES.options.cls = getClsOfCost ();

	updateClsOfBody (); // добавляем новый класс из CALC_VALUES.options.cls
}

/* RANGES */
/**
 * Перерасчет при изменении значений range
 */
function rangesHandler () {
	if ( !RANGES.wrap ) {
		return false;
	}

	RANGES.homeValue.input ().addEventListener ( 'input', () => {
		setCalcValues ( 'homeValue' );
	} );

	RANGES.downPayment.input ().addEventListener ( 'input', () => {
		setCalcValues ( 'downPayment' );
	} );

	RANGES.interestRate.input ().addEventListener ( 'input', () => {
		setCalcValues ( 'interestRate' );
	} );
}


/* REPORT */
/**
 * Формирует pdf из данных калькулятора
 */
function reportInit () {
	const link = CALC_UI.report ();

	if ( !link ) {
		return false;
	}

	link.addEventListener ( 'click', ( e ) => {
		e.preventDefault ();
		let count = 0;
		let query = '';
		const params = {
			'cls': CALC_VALUES.options.cls,
			'type': CALC_UI.wrap.querySelector ( '.calc__type-link' ).textContent,
			'cost': CALC_UI.outResult ().textContent,
			'home-value': `$${RANGES.homeValue.htmlOut ().textContent}`,
			'down-payment': `$${RANGES.downPayment.htmlOut ().textContent}`,
			'rate': `${RANGES.interestRate.htmlOut ().textContent}%`,
			'term': CALC_VALUES.term,
			'kind': CALC_VALUES.options.kind,
			'principal-interest': `$${CALC_UI.principalInterest ().textContent}`,
			'insurance': CALC_UI.wrap.querySelector ( '[data-homeowner-insurance]' ).textContent,
			'fees': CALC_UI.wrap.querySelector ( '[data-hao-fees]' ).textContent,
			'total': CALC_UI.totalMonthlyPayment ().textContent
		};

		for ( let [ key, value ] of Object.entries ( params ) ) {
			const symbol = count === 0 ? '' : '&';

			switch ( true ) {
				case  value === 'simple':
					value = 'No'
					break;
				case  value === 'veteran':
					value = 'Veteran'
					break;
				case  value === 'first':
					value = '1st Time'
					break;
			}

			query += `${ symbol }${ key }=${ value }`
			count++;
		}

		window.open(
			// `http://localhost:9000/dompdf-test.php?${query}`,
			`https://digitalbutlers.me/any_scripts/WOWMI_fairway/html-to-pdf/dompdf-test.php?${query}`,
			// `https://dev.kasapvictor.ru/digitalbutlers/html-to-pdf/dompdf-test.php?${query}`,
			'_blank'
		);
	} )
}

/* инициализация */
initButtonTypesHandler (); // на выбор типа собственности
kindHandler (); // на checkbox  типа: veteran + 1st
initTerm (); // события при выборе срока кредитования
rangesHandler (); // перерасчет при изменении значений range
// reportInit (); // формирование pdf для тестов


