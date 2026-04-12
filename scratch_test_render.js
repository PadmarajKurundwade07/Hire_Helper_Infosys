async function test() {
    console.log("Sending request...");
    try {
        const response = await fetch('https://hire-helper-infosys.onrender.com/api/auth/test-email', {
            method: 'POST',
            timer: 15000,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'umoney2004@gmail.com' })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response data:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
