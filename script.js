document.getElementById('tripForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const minCost = parseFloat(document.getElementById('minCost').value);
    const maxCost = parseFloat(document.getElementById('maxCost').value);
    
    addTripItem(item, minCost, maxCost);
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
