/**
 * Matthew Machida (mmachida)
 * Ralen Kovara (ralenk)
 *
 * The Javascript file for the index.html file. Provides functionality for
 * switching pages and dynamically loads foods choices to the ordering page.
 * Ensures only one page is being displayed at a time.
 */

"use strict";
(function() {

  // Names for all of the pages the website has. Used for swapping views
  const HOME = "home-page";
  const ORDER = "order-page";
  // const CART = "cart-page";
  // const PROFILE = "profile-page";
  const ITEM = "item-page";
  // const LOGIN_PAGE = "login";
  // const HISTORY = 'history-page';

  // const TIME = 2000;

  // // keeps track of the current user logged in
  // let currentUser = '';

  // endpoints constants
  const RECIPE_MATCHES = '/getDesserts';
  // const SEARCH = '/search';
  // const CREATE = '/newuser';
  // const LOGIN = '/login';
  // const CART_PAGE = '/cart';
  // const PURCHASE = '/purchase';

  // Name of all foods on sale. Will automatically make cards for each food

  window.addEventListener("load", init);

  /**
   * Initialization function that runs on page load.
   */
  function init() {
    activateButtons();
    // id('toggle').addEventListener('click', () => {
    //   toggleView();
    // });

    let items = qsa(".item");
    for (let i = 0; i < items.length; i++) {
      console.log("item");
      items[i].addEventListener("click", handleItem);
    }
  }

  /**
   * Switches the user view to the specified page. Hides the current page and
   * displays the new one in its place
   * @param {string} pageName The name of the page to switch to. Must be a
   *                          page nae specified by a constant value
   */
  function switchPages(pageName) {
    let currentPage = qs(".viewing");
    currentPage.classList.add("hidden");
    currentPage.classList.remove("viewing");

    let nextPage = id(pageName);
    nextPage.classList.remove("hidden");
    nextPage.classList.add("viewing");
  }

  // function toggleView() {
  //   let cards = qsa('.item');
  //   for(let i=0; i < cards.length; i++) {
  //     cards[i].classList.toggle('individual');
  //   }
  // }

  /**
   * Adds functionality to all buttons on screen, including header buttons
   * and buttons on each page. Each button navigates to a predetermined
   * page. ANY BUTTONS WITHOUT FUNCTIONALITY ARE YET TO BE IMPLEMENTED
   */
  function activateButtons() {
    id("logo-btn").addEventListener("click", () => {
      switchPages(HOME);
    });
    id("home-order-btn").addEventListener("click", () => {
      // loadRecipes();
      loadLocalRecipies();  // FOR TESTING ONLY
      switchPages(ORDER);
    });
    id("item-order-btn").addEventListener("click", () => {
      switchPages(ORDER);
    });
    id('instagram-btn').addEventListener('click', function() {
      window.location.href = 'https://www.instagram.com/yumisdesserts/';
    });
    // activateButtonsHelper();
  }

  // /**
  //  * Helps activate the rest of the buttons needed for app functionality
  //  */
  // function activateButtonsHelper() {
  //   id('search-btn').addEventListener('click', async function () {
  //     await searchItems('');
  //   });
  //   id('small-filter').addEventListener('click', async function() {
  //     await searchItems('?small=1');
  //   });
  //   id('large-filter').addEventListener('click', async function() {
  //     await searchItems('?large=1');
  //   });
  //   id('customizable-filter').addEventListener('click', async function() {
  //     await searchItems('?customizable=1');
  //   });
  //   id('deselect-btn').addEventListener('click', function () {
  //     id('small-filter').checked = false;
  //     id('large-filter').checked = false;
  //     id('customizable-filter').checked = false;
  //     showAll();
  //   });
  //   id('to-cart').addEventListener('click', function (){
  //     addToCart()
  //     switchPages(ORDER);
  //   });
  //   id('purchase-btn').addEventListener('click', showHistory);
  //   id('clear-cart').addEventListener('click', clearCart);
  //   id('checkout').addEventListener('click', function() {
  //     checkOut();
  //   });
  // }

  /**
   * Loads the avaialble baked goods for purchase
   */
  async function loadRecipes() {
    try {
      let response = await fetch(RECIPE_MATCHES);
      await statusCheck(response);
      let result = await response.json();
      id('dessert-list').innerHTML = '';
      result.forEach(dessert => {
        let itemCard = genItemCard(dessert)
        id('dessert-list').append(itemCard);
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Functions identically to loadRecipies but accesses data from the local client
   * file directory instead of fetching from the server. Practically should only
   * be used for testing purposes
   */
  async function loadLocalRecipies() {
    try {
      let response = await fetch("/localdata/local-dessertData.json");
      await statusCheck(response);
      let result = await response.json();
      id('dessert-list').innerHTML = '';
      result.forEach(dessert => {
        let itemCard = genItemCard(dessert)
        id('dessert-list').append(itemCard);
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Generates a new article tag to represent a food item. Uses the name
   * of the food as a title for the card. Also uses the name to set the
   * article's ID in the format "card-[itemName]" and adds an image for
   * the item, using the item name for the image path.
   * @param {string} itemName The name of the food item to generate. Must
   *                          be from the constant array of food names
   * @returns {HTMLElement}   The article tag with the title, image, and
   *                          ID specified by the passed item name.
   */
  function genItemCard(item) {
    let article = gen("article");
    article.classList.add("item");
    article.id = "card-" + item.name;

    let pLabel = gen("p");
    pLabel.textContent = capitalizeFirst(item.name);
    article.appendChild(pLabel);

    let img = gen("img");

    img.src = "img/" + item.img;
    article.appendChild(img);

    article.addEventListener('click', async function() {
      // await getSpecificItem(item.name);
      await getLocalSpecificItem(item.name);  // FOR TESTING ONLY
    });
    return article;
  }

  /**
   * Redisplays all the purchasable items
   */
  function showAll (){
    let displayed = qsa('.item');
    displayed.forEach(card => {
      card.classList.remove('hidden');
    });
  }

  // /**
  //  * Searches and filters item based on radiobuttons selected or keywords entered
  //  * in the searchbar
  //  * @param {string} filter representing how to filter the items
  //  */
  // async function searchItems(filter){
  //   try {
  //     showAll();
  //     let response;
  //     let searchTerm;
  //     if(filter === '') {
  //       searchTerm = id('search-term').value.trim();
  //       response = await fetch(SEARCH + '?input=' + searchTerm);
  //     } else {
  //       response = await fetch(SEARCH + filter);
  //     }
  //     await statusCheck(response);
  //     let result = await response.json();
  //     displaySearch(result);
  //   } catch (err) {

  //   }
  // }

  // /**
  //  * Displays the items that matches the search result and hides the rest of them
  //  * @param {json} result the items that match the search
  //  */
  // function displaySearch(result) {
  //   let displayed = qsa('.item');
  //   displayed.forEach(card => {
  //     let remove = true;
  //     for (let i = 0; i < result.length; i++) {
  //       if ('card-' + result[i].name === card.id) {
  //         remove = false;
  //       }
  //     }
  //     if (remove) {
  //       card.classList.add('hidden');
  //     }
  //   });
  // }

  /**
   * Allows user to purchase an item and then customize it with flavors and quantity
   * and special requests.
   * @param {string} itemName name of the item the user selected
   */
  async function getSpecificItem(itemName){
    try {
      let response = await fetch(RECIPE_MATCHES + '?dessert=' + itemName);
      await statusCheck(response);
      let result = await response.json();

      id("flavor-select").innerHTML = "";
      displayItemDetails(result, itemName);

      switchPages(ITEM);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Functions identically to getSpecificItem but accesses data from the local client
   * file directory instead of fetching from the server. Practically should only
   * be used for testing purposes
   * @param {string} itemName name of the item the user selected
   */
  async function getLocalSpecificItem(itemName){
    try {
      let response = await fetch('/localdata/local-' + itemName + '.json');
      await statusCheck(response);
      let result = await response.json();

      id("flavor-select").innerHTML = "";
      displayItemDetails(result, itemName);

      switchPages(ITEM);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Opens the item page for a specific dessert type, displaying flavors, pricing,
   * and a photo of the dessert type. 
   * @param {object} data A json object with all the information about the item
   * @param {string} name The name of the item
   */
  function displayItemDetails(data, name) {
    // Add all different flavor options for the certain item
    for (let i = 0; i < data.flavors.length; i++) {
      const option = document.createElement('option');
      option.value = data.flavors[i].flavor;
      option.textContent = data.flavors[i].flavor;
      id('flavor-select').appendChild(option);
    }

    // Add image, price, and title text
    id('gen-dessert').src = 'img/' + data.img;
    id('quantity-input').max = data.max;
    id('item-type').textContent = name;

    // Continually update the total price based on the current flavor and amount selected
    updatePrice(data);
    id('flavor-select').addEventListener('change', function() {
      updatePrice(data);
    });
    id('quantity-input').addEventListener('input', function() {
      updatePrice(data);
    });
  }

  // /**
  //  * Adds the item to the cart
  //  */
  // function addToCart() {
  //   const item = id('item-type').textContent;
  //   const flavor = id('flavor-select').value;
  //   const quantity = parseInt(id('quantity-input').value);
  //   const price = parseFloat(id('price-display').textContent);
  //   const modifications = id('customization-input').textContent;
  //   let cart = localStorage.getItem('cart');
  //   if (!cart) {
  //     cart = [];
  //   } else {
  //     cart = JSON.parse(cart);
  //   }
  //   const itemId = item.toLowerCase() + "-" + flavor.toLowerCase().replace(' ', '');
  //   cart.unshift({
  //     item: itemId,
  //     quantity: quantity,
  //     modifications: modifications,
  //     price: price
  //   });

  //   window.localStorage.setItem('cart', JSON.stringify(cart));
  //   console.log(cart);
  // }

  /**
   * Updates the total price based on quantity/flavor selection
   * @param {object} data containing all the data about the item and its attributes
   */
  function updatePrice(data) {
    const selectedFlavor = id('flavor-select').value;
    const selectedData = data.flavors.find(flavor => flavor.flavor === selectedFlavor);
    const quantity = parseInt(id('quantity-input').value);
    let price = selectedData.price * quantity;
    price = (isNaN(price))? "0":"";
    if (price.indexOf(".") >= 0) {
      price += "0"
    } else {
      price += ".00";
    }
    id('price-display').textContent = "$" + price;
  }

  /**
   * Given a string, makes the first letter capitalized and returns that string
   * @param {string} str The string to capitalize
   * @returns {string}   The same string with the first letter capitalized
   */
  function capitalizeFirst(str) {
    if (str.length === 0) {
      return "";
    } else if (str.length === 1) {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

   /**
   * Checks status of original fetch to see if we can proceed
   * @param {promise} res checks status of promise
   * @returns {promise} promise to proceed
   */
   async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * TEMPORARY COMMENT: UPDATE ONCE IMPLEMENTED
   * @param {Event} evt Event
   * @return {string} evt.id
   */
  function handleItem(evt) {
    return evt.id;
  }

  /**
   * Lecture function wrapper for getElementById
   * @param   {string} id The string id of the object to get
   * @returns {Object}    The element object associated with the id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Lecture function wrapper for querySelector
   * @param   {string} selector The class selector string
   * @returns {Object}          The object first found with the given class.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Lecture function wrapper for querySelectorAll
   * @param   {string} selector The class selector string
   * @returns {Array}           A list of objects with the given selector.
   *                            Empty if none exist.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Lecture function wrapper for document.createElement
   * @param   {string} tagName The HTML tag element to create
   * @returns {Object}         The HTML element of the given tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
