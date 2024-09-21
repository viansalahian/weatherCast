import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import {setupCounter} from './counter.js'
import axios from "axios";

const Key = '198c32d1a5fd44f596174131241909'
const baseurl = "http://api.weatherapi.com/v1"
const q = 'dhaka';


    function getWeather() {
    axios.get(baseurl,{
        params: {
            key: Key,
            q:'dhaka'
        }
    }) // جایگزین URL با URL واقعی API
        .then(function (response) {
            const data = response.data;

            // قرار دادن داده‌ها در HTML
            document.getElementById('.weather-box').textContent = data.location.name;
            console.log(data.location.name);

        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

    // فراخوانی تابع برای گرفتن اطلاعات
    getWeather();

