import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import axios from 'axios';

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}

async function tiktok(url) {
    try {
        const data = new URLSearchParams({
            'id': url,
            'locale': 'id',
            'tt': 'RFBiZ3Bi'
        });

        const headers = {
            'HX-Request': true,
            'HX-Trigger': '_gcaptcha_pt',
            'HX-Target': 'target',
            'HX-Current-URL': 'https://ssstik.io/id',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://ssstik.io/id'
        };

        const response = await axios.post('https://ssstik.io/abc?url=dl', data, { headers });
        const html = response.data;

        const $ = cheerio.load(html);

        const author = $('#avatarAndTextUsual h2').text().trim();
        const profile = $('.result_author').attr('src');
        const title = $('#avatarAndTextUsual p').text().trim();
        const styleContent = $('style').html();
		const thumbnail = styleContent.match(/background-image: url\((.*?)\)/)?.[1] || false;
        const caption = $('.maintext').text();
        const video = $('.result_overlay_buttons a.download_link').attr('href');
        const audio = $('.result_overlay_buttons a.download_link.music').attr('href');
        const imgLinks = [];
        $('img[data-splide-lazy]').each((index, element) => {
            const imgLink = $(element).attr('data-splide-lazy');
            imgLinks.push(imgLink);
        });

        const result = {
            isSlide: video ? false : true,
            author,
            profile, 
            title,
            thumbnail, 
            caption, 
            result: video || imgLinks,
            mp4: video, 
            mp3: audio
        };
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export { tiktokdl, tiktok };