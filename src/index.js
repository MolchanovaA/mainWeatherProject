//weather Api engine

function setWeatherIcon(condition = "Clear") {
  let genInfoText = document.querySelector(".generalInfo");

  if (condition === "Clouds") {
    genInfoText.innerHTML = `<span>☁</span> ${condition}`;
  } else if (condition === "Rain") {
    genInfoText.innerHTML = `<span>🌧</span> ${condition}`;
  } else {
    genInfoText.innerHTML = `<span>🌞</span> ${condition}`;
  }
}

function setWeatherToPage({ temp, hum, genInfo, city, flag }) {
  if (flag === "searchEngine") {
    let head = document.querySelector(".defaultCity");
    head.innerHTML = `${city[0].toUpperCase()}${city
      .split("")
      .slice(1)
      .join("")}`;
  }
  let humText = document.querySelector(".hum");
  humText.innerText = `${hum}`;
  let tempText = document.querySelector(".temp");
  tempText.innerText = `${temp} `;
  setWeatherIcon(genInfo);
}

function getRandomTemperature(averageTemp) {
  let min = averageTemp - 3;
  let max = averageTemp + 3;
  return Math.round(Math.random(max - min) + min);
}

function searchWeather(cityOrDay, flagPlace) {
  // console.log(cityOrDay.parentElement.parentElement.className);

  // console.log(flagPlace);
  let cityOrDayCheck;
  if (flagPlace === "searchEngine") {
    console.log("check");
    cityOrDayCheck = cityOrDay;
  }

  cityOrDayCheck =
    cityOrDayCheck || cityOrDay.parentElement.parentElement.className;
  console.log(cityOrDay, "after");
  if (cityOrDayCheck === "navBarCities" || flagPlace === "searchEngine") {
    let city = cityOrDay.innerText;
    if (flagPlace === "searchEngine") {
      city = cityOrDay;
    }
    let apiKey = `47acee420b645368c8f4f5042bbda62e`;
    let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    flagPlace = flagPlace || "false";

    function showApiResponce(responce) {
      let weatherData = {
        temp: Math.floor(responce.data.main.temp),
        hum: Math.floor(responce.data.main.humidity),
        genInfo: responce.data.weather[0].main,
        city: city,
        flag: flagPlace,
      };

      setWeatherToPage(weatherData);
    }

    axios.get(apiUrlCity).then(showApiResponce);
  } else {
    let tempForRandom = document.querySelector(".temp").innerText;
    let randomWeatherData = {
      temp: getRandomTemperature(tempForRandom),
      hum: getRandomTemperature(tempForRandom) + 40,
    };
    setWeatherToPage(randomWeatherData);
  }
}

//search engine
function readFromInput(e) {
  e.preventDefault();
  let searchCity = e.target[0].value;
  let flag = "searchEngine";
  console.log(searchCity, "FROM E");
  searchWeather(searchCity, flag);
}

// to channge clicked element styles
let prevClickBigBar = "city_1";
let prevClickSmallBar = "day_1";

function clickChanger(ev) {
  //general variables; 'choosen' classes
  let barClassB = `BigBar`;
  let barClassS = `SmallBar`;
  let barClass = ``;
  let clickFlag = ``;

  // elements Small Bar
  let liParentConfirmation = ev.target.parentElement.className; // mainCity__smallInfo
  let h2ParentConfirmation = ev.target.parentElement.parentElement.className; // mainCity__smallInfo
  // elements Big cities Bar
  let bigCityParentConfirmation =
    ev.target.parentElement.parentElement.className; //"navBarCities"

  if (
    h2ParentConfirmation === "mainCity__smallInfo" ||
    liParentConfirmation === "mainCity__smallInfo"
  ) {
    barClass = barClassS;
    clickFlag = `SmallBar`;
  } else if (bigCityParentConfirmation === "navBarCities") {
    barClass = barClassB;
    clickFlag = `BigBar`;
  }

  function setPreviousName(name, flag) {
    if (flag === "SmallBar") {
      prevClickSmallBar = name;
      return prevClickSmallBar;
    } else if (flag === "BigBar") {
      prevClickBigBar = name;
      return prevClickBigBar;
    }
  }

  let prevElement = document.querySelector(`.${prevClickSmallBar}`);
  if (clickFlag === `BigBar`) {
    prevElement = document.querySelector(`.${prevClickBigBar}`);
  }
  prevElement.classList.remove(`choosen${barClass}`);

  let currentClick = ev.target.parentElement.className;

  if (currentClick === "mainCity__smallInfo") {
    currentClick = prevClickSmallBar;
  }

  let currentElement =
    document.querySelector(`.${currentClick}`) ||
    document.querySelector(`.navBarCitiesBig`);

  currentElement.classList.add(`choosen${barClass}`);
  setPreviousName(currentClick, clickFlag);
}

let searchForm = document.querySelector("form.searchCity");
searchForm.addEventListener("submit", readFromInput);

function toSetWeatheData(city) {
  city.addEventListener("click", (e) => {
    let clickedElement = e.target;
    //AXIOS.
    searchWeather(clickedElement);
    clickChanger(e);
  });
}

let bigCities = document.querySelectorAll(".navBarCities span");
bigCities.forEach((i) => toSetWeatheData(i));

let weekDays = document.querySelectorAll(".mainCity__smallInfo li");
weekDays.forEach((i) => toSetWeatheData(i));
