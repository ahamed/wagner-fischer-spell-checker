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

app.get('/convert', async (req, res) => {
  const file = await Bun.file('./bengali.txt');
  const content = await file.text();
  const lines = content.split('\n').map((line: string) => line.trim());
  Bun.write('./bengali.json', JSON.stringify(lines));
  res.send('converted');
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
