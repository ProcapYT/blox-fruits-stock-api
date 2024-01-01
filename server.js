const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.static('publc'))

app.get('/api/bloxfruits/stock', async (req, res) => {
  try {
    const response = await axios.get('https://fruityblox.com/stock');
    
    const $ = cheerio.load(response.data);

    const fruitElements = $('.row.mb-3.bg-purple.text-light.fw-bold.rounded-2');

    const stock = {};

    fruitElements.each((index, element) => {
      const fruitInfo = {};

      const imgSrc = $(element).find('.col-3.d-flex.align-items-center img').attr('src');
      const name = $(element).find('.col-3.d-flex.align-items-center').eq(1).text().trim();
      const price = $(element).find('.col-3.d-flex.align-items-center').eq(2).text().trim();
      const robux = $(element).find('.col-3.d-flex.align-items-center').eq(3).text().trim();
      const countDown = $('body').find('#countdown').text()

      fruitInfo.imageURL = imgSrc;
      fruitInfo.name = name;
      fruitInfo.price = price;
      fruitInfo.robux = robux;

      stock['countdown'] = countDown
      stock[name.toLowerCase()] = fruitInfo;
    });

    res.json({ stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
