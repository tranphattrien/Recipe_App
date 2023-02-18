import View from "./View";
class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateButtonMarkup(type, curPage) {
    return `
      <button data-goto = "${
        type === "next" ? curPage + 1 : curPage - 1
      }"  class="btn--inline pagination__btn--${type}">
      <span>Page ${type === "next" ? curPage + 1 : curPage - 1}</span>
      <i class="search__icon fa-solid fa-angle-${
        type === "next" ? "right" : "left"
      }"></i>
    </button>
    `;
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateButtonMarkup("next", curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateButtonMarkup("prev", curPage);
    }

    // Other page
    if (curPage < numPages) {
      return `${this._generateButtonMarkup(
        "next",
        curPage
      )}${this._generateButtonMarkup("prev", curPage)}`;
    }

    // page 1, No other page
    return "";
  }
}
export default new PaginationView();
