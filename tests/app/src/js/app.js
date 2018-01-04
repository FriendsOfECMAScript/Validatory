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
import {init, STATE, validatorRegistry, Validator} from 'validatory';

const getStateString = stateValue => {
  switch (stateValue) {
    case STATE.VALID:
      return 'VALID';
    case STATE.NOT_VALID:
      return 'NOT VALID';
    case STATE.NOT_VALIDATED:
      return 'NOT VALIDATED';
    case STATE.NOT_FILLED:
      return 'NOT FILLED';
  }
};

const palindromeValidator = new Validator({
  supports: node => node.id === 'palindrome',
  isEmpty: node => node.value === '',
  isValid: node => node.value === node.value.split('').reverse().join(''),
});
validatorRegistry.add(palindromeValidator);

const
  formValidationStateChangedCallback = formValidatorInstance => {
    console.log(`Form state changed to: [${getStateString(formValidatorInstance.state)}]`);
  },
  formElementValidationStateChangedCallback = formElementValidatorInstance => {
    console.log(`Form element state changed to: [${getStateString(formElementValidatorInstance.state)}]`);
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
