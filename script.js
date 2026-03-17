const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p");
const dateField = document.querySelector(".time_location span");
const weatherField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");
const currentLocationBtn = document.getElementById("currentLocationBtn");

let target = "Rourkela";

const OPENCAGE_API_KEY = "66f33c7d10d543b9bf26d32040b907c3";

const fetchResults = async (target, customLocation = null) => {
    try {
        let url = `https://api.weatherapi.com/v1/current.json?key=d2863b883c504497b49174620261603&q=${target}&aqi=no`;
        const res = await fetch(url);
        const data = await res.json();

        let locationName = customLocation 
            ? customLocation 
            : `${data.location.name}, ${data.location.region}`;

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

async function getExactLocation(lat, lon) {
    try {
        const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
        );
        const data = await res.json();

        const comp = data.results[0].components;

        return (
            comp.suburb ||
            comp.neighbourhood ||
            comp.city_district ||
            comp.city ||
            comp.town ||
            comp.village ||
            data.results[0].formatted
        );
    } catch {
        return "Location not found";
    }
}

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
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const exactLocation = await getExactLocation(lat, lon);
                fetchResults(`${lat},${lon}`, exactLocation);
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
