const CLASSES = {
	single: {
		simple: [ 'sf-1', 'sf-2', 'sf-3' ],
		veteran: [ 'sf-1-veteran', 'sf-2-veteran', 'sf-3-veteran' ],
		first: [ 'sf-1-1st', 'sf-2-1st', 'sf-3-1st' ],
	},
	condominium: {
		simple: [ 'con-1', 'con-2', 'con-3' ],
		veteran: [ 'con-1-veteran', 'con-2-veteran', 'con-3-veteran' ],
		first: [ 'con-1-1st', 'con-2-1st', 'con-3-1st' ],
	},
	town: {
		simple: [ 'town-1', 'town-2', 'town-3' ],
		veteran: [ 'town-1-veteran', 'town-2-veteran', 'town-3-veteran' ],
		first: [ 'town-1-1st', 'town-2-1st', 'town-3-1st' ],
	},
	multi: {
		simple: [ 'multi-1', 'multi-2', 'multi-3' ],
		veteran: [ 'multi-1-veteran', 'multi-2-veteran', 'multi-3-veteran' ],
		first: [ 'multi-1-1st', 'multi-2-1st', 'multi-3-1st' ],
	}
};
const CALC_UI = {
	wrap: document.querySelector ( '.calc-container' ),
	calcBody: () => CALC_UI.wrap ? CALC_UI.wrap.querySelector ( '.calc__body' ) : '',
	buttonsOfTypes: () => CALC_UI.wrap ? CALC_UI.wrap.querySelectorAll ( '[data-type-of-property]' ) : [],
	kind: () => CALC_UI.wrap.querySelectorAll ( '[data-kind]' ),
	kindDesc: () => CALC_UI.wrap.querySelector ( '.calc__descr-kind' ),
	mortgage: () => CALC_UI.wrap.querySelectorAll ( '[data-mortgage]' ), //calc__descr--years
	mortgageDesc: () => CALC_UI.wrap.querySelector ( '.calc__descr--years' ),
	outResult: () => CALC_UI.wrap.querySelector ( '.calc__price' ),
	principalInterest: () => CALC_UI.wrap.querySelector ( '[data-principal-interest]' ),
	homeownerInsurance: () => CALC_UI.wrap.querySelector ( '[data-homeowner-insurance]' ).dataset.homeownerInsurance,
	haoFees: () => CALC_UI.wrap.querySelector ( '[data-hao-fees]' ).dataset.heoFees,
	totalMonthlyPayment: () => CALC_UI.wrap.querySelector ( '[data-total-monthly-payment]' )
};
const CALC_VALUES = {
	homeValue: { min: 0, max: 0, current: 0 },
	downPay: { min: 0, max: 0, current: 0 },
	rate: { min: 0, max: 0, current: 0 },
	options: { type: 'single', kind: 'simple', cls: 'sf-1' },
	mortgage: 15,
	va15: [ 2.3, 800000 ],
	va30: [ 2.5, 800000 ],
	_1st: [ 3.5, 800000 ]
}

/* BUTTONS FUNCTIONS OF CALC */
/**
 * инициализация клика на выбор типа собственности
 * @return {boolean}
 */
function initButtonTypesHandler () {
	const buttons = [ ...CALC_UI.buttonsOfTypes () ];

	if ( buttons.length === 0 ) {
		return false;
	}

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

	// удаляем старый класс в UI_CALS.calcBody()
	removeOldClsOfBody ();

	// обновление класса в UI_CALS.calcBody()
	updateClsOfBody ();
}

/* CHECKBOXES OF CALC */
/**
 * События по клику на veteran + 1st
 */
function kindHandler () {
	const items = CALC_UI.kind ();

	items.forEach ( item => {
		item.addEventListener ( 'click', () => {
			if ( item.classList.contains ( 'calc__radio-btn--active' ) ) {
				item.classList.remove ( 'calc__radio-btn--active' );
				item.dataset.kindCheck = 'false';
				CALC_UI.kindDesc ().innerHTML = 'I have no benefits';
			} else {
				removeActiveOfKind ();
				item.classList.add ( 'calc__radio-btn--active' );
				item.dataset.kindCheck = 'true';
				CALC_UI.kindDesc ().innerHTML = item.dataset.kindDesc;
			}

			setCalcValuesOpt (); // обновляем значение в опциях
			removeOldClsOfBody (); // удаляем класс у боди
			updateClsOfBody (); // добавляем новый класс у боди
		} );
	} );
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
function initMortgage () {
	[ ...CALC_UI.mortgage () ].forEach ( item => {
		item.addEventListener ( 'click', () => {
			const mortgage = getMortgage () ? getMortgage ().dataset.mortgage : 15;

			CALC_UI.mortgageDesc ().innerHTML = mortgage;
			CALC_VALUES.mortgage = mortgage;
			calcResult ();
		} );
	} );
}

/**
 * Возвращает активный выбор периода кредитования
 * @return {*}
 */
function getMortgage () {
	return [ ...CALC_UI.mortgage () ].find ( item => {
		const input = item.querySelector ( 'input' );
		if ( input.checked ) {
			return item;
		}
	} );
}


/* CALC FUNCTIONS */
/**
 * VA 15 max 2.25% -> max 800.000
 * VA 30 max 2.45% -> max 800.000
 *
 * 1st max 3.5% -> max 800.000
 */
function calcResult () {
	const cost = CALC_VALUES.homeValue.current - CALC_VALUES.downPay.current;
	const rate = CALC_VALUES.rate.current / 1200;
	const mortgage = CALC_VALUES.mortgage * 12;
	let result = 0;


	result = cost * (rate * Math.pow ( (1 + rate), mortgage )) / (Math.pow ( (1 + rate), mortgage ) - 1);
	result = result === 0 || isNaN ( result ) ? '$0' : result.toFixed ( 0 );

	if ( result <= 0 ) {
		result = 0;
	}

	const homeownerInsurance = +CALC_UI.homeownerInsurance () + (isNaN ( +result ) ? 0 : +result);

	result = toMoney ( result ) !== '' ? toMoney ( result ) : result;
	CALC_UI.outResult ().innerHTML = `${ toMoney ( homeownerInsurance ) }`;
	CALC_UI.totalMonthlyPayment ().innerHTML = `${ toMoney ( homeownerInsurance ) }`;
	CALC_UI.principalInterest ().innerHTML = `${ result }`;

}

/* HELPERS FUNCTION FOR CALC */
/**
 * Устанавливает новый класс для CALC_UI.calcBody()
 */
function updateClsOfBody () {
	CALC_UI.calcBody ().classList.add ( CALC_VALUES.options.cls );
	calcResult ();
}

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
	const _3 = CALC_VALUES.homeValue.max / 100 * 33;
	const _6 = CALC_VALUES.homeValue.max / 100 * 66;
	const current = CALC_VALUES.homeValue.current;
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
 * Данные приходят из скрипта фронтовой части
 * @param name
 * @param data
 * @param current
 */
function setCalcValues ( name, data, current = null ) {
	if ( !current ) {
		CALC_VALUES[`${ name }`].min = data.min ?? 0;
		CALC_VALUES[`${ name }`].max = data.max;
		CALC_VALUES[`${ name }`].current = data.from;
	} else {
		// удаляет символ $, пробелы, запятую и %
		CALC_VALUES[`${ name }`].current = +current.replace ( /[\$\s,%]/gm, '' );
	}

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

	removeOldClsOfBody (); // удаляем старый класс
	updateClsOfBody (); // добавляем новый класс из CALC_VALUES.options.cls
}


/* инициализация */
initButtonTypesHandler (); // на выбор типа собственности
kindHandler (); // на checkbox  типа: veteran + 1st
initMortgage (); // события при выборе срока кредитования


//
