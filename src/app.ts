import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

function getCurrentDateInUTC() {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getUTCDate()).padStart(2, '0');
  const hours = String(currentDate.getUTCHours()).padStart(2, '0');
  const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

const app = express();
app.use(bodyParser.json());

app.post('/rpc', async (req, res) => {
  const apiKey = req.query.apikey;
  const requiredApiKey = process.env.API_KEY;
  const url = process.env.URL;

  if (url === undefined) {
    res.status(500).send('URL is not defined');
    return;
  }

  if (apiKey !== requiredApiKey) {
    res.status(401).send('Unauthorized: Invalid API key');
    return;
  }

  console.log(`${getCurrentDateInUTC()} - request: ${req.body}`)

  try {
    const response = await axios.post(url, req.body);

    console.log(`${getCurrentDateInUTC()} - result: ${JSON.stringify(response.data)}`)

    res.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
        console.log(`${getCurrentDateInUTC()} - error: ${JSON.stringify(error.message)}`)
        res.status(500).send(`Error forwarding the JSON-RPC request: ${JSON.stringify(error.message)}`);
      } else {
        console.log(`${getCurrentDateInUTC()} - error: ${error}`)
        res.status(500).send('Error forwarding the JSON-RPC request');
      }  
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
