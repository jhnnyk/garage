function getCars(callbackFn) {
  $.getJSON('/api/cars', callbackFn)
}

function getRecentFillups (carId, callbackFn) {
  $.getJSON(`/api/fillups/${carId}`, displayFillups)
}

function displayCars (data) {
  let carListHTML = `<section><ul>`
  for (let i = 0; i < data.cars.length; i++) {
    carListHTML += `<li><a href="#" class="js-car-page-link" id="${data.cars[i].id}">${data.cars[i].name}</a></li>`
  }
  carListHTML += `</ul></section>`

  $('.menu').html(carListHTML)
}

function displayFillups (data) {
  let fillupsHTML = `
    <section>
      <h3>Fill Ups</h3>
      <table id="fillups">
        <thead>
          <tr>
            <th>MPG</th>
            <th>Mileage</th>
            <th>Cost</th>
            <th>Gallons</th>
            <th>$/gal</th>
            <th>Brand</th>
            <th>Location</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>`

  for (let i = 0; i < data.fillups.length; i++) {
    fillupsHTML += `
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
          <form method="post" action="/api/fillups/${data.fillups[i].id}" class="edit-fillup-form">
            <input type="hidden" name="id" value="${data.fillups[i].id}">
            <div>
              <label for="mileage">
                <span>Mileage:</span><br>
                <input type="text" name="mileage" class="mileage" id="mileage${[i]}" value="${data.fillups[i].mileage}">
                <span class="error js-mileage-error"></span>
              </label>
            </div>
            <div>
              <label for="price">
                <span>Total Price:</span><br>
                <input type="text" name="price" class="price" id="price${[i]}" value="${data.fillups[i].price}">
                <span class="error js-price-error"></span>
              </label>
            </div>
            <div>
              <label for="gallons">
                <span>Gallons:</span><br>
                <input type="text" name="gallons" class="gallons" id="gallons${[i]}" value="${data.fillups[i].gallons}">
                <span class="error js-gallons-error"></span>
              </label>
            </div>
            <div>
              <label for="brand">
                <span>Brand:</span><br>
                <input type="text" name="brand" id="brand${[i]}" value="${data.fillups[i].brand ? data.fillups[i].brand : ''}">
              </label>
            </div>
            <div>
              <label for="location">
                <span>Location:</span><br>
                <input type="text" name="location" id="location${[i]}" value="${data.fillups[i].location ? data.fillups[i].location : ''}">
              </label>
            </div>
            <div>
              <label for="notes">
                <span>Notes:</span><br>
                <input type="text" name="notes" id="notes${[i]}" value="${data.fillups[i].notes ? data.fillups[i].notes : ''}">
              </label>
            </div>
            <button type="submit" name="submit">Submit</button>
            <span class="error js-submit-error"></span>
            <button type="reset" class="cancel-edit">Cancel</button>
          </form>
        </td>
      </tr>`
  }
  fillupsHTML += `
      </tbody>
      </table>
    </section>`

  $('.fillups').html(fillupsHTML)
}

function displayAddFillupForm (carId) {
  let addFillupFormHTML = `
    <section>
      <h3>Add a Fill Up</h3>
      <form action="/api/fillups" method="post" id="new-fillup" novalidate>
        <input type="hidden" name="car" value="${carId}">
        <label for="brand">
          <span>Brand:</span>
          <input type="text" name="brand" id="brand">
        </label>
        <br>

        <label for="location">
          <span>Location:</span>
          <input type="text" name="location" id="location">
        </label>
        <br>

        <label for="mileage">
          <span>Mileage:</span>
          <input type="text" name="mileage" id="mileage">
          <span class="error js-mileage-error" aria-live="polite"></span>
        </label>
        <br>

        <label for="gallons">
          <span>Gallons:</span>
          <input type="text" name="gallons" id="gallons">
          <span class="error js-gallons-error" aria-live="polite"></span>
        </label>
        <br>

        <label for="price">
          <span>Total Price:</span>
          <input type="text" name="price" id="price">
          <span class="error js-price-error" aria-live="polite"></span>
        </label>
        <br>

        <label for="notes">
          <span>Notes:</span><br>
          <textarea name="notes" id="notes" cols="30" rows="3"></textarea>
        </label>
        <br>

        <button type="submit" name="submit">Submit</button>
        <span class="error js-submit-error" aria-live="polite"></span>
      </form>
    </section>`

  $('.header').html(addFillupFormHTML)
}

// show fillups
$('.container').on('click', '.js-car-page-link', function(e) {
  e.preventDefault()
  let carId = $(this).attr('id')
  displayAddFillupForm(carId)
  getRecentFillups(carId, displayFillups)
})

// show edit form
$('.container').on('click', '.edit-fillup', function (e) {
  e.preventDefault()
  $(this).parents('tr.data-row').hide()
  $(this).parents('tr.data-row').next('tr.edit-row').show()
})

// cancel edits
$('.container').on('click', '.cancel-edit', function () {
  $(this).parents('tr.edit-row').hide()
  $(this).parents('tr.edit-row').prev('tr.data-row').show()
})

// delete fillup
$('.container').on('click', '.delete-fillup', function (e) {
  e.preventDefault()
  if (confirm('Are you sure you want to delete this fillup?')) {
    $.ajax({
      url: `/api/fillups/${this.id}`,
      method: 'DELETE'
    })
    .then(() => {window.location = '/'})
  }
})

// form validations
let priceRegEx =   /^\d{0,8}(\.)?(\d{1,2})?$/
let gallonsRegEx = /^\d{0,8}(\.)?(\d{1,3})?$/
let mileageRegEx = /^\d{0,8}$/

function testPriceField (input) {
  return input.length === 0 || priceRegEx.test(input)
}

function testGallonsField (input) {
  return input.length === 0 || gallonsRegEx.test(input)
}

function testMileageField (input) {
  return input.length === 0 || mileageRegEx.test(input)
}

$('input#price').on('input', function (event) {
  if (!testPriceField($(this).val())) {
    $('#new-fillup .js-price-error').html('must be a number')
  } else {
    $('#new-fillup .js-price-error').html('')
  }
})

// validations for new fillup form
$('input#gallons').on('input', function (event) {
  if (!testGallonsField($(this).val())) {
    $('#new-fillup .js-gallons-error').html('must be a number')
  } else {
    $('#new-fillup .js-gallons-error').html('')
  }
})

$('input#mileage').on('input', function (event) {
  if (!testMileageField($(this).val())) {
    $('#new-fillup .js-mileage-error').html('must be a number')
  } else {
    $('#new-fillup .js-mileage-error').html('')
  }
})

$('form#new-fillup').on('submit', function (event) {
  // check price field
  if (!testPriceField($('input#price').val()) || $('input#price').val().length === 0) {
    $('#new-fillup .js-price-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    event.preventDefault()
  }

  // check gallons field
  if (!testGallonsField($('input#gallons').val()) || $('input#gallons').val().length === 0) {
    $('#new-fillup .js-gallons-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    event.preventDefault()
  }

  // check mileage field
  if (!testMileageField($('input#mileage').val()) || $('input#mileage').val().length === 0) {
    $('#new-fillup .js-mileage-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    event.preventDefault()
  }
})

// validations for edit fillup form
$('#fillups tbody').on('input', 'input.mileage', function (event) {
  if (!testMileageField($(this).val())) {
    $(this).next('.js-mileage-error').html('<br>must be a number')
  } else {
    $(this).next('.js-mileage-error').html('')
  }
})

$('#fillups tbody').on('input', 'input.price', function (event) {
  if (!testPriceField($(this).val())) {
    $(this).next('.js-price-error').html('<br>must be a number')
  } else {
    $(this).next('.js-price-error').html('')
  }
})

$('#fillups tbody').on('input', 'input.gallons', function (event) {
  if (!testGallonsField($(this).val())) {
    $(this).next('.js-gallons-error').html('<br>must be a number')
  } else {
    $(this).next('.js-gallons-error').html('')
  }
})

$('#fillups tbody').on('submit', '.edit-fillup-form', function (event) {
  // check mileage field
  if (!testMileageField($(this).find('input.mileage').val()) || $(this).find('input.mileage').val().length === 0) {
    $(this).find('.js-mileage-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    event.preventDefault()
  }

  // check price field
  if (!testPriceField($(this).find('input.price').val()) || $(this).find('input.price').val().length === 0) {
    $(this).find('.js-price-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    event.preventDefault()
  }

  // check gallons field
  if (!testGallonsField($(this).find('input.gallons').val()) || $(this).find('input.gallons').val().length === 0) {
    $(this).find('.js-gallons-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    event.preventDefault()
  }
})

function getAndDisplayDashboard () {
  getCars(displayCars)
}

$(getAndDisplayDashboard())
