const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const JIRA_CONFIG = {
  domain: "appworks.atlassian.net",
  email: "sukit.an@appworks.co.th",
  token: "ATATT3xFfGF0MmOuIRJvEE70mh1L_VInzLASWVjA0U7t6cXNP9DBKS1D20FUxmpZbx24_0o_vhk7eYH1zRWh33DVnqQJnfTG1JlEKGuhBuUYU0OKxAG5F2AczNfta-XZWWCDGBbH3O6FOEqguIuMDaYIGe68SuUVJ4sl7GcbGti07huDmgjLpCM=97931335"
};

// หน้าแรกสำหรับเช็คสถานะ Server
app.get('/', (req, res) => {
  res.send('SGLS Jira Proxy is Online! Use /api/jira to get data.');
});

// API สำหรับดึงข้อมูลจาก Jira
app.get('/api/jira', async (req, res) => {
  const jql = "project = 'SGLS' AND (issuetype = 'Bug' OR issuetype = 'Defect') ORDER BY priority DESC";
  try {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
    const response = await axios.get(`https://${JIRA_CONFIG.domain}/rest/api/3/search`, {
      params: { jql },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Jira Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch from Jira", detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));