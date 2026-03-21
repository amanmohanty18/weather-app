const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p");
const dateField = document.querySelector(".time_location span");
const weatherField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");
const currentLocationBtn = document.getElementById("currentLocationBtn");

let target = "Rourkela";
const fetchResults = async (target) => {
    try {
        let url = `https://api.weatherapi.com/v1/current.json?key=d2863b883c504497b49174620261603&q=${target}&aqi=no`;
        const res = await fetch(url);
        const data = await res.json();
        let locationName = data.location.name;
        let time = data.location.localtime;
        let temp = data.current.temp_c;
        let condition = data.current.condition.text;
        document.querySelector(".weather_icon").src =
            "https:" + data.current.condition.icon;

        updateDetails(temp, locationName, time, condition);
    } catch (error) {
        alert("Error fetching weather data");
    }
};
function updateDetails(temp, locationName, time, condition) {
    let [date, timeOnly] = time.split(" ");
    let dayName = getDayName(new Date(date).getDay());

    temperatureField.innerText = `${temp}°C`;
    locationField.innerText = locationName;
    dateField.innerText = `${date} ${dayName} ${timeOnly}`;
    weatherField.innerText = condition;

    updateBackground(condition);
}
function updateBackground(condition) {
    let c = condition.toLowerCase();
    if (c.includes("cloud")) {
        document.body.className = "cloudy";
    } else if (c.includes("rain")) {
        document.body.className = "rainy";
    } else if (c.includes("sun") || c.includes("clear")) {
        document.body.className = "sunny";
    } else if (c.includes("mist") || c.includes("fog")) {
        document.body.className = "mist";
    } else {
        document.body.className = "clear";
    }
}
function searchForLocation(e) {
    e.preventDefault();
    if (searchField.value.trim() === "") return;

    target = searchField.value;
    fetchResults(target);
}
currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                fetchResults(`${lat},${lon}`);
            },
            () => {
                alert("Location access denied");
            }
        );
    } else {
        alert("Geolocation not supported");
    }
});
function getDayName(number) {
    const days = [
        "Sunday","Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday"
    ];
    return days[number];
}
form.addEventListener("submit", searchForLocation);
fetchResults(target);
