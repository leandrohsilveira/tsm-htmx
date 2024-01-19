/**
 *
 * @param {HTMLFormElement} form
 */
function createPasswordsValidator(form) {
  return function handleInput(e) {
    if (['password', 'password_confirm'].indexOf(e.target.name) >= 0) {
      const password_input = form.password
      const password_confirm_input = form.password_confirm
      const password = password_input.value
      const password_confirm = password_confirm_input.value

      if (password && password_confirm && password !== password_confirm) {
        password_confirm_input.setCustomValidity(
          'Password confirmation does not match',
        )
      } else {
        password_confirm_input.setCustomValidity('')
      }
      password_confirm_input.checkValidity()
    }
  }
}

window.createPasswordsValidator = createPasswordsValidator
