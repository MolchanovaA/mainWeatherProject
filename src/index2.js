//default city and common functions

let lastUpdate = new Date();
function setIcon(code) {
  let iconElement = document.querySelector(".icon");
  iconElement.src = `http://openweathermap.org/img/wn/${code}@2x.png`;
}

function setDescrioption(classOfElement, infoForElement) {
  let descriptionElement = document.querySelector(`${classOfElement}`);
  descriptionElement.innerText = `${infoForElement}`;
}

let functionWithFullForecastInfo = null;

function partlyFunction_toGetInfoClickAndDay(forecastFull, clickedDay) {
  let temperatureForSelectedDay = Math.round(forecastFull[clickedDay].temp.day);
  let humidityForSelectedDay = forecastFull[clickedDay].humidity;
  let weatherDescrioptionForSelectedDay =
    forecastFull[clickedDay].weather[0].description;
  let icon = forecastFull[clickedDay].weather[0].icon;
  let weatherObjectForSelectedDay = {
    ".temp": temperatureForSelectedDay,
    ".weatherDescrioption": weatherDescrioptionForSelectedDay,
    ".hum": humidityForSelectedDay,
  };
  for (let key in weatherObjectForSelectedDay) {
    setDescrioption(key, weatherObjectForSelectedDay[key]);
  }
  setIcon(icon);
}

function addDailyShortForecast(forecastInfo) {
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let otherDaysElemets = document.querySelector(".mainCity__smallInfo");
  otherDaysElemets.innerHTML = null;
  let totalForecast = 5;

  forecastInfo.forEach((item, i) => {
    if (i < totalForecast) {
      let date = new Date(item.dt * 1000);
      otherDaysElemets.innerHTML += `<li class="forecastArrayInfo_${i}"><h2>${
        week[date.getDay()]
      }</h2></li>`;

      if (i === 0) {
        let lastUpdElement = document.querySelector(".lastUpdate");
        lastUpdElement.innerText = `${lastUpdate.getDate()} of ${
          months[lastUpdate.getMonth()]
        } at ${lastUpdate.getHours()}:${lastUpdate.getMinutes()}`;
        let defaultWeekDayElement = document.querySelector(
          `.forecastArrayInfo_${i}`
        );
        defaultWeekDayElement.classList.add("choosenSmallBar");
      }
    }
  });

  functionWithForecastInfo = partlyFunction_toGetInfoClickAndDay.bind(
    null,
    forecastInfo
  );

  toChooseElement();
}

let defaultWeekDay = null;
function toCheckWeekElement() {
  console.log(defaultWeekDay);
  console.log(this.className);
  let choosenDay = this.className.split("_")[1];
  functionWithForecastInfo(choosenDay);

  this.classList.add("choosenSmallBar");
  defaultWeekDay.classList.remove("choosenSmallBar");
  defaultWeekDay = this;
}

function toChooseElement() {
  let weekElements = document.querySelectorAll(".mainCity__smallInfo li");
  defaultWeekDay = document.querySelector(".choosenSmallBar");
  weekElements.forEach((item) =>
    item.addEventListener("click", toCheckWeekElement)
  );
}

function getForecastResults(respond) {
  let icon = respond.data.current.weather[0].icon;
  setIcon(icon);
  let temperature = Math.round(respond.data.current.temp);
  let weatherDescription = respond.data.current.weather[0].description;
  let humidity = respond.data.current.humidity;
  let weatherObject = {
    ".temp": temperature,
    ".weatherDescrioption": weatherDescription,
    ".hum": humidity,
  };
  for (let key in weatherObject) {
    setDescrioption(key, weatherObject[key]);
  }
  let forecastWeeklyInfo = respond.data.daily;
  addDailyShortForecast(forecastWeeklyInfo);
}

function getForecastByCoords(coords) {
  let { lat, lon } = coords.data.coord;
  let apiKey = "47acee420b645368c8f4f5042bbda62e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getForecastResults);
}

function toCallApiByCityName(city, cityFlag) {
  if (!cityFlag) {
    let uppercaseCity = `${city[0].toUpperCase()}${city
      .split("")
      .slice(1)
      .join("")}`;
    setDescrioption(".defaultCity", uppercaseCity);
    let defaultCityBySearch = document.querySelector(".city_1");
    defaultCityBySearch.classList.add("choosenBigBar");
    prevThisBigCity.classList.remove("choosenBigBar");
    prevThisBigCity = defaultCityBySearch;
  }

  let apiKey = `92af424606501aebb73d6eb016d67cdc`;
  let urlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(urlAPI).then(getForecastByCoords);
}

function showCurrentCityName(apiRespond) {
  toCallApiByCityName(apiRespond.data.name);
}

function toSearchCurrentCoords(respond) {
  let long = respond.coords.longitude;
  let lat = respond.coords.latitude;
  let apiKey = `92af424606501aebb73d6eb016d67cdc`;
  let urlAPIGetCity = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(urlAPIGetCity).then(showCurrentCityName);
}

navigator.geolocation.getCurrentPosition(toSearchCurrentCoords);

// searchEngine

function getCityNamefromFormElement(e) {
  e.preventDefault();
  let searchingElement = document.querySelector(".searchField");
  toCallApiByCityName(searchingElement.value);
}
let searchFormElement = document.querySelector(".searchCity");
searchFormElement.addEventListener("submit", getCityNamefromFormElement);

let prevThisBigCity = document.querySelector(".city_1");
function showBigCity() {
  console.log(this);
  let fromDefaultCityBar = true;
  toCallApiByCityName(this.text, fromDefaultCityBar);
  this.classList.add("choosenBigBar");
  prevThisBigCity.classList.remove("choosenBigBar");
  prevThisBigCity = this;
}

let bigCityList = document.querySelectorAll(".navBarCities a");
bigCityList.forEach((item) => item.addEventListener("click", showBigCity));
