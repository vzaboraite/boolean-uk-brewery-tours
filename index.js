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

let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: ""
  }
};

function renderBreweriesList() {
  console.log("Inside renderBreweriesList: ", state.breweries);

  for (let i = 0; i < state.breweries.length; i++) {}
}

renderBreweriesList();
