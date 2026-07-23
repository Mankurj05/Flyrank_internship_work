/**
 * Application initialization and event listeners
 */

document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const notifications = document.getElementById('notifications').checked;

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const feedbackMessage = document.getElementById('feedbackMessage');

    // Reset error messages and styles
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    feedbackMessage.className = '';
    feedbackMessage.textContent = '';

    // Run validations
    const userErr = validateUsername(usernameInput.value);
    const emailErr = validateEmail(emailInput.value);
    const passErr = validatePassword(passwordInput.value);

    let hasErrors = false;

    if (userErr) {
        usernameError.textContent = userErr;
        usernameInput.setAttribute('aria-invalid', 'true');
        hasErrors = true;
    } else {
        usernameInput.removeAttribute('aria-invalid');
    }

    if (emailErr) {
        emailError.textContent = emailErr;
        emailInput.setAttribute('aria-invalid', 'true');
        hasErrors = true;
    } else {
        emailInput.removeAttribute('aria-invalid');
    }

    if (passErr) {
        passwordError.textContent = passErr;
        passwordInput.setAttribute('aria-invalid', 'true');
        hasErrors = true;
    } else {
        passwordInput.removeAttribute('aria-invalid');
    }

    if (hasErrors) {
        feedbackMessage.textContent = "Please correct the highlighted errors before saving.";
        feedbackMessage.className = "error";
        return;
    }

    // Success response
    feedbackMessage.textContent = "Settings saved successfully!";
    feedbackMessage.className = "success";

    console.log("Mock API Post:", {
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        notifications
    });
});
