/**
 * Validation utilities for User Settings Form
 */

function validateUsername(username) {
    if (!username) return 'Username is required.';
    if (username.length < 3) return 'Username must be at least 3 characters long.';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
    return '';
}

function validateEmail(email) {
    if (!email) return 'Email is required.';
    // Simple but robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return '';
}

function validatePassword(password) {
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    return '';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUsername,
        validateEmail,
        validatePassword
    };
}
