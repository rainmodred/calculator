function formatWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}


export default class View {
  constructor() {
    this.result = document.querySelector('.result');
    this.history = document.querySelector('.history');
  }

  updateResult(value) {
    if (value[0] === '0') {
      this.result.textContent = value;
      return;
    }
    this.result.textContent = formatWithSpaces(value);
  }

  updateHistory(value) {
    this.history.textContent = value.replace(/[^0-9.]/g, ((match) => ` ${match} `));
    this.history.scrollTop = this.history.scrollHeight;
  }
}
