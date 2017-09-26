const MOCK_FILLUPS = {
  'fillups': [
    {
      'id': '12344556',
      'location': 'Evergreen, CO',
      'brand': 'Loaf \'n Jug',
      'mileage': 23562,
      'gallons': 17.6,
      'cost': 65.49,
      'text': 'this is a test fillup #1',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
      'location': 'Evergreen, CO',
      'brand': 'Loaf \'n Jug',
      'mileage': 23562,
      'gallons': 18.8,
      'cost': 50.49,
      'text': 'this is a test fillup #2',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
      'location': 'Evergreen, CO',
      'brand': 'Loaf \'n Jug',
      'mileage': 23562,
      'gallons': 12.2,
      'cost': 55.21,
      'text': 'this is a test fillup #3',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
      'location': 'Evergreen, CO',
      'brand': 'Loaf \'n Jug',
      'mileage': 23562,
      'gallons': 16.8,
      'cost': 35.49,
      'text': 'this is a test fillup #4',
      'car_id': '3924508'
    }
  ]
}

function getRecentFillups (callbackFn) {
  setTimeout(function () { callbackFn(MOCK_FILLUPS) }, 100)
}

function displayFillups (data) {
  for (index in data.fillups) {
    const fillup = data.fillups[index]
    $('#fillups').append(`
      <li>
        ${fillup.mileage} miles<br>
        $${fillup.cost} ${fillup.gallons}gal<br>
        ${fillup.text}
      </li>
    `)
  }
}

function getAndDisplayDashboard () {
  getRecentFillups(displayFillups)
}

$(getAndDisplayDashboard())
