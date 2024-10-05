import AWN from 'awesome-notifications';
import './style.css'
import axios from "axios";
import Chart from 'chart.js/auto';


const Key = '198c32d1a5fd44f596174131241909'
const baseurl = "https://api.weatherapi.com/v1"
const q = 'bangladesh';
let searchList = [];

//location
function getWeather(location) {
    if (!location) {
        location = q;
    }
    const url = `${baseurl}/current.json?key=${Key}&q=${location}`;

    axios.post(url)
        .then(function (response) {

            // new AWN().success('با موفقیت درخواست گرفته شد', {durations: {success: 0}, labels: {success: "موفقیت"}})

            const data = response.data;
            console.log(response.data);

            document.querySelectorAll('#location-name')[0].innerHTML = `${data.location.name} - ${data.location.country}`;


        })
        .catch(function (error) {
            // new AWN().alert('با مشکل:| درخواست گرفته شد', {durations: {success: 0}, labels: {alert: "مشکل"}})
        });
}


getWeather();


let ball = document.querySelector('.ball');
let modeBtn = document.querySelector('.mode-btn');
let moon = document.querySelector('.moon');
ball.addEventListener('click', function () {

    document.body.classList.toggle('light-mode');


    modeBtn.classList.toggle('active');

});

const search = document.getElementById('search');
search.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        let searchValue = search.value.trim();
        if (searchValue) {

            getWeather(searchValue);
            GetCurrentDay(searchValue);
            renderChart(searchValue);
            searchList.push(searchValue);


            let lastFiveSearch = searchList.slice(-4);
            lastFiveSearch.forEach((searchItem,index) => {
                const url = `${baseurl}/current.json?key=${Key}&q=${searchItem}`;
                axios.get(url)
                    .then(function (response) {
                        const data = response.data;
                        const citiesIcon=data.current.condition.icon;
                        const txtCondition=data.current.condition.text;
                        const name=data.location.name;
                        const country=data.location.country;

                        const weather=document.querySelector(`#city-${index}`);
                        weather.querySelector('.city-weather-icon').src=citiesIcon;
                        weather.querySelector('.condition-txt').textContent=txtCondition;
                        weather.querySelector('.country-name').textContent=country;
                        weather.querySelector('.city-name').textContent=name;




                    })

            });
        } else {
            console.alert("Please enter a valid location.");
        }
    }
});

//days-weather


function GetCurrentDay(location) {
    const url = `${baseurl}/forecast.json?key=${Key}&q=${location}&days=7`;

    axios.get(url)
        .then(function (response) {
            const currentDay = response.data.forecast.forecastday[0];
            const Time = response.data.location.localtime.split(' ')[1];
            const WeatherIcon = currentDay.day.condition.icon;
            const Temperature = `${currentDay.day.maxtemp_c}°`;
            const localtime = response.data.location.localtime;
            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            const currentDayOfWeek = weekDays[today.getDay()];
            const wind = currentDay.day.maxwind_kph;
            const currentHour = response.data.forecast.forecastday[0].hour[0];
            const pressure = currentHour.pressure_in;
            const humidity = currentHour.humidity;
            const astro = response.data.forecast.forecastday[0].astro;
            const sunrise = astro.sunrise;
            const sunset = astro.sunset;
            const uv = currentDay.day.uv;
            const windStatus = currentDay.wind_mph;


            const weatherBox = document.querySelector('.weather-box');
            weatherBox.querySelector('.time').textContent = Time;
            weatherBox.querySelector('.current-weather-icon').src = WeatherIcon;
            weatherBox.querySelector('.current-temperature').textContent = Temperature;
            weatherBox.querySelector('.day-name').textContent = currentDayOfWeek;
            weatherBox.querySelector('.wind').textContent = wind;
            weatherBox.querySelector('.pressure').textContent = `${pressure}MB`;
            weatherBox.querySelector('.humidity').textContent = `${humidity}%`;
            weatherBox.querySelector('.sunrise').textContent = sunrise;
            weatherBox.querySelector('.sunset').textContent = sunset;
            const lowerBox = document.querySelector('.lower-boxes');
            lowerBox.querySelector('#wind').textContent = wind;
            lowerBox.querySelector('#uv-index').textContent = uv;
            lowerBox.querySelector('#humidity').textContent = `${humidity}%`;


            switch (true) {
                case (uv >= 0 && uv <= 2):
                    lowerBox.querySelector('.uv-img').src = './images/uv.png';
                    break;
                case (uv >= 3 && uv <= 5):
                    lowerBox.querySelector('.uv-img').src = './images/greenuv.png';
                    break;
                case(uv >= 6 && uv <= 8):
                    lowerBox.querySelector('.uv-img').src = './images/yellowuv.png';
                    break;

                case (uv >= 9 && uv <= 11):
                    lowerBox.querySelector('.uv-img').src = './images/reduv.png';
                    break;


            }


            for (let i = 1; i <= 6; i++) {
                const futureDay = response.data.forecast.forecastday[i];
                const futureWeatherIcon = futureDay.day.condition.icon;
                const futureTemperature = `${futureDay.day.maxtemp_c}°`;
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i);
                const futureDaysOfWeek = weekDays[futureDate.getDay()];

                const dayBox = document.querySelector(`#day-${i}`);
                dayBox.querySelector('.day-name').textContent = futureDaysOfWeek;
                dayBox.querySelector('.weather-icon').src = futureWeatherIcon;
                dayBox.querySelector('.temperature').textContent = futureTemperature;
            }
        });
}

GetCurrentDay(q);
let  myChart;
function renderChart(location) {
    (async function() {
        try {
            const response = await axios.get(`${baseurl}/forecast.json?key=${Key}&q=${location}&days=7`);
            const forecastData = response.data.forecast.forecastday;

            const data = forecastData.map(day => {
                const hours = day.hour.map(hour => hour.time.split(' ')[1]);
                return {
                    hours: hours,
                    sunshine: day.day.uv,
                    rainy: day.day.daily_chance_of_rain
                };
            });
            if (myChart){
                myChart.destroy();
            }

             myChart=new Chart(
                document.getElementById('myChart'),
                {
                    type: 'bar',
                    data: {
                        labels: data[0].hours.filter((_, i) => i % 3 === 0),
                        datasets: [
                            {
                                label: 'Sunny',
                                data: data.map(row => row.sunshine),
                                backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            },
                            {
                                label: 'Chance of Rain (%)',
                                data: data.map(row => row.rainy),
                                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            }
                        ]
                    },
                    options: {
                        scales: {
                            x: {
                                ticks: {
                                    maxRotation: 0,
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Error fetching data from API', error);
        }
    })();
}
renderChart(q);



const toggleContainer = document.getElementById('toggle-container');
const toggleBtn = document.getElementById('toggle-btn');
let isAirActive = false;

toggleContainer.addEventListener('click', () => {
    if (isAirActive) {
        toggleBtn.style.transform = 'translateX(0)';
        isAirActive = false;
    } else {
        toggleBtn.style.transform = 'translateX(80px)';
        isAirActive = true;
    }
});
