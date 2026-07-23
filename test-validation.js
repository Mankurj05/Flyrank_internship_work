/**
 * Unit tests for validation.js
 */
const { validateUsername, validateEmail, validatePassword } = require('./validation');

let failures = 0;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ Fail: ${message}`);
        failures++;
    } else {
        console.log(`✅ Pass: ${message}`);
    }
}

console.log('Running validation tests...\n');

// Username Tests
assert(validateUsername('') === 'Username is required.', 'empty username');
assert(validateUsername('ab') === 'Username must be at least 3 characters long.', 'short username');
assert(validateUsername('user!name') === 'Username can only contain letters, numbers, and underscores.', 'invalid chars in username');
assert(validateUsername('valid_user123') === '', 'valid username');

// Email Tests
assert(validateEmail('') === 'Email is required.', 'empty email');
assert(validateEmail('invalid-email') === 'Please enter a valid email address.', 'invalid email structure');
assert(validateEmail('user@domain.com') === '', 'valid email');

// Password Tests
assert(validatePassword('') === 'Password is required.', 'empty password');
assert(validatePassword('short') === 'Password must be at least 8 characters long.', 'short password');
assert(validatePassword('nouppercase1') === 'Password must contain at least one uppercase letter.', 'missing uppercase password');
assert(validatePassword('NoNumberCase') === 'Password must contain at least one number.', 'missing number password');
assert(validatePassword('ValidPass1') === '', 'valid password');

console.log(`\nTests finished. Failures: ${failures}`);
if (failures > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
