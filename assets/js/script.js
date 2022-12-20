//I am declaring variables for user input and current weather and using Dayjs to pull the date and set the format.
let today = dayjs().format('MM/DD/YYYY');
let todaysIcon;
let todaysTemp;
let todaysWind;
let todaysHumidity;
let todaysContainer;
let todaysCityContainer;
let todaysIconContainer;
let todaysTempContainer;
let todaysWindContainer;
let todaysHumidityContainer;
let contentResults = $('#content-results');
let todaysResults = $('#todays-results');
let contentHistory = $('#search-history');
let searchVal = $('#search-input');
let localStorageHistory = [];

//This function is creating a click for the search input from the user, it also prevents the default event from running, and calls both api functions. 
$('#search-btn').click(function(event){
  event.preventDefault();
  todaysResults.text('');
  contentResults.text('');
  findCityToday();
  findCityForecast();
});

//This takes the users input, ensures all letters are made lower case, finds the first character of the string, converts it to uppercase and adds the sliced version of the string to the end creating a capitalized word.
function capitalCity() {
  let cityLower = $('#search-input').val().toLowerCase();
  return cityLower.charAt(0).toUpperCase() + cityLower.slice(1);
}

//This is the function that calls the api and gathers the data for todays weather. It first takes the url and user input, puts them together and creates a fetch, if the fetch is good, it moves to the then function else it displays the error provided. 
function findCityToday () {
  let requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + $('#search-input').val() + "&appid=d3722239d97657959cb1778dc4943cd3&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok){
      return response.json();
      }else {
        todaysResults.text('Error: ' + response.status + ' City not valid. Please try again.');
        $('#search-input').val('');
        return Promise.reject('Error: ' + response.status);
      }
    })
    //This uses the city coordinates to make an api call for the data below
    .then(function(data) {
      let dataUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + data.city.coord.lat + "&lon=" +data.city.coord.lon + "&appid=d3722239d97657959cb1778dc4943cd3&units=imperial";

      fetch(dataUrl)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
              return Promise.reject('Error: ' + response.status);
          }
        })
        //This goes through the data, pulls the data needed, creates the document elements, adds appropriate classes, adds data as text or string, appends the data to the variables declared above and then appends the information to the corresponding html elements. Finally it stores the data locally.
        .then(function(data) {
          let city = capitalCity();
          todaysIcon = data.list[0].weather[0].icon;
          todaysTemp = data.list[0].main.temp;
          todaysWind = data.list[0].wind.speed;
          todaysHumidity = data.list[0].main.humidity;
          todaysContainer = $('<div>');
          todaysCityContainer = $('<h3>');
          todaysIconContainer = $('<img>');
          todaysTempContainer = $('<p>');
          todaysWindContainer = $('<p>');
          todaysHumidityContainer = $('<p>');
          todaysCityContainer.addClass('history-btn-card');
          todaysCityContainer.addClass('card');
          todaysCityContainer.addClass('text-center');
          todaysCityContainer.addClass('text-bg-dark'); 
          todaysCityContainer.text(city);
          todaysContainer.text(city + ' (' + today + ')');
          todaysIconContainer.attr('src', 'http://openweathermap.org/img/wn/' + todaysIcon + '@2x.png');
          todaysIconContainer.attr('height', '40px');
          todaysIconContainer.attr('width', '40px');
          todaysTempContainer.text('Temp: ' + todaysTemp + '°F');
          todaysWindContainer.text('Wind: ' + todaysWind + 'MPH');
          todaysHumidityContainer.text('Humidity: ' + todaysHumidity + '%');
          todaysContainer.append(todaysCityContainer, todaysIconContainer, todaysTempContainer, todaysWindContainer, todaysHumidityContainer);
          todaysResults.append(todaysContainer);
          contentHistory.prepend(todaysCityContainer);
          localStorageHistory.push(todaysCityContainer.text());
          localStorage.setItem('search-history', JSON.stringify(localStorageHistory));

          $('#search-input').val('');

        });
    });
};
//I am declaring variables for forecast weather.
let icon; 
let temp;
let wind;
let humidity;
let forecastContainer;
let forecastDateContainer;
let forecastIconContainer;
let forecastTempContainer;
let forecastWindContainer;
let forecastHumidityContainer;

//This is the function that calls the api and gathers the data for forecast weather. It first takes the url and user input, puts them together and creates a fetch, if the fetch is good, it moves to the then function else it displays the error provided.
function findCityForecast () {
  let requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + $('#search-input').val() + "&appid=d3722239d97657959cb1778dc4943cd3&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok){
      return response.json();
      }else {
        todaysResults.text('Error: ' + response.status + ' City not valid. Please try again.');
        $('#search-input').val('');
        return Promise.reject('Error: ' + response.status);
      }
    })

    .then(function(data) {
      let dataUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + data.city.coord.lat + "&lon=" +data.city.coord.lon + "&appid=d3722239d97657959cb1778dc4943cd3&units=imperial";

      fetch(dataUrl)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
              return Promise.reject('Error: ' + response.status);
          }
        })

        //This uses a for function to change the date using Dayjs and looping through. This also, pulls the data, sets the elements, and appends all appropriate items to the page
        .then(function(data) {
          for (let i = 0; i < 5; i++) {
            let date = dayjs().add(i + 1, 'days').format('MM/DD/YYYY');
            icon = data.list[i].weather[0].icon;  
            temp = data.list[i].main.temp;
            wind = data.list[i].wind.speed;
            humidity = data.list[i].main.humidity;
            forecastContainer = $('<div>');
            forecastDateContainer = $('<p>');
            forecastIconContainer = $('<img>');
            forecastTempContainer = $('<p>');
            forecastWindContainer = $('<p>');
            forecastHumidityContainer = $('<p>');
            forecastContainer.addClass('card');
            forecastContainer.addClass('col');
            forecastContainer.addClass('p-2');
            forecastContainer.addClass('border');
            forecastContainer.addClass('bg-dark');
            forecastContainer.addClass('text-white');
            forecastDateContainer.text(date);
            forecastIconContainer.attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
            forecastIconContainer.attr('height', '40px');
            forecastIconContainer.attr('width', '40px');
            forecastTempContainer.text('Temp: ' + temp + '°F');
            forecastWindContainer.text('Wind: ' + wind + 'MPH');
            forecastHumidityContainer.text('Humidity: ' + humidity + '%');
            forecastContainer.append(forecastDateContainer, forecastIconContainer, forecastTempContainer, forecastWindContainer, forecastHumidityContainer);
            contentResults.append(forecastContainer);
          
          }
          console.log(data);
        });
      });
  };


//This takes the local storage and creates the element for the information, sets a class so it can be used above, and ensures the last city searched is stored at the top of the search history section.
function makeSearchHistory() {
  let storageHistory = JSON.parse(localStorage.getItem('search-history'));
  for (let i = 0; i < storageHistory.length; i++) {
      let historyContainer = $('<p>');
      historyContainer.addClass('history-btn-card')
      historyContainer.addClass('card');
      historyContainer.text(storageHistory[i]);
      contentHistory.prepend(historyContainer);
  }
} 

//This uses the local storage that is made into a card and displayed and makes it clickable, and also calls both api functions to run
contentHistory.on('click', '.history-btn-card', function(){
  document.getElementById('search-input').value = $(this).text();
  todaysResults.text('');
  contentResults.text('');
  findCityToday();
  findCityForecast();
});

makeSearchHistory();