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
            words: ["active", "adventurous", "articulate", "confident", "decide", "decisive", "dominant", "greedy", "guru", "hacker", "headstrong", "head-strong", "implusive", "levelheaded", "level-headed", "masculine", "ninja", "objective", "opinion", "outspoken", "persist", "reckless", "rockstar", "superhero", "versatile"],
            prefixes: ["aggress", "ambitio", "analy", "assert", "athlet", "autonom", "battle", "boast", "challeng", "champion", "compet", "confiden", "courag", "decid", "decision", "decisive", "defend", "determin", "domina", "dominant", "driven", "fearless", "fight", "force", "hierarch", "hostil", "impulsive", "independen", "individual", "intellect", "lead", "logic", "practical", "principle", "self-confiden", "selfrelian", "self-relian", "selfsufficien", "self-sufficien", "stubborn", "superior", "unreasonab"],
        },
        feminine: {
            words: ["affectionate", "feminine", "flatterable", "honest", "kind", "kinship", "modesty", "nag", "share", "organized"],
            prefixes: ["agree", "child", "cheer", "collab", "commit", "communal", "compassion", "connect", "considerate", "cooperat", "co-operat", "depend", "emotiona", "empath", "energetic", "enthusias", "feel", "gentle", "inclusive", "interpersonal", "inter-personal", "interdependen", "inter-dependen", "interpersona", "inter-persona", "loyal", "nurtur", "pleasant", "polite", "quiet", "respon", "sensitiv", "sharin", "submissive", "support", "sympath", "tender", "together", "trust", "understand", "warm", "whin", "yield"],
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
