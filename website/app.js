const apiKey = 'd9acfd94f6cc474e1be2ab599b9e1e0a'; // Replace with your OpenWeatherMap API key

document.getElementById('generate').addEventListener('click', () => {
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherData(zipCode, apiKey)
        .then((data) => {
            const temperature = data.main.temp;
            const date = new Date().toLocaleDateString();

            // Make POST request to server with fetched data
            postData('/add', { date, temperature, feelings });
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
});

async function getWeatherData(zipCode, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Unable to fetch weather data.');
    }
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log('Data posted successfully:', newData);
        // After posting data, immediately update UI from server
        updateUI();
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

async function updateUI() {
    const response = await fetch('/get');

    try {
        const data = await response.json();
        document.getElementById('date').textContent = `Date: ${data.date}`;
        document.getElementById('temp').textContent = `Temperature: ${data.temperature}°C`;
        document.getElementById('content').textContent = `Feeling: ${data.feelings}`;
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

// Initial call to update UI
updateUI();
