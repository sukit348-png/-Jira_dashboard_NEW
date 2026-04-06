const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const JIRA_CONFIG = {
  domain: "appworks.atlassian.net",
  email: "sukit.an@appworks.co.th",
  // อัปเดต Token ชุดล่าสุด (CBBD2653) เรียบร้อยแล้ว
  token: "ATATT3xFfGF0euqv7LQMzCNAfc32bCEC09htn5pmNkiOwnkaUKYApPZtZEUqmH4VA5QRrX0nHm_DHbDDVofrw3tFqQxXBFNK44JiE4-7VbBT3uxV0gE5IB0IZazpmSTDmIL_N-essB-SfpGyEY20AXLM5gMijFhnDuHUH8c1jvR5OoLDJU7x2rk=CBBD2653"
};

app.get('/', (req, res) => res.send('SGLS Proxy v3 (Updated Token) is Online!'));

app.get('/api/jira', async (req, res) => {
  // ใช้ Endpoint v3 ตามมาตรฐานล่าสุดเพื่อเลี่ยง Error 410
  const url = `https://${JIRA_CONFIG.domain}/rest/api/3/search`;
  const jql = "project = 'SGLS' AND (issuetype = 'Bug' OR issuetype = 'Defect') ORDER BY priority DESC";

  try {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
    const response = await axios.get(url, {
      params: { jql },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : error.message;
    console.error("Jira Sync Error:", data);
    res.status(status).json({ error: "Jira API Sync Failed", status, detail: data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend is listening on port ${PORT}`));