const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/:route', (req, res) => {
  const handler = require(`./handlers/${req.params.route}`).default;
  if (!handler) {
    return res.status(404).json({
      message: 'not found'
    });
  }
  return handler(req, res);
})

app.listen(PORT);
