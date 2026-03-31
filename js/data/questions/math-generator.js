/**
 * Procedural Math Question Generator for Monstit RPG
 * Targets 3rd-5th graders (difficulty 1-3)
 *
 * UMD-lite: works as browser <script> (sets window.MathGenerator)
 * and as Node.js module (require()).
 */
(function (root, factory) {
  var mod = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mod;
  } else if (root) {
    root.MathGenerator = mod;
  }
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {

  // =========================================================================
  //  Helpers
  // =========================================================================

  /**
   * Random integer in [min, max] inclusive.
   */
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Simple deterministic string hash (djb2-style). Returns hex string.
   */
  function simpleHash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
    }
    // Convert to unsigned then to hex
    var unsigned = hash >>> 0;
    return unsigned.toString(16);
  }

  /**
   * Greatest common divisor (Euclidean algorithm).
   */
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  /**
   * Least common multiple.
   */
  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  /**
   * Format a number with commas for thousands separators.
   */
  function formatNumber(n) {
    var parts = String(n).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  /**
   * Simplify a fraction and return as "a/b" string (or whole number string).
   */
  function simplifyFraction(num, den) {
    if (den === 0) return '0';
    var sign = (num < 0) !== (den < 0) ? -1 : 1;
    num = Math.abs(num);
    den = Math.abs(den);
    var g = gcd(num, den);
    num = (sign * num) / g;
    den = den / g;
    if (den === 1) return String(num);
    return num + '/' + den;
  }

  /**
   * Fisher-Yates shuffle (returns new array).
   */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /**
   * Pick a random element from an array.
   */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Generate a set of unique wrong answers near the correct value.
   * Strategies are applied in order; duplicates and negatives are filtered.
   */
  function generateWrongNumbers(correct, strategies) {
    var wrongs = [];
    var seen = {};
    seen[correct] = true;
    // Flatten strategies: each is a function that returns a candidate number
    var candidates = [];
    for (var i = 0; i < strategies.length; i++) {
      var val = strategies[i];
      if (typeof val === 'number') {
        candidates.push(val);
      }
    }
    for (var j = 0; j < candidates.length && wrongs.length < 3; j++) {
      var c = candidates[j];
      if (c < 0 || seen[c]) continue;
      seen[c] = true;
      wrongs.push(c);
    }
    // Fill remaining with random offsets if needed
    var attempts = 0;
    while (wrongs.length < 3 && attempts < 50) {
      attempts++;
      var offset = randomInt(1, Math.max(5, Math.abs(correct))) * (Math.random() < 0.5 ? 1 : -1);
      var w = correct + offset;
      if (w < 0 || seen[w]) continue;
      seen[w] = true;
      wrongs.push(w);
    }
    // Last resort: just pick incrementing values
    var fallback = 1;
    while (wrongs.length < 3) {
      if (!seen[correct + fallback] && correct + fallback >= 0) {
        wrongs.push(correct + fallback);
        seen[correct + fallback] = true;
      }
      fallback++;
    }
    return wrongs;
  }

  /**
   * Build wrong answers for string-type answers (fractions, decimals displayed as strings).
   * Accepts an array of candidate wrong strings plus the correct string.
   * Returns exactly 3 unique wrong strings.
   */
  function pickWrongStrings(correct, candidates) {
    var wrongs = [];
    var seen = {};
    seen[correct] = true;
    for (var i = 0; i < candidates.length && wrongs.length < 3; i++) {
      var c = candidates[i];
      if (seen[c]) continue;
      seen[c] = true;
      wrongs.push(c);
    }
    // Fallback: mutate the correct answer slightly
    var fallback = 1;
    while (wrongs.length < 3) {
      var fb = String(parseInt(correct, 10) + fallback);
      if (!seen[fb]) {
        wrongs.push(fb);
        seen[fb] = true;
      }
      fallback++;
      if (fallback > 100) break; // safety
    }
    return wrongs;
  }

  /**
   * Package a question: shuffles answers, assigns correctIndex, generates id.
   */
  function packageQuestion(difficulty, questionText, correctAnswer, wrongAnswers) {
    // Ensure all answers are strings
    var correct = String(correctAnswer);
    var wrongs = wrongAnswers.map(String);

    // Build answer array with index tracking
    var items = [{ text: correct, isCorrect: true }];
    for (var i = 0; i < wrongs.length; i++) {
      items.push({ text: wrongs[i], isCorrect: false });
    }
    items = shuffle(items);

    var answers = [];
    var correctIndex = 0;
    for (var j = 0; j < items.length; j++) {
      answers.push(items[j].text);
      if (items[j].isCorrect) correctIndex = j;
    }

    return {
      id: 'gen_m_' + simpleHash(questionText),
      category: 'math',
      difficulty: difficulty,
      question: questionText,
      answers: answers,
      correctIndex: correctIndex
    };
  }

  // =========================================================================
  //  Difficulty 1 sub-categories  (3rd grade)
  // =========================================================================

  function d1_addition() {
    var a = randomInt(10, 99);
    var b = randomInt(10, 99);
    var correct = a + b;
    var question = 'What is ' + a + ' + ' + b + '?';
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct + 10,
      correct - 10,
      a + b + a % 10,   // common carry mistake
      a + b - b % 10    // forget ones
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d1_subtraction() {
    var a = randomInt(100, 999);
    var b = randomInt(10, 99);
    // Guarantee positive result
    if (a <= b) a = b + randomInt(10, 100);
    var correct = a - b;
    var question = 'What is ' + a + ' \u2212 ' + b + '?';
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct + 10,
      correct - 10,
      a + b,           // wrong operation
      correct + 2
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d1_multiplication() {
    var a = randomInt(2, 9);
    var b = randomInt(2, 9);
    var correct = a * b;
    var question = 'What is ' + a + ' \u00d7 ' + b + '?';
    var wrongs = generateWrongNumbers(correct, [
      a * (b + 1),       // adjacent table value
      a * (b - 1),       // adjacent table value
      (a + 1) * b,       // adjacent table value
      correct + 1,
      correct - 1,
      a + b              // wrong operation (addition)
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d1_division() {
    var divisor = randomInt(2, 9);
    var quotient = randomInt(2, 12);
    var dividend = divisor * quotient;
    var correct = quotient;
    var question = 'What is ' + dividend + ' \u00f7 ' + divisor + '?';
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      divisor,            // confuse divisor for answer
      correct + 2,
      dividend - divisor, // wrong operation
      correct * 2
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d1_placeValue() {
    var digits = randomInt(3, 4);
    var num;
    if (digits === 3) {
      num = randomInt(100, 999);
    } else {
      num = randomInt(1000, 9999);
    }
    var places = ['ones', 'tens', 'hundreds'];
    if (digits === 4) places.push('thousands');
    var place = pick(places);
    var str = String(num);
    var idx;
    switch (place) {
      case 'ones':      idx = str.length - 1; break;
      case 'tens':       idx = str.length - 2; break;
      case 'hundreds':   idx = str.length - 3; break;
      case 'thousands':  idx = str.length - 4; break;
    }
    var correct = parseInt(str[idx], 10);
    var question = 'What digit is in the ' + place + ' place of ' + formatNumber(num) + '?';

    // Build wrong answers from other digits plus near values
    var otherDigits = [];
    for (var i = 0; i < str.length; i++) {
      if (i !== idx) otherDigits.push(parseInt(str[i], 10));
    }
    var candidates = otherDigits.concat([
      (correct + 1) % 10,
      (correct + 9) % 10, // correct - 1 mod 10
      randomInt(0, 9),
      randomInt(0, 9)
    ]);
    // Filter duplicates and correct
    var wrongs = [];
    var seen = {};
    seen[correct] = true;
    for (var j = 0; j < candidates.length && wrongs.length < 3; j++) {
      if (!seen[candidates[j]]) {
        seen[candidates[j]] = true;
        wrongs.push(candidates[j]);
      }
    }
    while (wrongs.length < 3) {
      var r = randomInt(0, 9);
      if (!seen[r]) { seen[r] = true; wrongs.push(r); }
    }
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d1_rounding() {
    var num = randomInt(100, 999);
    var roundTo = pick(['ten', 'hundred']);
    var correct;
    if (roundTo === 'ten') {
      correct = Math.round(num / 10) * 10;
    } else {
      correct = Math.round(num / 100) * 100;
    }
    var question = 'Round ' + num + ' to the nearest ' + roundTo + '.';
    var wrongs;
    if (roundTo === 'ten') {
      wrongs = generateWrongNumbers(correct, [
        correct + 10,
        correct - 10,
        Math.floor(num / 10) * 10,  // always round down
        Math.ceil(num / 10) * 10,   // always round up
        correct + 1,
        correct - 1
      ]);
    } else {
      wrongs = generateWrongNumbers(correct, [
        correct + 100,
        correct - 100,
        Math.floor(num / 100) * 100,
        Math.ceil(num / 100) * 100,
        correct + 10,
        correct - 10
      ]);
    }
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d1_skipCounting() {
    var step = pick([2, 3, 4, 5, 10]);
    var start = randomInt(1, 20) * step; // start on a multiple
    var seq = [start, start + step, start + 2 * step, start + 3 * step];
    var correct = start + 4 * step;
    var question = 'What comes next: ' + seq.join(', ') + ', ___?';
    var wrongs = generateWrongNumbers(correct, [
      correct + step,     // one step too far
      correct - step,     // previous term
      correct + 1,
      correct - 1,
      start + 5 * step,   // two steps ahead
      correct + 2
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  // =========================================================================
  //  Difficulty 2 sub-categories  (4th grade)
  // =========================================================================

  function d2_multiplication() {
    var a = randomInt(11, 30);
    var b = randomInt(2, 9);
    var correct = a * b;
    var question = 'What is ' + a + ' \u00d7 ' + b + '?';
    var wrongs = generateWrongNumbers(correct, [
      (a + 1) * b,
      (a - 1) * b,
      a * (b + 1),
      a * (b - 1),
      correct + 10,
      correct - 10
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d2_longDivision() {
    var divisor = randomInt(3, 9);
    var quotient = randomInt(11, 30);
    var dividend = divisor * quotient;
    var correct = quotient;
    var question = 'What is ' + dividend + ' \u00f7 ' + divisor + '?';
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct + divisor,
      correct - divisor,
      divisor,
      correct * 2
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d2_fractionCompare() {
    // Generate two fractions with different values
    var d1 = randomInt(2, 8);
    var n1 = randomInt(1, d1 - 1);
    var d2, n2;
    do {
      d2 = randomInt(2, 8);
      n2 = randomInt(1, d2 - 1);
    } while (n1 * d2 === n2 * d1); // ensure they are not equal

    var frac1 = simplifyFraction(n1, d1);
    var frac2 = simplifyFraction(n2, d2);

    // Determine which is greater
    var val1 = n1 / d1;
    var val2 = n2 / d2;
    var correctAnswer, wrongAnswer;
    if (val1 > val2) {
      correctAnswer = frac1;
      wrongAnswer = frac2;
    } else {
      correctAnswer = frac2;
      wrongAnswer = frac1;
    }

    var question = 'Which fraction is greater: ' + frac1 + ' or ' + frac2 + '?';
    // Wrong answers: the other fraction, "They are equal", and a made-up fraction
    var extraFrac = simplifyFraction(randomInt(1, 5), randomInt(2, 8));
    var wrongs = pickWrongStrings(correctAnswer, [
      wrongAnswer,
      'They are equal',
      extraFrac,
      simplifyFraction(randomInt(1, 4), randomInt(3, 7))
    ]);
    return { question: question, correct: correctAnswer, wrongs: wrongs };
  }

  function d2_equivalentFractions() {
    // Pick a base fraction
    var baseDen = randomInt(2, 6);
    var baseNum = randomInt(1, baseDen - 1);
    var g = gcd(baseNum, baseDen);
    var simpNum = baseNum / g;
    var simpDen = baseDen / g;

    // Create the equivalent fraction by multiplying by a factor
    var factor = randomInt(2, 4);
    var equivNum = simpNum * factor;
    var equivDen = simpDen * factor;

    var question = 'Which fraction is equal to ' + simplifyFraction(simpNum, simpDen) + '?';
    var correctAnswer = equivNum + '/' + equivDen;

    // Generate wrong fractions
    var wrongCandidates = [];
    // Off-by-one numerator
    wrongCandidates.push((equivNum + 1) + '/' + equivDen);
    wrongCandidates.push((equivNum - 1 > 0 ? equivNum - 1 : equivNum + 2) + '/' + equivDen);
    // Same numerator, wrong denominator
    wrongCandidates.push(equivNum + '/' + (equivDen + 1));
    // Different random fraction
    wrongCandidates.push(simplifyFraction(simpNum + 1, simpDen));
    wrongCandidates.push((simpNum) + '/' + (simpDen + 1));

    var wrongs = pickWrongStrings(correctAnswer, wrongCandidates);
    return { question: question, correct: correctAnswer, wrongs: wrongs };
  }

  function d2_measurement() {
    var type = randomInt(0, 2);
    var correct, question;
    if (type === 0) {
      var feet = randomInt(2, 10);
      correct = feet * 12;
      question = 'How many inches are in ' + feet + ' feet?';
    } else if (type === 1) {
      var yards = randomInt(2, 10);
      correct = yards * 3;
      question = 'How many feet are in ' + yards + ' yards?';
    } else {
      var quarts = randomInt(2, 8);
      correct = quarts * 4;
      question = 'How many cups are in ' + quarts + ' quarts?';
    }
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct * 2,
      Math.floor(correct / 2),
      correct + 3,
      correct - 3
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d2_perimeter() {
    var length = randomInt(5, 20);
    var width = randomInt(3, 15);
    var correct = 2 * (length + width);
    var question = 'A rectangle is ' + length + ' units long and ' + width + ' units wide. What is the perimeter?';
    var wrongs = generateWrongNumbers(correct, [
      length * width,          // confused with area
      length + width,          // forgot to double
      2 * length + width,      // only doubled one
      length + 2 * width,      // only doubled one
      correct + 2,
      correct - 2
    ]);
    return { question: question, correct: formatNumber(correct) + ' units', wrongs: wrongs.map(function (w) { return formatNumber(w) + ' units'; }) };
  }

  function d2_area() {
    var length = randomInt(3, 15);
    var width = randomInt(2, 12);
    var correct = length * width;
    var question = 'A rectangle is ' + length + ' units long and ' + width + ' units wide. What is the area?';
    var wrongs = generateWrongNumbers(correct, [
      2 * (length + width),    // confused with perimeter
      correct + 1,
      correct - 1,
      (length + 1) * width,
      length * (width + 1),
      correct + length
    ]);
    return { question: question, correct: formatNumber(correct) + ' square units', wrongs: wrongs.map(function (w) { return formatNumber(w) + ' square units'; }) };
  }

  function d2_wordProblems() {
    var type = randomInt(0, 1);
    var correct, question;
    if (type === 0) {
      var rows = randomInt(3, 10);
      var items = randomInt(4, 12);
      correct = rows * items;
      question = 'A store has ' + rows + ' rows of ' + items + ' items. How many items are there in total?';
    } else {
      var divisor = randomInt(3, 8);
      var quotient = randomInt(2, 10);
      var cookies = divisor * quotient;
      correct = quotient;
      question = cookies + ' students share ' + cookies + ' cookies equally. How many does each student get?';
      // Fix: use divisor as students
      question = divisor + ' students share ' + cookies + ' cookies equally. How many does each student get?';
    }
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct + 2,
      correct - 2,
      correct * 2,
      Math.max(1, Math.floor(correct / 2))
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  // =========================================================================
  //  Difficulty 3 sub-categories  (5th grade)
  // =========================================================================

  function d3_multiplication() {
    var a = randomInt(11, 50);
    var b = randomInt(11, 30);
    var correct = a * b;
    var question = 'What is ' + a + ' \u00d7 ' + b + '?';
    var wrongs = generateWrongNumbers(correct, [
      (a + 1) * b,
      (a - 1) * b,
      a * (b + 1),
      a * (b - 1),
      correct + 10,
      correct - 10
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d3_decimals() {
    var type = randomInt(0, 1);
    var question, correct, correctStr;
    if (type === 0) {
      // Addition: A.B + C.D
      var a = randomInt(1, 20);
      var aFrac = randomInt(1, 9);
      var b = randomInt(1, 15);
      var bFrac = randomInt(1, 9);
      var aVal = a + aFrac / 10;
      var bVal = b + bFrac / 10;
      correct = Math.round((aVal + bVal) * 10) / 10;
      question = 'What is ' + aVal.toFixed(1) + ' + ' + bVal.toFixed(1) + '?';
      correctStr = correct.toFixed(1);
    } else {
      // Multiplication: A.B x C (single digit)
      var base = randomInt(1, 15);
      var frac = randomInt(1, 9);
      var multiplier = randomInt(2, 9);
      var baseVal = base + frac / 10;
      correct = Math.round(baseVal * multiplier * 10) / 10;
      question = 'What is ' + baseVal.toFixed(1) + ' \u00d7 ' + multiplier + '?';
      correctStr = correct.toFixed(1);
    }

    // Generate wrong decimal answers
    var wrongCandidates = [
      (correct + 0.1).toFixed(1),
      (correct - 0.1).toFixed(1),
      (correct + 1).toFixed(1),
      (correct - 1).toFixed(1),
      (correct + 0.2).toFixed(1),
      (correct + 10).toFixed(1)
    ];
    var wrongs = pickWrongStrings(correctStr, wrongCandidates.filter(function (w) {
      return parseFloat(w) >= 0;
    }));
    return { question: question, correct: correctStr, wrongs: wrongs };
  }

  function d3_fractionAddition() {
    // a/b + c/d with unlike denominators
    var b = randomInt(2, 6);
    var d = randomInt(2, 6);
    // Ensure unlike denominators
    while (d === b) { d = randomInt(2, 6); }
    var a = randomInt(1, b - 1);
    var c = randomInt(1, d - 1);

    var commonDen = lcm(b, d);
    var resultNum = a * (commonDen / b) + c * (commonDen / d);
    var resultDen = commonDen;

    var correctStr = simplifyFraction(resultNum, resultDen);
    var question = 'What is ' + a + '/' + b + ' + ' + c + '/' + d + '?';

    // Wrong answers
    var wrongCandidates = [
      simplifyFraction(a + c, b + d),                  // common mistake: add tops and bottoms
      simplifyFraction(a + c, b),                       // used first denominator
      simplifyFraction(a + c, d),                       // used second denominator
      simplifyFraction(resultNum + 1, resultDen),       // off by one
      simplifyFraction(resultNum - 1, resultDen),       // off by one
      simplifyFraction(a * c, b * d)                    // multiplied instead
    ];

    var wrongs = pickWrongStrings(correctStr, wrongCandidates);
    return { question: question, correct: correctStr, wrongs: wrongs };
  }

  function d3_orderOfOperations() {
    var type = randomInt(0, 1);
    var a, b, c, correct, question;
    if (type === 0) {
      // A + B x C
      a = randomInt(2, 9);
      b = randomInt(2, 9);
      c = randomInt(2, 9);
      correct = a + b * c;
      question = 'What is ' + a + ' + ' + b + ' \u00d7 ' + c + '?';
      var wrongAdd = (a + b) * c; // left-to-right mistake
      var wrongs = generateWrongNumbers(correct, [
        wrongAdd,
        correct + 1,
        correct - 1,
        a * b + c,
        correct + c,
        correct - b
      ]);
    } else {
      // A x B - C
      a = randomInt(2, 9);
      b = randomInt(2, 9);
      c = randomInt(1, Math.min(a * b - 1, 9));
      correct = a * b - c;
      question = 'What is ' + a + ' \u00d7 ' + b + ' \u2212 ' + c + '?';
      var wrongLeft = a * (b - c); // wrong grouping
      var wrongs = generateWrongNumbers(correct, [
        wrongLeft,
        correct + 1,
        correct - 1,
        a + b - c,    // add instead of multiply
        correct + c,
        correct + 10
      ]);
    }
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  function d3_volume() {
    var l = randomInt(2, 10);
    var w = randomInt(2, 10);
    var h = randomInt(2, 10);
    var correct = l * w * h;
    var question = 'A box is ' + l + ' cm \u00d7 ' + w + ' cm \u00d7 ' + h + ' cm. What is the volume?';
    var wrongs = generateWrongNumbers(correct, [
      l * w + h,              // forgot to multiply all three
      l + w + h,              // added instead
      2 * (l * w + w * h + l * h), // surface area
      correct + 1,
      correct - 1,
      l * w * (h + 1)
    ]);
    return { question: question, correct: formatNumber(correct) + ' cm\u00b3', wrongs: wrongs.map(function (w) { return formatNumber(w) + ' cm\u00b3'; }) };
  }

  function d3_percentages() {
    var percentages = [10, 20, 25, 50, 75];
    var p = pick(percentages);
    // Pick N so that p% of N is a whole number
    // Use the denominator of simplified p/100 as the base
    var bases = { 10: 10, 20: 5, 25: 4, 50: 2, 75: 4 };
    var base = bases[p];
    var multiplier = randomInt(1, 10);
    var n = base * multiplier;
    var correct = (p / 100) * n;
    var question = 'What is ' + p + '% of ' + formatNumber(n) + '?';
    var wrongs = generateWrongNumbers(correct, [
      correct + 1,
      correct - 1,
      correct * 2,
      Math.max(1, Math.floor(correct / 2)),
      correct + 5,
      n - correct
    ]);
    return { question: question, correct: formatNumber(correct), wrongs: wrongs.map(formatNumber) };
  }

  function d3_decimalSubtraction() {
    // A.BC - D.EF with 2 decimal places, positive result
    var aWhole = randomInt(5, 30);
    var aFrac = randomInt(10, 99);
    var dWhole = randomInt(1, aWhole - 1);
    var dFrac = randomInt(10, 99);
    var aVal = aWhole + aFrac / 100;
    var dVal = dWhole + dFrac / 100;
    // Ensure positive
    if (aVal <= dVal) {
      aVal = dVal + randomInt(1, 10) + randomInt(1, 99) / 100;
      aVal = Math.round(aVal * 100) / 100;
    }
    var correct = Math.round((aVal - dVal) * 100) / 100;
    var question = 'What is ' + aVal.toFixed(2) + ' \u2212 ' + dVal.toFixed(2) + '?';
    var correctStr = correct.toFixed(2);

    var wrongCandidates = [
      (correct + 0.01).toFixed(2),
      (correct - 0.01).toFixed(2),
      (correct + 0.10).toFixed(2),
      (correct - 0.10).toFixed(2),
      (correct + 1).toFixed(2),
      (aVal + dVal).toFixed(2)       // added instead of subtracted
    ];
    var wrongs = pickWrongStrings(correctStr, wrongCandidates.filter(function (w) {
      return parseFloat(w) >= 0;
    }));
    return { question: question, correct: correctStr, wrongs: wrongs };
  }

  function d3_multiStep() {
    var n = randomInt(3, 8);
    var m = randomInt(4, 12);
    var k = randomInt(1, n * m - 1);
    var correct = n * m - k;
    var question = 'A bag has ' + n + ' groups of ' + m + ' marbles, then ' + k + ' are removed. How many are left?';
    var wrongs = generateWrongNumbers(correct, [
      n * m,                  // forgot to subtract
      n * m + k,              // added instead
      n + m - k,              // added groups instead of multiply
      correct + 1,
      correct - 1,
      correct + k
    ]);
    return { question: question, correct: String(correct), wrongs: wrongs.map(String) };
  }

  // =========================================================================
  //  Sub-category registries
  // =========================================================================

  var difficulty1 = [
    d1_addition,
    d1_subtraction,
    d1_multiplication,
    d1_division,
    d1_placeValue,
    d1_rounding,
    d1_skipCounting
  ];

  var difficulty2 = [
    d2_multiplication,
    d2_longDivision,
    d2_fractionCompare,
    d2_equivalentFractions,
    d2_measurement,
    d2_perimeter,
    d2_area,
    d2_wordProblems
  ];

  var difficulty3 = [
    d3_multiplication,
    d3_decimals,
    d3_fractionAddition,
    d3_orderOfOperations,
    d3_volume,
    d3_percentages,
    d3_decimalSubtraction,
    d3_multiStep
  ];

  var registries = {
    1: difficulty1,
    2: difficulty2,
    3: difficulty3
  };

  // =========================================================================
  //  Main entry point
  // =========================================================================

  /**
   * Generate a random math question for the given difficulty level.
   *
   * @param {number} difficulty - 1 (3rd grade), 2 (4th grade), or 3 (5th grade)
   * @returns {{ id: string, category: string, difficulty: number, question: string, answers: string[], correctIndex: number }}
   */
  function generateMathQuestion(difficulty) {
    var d = difficulty || 1;
    if (d < 1) d = 1;
    if (d > 3) d = 3;
    var generators = registries[d];
    var generator = generators[Math.floor(Math.random() * generators.length)];
    var result = generator();
    return packageQuestion(d, result.question, result.correct, result.wrongs);
  }

  // =========================================================================
  //  Public API
  // =========================================================================

  return {
    generateMathQuestion: generateMathQuestion,
    // Expose helpers for testing
    _helpers: {
      simpleHash: simpleHash,
      gcd: gcd,
      lcm: lcm,
      simplifyFraction: simplifyFraction,
      formatNumber: formatNumber,
      randomInt: randomInt
    }
  };

});
