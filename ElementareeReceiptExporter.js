// ==UserScript==
// @name        ElementareeReceiptExporter
// @namespace   ElementareeReceiptExporter
// @match       https://elementaree.ru/*
// @grant       none
// @version     1.0
// @author      github.com/ciricc
// @description Add export button for all receipts on the elementaree.ru website 31/08/2024, 17:49:13
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// ==/UserScript==
VM.observe(document.body, function() {
  const basketDishes = $('[class^="basket__dishes___"]');
  if (basketDishes.length) {
    let button = basketDishes.find("button.export-receipt");
    if (button.length) return console.error("Already has button");
    button = $(`<button style="background-color: #ffdb19; color: var(--color__choco); padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 16px;margin-left: 24px;"></button>`).addClass("export-receipt").text("Сохранить список");
    button.on("click", function () {
      const products = getProductsList();
      const rows = products.map(el => {
        const cols = [];
        cols.push(el.title);
        cols.push(el.price);
        cols.push(el.portionsCount);
        return cols.join(",")
      });
      navigator.clipboard.writeText(rows.join("\n"));
      alert("Copied to clipboard!")
    })
    basketDishes.append(button);
  }
});

function download(filename, text) {
  var element = document.createElement('a');

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function getProductsList() {
    const products = [];

    document.querySelectorAll(`[data-test-id="basket-dish-mobile-small"]`).forEach(el => {
        const title = el.querySelector(`[data-test-id="basket-dish__title"]`).innerText;
        const price = parseInt(el.querySelector(`[class^="basket__dish-item__price"] [class^="num"]`).innerText, 10);
        const portionsCount = parseInt(el.querySelector(`[data-test-id="portions__count"]`).innerText);
        products.push({
            title,
            price,
            portionsCount
        });
    });

    return products;
}
