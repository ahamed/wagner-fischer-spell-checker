import bunrestServer from 'bunrest';
import SpellChecker from './spell-check';

const app = bunrestServer();
const checker = new SpellChecker();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next && next();
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/spell-check', async (req, res) => {
  const word = req.query?.word;
  if (!word) {
    res.status(400).send('Missing query params!');
  }

  checker.setWord(word);
  checker.checkSpell();

  const data = {
    is_correct: checker.isCorrectWord(),
    suggestions: checker.getSuggestions(),
  };

  res.send(JSON.stringify(data));
});

app.listen(3000, () => {
  console.log(`Listening to the port:3000`);
});
