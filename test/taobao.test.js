var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

nightmare
  .goto('https://www.taobao.com/')
  .type('#q', '笔记本')
  .click('button.btn-search.tb-bg[type=submit]')
  .wait('.grid.g-clearfix')
  .evaluate(function () {
    return document.querySelector('.g_price.g_price-highlight strong')
      .textContent.trim();
  })
  .end()

  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });