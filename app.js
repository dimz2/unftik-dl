import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { tiktokdl, tiktok } from './src/tiktok.js';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


global.access = [];

app.get('/', async(req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/download', async(req, res) => {
	const { url } = req.body;
	let anu = await tiktokdl(url);
	let anu2 = await tiktok(url);
	if(anu.code != 0) return res.send(`<p style=\"color: red;\">${anu.msg}</p>`);
	if(anu2.isSlide) return res.send(`<p style=\"color: red;\">Tiktok slide is not supported.</p>`);
	
	return res.render('result_video', { data: anu2 });
	});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
