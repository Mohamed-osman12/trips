document.getElementById('tripForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const minCost = parseFloat(document.getElementById('minCost').value);
    const maxCost = parseFloat(document.getElementById('maxCost').value);
    
    addTripItem(item, minCost, maxCost);
    saveTripData(item, minCost, maxCost);
});

window.addEventListener('load', function() {
    loadTripData();
});

function addTripItem(item, minCost, maxCost) {
    const tripTableBody = document.getElementById('tripTableBody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${item}</td>
        <td>${minCost}</td>
        <td>${maxCost}</td>
    `;
    
    tripTableBody.appendChild(newRow);
    
    updateTotals(minCost, maxCost);
}

function updateTotals(minCost, maxCost) {
    const totalMinCost = document.getElementById('totalMinCost');
    const totalMaxCost = document.getElementById('totalMaxCost');
    
    totalMinCost.textContent = parseFloat(totalMinCost.textContent) + minCost;
    totalMaxCost.textContent = parseFloat(totalMaxCost.textContent) + maxCost;
}

function saveTripData(item, minCost, maxCost) {
    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    trips.push({ item, minCost, maxCost });
    localStorage.setItem('trips', JSON.stringify(trips));
}

function loadTripData() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    let totalMin = 0;
    let totalMax = 0;

    trips.forEach(trip => {
        addTripItem(trip.item, trip.minCost, trip.maxCost);
        totalMin += trip.minCost;
        totalMax += trip.maxCost;
    });

    document.getElementById('totalMinCost').textContent = totalMin;
    document.getElementById('totalMaxCost').textContent = totalMax;
}
