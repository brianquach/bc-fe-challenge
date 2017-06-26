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
  var $pagination;
  var $currentPage;
  var $totalPage;
  var $prevBtn;
  var $nextBtn;
  var $companyInformation;
  var q = '';
  var startIndex = 0;
  var limit = 25;
  var total;
  var results = [];

  function init() {
    $searchBox = document.getElementById('searchBox');
    $searchResults = document.getElementById('searchResults');
    $currentPage = document.getElementById('currentPage');
    $totalPage = document.getElementById('totalPage');
    $prevBtn = document.getElementById('prevBtn');
    $nextBtn = document.getElementById('nextBtn');
    $pagination = document.getElementById('pagination');
    $companyInformation = document.getElementById('companyInformation');

    var getCompanyInfo = tools.debounce(companyAPI.getCompanyInformation, 1000);
    var companyInfoCallBack = function(response) {
      results = response.results;
      total = response.total;
      searchRender();
    };
    $searchBox.addEventListener('keyup', function(event) {
      q = $searchBox.value;
      startIndex = 0;
      var options = {
        q: q,
        start: startIndex,
        limit: limit,
        laborTypes: [],
        callback: companyInfoCallBack
      };
      getCompanyInfo(options);
    });

    $prevBtn.addEventListener('click', function(event) {
      startIndex -= limit;
      companyAPI.getCompanyInformation({
        q: q,
        start: startIndex,
        limit: limit,
        laborTypes: [],
        callback: companyInfoCallBack
      });
    });

    $nextBtn.addEventListener('click', function(event) {
      startIndex += limit;
      companyAPI.getCompanyInformation({
        q: q,
        start: startIndex,
        limit: limit,
        laborTypes: [],
        callback: companyInfoCallBack
      });
    });

    // Use event delegation to handle company selection
    $searchResults.addEventListener('click', function(event) {
      var element = event.srcElement || event.target;
      if (element.classList.contains('company-title')) {
        companyRender(
          element.dataset.name,
          element.dataset.avatarurl,
          element.dataset.phone,
          element.dataset.website,
          element.dataset.labortypes
        );
      }
    });

    companyAPI.getCompanyInformation({
      q: '',
      start: startIndex,
      limit: limit,
      laborTypes: [],
      callback: companyInfoCallBack
    });
  }

  function companyRender(name, avatarURL, phone, website, laborTypes) {
    var h = '';

    h += '<h2>' + name + '</h2>';
    h += '<img src="' + avatarURL + '">';
    h += '<span class="phone">' + phone + '</span>';
    h += '<a href="' + website + '">website</a>';
    h += '<span class="laborTypes">' + laborTypes + '</span>';

    $companyInformation.innerHTML = h;
  }

  function searchRender() {
    // Render current list of companies
    var h = '';
    results.forEach(function(result) {
      h += '<li class="company-brief">';
      h += '<a class="company-title" href="javascript:void(0)"';
      h += 'data-avatarurl="' + result.avatarUrl + '"';
      h += 'data-name="' + result.name + '"';
      h += 'data-phone="' + result.phone + '"';
      h += 'data-website="' + result.website + '"';
      h += 'data-labortypes="' + result.laborType.join(', ') + '"';
      h += '>' + result.name + '</a></li>';
    });
    $searchResults.innerHTML = h;

    // Render serach pagination
    var currentPage = Math.floor(startIndex / limit) + 1;
    var totalPages = Math.ceil(total / limit);
    $currentPage.innerText = currentPage;
    $totalPage.innerText = totalPages;

    if (currentPage > 1) {
      $prevBtn.classList.remove('hide');
    } else {
      $prevBtn.classList.add('hide')
    }
    if (currentPage !== totalPages) {
      $nextBtn.classList.remove('hide');
    } else {
      $nextBtn.classList.add('hide');
    }

    if (results.length > 0) {
      $pagination.classList.add('show');
    } else {
      $pagination.classList.remove('show');
    }
  }

  return {
    init: init
  };
})();

companyAPI.init();
companySearch.init();
