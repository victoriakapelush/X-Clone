const giphy = require('giphy-api')('sQgg5vgN1hswBnzBkuzFRLbeZ9dO8eHV');

exports.searchGifs = (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send({ error: 'Query parameter is required' });
  }
  giphy.search({ q: query, limit: 33 }, (err, response) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(response.data);
  });
};

exports.randomGifs = (req, res) => {
  const { limit } = req.query;
  const numberOfGifs = limit || 9; 

  const promises = [];
  for (let i = 0; i < numberOfGifs; i++) {
    promises.push(giphy.random()); 
  }

  Promise.all(promises)
    .then((responses) => {
      const gifs = responses.map(response => response.data);
      console.log(gifs);

      res.send(gifs);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};

