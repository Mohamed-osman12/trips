document.addEventListener('DOMContentLoaded', function () {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBiNZmf6rBGK0u61jdJRjPYqSTTV9LHVHs",
        authDomain: "trips-b722c.firebaseapp.com",
        projectId: "trips-b722c",
        storageBucket: "trips-b722c.appspot.com",
        messagingSenderId: "73446183139",
        appId: "1:73446183139:web:81eea9689917ed15ca75d6",
        measurementId: "G-VWMC813WK0"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics();
    const db = firebase.firestore();

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
        db.collection('trips').doc(tripName).set({
            items: []
        }).then(() => {
            updateTripList();
            selectTrip(tripName);
        });
    }

    function selectTrip(tripName) {
        selectedTrip = tripName;
        selectedTripTitle.textContent = tripName;
        loadTripItems();
    }

    function updateTripList() {
        tripList.innerHTML = '';
        db.collection('trips').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const tripName = doc.id;
                const li = document.createElement('li');
                li.textContent = tripName;
                li.addEventListener('click', () => selectTrip(tripName));
                tripList.appendChild(li);
            });

            if (!selectedTrip && querySnapshot.size > 0) {
                // Select the last trip added if no trip is currently selected
                const lastTrip = querySnapshot.docs[querySnapshot.size - 1].id;
                selectTrip(lastTrip);
            }
        });
    }

    function addTripItem(item, minCost, maxCost) {
        if (selectedTrip) {
            db.collection('trips').doc(selectedTrip).update({
                items: firebase.firestore.FieldValue.arrayUnion({ item, minCost, maxCost })
            }).then(() => {
                loadTripItems();
            });
        }
    }

    function loadTripItems() {
        tripTableBody.innerHTML = '';
        db.collection('trips').doc(selectedTrip).get().then(doc => {
            const data = doc.data();
            let totalMin = 0;
            let totalMax = 0;

            data.items.forEach(({ item, minCost, maxCost }, index) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${item}</td>
                    <td>${minCost}</td>
                    <td>${maxCost}</td>
                    <td><button class="delete-button" data-index="${index}">حذف</button></td>
                `;
                tripTableBody.appendChild(newRow);

                totalMin += minCost;
                totalMax += maxCost;
            });

            totalMinCost.textContent = totalMin;
            totalMaxCost.textContent = totalMax;

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    deleteTripItem(index);
                });
            });
        });
    }

    function deleteTripItem(index) {
        db.collection('trips').doc(selectedTrip).get().then(doc => {
            const data = doc.data();
            const items = data.items;
            items.splice(index, 1);

            db.collection('trips').doc(selectedTrip).update({
                items: items
            }).then(() => {
                loadTripItems();
            });
        });
    }

    updateTripList();
});
