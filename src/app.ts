import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

interface JsonRpcRequest {
    jsonrpc: string;
    id: number | string | null;
    method: string;
    params: any;
  }
  
  interface ExtendedJsonRpcRequest extends JsonRpcRequest {
    url: string;
  }

const app = express();
app.use(bodyParser.json());

app.post('/rpc', async (req, res) => {
  const apiKey = req.query.apikey;
  const requiredApiKey = process.env.API_KEY;

  if (apiKey !== requiredApiKey) {
    res.status(401).send('Unauthorized: Invalid API key');
    return;
  }

  const jsonRpcRequest: ExtendedJsonRpcRequest = req.body;

  console.log(jsonRpcRequest)

  try {
    const response = await axios.post(jsonRpcRequest.url, {
      jsonrpc: jsonRpcRequest.jsonrpc,
      id: jsonRpcRequest.id,
      method: jsonRpcRequest.method,
      params: jsonRpcRequest.params,
    });

    res.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).send(`Error forwarding the JSON-RPC request: ${error.message}`);
      } else {
        res.status(500).send('Error forwarding the JSON-RPC request');
      }  
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
