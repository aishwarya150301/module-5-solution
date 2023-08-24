$(function () {
  // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}' with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // Given array of category objects, returns a random category object.
  var chooseRandomCategory = function (categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  };

  // New function to get a random category and load menu items for it
  var loadRandomCategoryMenuItems = function (categories) {
    var chosenCategory = chooseRandomCategory(categories);
    dc.loadMenuItems(chosenCategory.short_name);
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // Show loading icon during initial load
    showLoading("#main-content");

    // Request all categories from the server
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        // Build and show the home page with a random category
        buildAndShowHomeHTML(categories);
      },
      true
    );
  });

  // Builds HTML for the home page based on categories array
  function buildAndShowHomeHTML(categories) {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        // Choose a random category
        var chosenCategory = chooseRandomCategory(categories);

        // Insert the chosen category into the home HTML
        var homeHtmlToInsertIntoMainPage = insertProperty(
          homeHtml,
          "randomCategoryShortName",
          chosenCategory.short_name
        );

        // Insert the produced HTML into the main page
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
      },
      false
    );
  }

  // ... (Other functions remain unchanged)

  // Add an event listener for the "Specials" tile click event
  $("#specials-tile").click(function () {
    loadRandomCategoryMenuItems(categories);
  });

  global.$dc = dc;
})(window);
