    function updateCurrentDate() {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').innerText = currentDate.toLocaleDateString(undefined, options);
    }

    // Call the function to update the date on page load
    updateCurrentDate();

    // Function to fetch weather data from an API
    async function getWeather() {
        const city = document.getElementById('city').value.trim(); // Ensure no extra spaces

        if (!city) {  // Check if the city field is empty
            alert("Please enter a city name to get the weather information.");
            return;
        }

        const apiKey = '19c780c5db083447fc158cb75ed1614d'; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.cod !== 200) {
                alert(data.message);  // Display error message if city is not found
                return;
            }

            // Update the current weather display
            document.querySelector('.city').innerText = data.name;
            document.querySelector('.temp').innerText =` ${Math.round(data.main.temp)}°C`;
            document.querySelector('.humidity').innerText = `${data.main.humidity}%`;
            document.querySelector('.wind').innerText = `${data.wind.speed} km/h`;

            // Get the weather icon (higher resolution)
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('weather-icon').src = iconUrl;

            // Change the background video based on weather conditions
            const weatherMain = data.weather[0].main.toLowerCase();
            changeBackgroundVideo(weatherMain);

            // Fetch hourly forecast
            getHourlyForecast(city);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Function to fetch hourly forecast
    async function getHourlyForecast(city) {
        const apiKey = '19c780c5db083447fc158cb75ed1614d'; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.cod !== "200") {
                alert(data.message);
                return;
            }

            // Prepare hourly forecast data
            const hourlyForecast = data.list.slice(0, 5).map(item => {
                return {
                    time: item.dt_txt.split(" ")[1].slice(0, 5), // Extract time from dt_txt
                    temp: Math.round(item.main.temp),
                    icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`// Higher resolution icon
                };
            });

            // Update the hourly forecast display
            const hourlyForecastContainer = document.getElementById('hourly-forecast');
            hourlyForecastContainer.innerHTML = ''; // Clear previous data

            hourlyForecast.forEach(hour => {
                const hourDiv = document.createElement('div');
                hourDiv.className = 'hourly';
                hourDiv.innerHTML = `
                    <img src="${hour.icon}" alt="Weather Icon" style="width: 30px; height: 30px;">
                    <div>${hour.time}</div>
                    <div>${hour.temp}°C</div>
                `;
                hourlyForecastContainer.appendChild(hourDiv);
            });

            // Show the weather details section
            document.querySelector('.weather').style.display = 'block';

        } catch (error) {
            console.error("Error fetching hourly forecast:", error);
        }
    }

    // Function to change the background video based on weather conditions
    function changeBackgroundVideo(weather) {
        const video = document.getElementById('bg-video');
        let videoSrc;

        switch (weather) {
            case 'rain':
            case 'drizzle':
                videoSrc = 'https://videos.pexels.com/video-files/7681543/7681543-sd_360_640_24fps.mp4'; // Replace with your rainy video file
                
                break;
            case 'clear':
                videoSrc = 'https://videos.pexels.com/video-files/1309214/1309214-hd_1920_1080_30fps.mp4'; // Replace with your sunny video file
                break;
            case 'clouds':
                videoSrc = 'https://videos.pexels.com/video-files/1893623/1893623-uhd_2560_1440_25fps.mp4'; // Replace with your cloudy video file
                break;
            case 'snow':
                videoSrc = 'https://videos.pexels.com/video-files/856381/856381-hd_1920_1080_30fps.mp4'; // Replace with your snowy video file
                break;
            case 'thunderstorm':
                videoSrc = 'https://videos.pexels.com/video-files/3433955/3433955-uhd_2732_1440_24fps.mp4'; // Replace with your thunderstorm video file
                break;
            default:
                videoSrc = 'default-video.mp4'; // Replace with a default video file
                break;
        }

        if (videoSrc !== video.src) { // Only change video source if it's different
            video.src = videoSrc;
            video.load(); // Reload the video to reflect the new source
            video.play(); // Ensure the video starts playing after the source change
        }
    }


    document.getElementById('searchButton').addEventListener('click', getWeather);



