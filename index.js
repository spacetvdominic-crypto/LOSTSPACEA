const express = require('express');
const axios = require('axios');
const app = express();

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// PAGE ROUTES
app.get('/', (req, res) => res.render('login'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/front-desk', (req, res) => res.render('front-desk'));
app.get('/work-job', (req, res) => res.render('work-job', { query: req.query }));
app.get('/receipt-flip', (req, res) => res.render('receipt-flip', { query: req.query }));
app.get('/final-receipt', (req, res) => res.render('final-receipt', { query: req.query }));

// API LOGIC
app.get('/login', async (req, res) => {
    const { user, pass } = req.query;
    const resp = await axios.get(`${GOOGLE_SCRIPT_URL}?action=login&user=${user}&pass=${pass}`);
    res.json(resp.data);
});

app.get('/api/jobs', async (req, res) => {
    const resp = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getJobs`);
    res.json(resp.data);
});

app.get('/api/add-job', async (req, res) => {
    const { customer, tel, loc, prob, type } = req.query;
    const url = `${GOOGLE_SCRIPT_URL}?action=addJob&customer=${customer}&tel=${tel}&loc=${loc}&prob=${prob}&type=${type}`;
    const resp = await axios.get(url);
    res.send(resp.data);
});

app.get('/start-job', async (req, res) => {
    await axios.get(`${GOOGLE_SCRIPT_URL}?action=startJob&rowId=${req.query.rowId}`);
    res.send("ok");
});

app.post('/submit-job', express.json(), async (req, res) => {
    const resp = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    res.send(resp.data);
});

app.listen(process.env.PORT || 3000, () => console.log("Space TV System Live"));
