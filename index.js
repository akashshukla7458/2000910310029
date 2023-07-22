const express = require('express');
const request = require('request');




const app = express();
const port = 8008;
//port listening on 8008

// Function to fetch data 
const fecthData = (url, timeout) => {
    return new Promise((resolve, reject) => {
        request({ url, json: true, timeout }, (err, response, body) => {
            if (err) {
                reject(err.message);
            } else if (response.statusCode !== 200) {
                reject(`Failed to get data from ${url}, status code: ${response.statusCode}`);
            } else {
                resolve(body);
            }
        });
    });
};

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    const result = new Set();

    if (!urls) {
        return res.status(400).json({ error: 'Please provide valid url.' });
    }
    // not correct url

    if (!Array.isArray(urls)) {
        urls = [urls];
    }

    const promises = urls.map((url) => fecthData(url, 500));


     // Execute promises and corresp res
    try {
        const responses = await Promise.allSettled(promises);
        responses.forEach((response) => {
            if (response.status === 'fulfilled') {
                const data = response.value;
                if (Array.isArray(data.numbers)) {
                    data.numbers.forEach((num) => result.add(num));
                }
            }
        });


        //  to get sorted array


        const sortedNumbers = Array.from(result).sort((a, b) => a - b);
        res.json({ numbers: sortedNumbers });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the URLs.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
