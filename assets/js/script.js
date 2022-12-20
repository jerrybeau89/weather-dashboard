let contentResults = $('#content-results');
let todaysResults = $('#todays-results');
let contentHistory = $('#search-history');
let searchVal = $('#search-input');
let localStorageHistory = [];

$('#search-btn').click(function(event){
  event.preventDefault();
  todaysResults.text('');
  contentResults.text('');
  findCity();
});

contentHistory.on('click', '.history-button', function(){
  document.getElementById('search-input').value = $(this).text();
  todaysResults.text('');
  contentResults.text('');
  findCity();
});


function findCity () {
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
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
              return Promise.reject('Error: ' + response.status);
          }
        })
        .then(function(data) {
          console.log(data);
          let city = $('#search-input').val();
          let today = dayjs().format('MM/DD/YYYY');
          let todaysIcon = data.list[0].weather[0].icon;
          let todaysTemp = data.list[0].main.temp;
          let todaysWind = data.list[0].wind.speed;
          let todaysHumidity = data.list[0].main.humidity;
          let todaysContainer = $('<div>');
          let todaysCityContainer = $('<h3>');
          let todaysIconContainer = $('<img>');
          let todaysTempContainer = $('<p>');
          let todaysWindContainer = $('<p>');
          let todaysHumidityContainer = $('<p>');

          
          todaysCityContainer.addClass('history-button');
          todaysCityContainer.addClass('card');
          todaysCityContainer.addClass('text-center');
          todaysCityContainer.addClass('text-bg-dark'); 
          todaysCityContainer.text(city);
          todaysContainer.text(city + ' (' + today + ')');
          todaysTempContainer.text('Temp: ' + todaysTemp + '°F');
          todaysWindContainer.text('Wind: ' + todaysWind + 'MPH');
          todaysHumidityContainer.text('Humidity: ' + todaysHumidity + '%');
          $(todaysIconContainer).attr('src', 'http://openweathermap.org/img/wn/' + todaysIcon + '@2x.png');
          $(todaysIconContainer).attr('height', '40px');
          $(todaysIconContainer).attr('width', '40px');
          todaysContainer.append(todaysCityContainer, todaysIconContainer, todaysTempContainer, todaysWindContainer, todaysHumidityContainer);
          todaysResults.append(todaysContainer);
          contentHistory.prepend(todaysCityContainer);
          
          localStorageHistory.push(todaysCityContainer.text());
          localStorage.setItem('search-history', JSON.stringify(localStorageHistory));

          $('#search-input').val('');

        });
    });
};

function makeSearchHistory() {
  let storageHistory = JSON.parse(localStorage.getItem('search-history'));
  for (let i = 0; i < storageHistory.length; i++) {
      let historyContainer = $('<p>');
      historyContainer.text(storageHistory[i]);
      historyContainer.addClass('history-button')
      historyContainer.addClass('card');
      contentHistory.prepend(historyContainer);
  }
}
makeSearchHistory();