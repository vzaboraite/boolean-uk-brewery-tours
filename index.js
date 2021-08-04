/*

***********FILTER SECTION***********

  1.0 by_type:
    - micro
    - regional
    - brewpub

- Examples:
  https://api.openbrewerydb.org/breweries?by_type=micro

  2.0 by_city:

  ** Note: For the parameters, you can use underscores or url encoding %20 for spaces **

- Examples:
  https://api.openbrewerydb.org/breweries?by_city=san_diego 
  https://api.openbrewerydb.org/breweries?by_city=san%20diego

  3.0 by_state - to render a list of breweries in particular state

  ** Note: Full state name is required; no abbreviations. 
     For the parameters, you can use underscores or %20 for spaces. **

- Examples:
  https://api.openbrewerydb.org/breweries?by_state=ohio 
  https://api.openbrewerydb.org/breweries?by_state=new_york 
  https://api.openbrewerydb.org/breweries?by_state=new%20mexico

***********SEARCH SECTION***********

  1.0 by_name
  2.0 by_city

  ** Note: For the `query` parameter, you can use underscores or %20 for spaces. **

- Example:
  https://api.openbrewerydb.org/breweries/search?query=dog

***********FUNCTIONS***********

  1.0 Create render functions that read from state
    -- work on render functions after logic part will be complete
================================================================

  2.0 Create a fetch function to get data

    - fetch("https://api.openbrewerydb.org/breweries")
      .then(res => res.json())
      .then(data=> console.log(data)):
      
  
  3.0 Create action functions that update state

    3.1 update state object:
    3.1.1 updateSelectStateInput()

    3.1.2 updateBreweries()

    3.1.3 updateCities()

    3.1.4 upateFilters()
      - filter by type => use select element
      - filter by city => use checkbox element
      - filter by search:
        - search by name
        - search by city 


    3.0.1 - cleanData()
      -- "filter by type of brewery" section
      state.filters[{type: ""}]

    3.0.2 - extractCitiesData() ??
  
      - input: comes from 2.0
      - output: ??
*/

/* ELEMENTS */

const stateFormElem = document.querySelector("#select-state-form");

const selectStateInputElem = document.querySelector("#select-state");

const mainSectionElem = document.querySelector("main");

stateFormElem.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectStateInputElem.value) {
    return;
  }
  console.log("submited!!", selectStateInputElem.value);
  fetchStateBreweries(selectStateInputElem.value);
  stateFormElem.reset();
});

/* STATE OBJECT */

let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: "",
  },
};

/* APIs */

function fetchStateBreweries(stateInUSA) {
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${stateInUSA}`)
    .then((res) => res.json())
    .then((breweryData) => {
      state.breweries = breweryData;
      console.log("breweryData: ", state.breweries);

      state.cities = extractCitiesData(state.breweries);
      renderMainSection();
    });
}

function extractCitiesData(breweries) {
  const cities = breweries.map((brewery) => brewery.city);
  return [...new Set(cities)];
}

function renderFilterSection() {
  const filtersSectionElem = document.createElement("aside");
  filtersSectionElem.className = "filters-section";
  mainSectionElem.append(filtersSectionElem);

  const headingElem = document.createElement("h2");
  headingElem.innerText = "Filter By:";
  filtersSectionElem.append(headingElem);

  // FILTER BY TYPE

  const typeFilterFormElem = document.createElement("form");
  typeFilterFormElem.id = "filter-by-type-form";
  typeFilterFormElem.setAttribute("autocomplete", "off");
  filtersSectionElem.append(typeFilterFormElem);

  const typeFilterLabelElem = document.createElement("label");
  typeFilterLabelElem.setAttribute("for", "filter-by-type");
  typeFilterFormElem.append(typeFilterLabelElem);

  const labelHeading = document.createElement("h3");
  labelHeading.innerText = "Type of Brewery";
  typeFilterLabelElem.append(labelHeading);

  const typeFilterSelectElem = document.createElement("select");
  typeFilterSelectElem.setAttribute("name", "filter-by-type");
  typeFilterSelectElem.id = "filter-by-type";
  typeFilterFormElem.append(typeFilterSelectElem);

  const defaultOptionElem = document.createElement("option");
  defaultOptionElem.setAttribute("value", "");
  defaultOptionElem.innerText = "Select a type...";
  typeFilterSelectElem.append(defaultOptionElem);

  const microOptionElem = document.createElement("option");
  microOptionElem.setAttribute("value", "micro");
  microOptionElem.innerText = "Micro";
  typeFilterSelectElem.append(microOptionElem);

  const regionalOptionElem = document.createElement("option");
  regionalOptionElem.setAttribute("value", "regional");
  regionalOptionElem.innerText = "Regional";
  typeFilterSelectElem.append(regionalOptionElem);

  const brewpubOptionElem = document.createElement("option");
  brewpubOptionElem.setAttribute("value", "brewpub");
  brewpubOptionElem.innerText = "Brewpub";
  typeFilterSelectElem.append(brewpubOptionElem);

  // FILTER BY CITY HEADING

  const cityFilterElem = document.createElement("div");
  cityFilterElem.className = "filter-by-city-heading";
  filtersSectionElem.append(cityFilterElem);

  const cityFilterHeadingElem = document.createElement("h3");
  cityFilterHeadingElem.innerText = "Cities";
  cityFilterElem.append(cityFilterHeadingElem);

  const clearButton = document.createElement("button");
  clearButton.className = "clear-all-btn";
  clearButton.innerText = "clear all";
  cityFilterElem.append(clearButton);

  // FILTER BY CITY FORM
  const cityFilterFormElem = document.createElement("form");
  cityFilterFormElem.id = "filter-by-city-form";
  filtersSectionElem.append(cityFilterFormElem);

  state.cities.forEach((city) => {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", "checkbox");
    inputElem.setAttribute("name", city);
    inputElem.setAttribute("value", city);
    cityFilterFormElem.append(inputElem);

    const inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", city);
    inputLabel.innerText = city;
    cityFilterFormElem.append(inputLabel);
  });
}

function renderBreweriesList() {
  console.log("Inside renderBreweriesList: ", state.breweries);

  const mainHeadingElem = document.createElement("h1");
  mainHeadingElem.innerText = "List of Breweries";
  mainSectionElem.append(mainHeadingElem);

  const searchBarHeaderElem = document.createElement("header");
  searchBarHeaderElem.className = "search-bar";
  mainSectionElem.append(searchBarHeaderElem);

  // SEARCH BREWERIES FORM

  const searchFormElem = document.createElement("form");
  searchFormElem.id = "search-breweries-form";
  searchFormElem.setAttribute("autocomplete", "off");
  searchBarHeaderElem.append(searchFormElem);

  const searchBarLabelElem = document.createElement("label");
  searchBarLabelElem.setAttribute("for", "search-breweries");
  searchFormElem.append(searchBarLabelElem);

  const searchBarHeadingElem = document.createElement("h2");
  searchBarHeadingElem.innerText = "Search breweries:";
  searchBarLabelElem.append(searchBarHeadingElem);

  const searchBarInputElem = document.createElement("input");
  searchBarLabelElem.id = "search-breweries";
  searchBarLabelElem.setAttribute("name", "search-breweries");
  searchBarLabelElem.setAttribute("type", "text");
  searchFormElem.append(searchBarInputElem);

  // BREWERIES LIST

  const listWrapperElem = document.createElement("article");
  mainSectionElem.append(listWrapperElem);

  const breweriesListContainerElem = document.createElement("ul");
  breweriesListContainerElem.className = "breweries-list";
  listWrapperElem.append(breweriesListContainerElem);

  // generate list elements
  for (let i = 0; i < state.breweries.length; i++) {
    const brewery = state.breweries[i];

    const breweryListElem = document.createElement("li");
    breweriesListContainerElem.append(breweryListElem);

    const breweryNameElem = document.createElement("h2");
    breweryNameElem.innerText = brewery.name;
    breweryListElem.append(breweryNameElem);

    const breweryTypeElem = document.createElement("div");
    breweryTypeElem.className = "type";
    breweryTypeElem.innerText = brewery["brewery_type"];
    breweryListElem.append(breweryTypeElem);

    // address section
    const addressSectionElem = document.createElement("section");
    addressSectionElem.className = "address";
    breweryListElem.append(addressSectionElem);

    const addressHeadingElem = document.createElement("h3");
    addressHeadingElem.innerText = "Address:";
    addressSectionElem.append(addressHeadingElem);

    const streetElem = document.createElement("p");
    streetElem.innerText = brewery.street;
    addressSectionElem.append(streetElem);

    const postCodeWrapElem = document.createElement("p");
    addressSectionElem.append(postCodeWrapElem);

    const postCodeElem = document.createElement("strong");
    postCodeElem.innerText = `${brewery.city}, ${brewery["postal_code"]}`;
    postCodeWrapElem.append(postCodeElem);

    // phone section
    const phoneSectionElem = document.createElement("section");
    phoneSectionElem.className = "phone";
    breweryListElem.append(phoneSectionElem);

    const phoneHeadingElem = document.createElement("h3");
    phoneHeadingElem.innerText = "Phone:";
    phoneSectionElem.append(phoneHeadingElem);

    const phoneElem = document.createElement("p");
    phoneElem.innerText = brewery.phone ? brewery.phone : "N/A";
    phoneSectionElem.append(phoneElem);

    // link to the web-page section
    const linkSectionElem = document.createElement("section");
    linkSectionElem.className = "link";
    breweryListElem.append(linkSectionElem);

    const linkElem = document.createElement("a");
    linkElem.setAttribute("href", brewery["website_url"]);
    linkElem.setAttribute("target", "_blank");
    linkElem.innerText = "Visit Website";
    linkSectionElem.append(linkElem);
  }
}

renderBreweriesList();
