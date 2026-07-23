document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const notifications = document.getElementById('notifications').checked;

    // Vague validation
    if (!username || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    console.log("Saving settings...", { username, email, password, notifications });
    alert("Settings saved successfully!");
});
