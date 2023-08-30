const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const app = express();


const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./front-end'))

const xmlUrl = 'https://christianbook.com/sitemap4.xml'; 

// Fetch XML data and parse it

axios.get(xmlUrl)
  .then(response => {
    const xmlData = response.data;

    parseString(xmlData, (err, result) => {
      if (err) {
        console.error('XML parsing error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const jsonData = result;

      app.get('/redirect/:code', (req, res) => {
        const userCode = req.params.code;

        const matchingUrlEntry = jsonData.urlset.url.find(urlEntry => {
          const url = urlEntry.loc[0];
          const extractedCode = url.substring(url.lastIndexOf('/') + 1);
          return extractedCode === userCode;
        });

        if (matchingUrlEntry) {
          const redirectUrl = matchingUrlEntry.loc[0];
          return res.redirect(redirectUrl);
        } else {
          return res.status(404).json({ error: 'Code not found' });
        }
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error fetching XML:', error);
  });
