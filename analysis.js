function _countWords(words, wordsCounter, wordsFound) {
  let count = 0;
  let found = new Set([...wordsFound]);

  for (const word of words) {
    if (wordsCounter[word] && !found.has(word)) {
      count += wordsCounter[word];
      found.add(word);
    }
  }

  return [count, found];
}

function _countWordsAndPrefixes(text, prefixes, biasWords) {
  const wordsCounter = _.countBy(text);
  const wordsUnique = Object.keys(wordsCounter);
  let found = new Set();
  let count = 0;

  const [wordCount, WordsFound] = _countWords(biasWords, wordsCounter, found);
  found = new Set([...found, ...WordsFound]);
  count += wordCount;

  for (const prefix of prefixes) {
    const prefixedWords = wordsUnique.filter(word => word.startsWith(prefix));
    const [prefixedCount, prefixedWordsFound] = _countWords(prefixedWords, wordsCounter, found);
    found = new Set([...found, ...prefixedWordsFound]);
    count += prefixedCount;
  }

  return [count, found];
}

function _calculateGenderBias(text, genderBiases) {
  const _text = _.words(_.lowerCase(text));
  const _found = {};
  const score = {};

  for (const key of Object.keys(genderBiases)) {
    const [count, found] = _countWordsAndPrefixes(
      _text,
      genderBiases[key]["prefixes"],
      genderBiases[key]["words"],
    );

    score[key] = count;
    _found[key] = found;
  }

  return [score, _found, _text];
}

function findBias(text, { ALERT, DEBUG } = {}) {
  const BIAS_WEIGHT = 2;
  const GENDER_BIASES = {
    masculine: {
      words: ["active", "adventurous", "articulate", "confident", "decide", "decisive", "dominant", "greedy", "guru", "hacker", "he", "headstrong", "head-strong", "implusive", "levelheaded", "level-headed", "masculine", "ninja", "objective", "opinion", "outspoken", "persist", "reckless", "rockstar", "strong", "superhero", "versatile"],
      prefixes: ["aggress", "ambitio", "analy", "assert", "athlet", "autonom", "battle", "boast", "challeng", "champion", "compet", "confiden", "courag", "decid", "decision", "decisive", "defend", "determin", "domina", "dominant", "driven", "fearless", "fight", "force", "hierarch", "hostil", "impulsive", "independen", "individual", "intellect", "lead", "logic", "practical", "principle", "self-confiden", "selfrelian", "self-relian", "selfsufficien", "self-sufficien", "stubborn", "superior", "unreasonab"],
    },
    feminine: {
      words: ["affectionate", "feminine", "flatterable", "honest", "kind", "kinship", "modesty", "nag", "responsible", "share", "she", "organized"],
      prefixes: ["agree", "child", "cheer", "collab", "commit", "communal", "compassion", "connect", "considerate", "cooperat", "co-operat", "depend", "emotiona", "empath", "energetic", "enthusias", "feel", "gentle", "inclusive", "interpersonal", "inter-personal", "interdependen", "inter-dependen", "interpersona", "inter-persona", "loyal", "nurtur", "pleasant", "polite", "quiet", "sensitiv", "sharin", "submissive", "support", "sympath", "tender", "together", "trust", "understand", "warm", "whin", "yield"],
    },
  };

  const [genderBiasScore, _found, _text] = _calculateGenderBias(text, GENDER_BIASES);
  let maxBias = 0;

  if (DEBUG) {
    console.log("Page contained: ", _text);
    console.log("Found gender-coded words: ", _found);
    console.log("Bias scores:");
  }

  for (const gender of Object.keys(genderBiasScore)) {
    maxBias = Math.max(maxBias, genderBiasScore[gender]);
    if (DEBUG) console.log("\t" + gender, maxBias);
  }

  const bias = Math.min(100, (((maxBias * BIAS_WEIGHT) / _text.length) * 100));
  const percentBias = bias.toFixed(2) + "%";
  if (ALERT) alert("Final bias score: " + percentBias);
  if (DEBUG) console.log("Final bias score: " + percentBias);

  return [bias, _found, _text];
}
