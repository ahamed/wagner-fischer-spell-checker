import wordsArray from './words.json';

class SpellChecker {
  isCorrect: boolean;
  words: string[];
  checkingWord: string;
  suggestions: string[];
  totalSuggestions: number;

  constructor(checking: string = '') {
    this.checkingWord = checking;
    this.isCorrect = false;
    this.words = wordsArray as string[];
    this.suggestions = [];
    this.totalSuggestions = 10;
  }

  setWord(word: string) {
    this.checkingWord = word;
  }

  checkSpell() {
    if (this.words.includes(this.checkingWord)) {
      this.isCorrect = true;
      return this;
    }

    this.isCorrect = false;
    const similarWords: { distance: number; word: string }[] = [];

    for (const word of this.words) {
      similarWords.push({ distance: this.calculateDistance(this.checkingWord, word), word });
    }

    this.suggestions = similarWords
      .toSorted((first, second) => first.distance - second.distance)
      .slice(0, this.totalSuggestions)
      .map(item => item.word);

    return this;
  }

  calculateDistance(current: string, target: string) {
    const currentLength = current.length;
    const targetLength = target.length;
    const matrix: number[][] = Array.from({ length: currentLength + 1 }, () =>
      Array.from({ length: targetLength + 1 })
    );
    matrix[0][0] = 0;

    for (let columnIndex = 1; columnIndex <= targetLength; columnIndex++) {
      matrix[0][columnIndex] = columnIndex;
    }

    for (let rowIndex = 1; rowIndex <= currentLength; rowIndex++) {
      matrix[rowIndex][0] = rowIndex;
    }

    for (let rowIndex = 1; rowIndex <= currentLength; rowIndex++) {
      for (let columnIndex = 1; columnIndex <= targetLength; columnIndex++) {
        const previousColumn = matrix[rowIndex][columnIndex - 1];
        const previousRow = matrix[rowIndex - 1][columnIndex];
        const previousDiagonal = matrix[rowIndex - 1][columnIndex - 1];

        const minimum = Math.min(previousColumn, previousRow, previousDiagonal);

        matrix[rowIndex][columnIndex] =
          current[rowIndex - 1] === target[columnIndex - 1] ? previousDiagonal : minimum + 1;
      }
    }

    return matrix[currentLength][targetLength];
  }

  isCorrectWord() {
    return this.isCorrect;
  }

  getSuggestions() {
    return this.suggestions;
  }
}

export default SpellChecker;
