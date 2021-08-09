/* ELEMENTS */

const stateFormElem = document.querySelector("#select-state-form");

const selectStateInputElem = document.querySelector("#select-state");

const mainSectionElem = document.querySelector("main");

stateFormElem.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectStateInputElem.value) {
    return;
  }

  state = {
    ...state,
    selectStateInput: selectStateInputElem.value,
  };
  fetchStateBreweries(state.selectStateInput);
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
  fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${stateInUSA}&per_page=50`
  )
    .then((res) => res.json())
    .then((breweryData) => {
      // filteredBreweries holds micro, regional and brewpub breweries, returned from cleanData()
      const filteredBreweries = cleanData(breweryData);

      state = {
        ...state,
        breweries: filteredBreweries,
        cities: extractCitiesData(filteredBreweries),
      };
      renderMainSection();
    });
}

function extractCitiesData(breweries) {
  const cities = breweries.map((brewery) => brewery.city);
  return [...new Set(cities)].sort();
}

/* RENDER FUNCTIONS */

function renderMainSection() {
  mainSectionElem.innerHTML = "";

  renderFilterSection();
  renderBreweriesList();
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
  typeFilterSelectElem.addEventListener("change", (event) => {
    state = {
      ...state,
      filters: {
        ...state.filters,
        type: event.target.value,
      },
    };

    renderMainSection();
  });
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

  switch (state.filters.type) {
    case "":
      defaultOptionElem.selected = true;
      break;
    case "micro":
      microOptionElem.selected = true;
      break;
    case "regional":
      regionalOptionElem.selected = true;
      break;
    case "brewpub":
      brewpubOptionElem.selected = true;
      break;
  }

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
  clearButton.addEventListener("click", (event) => {
    state = {
      ...state,
      filters: {
        ...state.filters,
        type: "",
        city: [],
        search: "",
      },
    };
    renderMainSection();
  });
  cityFilterElem.append(clearButton);

  // FILTER BY CITY FORM
  const cityFilterFormElem = document.createElement("form");
  cityFilterFormElem.id = "filter-by-city-form";
  filtersSectionElem.append(cityFilterFormElem);

  state.cities.forEach((city) => {
    const lowercasedCity = city.toLowerCase();

    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", "checkbox");
    inputElem.setAttribute("name", lowercasedCity);
    inputElem.setAttribute("value", lowercasedCity);
    inputElem.checked = state.filters.city.includes(lowercasedCity);
    inputElem.addEventListener("change", (event) => {
      if (event.target.checked) {
        state = {
          ...state,
          filters: {
            ...state.filters,
            city: [...state.filters.city, lowercasedCity],
          },
        };
      } else if (!event.target.checked) {
        const filteredCities = state.filters.city.filter(
          (city) => city !== event.target.value
        );
        state = {
          ...state,
          filters: {
            ...state.filters,
            city: filteredCities,
          },
        };
      }
      renderMainSection();
    });
    cityFilterFormElem.append(inputElem);

    const inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", lowercasedCity);
    inputLabel.innerText = city;
    cityFilterFormElem.append(inputLabel);
  });
}

function renderBreweriesList() {
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
  searchFormElem.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchValue = document.querySelector("#search-breweries").value;

    state = {
      ...state,
      filters: {
        ...state.filters,
        search: searchValue.toLowerCase(),
      },
    };

    renderMainSection();
    document.querySelector("#search-breweries").value = searchValue;
    document.querySelector("#search-breweries").focus();
  });
  searchBarHeaderElem.append(searchFormElem);

  const searchBarLabelElem = document.createElement("label");
  searchBarLabelElem.setAttribute("for", "search-breweries");
  searchFormElem.append(searchBarLabelElem);

  const searchBarHeadingElem = document.createElement("h2");
  searchBarHeadingElem.innerText = "Search breweries:";
  searchBarLabelElem.append(searchBarHeadingElem);

  const searchBarInputElem = document.createElement("input");
  searchBarInputElem.id = "search-breweries";
  searchBarInputElem.setAttribute("name", "search-breweries");
  searchBarInputElem.setAttribute("type", "text");
  searchFormElem.append(searchBarInputElem);

  // BREWERIES LIST

  const listWrapperElem = document.createElement("article");
  mainSectionElem.append(listWrapperElem);

  const breweriesListContainerElem = document.createElement("ul");
  breweriesListContainerElem.className = "breweries-list";
  listWrapperElem.append(breweriesListContainerElem);

  const filteredBreweries = applyUserFilters(state.breweries);

  // generate list elements
  filteredBreweries.forEach((brewery, i) => {
    if (i > 9) return;
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
  });
}

// ******************************************

function cleanData(breweries) {
  const filteredBreweries = breweries.filter((brewery) => {
    const type = brewery["brewery_type"];
    if (type === "micro") {
      return true;
    } else if (type === "regional") {
      return true;
    } else if (type === "brewpub") {
      return true;
    } else {
      return false;
    }
  });

  return filteredBreweries;
}

// TODO: add user filters
function applyUserFilters(breweries) {
  const filteredByType = filterByType(breweries);
  const filteredBySearch = filterBySearch(filteredByType);
  const filteredByCity = filterByCity(filteredBySearch);
  return filteredByCity;
}

function filterByType(breweries) {
  if (state.filters.type === "") {
    return breweries;
  }

  const filteredBreweries = breweries.filter(
    (brewery) => brewery["brewery_type"] === state.filters.type
  );
  return filteredBreweries;
}

function filterBySearch(breweries) {
  if (state.filters.search === "") {
    return breweries;
  }
  const filteredBreweries = breweries.filter(
    (brewery) =>
      brewery.name.toLowerCase().includes(state.filters.search) ||
      brewery.city.toLowerCase().includes(state.filters.search)
  );
  return filteredBreweries;
}

function filterByCity(breweries) {
  if (state.filters.city.length === 0) {
    return breweries;
  }
  const filteredBreweries = breweries.filter((brewery) => {
    return state.filters.city.includes(brewery.city.toLowerCase());
  });
  return filteredBreweries;
}
