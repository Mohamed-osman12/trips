document.addEventListener('DOMContentLoaded', function () {
    const initialForm = document.getElementById('initialForm');
    const mainContainer = document.getElementById('mainContainer');
    const initialFormContainer = document.getElementById('initialFormContainer');
    const tripList = document.getElementById('tripList');
    const tripForm = document.getElementById('tripForm');
    const tripTableBody = document.getElementById('tripTableBody');
    const totalMinCost = document.getElementById('totalMinCost');
    const totalMaxCost = document.getElementById('totalMaxCost');
    const selectedTripTitle = document.getElementById('selectedTripTitle');
    const newTripButton = document.getElementById('newTripButton');

    let trips = JSON.parse(localStorage.getItem('trips')) || {};
    let selectedTrip = null;

    initialForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const tripName = document.getElementById('tripName').value;
        addTrip(tripName);
        initialFormContainer.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        selectTrip(tripName);
    });

    newTripButton.addEventListener('click', function () {
        initialFormContainer.classList.remove('hidden');
        mainContainer.classList.add('hidden');
        document.getElementById('tripName').value = '';
    });

    tripForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const item = document.getElementById('item').value;
        const minCost = parseFloat(document.getElementById('minCost').value);
        const maxCost = parseFloat(document.getElementById('maxCost').value);

        addTripItem(item, minCost, maxCost);
        tripForm.reset();
    });

    function addTrip(tripName) {
        if (!trips[tripName]) {
            trips[tripName] = [];
            updateTripList();
            saveTrips();
        }
    }

    function selectTrip(tripName) {
        selectedTrip = tripName;
        selectedTripTitle.textContent = tripName;
        loadTripItems();
    }

    function updateTripList() {
        tripList.innerHTML = '';
        for (let tripName in trips) {
            const li = document.createElement('li');
            li.textContent = tripName;
            li.addEventListener('click', () => selectTrip(tripName));
            tripList.appendChild(li);
        }
    }

    function addTripItem(item, minCost, maxCost) {
        if (selectedTrip) {
            trips[selectedTrip].push({ item, minCost, maxCost });
            loadTripItems();
            saveTrips();
        }
    }

    function loadTripItems() {
        tripTableBody.innerHTML = '';
        let totalMin = 0;
        let totalMax = 0;

        trips[selectedTrip].forEach(({ item, minCost, maxCost }) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item}</td>
                <td>${minCost}</td>
                <td>${maxCost}</td>
            `;
            tripTableBody.appendChild(newRow);

            totalMin += minCost;
            totalMax += maxCost;
        });

        totalMinCost.textContent = totalMin;
        totalMaxCost.textContent = totalMax;
    }

    function saveTrips() {
        localStorage.setItem('trips', JSON.stringify(trips));
    }

    updateTripList();
});
