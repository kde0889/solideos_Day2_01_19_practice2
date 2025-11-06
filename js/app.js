/* ===========================
   TravelHub - Smart Travel Planner
   Premium Travel Web Application
   =========================== */

// Global Variables
let map;
let routeLayer;
let markersLayer;
let searchData = {};
let autocompleteServices = {};

// Korean Cities Database with Coordinates
const koreanCities = [
    { name: '서울', lat: 37.5665, lng: 126.9780, english: 'Seoul' },
    { name: '부산', lat: 35.1796, lng: 129.0756, english: 'Busan' },
    { name: '대구', lat: 35.8714, lng: 128.6014, english: 'Daegu' },
    { name: '인천', lat: 37.4563, lng: 126.7052, english: 'Incheon' },
    { name: '광주', lat: 35.1595, lng: 126.8526, english: 'Gwangju' },
    { name: '대전', lat: 36.3504, lng: 127.3845, english: 'Daejeon' },
    { name: '울산', lat: 35.5384, lng: 129.3114, english: 'Ulsan' },
    { name: '세종', lat: 36.4800, lng: 127.2890, english: 'Sejong' },
    { name: '제주', lat: 33.4996, lng: 126.5312, english: 'Jeju' },
    { name: '수원', lat: 37.2636, lng: 127.0286, english: 'Suwon' },
    { name: '창원', lat: 35.2286, lng: 128.6811, english: 'Changwon' },
    { name: '천안', lat: 36.8151, lng: 127.1139, english: 'Cheonan' },
    { name: '전주', lat: 35.8242, lng: 127.1480, english: 'Jeonju' },
    { name: '강릉', lat: 37.7519, lng: 128.8761, english: 'Gangneung' },
    { name: '포항', lat: 36.0190, lng: 129.3435, english: 'Pohang' }
];

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set default departure date to today
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('departureDate').value = `${year}-${month}-${day}`;

    // Initialize event listeners
    initializeEventListeners();

    // Initialize Leaflet Map (No API key required!)
    if (typeof L !== 'undefined') {
        initializeMap();
    } else {
        console.warn('Leaflet not loaded.');
    }
}

// ===========================
// EVENT LISTENERS
// ===========================
function initializeEventListeners() {
    // Form submission
    document.getElementById('searchForm').addEventListener('submit', handleSearch);

    // Swap button
    document.getElementById('swapBtn').addEventListener('click', swapLocations);

    // Passenger controls
    document.getElementById('increasePassengers').addEventListener('click', () => {
        changePassengers(1);
    });
    document.getElementById('decreasePassengers').addEventListener('click', () => {
        changePassengers(-1);
    });

    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            sortResults(this.dataset.sort);
        });
    });
}

// ===========================
// FORM CONTROLS
// ===========================
function swapLocations() {
    const departure = document.getElementById('departure');
    const arrival = document.getElementById('arrival');
    const temp = departure.value;
    departure.value = arrival.value;
    arrival.value = temp;
}

function changePassengers(delta) {
    const input = document.getElementById('passengers');
    const current = parseInt(input.value);
    const newValue = Math.max(1, Math.min(9, current + delta));
    input.value = newValue;
}

// ===========================
// LEAFLET MAP INTEGRATION (No API Key!)
// ===========================
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Default center (Seoul)
    const defaultCenter = [37.5665, 126.9780];

    // Initialize Leaflet map
    map = L.map('map').setView(defaultCenter, 7);

    // Add OpenStreetMap tiles (completely free!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Initialize layer groups for markers and routes
    markersLayer = L.layerGroup().addTo(map);
    routeLayer = L.layerGroup().addTo(map);
}

function displayRoute(origin, destination) {
    if (!map) {
        console.warn('Map not initialized');
        return;
    }

    // Get city coordinates
    const originCity = koreanCities.find(c => c.name === origin);
    const destCity = koreanCities.find(c => c.name === destination);

    if (!originCity || !destCity) {
        console.error('City not found');
        return;
    }

    // Clear previous markers and routes
    markersLayer.clearLayers();
    routeLayer.clearLayers();

    // Create custom icons
    const originIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">A</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const destIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">B</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add markers
    const originMarker = L.marker([originCity.lat, originCity.lng], { icon: originIcon })
        .bindPopup(`<b>${origin}</b><br>출발지`)
        .addTo(markersLayer);

    const destMarker = L.marker([destCity.lat, destCity.lng], { icon: destIcon })
        .bindPopup(`<b>${destination}</b><br>도착지`)
        .addTo(markersLayer);

    // Draw route line
    const routeLine = L.polyline([
        [originCity.lat, originCity.lng],
        [destCity.lat, destCity.lng]
    ], {
        color: '#667eea',
        weight: 5,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(routeLayer);

    // Add arrow decorator to show direction
    const arrowIcon = L.divIcon({
        className: 'arrow-icon',
        html: '<div style="color: #667eea; font-size: 20px;">➜</div>',
        iconSize: [20, 20]
    });

    const midLat = (originCity.lat + destCity.lat) / 2;
    const midLng = (originCity.lng + destCity.lng) / 2;
    L.marker([midLat, midLng], { icon: arrowIcon }).addTo(routeLayer);

    // Fit map to show both markers
    const bounds = L.latLngBounds([
        [originCity.lat, originCity.lng],
        [destCity.lat, destCity.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Calculate and display distance and duration
    const distance = calculateDistance(
        originCity.lat, originCity.lng,
        destCity.lat, destCity.lng
    );
    const duration = Math.round(distance / 60 * 60); // Rough estimate: 60km/h average

    document.getElementById('distance').textContent = `${distance.toFixed(1)} km`;
    document.getElementById('duration').textContent = `약 ${Math.floor(duration / 60)}시간 ${duration % 60}분`;
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ===========================
// SEARCH HANDLING
// ===========================
async function handleSearch(e) {
    e.preventDefault();

    try {
        // Collect form data
        const date = document.getElementById('departureDate').value;
        const hour = parseInt(document.getElementById('departureHour').value);
        const minute = parseInt(document.getElementById('departureMinute').value);
        const period = document.getElementById('departurePeriod').value;

        console.log('Form values:', { date, hour, minute, period });

        // Convert 12-hour to 24-hour format
        let hour24 = hour;
        if (period === 'PM' && hour !== 12) {
            hour24 = hour + 12;
        } else if (period === 'AM' && hour === 12) {
            hour24 = 0;
        }

        // Create datetime string
        const departureDateTime = `${date}T${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        const formData = {
            departure: document.getElementById('departure').value,
            arrival: document.getElementById('arrival').value,
            departureDate: departureDateTime,
            passengers: parseInt(document.getElementById('passengers').value),
            transports: Array.from(document.querySelectorAll('input[name="transport"]:checked'))
                .map(cb => cb.value)
        };

        console.log('Collected form data:', formData);

        // Validate
        if (!formData.departure || !formData.arrival) {
            alert('출발지와 도착지를 입력해주세요.');
            return;
        }

        if (formData.transports.length === 0) {
            alert('최소 하나의 교통수단을 선택해주세요.');
            return;
        }

        // Store search data
        searchData = formData;

        // Show loading
        showLoading();

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Search for transportation
        const results = await searchTransportation(formData);
        console.log('Search results:', results);

        // Display results
        displayResults(results);

        // Display route on map
        displayRoute(formData.departure, formData.arrival);

        // Hide loading
        hideLoading();

        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('Error in handleSearch:', error);
        alert('검색 중 오류가 발생했습니다: ' + error.message);
        hideLoading();
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
}

// ===========================
// TRANSPORTATION SEARCH
// ===========================
async function searchTransportation(formData) {
    // In a real application, this would call actual APIs
    // For demo purposes, we'll generate realistic mock data

    const results = [];
    const { departure, arrival, departureDate, passengers, transports } = formData;

    // Parse departure date
    const depDate = new Date(departureDate);
    // Format time as HH:MM (24-hour format)
    const hours = String(depDate.getHours()).padStart(2, '0');
    const minutes = String(depDate.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    // Calculate base distance for pricing
    const originCity = koreanCities.find(c => c.name === departure);
    const destCity = koreanCities.find(c => c.name === arrival);
    let distance = 300; // default

    if (originCity && destCity) {
        distance = calculateDistance(
            originCity.lat, originCity.lng,
            destCity.lat, destCity.lng
        );
    }

    // Generate bus options
    if (transports.includes('bus')) {
        results.push(...generateBusOptions(departure, arrival, timeStr, distance, passengers));
    }

    // Generate train options
    if (transports.includes('train')) {
        results.push(...generateTrainOptions(departure, arrival, timeStr, distance, passengers));
    }

    // Generate flight options
    if (transports.includes('flight')) {
        results.push(...generateFlightOptions(departure, arrival, timeStr, distance, passengers));
    }

    // Mark the best option
    if (results.length > 0) {
        results[0].isBest = true;
    }

    return results;
}

function generateBusOptions(departure, arrival, time, distance, passengers) {
    const basePrice = Math.round(distance * 0.08) * 1000;
    const baseDuration = Math.round(distance / 60 * 60);

    return [
        {
            type: 'bus',
            name: '프리미엄 고속버스',
            company: '중앙고속',
            departureTime: time,
            arrivalTime: addMinutes(time, baseDuration),
            duration: `${Math.floor(baseDuration / 60)}시간 ${baseDuration % 60}분`,
            price: basePrice * passengers,
            pricePerPerson: basePrice,
            rating: 4.5,
            seats: 28,
            amenities: ['WiFi', 'USB 충전', '안마 의자'],
            bookingUrl: `https://www.kobus.co.kr/`
        },
        {
            type: 'bus',
            name: '일반 고속버스',
            company: '동부고속',
            departureTime: addMinutes(time, 30),
            arrivalTime: addMinutes(time, baseDuration + 30 + 15),
            duration: `${Math.floor((baseDuration + 15) / 60)}시간 ${(baseDuration + 15) % 60}분`,
            price: Math.round(basePrice * 0.8) * passengers,
            pricePerPerson: Math.round(basePrice * 0.8),
            rating: 4.2,
            seats: 42,
            amenities: ['WiFi'],
            bookingUrl: `https://www.kobus.co.kr/`
        }
    ];
}

function generateTrainOptions(departure, arrival, time, distance, passengers) {
    const basePrice = Math.round(distance * 0.15) * 1000;
    const baseDuration = Math.round(distance / 200 * 60);

    return [
        {
            type: 'train',
            name: 'KTX',
            company: '코레일',
            departureTime: time,
            arrivalTime: addMinutes(time, baseDuration),
            duration: `${Math.floor(baseDuration / 60)}시간 ${baseDuration % 60}분`,
            price: basePrice * passengers,
            pricePerPerson: basePrice,
            rating: 4.8,
            seats: 18,
            amenities: ['WiFi', '식당칸', '콘센트'],
            bookingUrl: `https://www.letskorail.com/`
        },
        {
            type: 'train',
            name: 'ITX-새마을',
            company: '코레일',
            departureTime: addMinutes(time, 45),
            arrivalTime: addMinutes(time, 45 + Math.round(baseDuration * 1.3)),
            duration: `${Math.floor(baseDuration * 1.3 / 60)}시간 ${Math.round(baseDuration * 1.3) % 60}분`,
            price: Math.round(basePrice * 0.7) * passengers,
            pricePerPerson: Math.round(basePrice * 0.7),
            rating: 4.5,
            seats: 32,
            amenities: ['WiFi', '콘센트'],
            bookingUrl: `https://www.letskorail.com/`
        }
    ];
}

function generateFlightOptions(departure, arrival, time, distance, passengers) {
    // Flights only make sense for longer distances
    if (distance < 200) {
        return [];
    }

    const basePrice = Math.round(distance * 0.25) * 1000;
    const baseDuration = 65; // Average flight duration

    return [
        {
            type: 'flight',
            name: '대한항공 KE1234',
            company: '대한항공',
            departureTime: time,
            arrivalTime: addMinutes(time, baseDuration),
            duration: `${Math.floor(baseDuration / 60)}시간 ${baseDuration % 60}분`,
            price: basePrice * passengers,
            pricePerPerson: basePrice,
            rating: 4.7,
            seats: 12,
            amenities: ['기내식', 'WiFi', '수하물 20kg'],
            bookingUrl: `https://www.koreanair.com/`
        },
        {
            type: 'flight',
            name: '아시아나 OZ5678',
            company: '아시아나항공',
            departureTime: addMinutes(time, 60),
            arrivalTime: addMinutes(time, 60 + baseDuration),
            duration: `${Math.floor(baseDuration / 60)}시간 ${baseDuration % 60}분`,
            price: Math.round(basePrice * 0.9) * passengers,
            pricePerPerson: Math.round(basePrice * 0.9),
            rating: 4.6,
            seats: 8,
            amenities: ['기내식', '수하물 15kg'],
            bookingUrl: `https://flyasiana.com/`
        },
        {
            type: 'flight',
            name: '제주항공 7C9012',
            company: '제주항공',
            departureTime: addMinutes(time, 120),
            arrivalTime: addMinutes(time, 120 + baseDuration + 10),
            duration: `${Math.floor((baseDuration + 10) / 60)}시간 ${(baseDuration + 10) % 60}분`,
            price: Math.round(basePrice * 0.6) * passengers,
            pricePerPerson: Math.round(basePrice * 0.6),
            rating: 4.3,
            seats: 15,
            amenities: ['수하물 15kg'],
            bookingUrl: `https://www.jejuair.net/`
        }
    ];
}

function addMinutes(timeStr, minutes) {
    // Parse HH:MM format
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// ===========================
// DISPLAY RESULTS
// ===========================
function displayResults(results) {
    displayTransportOptions(results);
    displayRecommendations(results);
}

function displayTransportOptions(results) {
    const container = document.getElementById('transportOptions');

    if (results.length === 0) {
        container.innerHTML = `
            <div class="no-routes-message">
                <i class="fas fa-route"></i>
                <h3>${searchData.departure} → ${searchData.arrival}</h3>
                <p class="no-routes-title">이용 가능한 교통편이 없습니다</p>
                <p class="no-routes-desc">선택하신 구간과 교통수단으로는 운행하는 노선이 없습니다.</p>
                <div class="no-routes-suggestions">
                    <p><strong>다음을 확인해보세요:</strong></p>
                    <ul>
                        <li>다른 교통수단을 선택해보세요 (버스, 기차, 비행기)</li>
                        <li>출발 시간을 변경해보세요</li>
                        <li>경유 구간을 검색해보세요</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(option => {
        const typeIcon = {
            'bus': 'fa-bus',
            'train': 'fa-train',
            'flight': 'fa-plane'
        }[option.type];

        return `
            <div class="transport-card ${option.type} ${option.isBest ? 'best' : ''}" data-price="${option.price}" data-duration="${option.duration}" data-rating="${option.rating}">
                ${option.isBest ? '<div class="best-badge"><i class="fas fa-crown"></i> 최고 추천</div>' : ''}

                <div class="transport-icon">
                    <i class="fas ${typeIcon}"></i>
                </div>

                <div class="transport-details">
                    <div class="transport-name">${option.name}</div>
                    <div class="transport-route">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="route-text">${searchData.departure}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span class="route-text">${searchData.arrival}</span>
                    </div>
                    <div class="transport-time">
                        <span><strong>${option.departureTime}</strong></span>
                        <i class="fas fa-arrow-right"></i>
                        <span><strong>${option.arrivalTime}</strong></span>
                        <span class="transport-duration">
                            <i class="fas fa-clock"></i>
                            ${option.duration}
                        </span>
                    </div>
                    <div class="transport-meta">
                        <span class="meta-item">
                            <i class="fas fa-building"></i>
                            ${option.company}
                        </span>
                        <span class="meta-item rating">
                            <i class="fas fa-star"></i>
                            ${option.rating}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-chair"></i>
                            ${option.seats}석
                        </span>
                    </div>
                    <div class="transport-meta" style="margin-top: 0.5rem;">
                        ${option.amenities.map(amenity => `
                            <span class="meta-item" style="background: #f3f4f6; padding: 0.2rem 0.6rem; border-radius: 6px;">
                                <i class="fas fa-check" style="color: #10b981;"></i>
                                ${amenity}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div class="transport-booking">
                    <div class="transport-price">
                        ${formatPrice(option.price)}
                        <small>/ ${searchData.passengers}인</small>
                    </div>
                    <a href="${option.bookingUrl}" target="_blank" class="btn-book" rel="noopener noreferrer">
                        예약하기
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function displayRecommendations(results) {
    const container = document.getElementById('recommendations');

    if (results.length === 0) {
        container.innerHTML = '<p>추천 정보를 생성할 수 없습니다.</p>';
        return;
    }

    // Find cheapest and fastest
    const cheapest = results.reduce((min, option) =>
        option.price < min.price ? option : min
    );

    const fastest = results.reduce((min, option) => {
        const minDur = parseDuration(min.duration);
        const optDur = parseDuration(option.duration);
        return optDur < minDur ? option : min;
    });

    const recommendations = [
        {
            icon: 'fa-piggy-bank',
            title: '가장 저렴한 옵션',
            content: `${cheapest.name}을(를) 선택하시면 ${formatPrice(cheapest.price)}으로 여행하실 수 있습니다. 총 ${cheapest.duration} 소요됩니다.`
        },
        {
            icon: 'fa-bolt',
            title: '가장 빠른 옵션',
            content: `${fastest.name}이(가) ${fastest.duration}으로 가장 빠릅니다. 가격은 ${formatPrice(fastest.price)}입니다.`
        },
        {
            icon: 'fa-star',
            title: '평점 최고',
            content: `사용자들이 가장 선호하는 교통편은 ${results[0].name}으로, 평점 ${results[0].rating}점을 받았습니다.`
        },
        {
            icon: 'fa-lightbulb',
            title: '여행 팁',
            content: `${searchData.departure}에서 ${searchData.arrival}까지는 평균적으로 ${results[0].duration} 정도 소요됩니다. 출발 30분 전에는 도착하시는 것을 권장합니다.`
        }
    ];

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <h4><i class="fas ${rec.icon}" style="color: var(--primary-color); margin-right: 0.5rem;"></i>${rec.title}</h4>
            <p>${rec.content}</p>
        </div>
    `).join('');
}

// ===========================
// SORTING
// ===========================
function sortResults(sortBy) {
    const container = document.getElementById('transportOptions');
    const cards = Array.from(container.querySelectorAll('.transport-card'));

    cards.sort((a, b) => {
        if (sortBy === 'price') {
            return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        } else if (sortBy === 'time') {
            return parseDuration(a.dataset.duration) - parseDuration(b.dataset.duration);
        } else if (sortBy === 'rating') {
            return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        }
        return 0;
    });

    // Clear and re-append
    container.innerHTML = '';
    cards.forEach(card => container.appendChild(card));
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function formatPrice(price) {
    return `₩${price.toLocaleString('ko-KR')}`;
}

function parseDuration(duration) {
    // Parse "X시간 Y분" format to total minutes
    const matches = duration.match(/(\d+)시간\s*(\d+)분/);
    if (matches) {
        return parseInt(matches[1]) * 60 + parseInt(matches[2]);
    }
    const hourMatch = duration.match(/(\d+)시간/);
    if (hourMatch) {
        return parseInt(hourMatch[1]) * 60;
    }
    const minMatch = duration.match(/(\d+)분/);
    if (minMatch) {
        return parseInt(minMatch[1]);
    }
    return 0;
}

// ===========================
// SMOOTH ANIMATIONS
// ===========================
// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards when they're created
function observeCards() {
    document.querySelectorAll('.transport-card, .recommendation-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Call after results are displayed
setTimeout(observeCards, 100);
