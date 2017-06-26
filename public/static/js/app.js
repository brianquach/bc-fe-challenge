var companyAPI = (function() {
  'use strict';

  var apiBaseURI;

  function init() {
    apiBaseURI = 'http://localhost:3000/';
  }

  function getCompanyInformation(options) {
    options = options || {};
    var query = options.q || '';
    var start = options.start || 0;
    var limit = options.limit || 10;
    var laborTypes = options.laborTypes || [];

    var queryString = '?q=' + query + '&start=' + start + '&limit=' + limit
      + '&laborTypes=' + laborTypes.join(',');
    var url = apiBaseURI + 'api/companies' + queryString;

    tools.ajaxCall({
      verb: 'GET',
      url: url,
      successCallBack: function(response) {
        console.log(response);
      },
      failCallBack: function() {
        console.log('error');
      }
    });
  }

  return {
    init: init,
    getCompanyInformation: getCompanyInformation
  };
})();

var companySearch = (function() {
  'use strict';

  var $searchBox;
  var $searchResults;

  function init() {
    $searchBox = document.getElementById('searchBox');
    $searchResults = document.getElementById('searchResults');

    $searchBox.addEventListener('keyup', function(event) {
      companyAPI.getCompanyInformation();
    });
  }

  function render() {
    // TODO: render list of company name
  }

  return {
    init: init
  };
})();

companyAPI.init();
companySearch.init();
