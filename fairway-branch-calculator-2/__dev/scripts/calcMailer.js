//data-from-name="report"
import { CALC_UI, CALC_VALUES, RANGES } from './setup';

/**
 * Функция находит все формы с классом .vi-mailer
 * Предотвращает отправку по умолчанию
 * Запускает функцию send()
 * @return {boolean}
 */
function formsHandler () {
	const forms = document.querySelectorAll ( '[data-form-name="report"]' );

	if ( !forms ) return false;

	forms.forEach ( form => {
		const UI = {
			form,
			wrapper: form.closest ( '.pop-up-container' ),
			submit: () => UI.form.querySelector ( 'input[type="submit"]' ),
			closeBtn: () => UI.wrapper.querySelector('[data-remodal-action="close"]'),
			errorWrapper: () => UI.wrapper.querySelector ( `.w-form-fail` ),
			successWrapper: () => UI.wrapper.querySelector ( `.w-form-done` ),
		};

		form.setAttribute ( 'action', 'vi' );
		form.addEventListener ( 'submit', (e) => formSend(e, UI) );

		// действие при закрытии окна с формой
		fromCloseHandler ( UI );
	} );

	/* отправка формы */
	function formSend ( e, ui ) {
		e.preventDefault ();
		send ( ui );
	}
}

/* отправка */
async function send ( ui ) {
	const form = ui.form;
	const submitBtn = ui.submit();
	const formData = new FormData ( form );

	/* блокируем повторное нажатие кнопки "Отправить" */
	submitBtn.disabled = true;

	formData.append ( 'params', generateReport () );

	// const url = `https://dev.kasapvictor.ru/digitalbutlers/html-to-pdf/dompdf.php`;
	const url = `https://digitalbutlers.me/any_scripts/WOWMI_fairway/html-to-pdf/dompdf.php`;

	const response = await fetch ( url, {
		method: 'POST',
		body: formData
	} );

	const result = await response.json ();
	// const result = await response.text ();
	// console.log ( result );

	/**
	 * проверка на ошибки
	 * выводим сообщения с ошибками
	 */
	if ( result.errors ) {
		const errors = result.errors;
		const errorWrapper = ui.errorWrapper();

		errorWrapper.innerHTML = '';

		for ( let i in errors ) {
			const error = errors[i];
			showMessage ( ui, error, 4000, false );
		}
		/* включаем возможность по нажатию на "Отправить" */
		submitBtn.disabled = false;
	}

	/**
	 * Вывесит сообщение об успешной отправке
	 */
	if ( result.success ) {
		const redirect = result.success.redirect;
		const successWrapper = ui.successWrapper();
		const successMessage = result.success.message;

		// console.log ( successMessage )
		// successWrapper.innerHTML = '';

		if ( redirect !== '' ) {
			location.href = redirect;
		} else {
			showMessage ( ui, '', 0, true );
			form.reset ();
		}
		form.reset ();

		/* включаем возможность по нажатию на "Отправить" */
		submitBtn.disabled = false;
	}
}

/**
 * Выводит сообщение об отправке или ошибке
 * @param ui
 * @param message
 * @param time
 * @param isSuccess
 */
function showMessage ( ui, message = '', time = 0, isSuccess = true ) {
	const form = ui.form;
	const wrapper = isSuccess ? ui.successWrapper() : ui.errorWrapper();

	if ( isSuccess ) {
		form.style.display = 'none';
	}

	if ( message !== '' ) {
		wrapper.insertAdjacentHTML ( 'afterbegin', `<div>${ message }</div>` );
		wrapper.style.display = 'block';
		wrapper.style.opacity = '1';
	} else {
		wrapper.style.display = 'block';
		wrapper.style.opacity = '1';
	}

	if ( time !== 0 ) {
		setTimeout ( () => {
			wrapper.style.opacity = '0';
			wrapper.style.display = 'none';
		}, time );
	}
}

/**
 * После закрытия модального окна
 * уведомление об отправке -> display = 'none'
 * форма -> display = 'flex'
 * @param ui
 */
function fromCloseHandler ( ui ) {
	const form = ui.form;
	const btn = ui.closeBtn();
	const successWrapper = ui.successWrapper();

	btn.addEventListener ( 'click', () => {
		setTimeout ( () => {
			form.style.display = 'flex';
			successWrapper.style.display = 'none';
		}, 2000 )
	} )
}

/**
 * Возвращает объект с данными калькулятора
 */
function generateReport () {
	const params = {
		'cls': CALC_VALUES.options.cls,
		'type': CALC_UI.wrap.querySelector ( '.calc__type-link' ).textContent,
		'cost': CALC_UI.outResult ().textContent,
		'home-value': `$${ RANGES.homeValue.htmlOut ().textContent }`,
		'down-payment': `$${ RANGES.downPayment.htmlOut ().textContent }`,
		'rate': `${ RANGES.interestRate.htmlOut ().textContent }%`,
		'term': CALC_VALUES.term,
		'kind': CALC_VALUES.options.kind,
		'principal-interest': `${ CALC_UI.principalInterest ().textContent }`,
		'insurance': CALC_UI.wrap.querySelector ( '[data-homeowner-insurance]' ).textContent,
		'fees': CALC_UI.wrap.querySelector ( '[data-hao-fees]' ).textContent,
		'total': CALC_UI.totalMonthlyPayment ().textContent
	};

	return JSON.stringify ( params );
}

formsHandler ();

