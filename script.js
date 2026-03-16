//http://api.weatherapi.com/v1/current.json?key=d2863b883c504497b49174620261603&q=Rourkela&aqi=no

const temperatureField = document.querySelector(".temp");
const locationField = document.querySelector(".time_location p");
const dateField = document.querySelector(".time_location span");
const weatherField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form"); 

form.addEventListener("submit", searchForLocation);

let target = "Rourkela"
const fetchResults = async (target) => {
    let url = `https://api.weatherapi.com/v1/current.json?key=d2863b883c504497b49174620261603&q=${target}&aqi=no`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(res);
    let locationName = data.location.name;
    let time = data.location.localtime;
    let temp = data.current.temp_c;
    let condition = data.current.condition.text;
    document.querySelector(".weather_icon").src = "https:" + data.current.condition.icon;
    updatDetails(temp, locationName, time, condition);
}

function updatDetails(temp, locationName, time, condition){
    let splitDate = time.split(' ')[0];
    let splitTime = time.split(' ')[1];
    let currentDay = getDayName(new Date(splitDate).getDay());
    temperatureField.innerText = `${temp}°C`;
    locationField.innerText = locationName;
    dateField.innerText = `${splitDate} ${currentDay} ${splitTime}`;
    weatherField.innerText = condition;
    document.body.className = condition.toLowerCase();
}

function searchForLocation(e){
    e.preventDefault();
    target = searchField.value;
    fetchResults(target);
}
fetchResults(target);

function getDayName(number){
    switch(number){
        case 0: 
        return "Sunday";
        case 1: 
        return "Monday";
        case 2: 
        return "Tuesday";
        case 3: 
        return "Wednesday";
        case 4: 
        return "Thursday";
        case 5: 
        return "Friday";
        case 6: 
        return "Saturday";
    }
}
