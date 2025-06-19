class Translate {
  constructor() {
    this.inputText = document.querySelector('.text-input');
    this.outputText = document.querySelector('.text-output');

    this.sourceButtons = document.querySelectorAll('.first-lang .lang-btn');
    this.resultButtons = document.querySelectorAll('.second-lang .lang-btn');

    this.defineButton = document.querySelector('.define-lang');
    this.swapButton = document.querySelector('.swap-btn');

    this.sourceLang = 'ru';  
    this.resultLang = 'en';  

    this.timeout = null;
    this.setActiveButton(this.sourceButtons, this.sourceLang);
    this.setActiveButton(this.resultButtons, this.resultLang);
    this.addListeners();
  }
  setActiveButton(buttons, lang) {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  addListeners() {
    this.sourceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sourceLang = btn.dataset.lang;
        this.setActiveButton(this.sourceButtons, this.sourceLang);
        this.resultLang = this.sourceLang === 'ru' ? 'en' : 'ru';
        this.setActiveButton(this.resultButtons, this.resultLang);
        this.translateText();
      });
    });

    this.resultButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.resultLang = btn.dataset.lang;
        this.setActiveButton(this.resultButtons, this.resultLang);
        this.translateText();
      });
    });

    this.defineButton.addEventListener('click', () => {
      const text = this.inputText.value.trim();
      if (!text) return;
      const isRus = /[а-яА-ЯЁё]/.test(text);
      this.sourceLang = isRus ? 'ru' : 'en';
      this.setActiveButton(this.sourceButtons, this.sourceLang);
      this.resultLang = this.sourceLang === 'ru' ? 'en' : 'ru';
      this.setActiveButton(this.resultButtons, this.resultLang);
      this.translateText();
    });

    this.inputText.addEventListener('input', () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.translateText(), 200);
    });

    this.swapButton.addEventListener('click', () => {
      [this.sourceLang, this.resultLang] = [this.resultLang, this.sourceLang];
      [this.inputText.value, this.outputText.value] = [this.outputText.value, this.inputText.value];
      this.setActiveButton(this.sourceButtons, this.sourceLang);
      this.setActiveButton(this.resultButtons, this.resultLang);
      this.translateText();
    });
  }

  async translateText() {
    const text = this.inputText.value.trim();
    if (!text) {
      this.outputText.value = '';
      return;
    }
    this.outputText.value = 'идёт перевод...';
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${this.sourceLang}&tl=${this.resultLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json(); //await тип ждем результата пока не заверш промис 
      const translated = data[0].map(text => text[0]).join('');
      this.outputText.value = translated || 'не удалось перевести!';
    } 
    catch {
      this.outputText.value = 'Ошибка перевода';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Translate();
});
