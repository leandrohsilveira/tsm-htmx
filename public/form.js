/** @typedef {(e: Event) => void} EventHandler */

/**
 * @typedef EnhanceFormOpts
 * @property {EventHandler} [onInput]
 * @property {EventHandler} [onSubmit]
 */

/**
 * @param {HTMLFormElement} form
 * @param {EnhanceFormOpts} [opts]
 */
function enhanceForm(form, opts) {
  function handleInput(e) {
    /** @type {HTMLInputElement} */
    const target = e.target
    target.dataset['dirty'] = 'true'
    if (opts && typeof opts.onInput === 'function') {
      opts.onInput(e)
    }
    if (target.checkValidity()) {
      target.classList.remove('error')
      const error_on = target.dataset.errorOn
      /** @type {HTMLSpanElement} */
      const error_span = document.getElementById(error_on)
      if (error_span) {
        error_span.innerText = ''
      }
    }
  }

  function handleInvalid(e) {
    e.preventDefault()
    /** @type {HTMLInputElement} */
    const target = e.target

    const error_on = target.dataset.errorOn
    /** @type {HTMLSpanElement} */
    const error_span = document.getElementById(error_on)
    if (error_span) {
      error_span.innerText = target.validationMessage
    }
  }

  function handleSubmit(e) {
    if (opts && typeof opts.onSubmit === 'function') {
      opts.onSubmit(e)
    }
  }

  form.addEventListener('submit', handleSubmit)
  form.addEventListener('input', handleInput)
  form.addEventListener('invalid', handleInvalid, true)
}

window.enhanceForm = enhanceForm
