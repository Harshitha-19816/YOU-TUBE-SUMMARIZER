const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/ai/youtube-summary', {
      url: 'https://youtu.be/h7LDnVsNRVI?si=o_JmAn9N6qlz6piT'
    }, {
      // Need auth? Ah! The API route requires supabase.auth.getUser()!
    });
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}
test();
