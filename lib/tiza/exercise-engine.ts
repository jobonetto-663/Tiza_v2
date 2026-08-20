export type Operation = '+' | '-' | '×' | '÷';

export interface ParsedExercise {
  operation: Operation;
  a: number;
  b: number;
}

export interface ExercisePlan {
  operationLabel: string;
  howTo: string[];
  hint: string;
  practicePrompt: string;
  practiceTip: string;
  practiceAnswer: number | null;
  originalAnswer: number | null;
}

const OPERATION_ALIASES: Record<string, Operation> = {
  '+': '+',
  '-': '-',
  '−': '-',
  x: '×',
  X: '×',
  '*': '×',
  '×': '×',
  '/': '÷',
  '÷': '÷',
};

interface WordProblem {
  prompt: string;
  answer: number;
}

const WORD_PROBLEM_BANK: WordProblem[] = [
  { prompt: 'Ana tiene 8 caramelos y le regalan 5 más. ¿Cuántos caramelos tiene ahora?', answer: 13 },
  { prompt: 'Había 12 pájaros en el árbol y 4 se fueron volando. ¿Cuántos quedan?', answer: 8 },
  { prompt: 'Hay 3 bolsas con 6 manzanas cada una. ¿Cuántas manzanas hay en total?', answer: 18 },
  { prompt: 'Se reparten 20 lápices entre 4 amigos por igual. ¿Cuántos lápices recibe cada uno?', answer: 5 },
  { prompt: 'Un colectivo llevaba 15 pasajeros. En la parada subieron 7 más. ¿Cuántos pasajeros hay ahora?', answer: 22 },
];

const PRACTICE_NAMES = [
  'Ana',
  'Tomás',
  'Lucía',
  'Mateo',
  'Sofía',
  'Benjamín',
  'Valentina',
  'Joaquín',
];

const PRACTICE_ITEMS = [
  'caramelos',
  'figuritas',
  'sticker',
  'galletitas',
  'lapiceras',
  'bloques',
  'manzanas',
  'autitos',
];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

interface PracticeTemplate {
  prompt: string;
  tip: string;
  answer: number;
}

const ADDITION_TEMPLATES = [
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `${n} tiene ${a} ${it} y le regalan ${b} más. ¿Cuántos ${it} tiene ahora?`,
    tip: 'Sumá cuando algo se agrega o juntás dos cantidades.',
    answer: a + b,
  }),
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `En una caja hay ${a} ${it} y en otra hay ${b}. ¿Cuántos ${it} hay en total?`,
    tip: 'La palabra "en total" te avisa que hay que sumar.',
    answer: a + b,
  }),
];

const SUBTRACTION_TEMPLATES = [
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `${n} tenía ${a} ${it} y regaló ${b}. ¿Cuántos ${it} le quedan?`,
    tip: 'La palabra "quedan" significa que hay que restar.',
    answer: a - b,
  }),
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `Había ${a} ${it} en el estante y se llevaron ${b}. ¿Cuántos ${it} quedan?`,
    tip: 'Restá lo que se fue de lo que había al principio.',
    answer: a - b,
  }),
];

const MULTIPLICATION_TEMPLATES = [
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `Hay ${a} cajas con ${b} ${it} cada una. ¿Cuántos ${it} hay en total?`,
    tip: 'Pensalo como sumar el mismo número varias veces.',
    answer: a * b,
  }),
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `${n} arma ${a} filas con ${b} ${it} cada una. ¿Cuántos ${it} hay en total?`,
    tip: 'Multiplicar filas por columnas te da el total.',
    answer: a * b,
  }),
];

const DIVISION_TEMPLATES = [
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `Se reparten ${a} ${it} entre ${b} amigos por igual. ¿Cuántos ${it} recibe cada uno?`,
    tip: 'Pensá en la tabla de multiplicar del divisor para ir más rápido.',
    answer: a / b,
  }),
  (n: string, it: string, a: number, b: number): PracticeTemplate => ({
    prompt: `${n} tiene ${a} ${it} y los guarda en ${b} bolsas por igual. ¿Cuántos ${it} hay en cada bolsa?`,
    tip: 'Dividir es repartir en partes iguales.',
    answer: a / b,
  }),
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

const ADDITION_KEYWORDS = ['regalan', 'le dan', 'compra', 'agrega', 'junta', 'recibe', 'suben', 'llega', 'más'];
const SUBTRACTION_KEYWORDS = ['pierde', 'regala', 'come', 'gasta', 'se van', 'quita', 'sale', 'sale', 'menos', 'quedan'];
const MULTIPLICATION_KEYWORDS = ['cajas', 'bolsas', 'filas', 'grupos', 'cada una', 'paquetes', 'docenas'];
const DIVISION_KEYWORDS = ['reparte', 'repartir', 'divide', 'dividir', 'por igual', 'entre'];

function detectWordProblem(raw: string): ParsedExercise | null {
  const numbers = raw.match(/\d+/g);
  if (!numbers || numbers.length < 2) return null;

  const text = raw.toLowerCase();
  const a = parseInt(numbers[0], 10);
  const b = parseInt(numbers[1], 10);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  if (DIVISION_KEYWORDS.some((kw) => text.includes(kw))) {
    return { operation: '÷', a, b };
  }
  if (MULTIPLICATION_KEYWORDS.some((kw) => text.includes(kw))) {
    return { operation: '×', a, b };
  }
  if (SUBTRACTION_KEYWORDS.some((kw) => text.includes(kw))) {
    return { operation: '-', a, b };
  }
  if (ADDITION_KEYWORDS.some((kw) => text.includes(kw))) {
    return { operation: '+', a, b };
  }
  return null;
}

export function parseExercise(raw: string): ParsedExercise | null {
  const match = raw.match(/(\d+)\s*([+\-−xX*×/÷])\s*(\d+)/);
  if (!match) return detectWordProblem(raw);

  const [, aStr, opStr, bStr] = match;
  const operation = OPERATION_ALIASES[opStr];
  const a = parseInt(aStr, 10);
  const b = parseInt(bStr, 10);
  if (!operation || Number.isNaN(a) || Number.isNaN(b)) return null;

  return { operation, a, b };
}

function similarNumber(original: number, min: number, max: number): number {
  const lower = clamp(original - 4, min, max);
  const upper = clamp(original + 4, min, max);
  let next = randomInt(lower, upper);
  if (next === original && upper > original) next = original + 1;
  else if (next === original && lower < original) next = original - 1;
  return next;
}

function generatePractice(parsed: ParsedExercise | null): {
  prompt: string;
  tip: string;
  answer: number | null;
} {
  if (!parsed) {
    const problem = pickRandom(WORD_PROBLEM_BANK);
    return {
      prompt: problem.prompt,
      tip: 'Dibujá o escribí los datos antes de resolver, te va a ayudar a pensar mejor.',
      answer: problem.answer,
    };
  }

  const name = pickRandom(PRACTICE_NAMES);
  const item = pickRandom(PRACTICE_ITEMS);

  switch (parsed.operation) {
    case '+': {
      const a2 = similarNumber(parsed.a, 2, 40);
      const b2 = similarNumber(parsed.b, 2, 40);
      const tpl = pickRandom(ADDITION_TEMPLATES);
      const result = tpl(name, item, a2, b2);
      return { prompt: result.prompt, tip: result.tip, answer: result.answer };
    }
    case '-': {
      const a2 = similarNumber(parsed.a, 10, 50);
      const b2 = similarNumber(parsed.b, 1, a2 - 1);
      const tpl = pickRandom(SUBTRACTION_TEMPLATES);
      const result = tpl(name, item, a2, b2);
      return { prompt: result.prompt, tip: result.tip, answer: result.answer };
    }
    case '×': {
      const a2 = similarNumber(parsed.a, 2, 12);
      const b2 = similarNumber(parsed.b, 2, 12);
      const tpl = pickRandom(MULTIPLICATION_TEMPLATES);
      const result = tpl(name, item, a2, b2);
      return { prompt: result.prompt, tip: result.tip, answer: result.answer };
    }
    case '÷': {
      const b2 = similarNumber(parsed.b, 2, 12);
      const k = similarNumber(parsed.a / parsed.b, 2, 12);
      const a2 = b2 * k;
      const tpl = pickRandom(DIVISION_TEMPLATES);
      const result = tpl(name, item, a2, b2);
      return { prompt: result.prompt, tip: result.tip, answer: result.answer };
    }
  }
}

export function regeneratePractice(parsed: ParsedExercise | null) {
  return generatePractice(parsed);
}

function solveOriginal(parsed: ParsedExercise | null): number | null {
  if (!parsed) return null;
  switch (parsed.operation) {
    case '+':
      return parsed.a + parsed.b;
    case '-':
      return parsed.a - parsed.b;
    case '×':
      return parsed.a * parsed.b;
    case '÷':
      return parsed.b !== 0 ? parsed.a / parsed.b : null;
    default:
      return null;
  }
}

export function buildExercisePlan(parsed: ParsedExercise | null): ExercisePlan {
  const practice = generatePractice(parsed);

  if (!parsed) {
    return {
      operationLabel: 'Problema',
      howTo: [
        'Leé el problema completo, despacio y sin apurarte.',
        'Subrayá los números y las palabras clave, como "en total", "quedan", "reparte" o "cada uno".',
        'Preguntate qué operación necesitás: ¿sumar, restar, multiplicar o dividir?',
        'Escribí el planteo con números antes de resolverlo.',
        'Resolvé paso a paso, con calma, y revisá que tu respuesta tenga sentido con la pregunta.',
      ],
      hint: 'Truco: las palabras "en total" o "juntos" casi siempre son de suma; "quedan" o "menos" son de resta.',
      practicePrompt: practice.prompt,
      practiceTip: practice.tip,
      practiceAnswer: practice.answer,
      originalAnswer: practice.answer,
    };
  }

  const { operation, a, b } = parsed;

  if (operation === '+') {
    return {
      operationLabel: 'Suma',
      howTo: [
        `Coloca el ${a} y el ${b} uno debajo del otro, alineando las unidades a la derecha.`,
        'Empezá a sumar por la columna de la derecha (las unidades).',
        'Si el resultado de esa columna es 10 o más, "llevate" 1 a la siguiente columna.',
        'Sumá la siguiente columna (las decenas) sin olvidar lo que llevaste.',
        '¡Listo! El número que armaste columna por columna es tu resultado.',
      ],
      hint: 'Truco: podés usar tus dedos o dibujar bolitas para contar de a uno si te trabás.',
      practicePrompt: practice.prompt,
      practiceTip: practice.tip,
      practiceAnswer: practice.answer,
      originalAnswer: solveOriginal(parsed),
    };
  }

  if (operation === '-') {
    return {
      operationLabel: 'Resta',
      howTo: [
        `Escribí el ${a} arriba y el ${b} justo abajo, alineando las unidades.`,
        'Restá empezando por la columna de las unidades.',
        'Si el número de arriba es más chico que el de abajo, "pedile prestado" 1 a la columna siguiente.',
        'Seguí restando columna por columna hacia la izquierda.',
        'El número que queda al final es tu resultado.',
      ],
      hint: 'Truco: podés contar hacia atrás con los dedos desde el número mayor.',
      practicePrompt: practice.prompt,
      practiceTip: practice.tip,
      practiceAnswer: practice.answer,
      originalAnswer: solveOriginal(parsed),
    };
  }

  if (operation === '×') {
    return {
      operationLabel: 'Multiplicación',
      howTo: [
        `Pensá el ${a} × ${b} como sumar el ${a} un total de ${b} veces.`,
        'Si te sabés la tabla de ese número, buscá la fila que corresponde.',
        'Si no, podés agrupar de a filas y columnas para armar una cuadrícula.',
        'Dibujar puntitos en filas y columnas te ayuda a visualizarlo.',
        'Contá todos los puntos de la cuadrícula para llegar al resultado.',
      ],
      hint: 'Truco: multiplicar por 2 es sumar el número dos veces; multiplicar por 10 es agregarle un cero.',
      practicePrompt: practice.prompt,
      practiceTip: practice.tip,
      practiceAnswer: practice.answer,
      originalAnswer: solveOriginal(parsed),
    };
  }

  return {
    operationLabel: 'División',
    howTo: [
      `Pensá el ${a} ÷ ${b} como repartir ${a} objetos en ${b} grupos iguales.`,
      'Repartí de a uno en cada grupo hasta que no puedas repartir más en partes iguales.',
      'Contá cuántos objetos quedaron en cada grupo: ese es tu resultado.',
      'Si sobran objetos que no se pueden repartir igual, eso se llama "resto".',
    ],
    hint: 'Truco: pensá en la tabla de multiplicar del divisor para adivinar el resultado más rápido.',
    practicePrompt: practice.prompt,
    practiceTip: practice.tip,
    practiceAnswer: practice.answer,
    originalAnswer: solveOriginal(parsed),
  };
}
