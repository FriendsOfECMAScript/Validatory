/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */

import './../scss/app.scss';

import $ from 'jquery';
import debounce from 'es6-promise-debounce';
import {init, STATE, validatorRegistry, Validator, asyncValidation} from 'validatory';

const getStateString = stateValue => {
  switch (stateValue) {
    case STATE.VALID:
      return 'VALID';
    case STATE.NOT_VALID:
      return 'NOT VALID';
    case STATE.DEFAULT:
      return 'DEFAULT';
    case STATE.VALIDATING:
      return 'VALIDATING';
    case STATE.NOT_FILLED:
      return 'NOT FILLED';
  }

  return `CUSTOM: ${stateValue}`;
};

const palindromeValidator = new Validator({
  supports: node => node.id === 'palindrome',
  isEmpty: node => node.value === '',
  isValid: node => ({
    valid: node.value === node.value.split('').reverse().join('')
  }),
});
validatorRegistry.add(palindromeValidator);

const
  debouncedValidation = debounce(node => {
    console.log('Asynchronous validation started');

    const validZipCode = /^\d{5}$/.test(node.value); // zip code format validation

    if (!validZipCode) {
      return {valid: false, errorCode: 'zip-code'};
    }

    return asyncValidation(fetch('https://jsonplaceholder.typicode.com/posts/1'), response => {
      const valid = node.value === '01005';

      return valid ? {valid} : {valid: false, errorCode: 'no-service'};
    });
  }, 500),
  asyncValidator = new Validator({
    supports: node => node.id === 'async',
    isEmpty: node => node.value === '',
    isValid: node => debouncedValidation(node),
  });
validatorRegistry.add(asyncValidator);

const
  formValidationStateChangedCallback = formValidatorInstance => {
    console.log(`Form state changed to: ${getStateString(formValidatorInstance.state)}`);
  },
  formElementValidationStateChangedCallback = formElementValidatorInstance => {
    console.log(`Form element state changed to: ${getStateString(formElementValidatorInstance.state)}`);
  };

init({
  formSelector: 'form',
  formElementSelector: 'input, select, textarea',
  onFormValidationStateChanged: formValidationStateChangedCallback,
  onFormElementValidationStateChanged: formElementValidationStateChangedCallback
});

/* eslint-disable max-len */
setTimeout(() => {
  // Inject new form-group-input to test nodeAdded observing
  const html = `
    <div class="form-group-input">
      <div class="form-group-input__label">
        <label class="form-label" for="required-phone-2"><span class="form-label__required">*</span>Phone</label>
      </div>
      <input id="required-phone-2" name="required-phone-2" type="tel" class="form-input" placeholder="Enter a 9 digit phone..." required data-validate data-validate-phone autocomplete="off" tabindex="0">
      <div class="form-group-input__errors">
        <p class="form-error  form-error--not-filled">This field is required.</p>
        <p class="form-error  form-error--not-valid">Entered phone does not match the required pattern.</p>
      </div>
    </div>
    <div class="form-group-input">
      <div class="form-group-input__label">
        <label class="form-label" for="required-foo"><span class="form-label__required">*</span>Don't type foo</label>
      </div>
      <input id="required-foo" name="required-foo" type="text" class="form-input" placeholder="Don't type foo..." required data-validate data-validate-pattern="^(?!.*foo).*$" autocomplete="off" tabindex="0">
      <div class="form-group-input__errors">
        <p class="form-error  form-error--not-filled">This field is required.</p>
        <p class="form-error  form-error--not-valid">You have written foo.</p>
      </div>
    </div>`;

  $('.form-group-checkbox').before($.parseHTML(html));
}, 5000);
/* eslint-enable max-len */
