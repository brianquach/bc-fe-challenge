/*
 * App.js is used to store all company search app logic
 */

/*
 * companyAPI - data logic that talks to express server through RESTful api calls
 */
var companyAPI = (function() {
  'use strict';

  var apiBaseURI;

  function init() {
    apiBaseURI = 'http://localhost:3000/';
  }

  /*
   *  getCompanyInformation - get a list of company inforamtion
   *  options {object}:
   *    q {string} - query string
   *    start {integer} - start index of desired result set
   *    limit {integer} - number of results desired from start index
   *    laborTypes {array} - list of labor types to filter by
   */
  function getCompanyInformation(options) {
    options = options || {};
    var query = options.q || '';
    var start = options.start || 0;
    var limit = options.limit || 10;
    var laborTypes = options.laborTypes || [];
    var cb = options.callback || function() {};

    var queryString = '?q=' + query + '&start=' + start + '&limit=' + limit
      + '&laborTypes=' + laborTypes.join(',');
    var url = apiBaseURI + 'api/companies' + queryString;

    tools.ajaxCall({
      verb: 'GET',
      url: url,
      successCallBack: cb,
      failCallBack: function() {
        console.error('Error getting company data.');
      }
    });
  }

  return {
    init: init,
    getCompanyInformation: getCompanyInformation
  };
})();

/*
 * companySearch - core company search app logic
 */
var companySearch = (function() {
  'use strict';

  var $searchBox;
  var $searchResults;
  var startIndex = 0;
  var total;
  var results = [];

  function init() {
    $searchBox = document.getElementById('searchBox');
    $searchResults = document.getElementById('searchResults');

    $searchBox.addEventListener('keyup', function(event) {
      companyAPI.getCompanyInformation();
    });

    companyAPI.getCompanyInformation({
      q: '',
      start: 0,
      limit: 25,
      laborTypes: [],
      callback: function(response) {
        results = response.results;
        total = response.total;
        render();
      }
    });
  }

  function render() {
    console.log('here render', startIndex, total, results);
    var h = '';
    results.forEach(function(result) {
      h += '<li class="company-brief">';
      h += '<a href="javascript:void(0)"><span class="title">' + result.name + '</span></a>'
      h += '</li>';
    });

    $searchResults.innerHTML = h;
  }

  return {
    init: init
  };
})();

companyAPI.init();
companySearch.init();
