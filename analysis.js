function _countWords(words, wordsCounter, wordsFound) {
    let count = 0;
    for (const word of words) {
        if (wordsCounter[word] && !wordsFound.has(word)) {
            count += wordsCounter[word];
            wordsFound.add(word);
        }
    }

    return [count, wordsFound];
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

    return count;
}

function _calculateGenderBias(text, genderBiases) {
    const score = {};
    const _text = _.words(_.lowerCase(text));

    for (const key of Object.keys(genderBiases)) {
        score[key] = _countWordsAndPrefixes(
            _text,
            genderBiases[key]["prefixes"],
            genderBiases[key]["words"],
        );
    }

    return [score, _text];
}


function findBias(text) {
    const BIAS_WEIGHT = 2;
    const GENDER_BIASES = {
        masculine: {
            words: ["active", "adventurous", "confident", "decide", "decisive", "dominant", "greedy", "headstrong", "implusive", "logic", "masculine", "objective", "opinion", "outspoken", "persist", "reckless", "stubborn", "superior"],
            prefixes: ["aggress", "ambitio", "analy", "assert", "athlet", "autonom", "boast", "challeng", "compet", "courag", "decision", "determin", "domina", "force", "hierarch", "hostil", "independen", "individual", "intellect", "lead", "principle", "self-confiden"],
        },
        feminine: {
            words: ["affectionate", "communal", "considerate", "feminine", "flatterable", "gentle", "honest", "interpersonal", "kind", "kinship", "modesty", "nag", "polite", "submissive"],
            prefixes: ["child", "cheer", "commit", "compassion", "connect", "cooperat", "depend", "emotiona", "empath", "interdependen", "interpersona", "loyal", "nurtur", "pleasant", "quiet", "respon", "sensitiv", "support", "sympath", "tender", "together", "trust", "understand", "warm", "whin", "yield"],
        },
    };

    const [genderBiasScore, _text] = _calculateGenderBias(text, GENDER_BIASES);
    let maxBias = 0;

    for (const gender of Object.keys(genderBiasScore)) {
        maxBias = Math.max(maxBias, genderBiasScore[gender]);
    }

    const bias = Math.min(100, (((maxBias * BIAS_WEIGHT) / _text.length) * 100));
    return bias;

    // return bias.toFixed(2) + "%";
}
