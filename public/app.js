const MOCK_FILLUPS = {
  'fillups': [
    {
      'id': '12344556',
      'text': 'this is a test fillup #1',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
      'text': 'this is a test fillup #2',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
      'text': 'this is a test fillup #3',
      'car_id': '3924508'
    },
    {
      'id': '12344556',
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
    $('#fillups').append(`
      <li>${data.fillups[index].text}</li>
    `)
  }
}

function getAndDisplayDashboard () {
  getRecentFillups(displayFillups)
  // getRecentServices(displayServices)
}

$(getAndDisplayDashboard())
