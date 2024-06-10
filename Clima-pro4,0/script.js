
document.addEventListener("DOMContentLoaded", function() {
    const apiKey = 'JTHGZLJUZD4PLH9N3P73AM84X'; 

    // Função para buscar o tempo atual e previsão de 15 dias
    async function fetchWeatherData(location) {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`);
        const data = await response.json();
        displayCurrentWeather(data);
        displayForecast(data);
        initializeMap(data.longitude, data.latitude);
        renderTemperatureChart(data);
    }

    // Função para exibir o tempo atual
    function displayCurrentWeather(data) {
        const currentDetails = document.getElementById('current-details');
        const currentConditions = data.currentConditions;
        currentDetails.innerHTML = `
            <p><strong>${data.resolvedAddress}</strong></p>
            <p>Temperatura: ${currentConditions.temp} °C</p>
            <p>Descrição: ${currentConditions.conditions}</p>
            <p>Umidade: ${currentConditions.humidity}%</p>
            <p>Vento: ${currentConditions.windspeed} m/s</p>
        `;
    }

    // Função para exibir a previsão de 15 dias
    function displayForecast(data) {
        const forecastGrid = document.getElementById('forecast-grid');
        forecastGrid.innerHTML = '';
        data.days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('forecast-day');
            dayElement.innerHTML = `
                <p><strong>${new Date(day.datetime).toLocaleDateString('pt-BR')}</strong></p>
                <p>${day.temp} °C</p>
                <p>${day.conditions}</p>
            `;
            forecastGrid.appendChild(dayElement);
        });
    }

    // Função para inicializar o mapa
    function initializeMap(lon, lat) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: lat, lng: lon },
            zoom: 16
        });

        new google.maps.Marker({
            position: { lat: lat, lng: lon },
            map: map
        });
    }

    // Função para renderizar o gráfico de temperatura
    function renderTemperatureChart(data) {
        const ctx = document.getElementById('temperature-chart').getContext('2d');
        const labels = data.days.map(day => new Date(day.datetime).toLocaleDateString('pt-BR'));
        const temperatures = data.days.map(day => day.temp);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: temperatures,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Temperatura (°C)'
                        }
                    }
                }
            }
        });
    }

    // Evento do botão de busca
    document.getElementById('search-btn').addEventListener('click', () => {
        const city = document.getElementById('city-input').value;
        if (city) {
            fetchWeatherData(city);
        }
    });
});
