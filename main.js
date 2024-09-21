import AWN from 'awesome-notifications';
import './style.css'
import axios from "axios";

const Key = '198c32d1a5fd44f596174131241909'
const baseurl = "http://api.weatherapi.com/v1"
const q = 'paris';

function getWeather() {
    const url = `${baseurl}/current.json?key=${Key}&q=${q}`;

    axios.get(url) // جایگزین URL با URL واقعی API
        .then(function (response) {
            new AWN().success('با موفقیت درخواست گرفته شد', { durations: { success: 0 }, labels: { success: "موفقیت" } })

            const data = response.data;
            document.querySelectorAll('#location-name')[0].innerHTML = `${data.location.name} - ${data.location.country}`;
            
        })
        .catch(function (error) {
            new AWN().alert('با مشکل:| درخواست گرفته شد', { durations: { success: 0 }, labels: { alert: "مشکل" } })
        });
}

// فراخوانی تابع برای گرفتن اطلاعات
getWeather();

