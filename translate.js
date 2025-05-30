const $ = document;

const divform = $.createElement("div");
const form = $.createElement("form");

const textBlock = $.createElement("div");
const textTransH = $.createElement("h3");
textTransH.textContent = "Translate";
textBlock.appendChild(textTransH);
textBlock.classList.add("text-block");

const firstLangBlock = $.createElement("div");
const firstLangRuBtn = $.createElement("button");
const secondLangEngBtn = $.createElement("button");
const defineLang = $.createElement("button");
firstLangRuBtn.textContent = "Русский";
secondLangEngBtn.textContent = "Английский";
defineLang.textContent = "Определить язык";
firstLangBlock.appendChild(defineLang);
firstLangBlock.appendChild(firstLangRuBtn);
firstLangBlock.appendChild(secondLangEngBtn);
firstLangBlock.classList.add("lang-block", "first-lang");

const swapBlock = $.createElement("div");
const swapBtn = $.createElement("button");
swapBlock.appendChild(swapBtn);
swapBlock.classList.add("swap-block");

const secondLangBlock = $.createElement("div");
const threeLangRuBtn = $.createElement("button");
const fourLangEngBtn = $.createElement("button");
threeLangRuBtn.textContent = "Русский";
fourLangEngBtn.textContent = "Английский";
secondLangBlock.appendChild(threeLangRuBtn);
secondLangBlock.appendChild(fourLangEngBtn);
secondLangBlock.classList.add("lang-block", "second-lang");

const langBlock = $.createElement("div");
langBlock.classList.add("output-row");

const inputBlock = $.createElement("div");
const textTranslateInput = $.createElement("input");
inputBlock.appendChild(textTranslateInput);
inputBlock.classList.add("block", "block-input");

const outputBlock = $.createElement("div");
const textTranslateOutput = $.createElement("input");
textTranslateOutput.readOnly = true;
outputBlock.appendChild(textTranslateOutput);
outputBlock.classList.add("block", "block-output");

const translateBlock = $.createElement("div");
translateBlock.classList.add("input-trans");

const formBlock = $.createElement("div");
formBlock.classList.add("form");

formBlock.appendChild(langBlock);
formBlock.appendChild(translateBlock);

langBlock.appendChild(firstLangBlock);
langBlock.appendChild(swapBlock);
langBlock.appendChild(secondLangBlock);

translateBlock.appendChild(inputBlock);
translateBlock.appendChild(outputBlock);

divform.classList.add("form-wrapper");
divform.appendChild(formBlock);
$.body.appendChild(divform);

let sourceLang = 'ru';
let resultLang = 'en';

function setActiveButton(buttons, activeButton) {
  buttons.forEach(btn => btn.classList.remove('active'));
  activeButton.classList.add('active');
}
async function translateText() {
    const text = textTranslateInput.value.trim();
    if (!text) {
        textTranslateOutput.value = '';
        return;
    }
    try {
        textTranslateOutput.value = "идет перевод...";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${resultLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        const translated = data[0].map(part => part[0]).join('');
        textTranslateOutput.value = translated || "не удалось перевести!";
    } catch (error) {
        textTranslateOutput.value = "Ошибка перевода";
    }
}
const sourceLangButtons = [firstLangRuBtn, secondLangEngBtn];
const resultLangButtons = [threeLangRuBtn, fourLangEngBtn];

firstLangRuBtn.addEventListener('click', () => {
    sourceLang = 'ru';
    setActiveButton(sourceLangButtons, firstLangRuBtn);
    translateText();
});
secondLangEngBtn.addEventListener('click', () => {
    sourceLang = 'en';
    setActiveButton(sourceLangButtons, secondLangEngBtn);
    translateText();
});
threeLangRuBtn.addEventListener('click', () => {
    resultLang = 'ru';
    setActiveButton(resultLangButtons, threeLangRuBtn);
    translateText();
});
fourLangEngBtn.addEventListener('click', () => {
    resultLang = 'en';
    setActiveButton(resultLangButtons, fourLangEngBtn);
    translateText();
});
defineLang.addEventListener('click', () => {
    const text = textTranslateInput.value.trim();
    if (!text) return;
    const isRussian = /[а-яА-ЯЁё]/.test(text);
    sourceLang = isRussian ? 'ru' : 'en';
    if (sourceLang === 'ru') {
        setActiveButton(sourceLangButtons, firstLangRuBtn);
    } else {
        setActiveButton(sourceLangButtons, secondLangEngBtn);
    }
    translateText();
});
textTranslateInput.addEventListener('input', () => {
    clearTimeout(window.translateTimeout );
    window.translateTimeout  = setTimeout(translateText, 200);
});

swapBtn.addEventListener('click', () => {
    [sourceLang, resultLang] = [resultLang, sourceLang];
    [textTranslateInput.value, textTranslateOutput.value] = [textTranslateOutput.value, textTranslateInput.value];
    if (sourceLang === 'ru') {
        setActiveButton(sourceLangButtons, firstLangRuBtn);
    } else {
        setActiveButton(sourceLangButtons, secondLangEngBtn);
    }
    if (resultLang === 'ru') {
        setActiveButton(resultLangButtons, threeLangRuBtn);
    } else {
        setActiveButton(resultLangButtons, fourLangEngBtn);
    }
    translateText();
});
setActiveButton(sourceLangButtons, firstLangRuBtn);
setActiveButton(resultLangButtons, fourLangEngBtn);
