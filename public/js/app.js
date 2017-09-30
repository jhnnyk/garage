function getRecentFillups (callbackFn) {
  $.getJSON('/api/fillups', displayFillups)
}

function displayFillups (data) {
  for (let i = 0; i < data.fillups.length; i++) {
    $('#fillups tbody').append(`
      <tr class="data-row">
        <td>${data.fillups[i].mpg}</td>
        <td>${data.fillups[i].mileage}</td>
        <td>$${data.fillups[i].price}</td>
        <td>${data.fillups[i].gallons}</td>
        <td>${data.fillups[i].pricePerGallon}</td>
        <td>${data.fillups[i].brand ? data.fillups[i].brand : ''}</td>
        <td>${data.fillups[i].location ? data.fillups[i].location : ''}</td>
        <td>${data.fillups[i].notes ? data.fillups[i].notes : ''}</td>
        <td class="edit-delete">
          <a href="#" class="edit-fillup"><i class="fa fa-pencil"></i></a>
          <a href="#" class="delete-fillup" id="${data.fillups[i].id}"><i class="fa fa-times"></i></a>
        </td>
      </tr>

      <tr class="edit-row">
        <td colspan="9">
          <form method="post" action="/api/fillups/${data.fillups[i].id}" id="edit-fillup">
            <input type="hidden" name="id" value="${data.fillups[i].id}">
            <label for="mileage">Mileage:</label>
            <input type="text" name="mileage" id="mileage" value="${data.fillups[i].mileage}">
            <label for="price">Total Price:</label>
            <input type="text" name="price" id="price" value="${data.fillups[i].price}">
            <label for="gallons">Gallons:</label>
            <input type="text" name="gallons" id="gallons" value="${data.fillups[i].gallons}">
            <label for="brand">Brand:</label>
            <input type="text" name="brand" id="brand" value="${data.fillups[i].brand ? data.fillups[i].brand : ''}">
            <label for="location">Location:</label>
            <input type="text" name="location" id="location" value="${data.fillups[i].location ? data.fillups[i].location : ''}">
            <input type="text" name="notes" id="notes" value="${data.fillups[i].notes ? data.fillups[i].notes : ''}">
            <button type="submit" name="submit">Submit</button>
            <button type="reset" class="cancel-edit">Cancel</button>
          </form>
        </td>
      </tr>
    `)
  }

  $('.edit-row').hide()
}

function getAndDisplayDashboard () {
  getRecentFillups(displayFillups)
}

// show edit form
$('#fillups tbody').on('click', '.edit-fillup', function (e) {
  e.preventDefault()
  $(this).parents('tr.data-row').hide()
  $(this).parents('tr.data-row').next('tr.edit-row').show()
})

// cancel edits
$('#fillups tbody').on('click', '.cancel-edit', function () {
  $(this).parents('tr.edit-row').hide()
  $(this).parents('tr.edit-row').prev('tr.data-row').show()
})

// delete fillup
$('#fillups tbody').on('click', '.delete-fillup', function (e) {
  e.preventDefault()
  if (confirm('Are you sure you want to delete this fillup?')) {
    $.ajax({
      url: `/api/fillups/${this.id}`,
      method: 'DELETE'
    })
    .then(() => {window.location = '/'})
  }
})

$(getAndDisplayDashboard())
