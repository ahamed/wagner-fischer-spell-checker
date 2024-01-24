import { useState } from 'react';
import './App.css';

interface Response {
  is_correct: boolean;
  suggestions: string[];
}

function App() {
  const [word, setWord] = useState('');
  const [response, setResponse] = useState<Response | null>(null);
  return (
    <div className="app-container">
      <form
        className="bg-white radius-circle p-8 drop-shadow-sm rounded-md"
        onSubmit={async event => {
          event.preventDefault();
          const response = await fetch(`http://localhost:3000/spell-check?word=${word}`);
          const data = (await response.json()) as Response;
          setResponse(data);
        }}
      >
        <label className="text-gray-600">Word to check</label>
        <input
          type="text"
          className="block mt-2 w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Spell checking"
          value={word}
          onChange={event => {
            setWord(event.target.value);
            setResponse(null);
          }}
        />
        <div className="text-right mt-4">
          <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ">Search</button>
        </div>
      </form>

      {!!response && (
        <div className="mt-8">
          {response?.is_correct ? (
            <div className="flex gap-2">
              <pre className="text-purple-700">{word}</pre> <span>is a correct word.</span>
            </div>
          ) : (
            <div>
              Did you mean?
              <ul>
                {response?.suggestions.map((word, index) => {
                  return (
                    <li key={index}>
                      <button className="bg-transparent border-none" onClick={() => setWord(word)}>
                        <pre className="text-purple-700">{word}</pre>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
