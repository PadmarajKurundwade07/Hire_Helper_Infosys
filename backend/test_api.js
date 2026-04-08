const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://hire-helper-infosys.onrender.com/api/auth/login', {
      email_id: 'umoney2004@gmail.com',
      password: 'wrongpassword'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error status:", err.response?.status);
    console.log("Error data:", err.response?.data);
  }
}
test();
