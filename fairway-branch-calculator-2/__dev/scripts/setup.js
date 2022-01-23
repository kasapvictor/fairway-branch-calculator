export const CLASSES = {
	single: {
		simple: [ 'single-f-1', 'single-f-2', 'single-f-3' ],
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
export const CALC_UI = {
	wrap: document.querySelector ( '.calc-container' ),
	calcBody: () => CALC_UI.wrap ? CALC_UI.wrap.querySelector ( '.calc__body' ) : '',
	buttonsOfTypes: () => CALC_UI.wrap ? CALC_UI.wrap.querySelectorAll ( '[data-type-of-property]' ) : [],
	kind: () => CALC_UI.wrap.querySelectorAll ( '[data-kind]' ),
	kindDesc: () => CALC_UI.wrap.querySelector ( '.calc__descr-kind' ),
	term: () => CALC_UI.wrap.querySelectorAll ( '[data-term]' ),
	termDesc: () => CALC_UI.wrap.querySelector ( '.calc__descr--years' ),
	outResult: () => CALC_UI.wrap.querySelector ( '.calc__price' ),
	principalInterest: () => CALC_UI.wrap.querySelector ( '[data-principal-interest]' ),
	homeownerInsurance: () => CALC_UI.wrap.querySelector ( '[data-homeowner-insurance]' ).dataset.homeownerInsurance,
	haoFees: () => CALC_UI.wrap.querySelector ( '[data-hao-fees]' ).dataset.heoFees,
	totalMonthlyPayment: () => CALC_UI.wrap.querySelector ( '[data-total-monthly-payment]' ),
	report: () => CALC_UI.wrap.querySelector('[data-calc-report]')
};
export const CALC_VALUES = {
	homeValue: { min: 0, max: 0, value: 0 },
	downPayment: { min: 0, max: 0, value: 0 },
	interestRate: { min: 0, max: 0, value: 0 },
	options: { type: 'single', kind: 'simple', cls: 'sf-1' },
	term: 15,
	va15: [ 2.3, 800000 ],
	va30: [ 2.5, 800000 ],
	_1st: [ 3.5, 800000 ]
}
export const RANGES = {
	wrap: document.querySelector ( '.ranges' ) ?? false,
	homeValue: {
		htmlOut: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-home-value-out]' ) : '',
		htmlMin: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-home-value-min]' ) : '',
		htmlMax: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-home-value-max]' ) : '',
		fill: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-home-value-fill]' ) : '',
		input: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-home-value-input]' ) : '',
		min: 100000,
		max: 1000000,
		value: 300000,
		step: 1000
	},
	downPayment: {
		htmlOut: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-down-payment-out]' ) : '',
		htmlMin: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-down-payment-min]' ) : '',
		htmlMax: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-down-payment-max]' ) : '',
		fill: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-down-payment-fill]' ) : '',
		input: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-down-payment-input]' ) : '',
		min: 0,
		max: 1000000,
		value: 10000,
		step: 100
	},
	interestRate: {
		htmlOut: () => RANGES.wrap.querySelector ( '[data-range-interest-rate-out]' ) ?? '',
		htmlMin: () => RANGES.wrap.querySelector ( '[data-range-interest-rate-min]' ) ?? '',
		htmlMax: () => RANGES.wrap.querySelector ( '[data-range-interest-rate-max]' ) ?? '',
		fill: () => RANGES.wrap.querySelector ( '[data-range-interest-rate-fill]' ) ?? '',
		input: () => RANGES.wrap ? RANGES.wrap.querySelector ( '[data-range-interest-rate-input]' ) : '',
		min: 2,
		max: 4,
		value: 2.1,
		step: 0.01
	}
}
