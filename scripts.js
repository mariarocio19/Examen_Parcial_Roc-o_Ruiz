const getById = id => document.getElementById(id);
const getAll = sel => document.querySelectorAll(sel);

const getIO = () => ({
    text: getAll("#text")[0].value.normalize(), 
    search: getAll("#search")[0].value.normalize(),
    view: getAll("#view")[0]
});

// Limpiar el texto, eliminando caracteres no deseados y manteniendo solo letras y espacios
const clean_string = (text) => 
    text
    .replace(/[\n\r\t]+/igm, " ")                                
    .replace(/[^a-zñáéíóúü0-9 \.,;:()¿?¡!“”❝❞«»'‘’\-]+/igm, "") 
    .replace(/[ ]+/gm, " ");                                     

// Función para controlar los arrays 
const char_array = (text) => 
    clean_string(text)
    .replace(/[^a-zñáéíóú]+/igm, "") 
    .split("")                       
    .filter((w) => (w !== ""));       

// Array de palabras
const word_array = (text) => {
    return clean_string(text)
        .split(/\s+/)   
        .filter(word => word.length > 0);  
};


// Array de frases 
const sentence_array = (text) =>
    clean_string(text)     
    .replace(/([\.:;?!\n]+)/gm, "$1+")
    .split("+")
    .filter((w) => (w !== ""))          // Eliminamos Strings vacíos 
    .map((s) => (s.replace(/^[ 0-9]+(.*$)/, "$1"))); 

// Función para contar las repeticiones 
const repetitions = (ordered_array) => 
    ordered_array
    .reduce(
        (acc, el, i, a) => {
            if (i === 0)            acc.push({s: el, n: 1});
            else if (el === a[i-1]) acc[acc.length-1].n++;
            else                    acc.push({s: el, n: 1});
            return acc;
        }, 
        []
    );

// Contar caracteres, palabras, frases, y lineas
const count = () => {
    let {text, view} = getIO();

    let result =  `Caracteres: ${char_array(text).length}\n`; 
        result += `Palabras: ${word_array(text).length}\n`;  
        result += `Frases: ${sentence_array(text).length}\n`;
        result += `Líneas: ${text.split("\n").length}\n`;

    view.innerHTML = result;
};

// Función para contar repeticiones de letras 
const letter_index = () => {
    let {text, view} = getIO();

    let ordered_letters = 
        char_array(text)
        .map(el => el.toLowerCase())
        .sort();

    let result = 
        repetitions(ordered_letters)
        .map(el => `${el.s}: ${el.n}`)
        .join("\n");

    view.innerHTML = result;
};

const word_index = () => {
    let {text, view} = getIO();
    
    let words = word_array(text).map(word => word.toLowerCase()).sort();
    
    let result = repetitions(words)
        .map(el => `${el.s}: ${el.n}`)
        .join("\n");

    view.innerHTML = result;
};

const sentence_index = () => {
    let {text, view} = getIO();

    let ordered_sentences = 
        sentence_array(text)
        .map(el => el.toLowerCase())
        .sort();

    let result = 
        repetitions(ordered_sentences)
        .map(el => `${el.s}: ${el.n}`)
        .join("\n");                  

    view.innerHTML = result;
};

// Función para contar letras del texto
const search_letters = () => {
    let {text, view, search} = getIO();

    let ordered_letters = 
        char_array(text)
        .map(el => el.toLowerCase())
        .filter(el => el.includes(search.toLowerCase()))
        .sort();

    let result = `Hay ${ordered_letters.length} ocurrencias de la letra '${search}'.\n\n`;

    result +=
        repetitions(ordered_letters)      
        .map(el => `${el.n} repeticiones de:  ${el.s}`)  
        .join("\n");                    

    view.innerHTML = result;
};

// Función para buscar palabras en el texto 
const search_words = () => {
    let {text, view, search} = getIO();

    let words = word_array(text)
        .map(word => word.toLowerCase())
        .filter(word => word.includes(search.toLowerCase()))
        .sort();

    let result = `Hay ${words.length} palabras que contienen '${search}'.\n\n`;
    
    result += repetitions(words)
        .map(el => `${el.n} repeticiones de: ${el.s}`)
        .join("\n");

    view.innerHTML = result;
};

// Buscar frases en el texto 
const search_sentences = () => {
    let {text, view, search} = getIO();

    let searched_sentences = 
        sentence_array(text)
        .filter(el => el.includes(search))
        .sort();

    let result = `Hay ${searched_sentences.length} frases que contienen '${search}'.\n\n`;

    result +=
        repetitions(searched_sentences)
        .map(el => `${el.n} repeticiones de:   ${el.s}`)
        .join("\n");

    view.innerHTML = result;
};
document.addEventListener('click', ev => {
    if      (ev.target.matches('.count'))            count();
    else if (ev.target.matches('.letter_index'))     letter_index(); 
    else if (ev.target.matches('.word_index'))       word_index();
    else if (ev.target.matches('.sentence_index'))   sentence_index();
    else if (ev.target.matches('.search_letters'))   search_letters();
    else if (ev.target.matches('.search_words'))     search_words();
    else if (ev.target.matches('.search_sentences')) search_sentences();
});

