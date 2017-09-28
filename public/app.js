function getRecentFillups (callbackFn) {
  $.getJSON('/api/fillups', displayFillups)
}

function displayFillups (data) {
  for (let i = 0; i < data.fillups.length; i++) {
    $('#fillups tbody').append(`
      <tr>
        <td>${data.fillups[i].mpg}</td>
        <td>${data.fillups[i].mileage}</td>
        <td>$${data.fillups[i].price}</td>
        <td>${data.fillups[i].gallons}</td>
        <td>${data.fillups[i].pricePerGallon}</td>
        <td>${data.fillups[i].brand ? data.fillups[i].brand : ''}</td>
        <td>${data.fillups[i].location ? data.fillups[i].location : ''}</td>
        <td>${data.fillups[i].notes ? data.fillups[i].notes : ''}</td>
      </tr>
    `)
  }
}

function getAndDisplayDashboard () {
  getRecentFillups(displayFillups)
}

$(getAndDisplayDashboard())
