import icons from '../../img/icons.svg';

import View from './View';

//  import会在icons报错

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _curPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      const goToPage = +btn.dataset.goto;
      if (!goToPage) return;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are  other pages
    if (this._curPage === 1 && numPages > 1) return this._generateBtnNext();

    // Last page
    if (this._curPage === numPages) return this._generateBtnPrev();
    // Other page
    if (this._curPage < numPages)
      return `${this._generateBtnPrev()} 
              ${this._generateBtnNext()}`;
    // Page 1, and there are no other pages
    return '';
  }

  _generateBtnPrev() {
    return `
          <button data-goto=${
            this._curPage - 1
          } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._curPage - 1}</span>
          </button>
        `;
  }

  _generateBtnNext() {
    return `
          <button data-goto=${
            this._curPage + 1
          } class="btn--inline pagination__btn--next">
            <span>Page ${this._curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }
}

export default new PaginationView();
