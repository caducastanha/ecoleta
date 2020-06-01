import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  return res.json([
    'Cadu',
    'Lari',
    'Mônica'
  ]);
});

app.listen(3333);
