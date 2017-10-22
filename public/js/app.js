function isLoggedIn () {
  return !!localStorage.token
}

function flashMessage (message) {
  $('#flash').html(message).slideDown('normal', function () {
    $(this).delay(2500).fadeOut()
  })
}

function displayMainNav () {
  if (isLoggedIn()) {
    $('#login-button').parent('li').hide()
    $('.js-logged-in').show()
    getCars(displayCars)
  } else {
    $('.js-logged-in').hide()
    $('#add-fillup').hide()
    $('#login-button').parent('li').show()
  }
}

function displayLandingPage () {
  $('#page-title').html('')
  let landingPageHTML = ``

  if (isLoggedIn()) {
    landingPageHTML = `
      <section class="loggedin-landing-page">
        <h2>Welcome to Your Garage</h2>
        <h3>Please select a car below:</h3>
        <ul id="my-landing-page-cars"></ul>
      </section>`
    getCars(displayCarsOnLandingPage)
  } else {
    landingPageHTML = `
      <section class="landing-page">
        <div id="welcome">
          <h1>Welcome to MyGarage.online</h1>
          <p class="tagline">The online home for your cars</p>
        </div>
        
        <div>
          <form action="#" method="POST" id="landing-page-signup">
            <h2>Sign Up for Free</h2>
            <label for="firstName">
              <span>First Name:</span>
              <input type="text" name="firstName">
            </label>
            <label for="lastName">
              <span>Last Name:</span>
              <input type="text" name="lastName">
            </label>
            <label for="username">
              <span>Username:</span>
              <input type="text" name="username">
            </label>
            <label for="password">
              <span>Password:</span>
              <input type="password" name="password">
            </label>
            <button type="submit">Sign Up</button>
            <span class="error submit-error js-submit-error" aria-live="polite"></span>
          </form>
        </div>
      </section>
      
      <section class="landing-page">
        <div></div>
        <div>
          <h2>Add your car</h2>
          <p>Keep track of your vehicles in MyGarage.online.</p>
        </div>
      </section>
      
      <section class="landing-page">
        <div>
          <h2>Add fillups</h2>
          <p>Everytime you fill up your car with fuel, add the cost, gallons 
            and mileage to your car in MyGarage.online and we'll calculate
            the gas mileage for you.
          </p>
        </div>
        <div></div>
      </section>`
  }

  $('.js-content').html(landingPageHTML)
}

function getCars (callbackFn) {
  $.ajax({
    datatype: "json",
    url: `/api/cars`,
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
      }
    },
    method: 'GET',
    success: callbackFn
  })
}

function getRecentFillups (carId, callbackFn) {
  $.getJSON(`/api/fillups/${carId}`, displayFillups)
}

function displayCars (data) {
  let carListHTML = ``
  for (let i = 0; i < data.cars.length; i++) {
    carListHTML += `<li><a href="#" class="js-car-page-link" id="${data.cars[i].id}"><i class="fa fa-car" aria-hidden="true"></i> ${data.cars[i].name}</a></li>`
  }
  carListHTML += `
    <li>
      <a href="#" id="add-car-button"><i class="fa fa-plus-circle"></i> add a car</a>
    </li>`

  $('#my-cars ul').html(carListHTML)
}

function displayCarsOnLandingPage (data) {
  let carListHTML = ``
  for (let i = 0; i < data.cars.length; i++) {
    carListHTML += `<li><a href="#" class="js-car-page-link" id="${data.cars[i].id}"><i class="fa fa-car" aria-hidden="true"></i> ${data.cars[i].name}</a></li>`
  }
  carListHTML += `
    <li>
      <a href="#" id="add-car-button"><i class="fa fa-plus-circle"></i> add a car</a>
    </li>`

  $('#my-landing-page-cars').html(carListHTML)
}

function displayFillups (data) {
  let fillupsHTML
  if (data.fillups.length === 0) {
    fillupsHTML = `<h3>
        This car doesn't have any fillups yet.<br>
        <a href="#" id='nofillups-add-fillup'>Add a Fillup</a>
      </h3>`
  } else {
    fillupsHTML = `
      <section>
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
          <td data-label="MPG">${data.fillups[i].mpg ? data.fillups[i].mpg : '--'}</td>
          <td data-label="Mileage">${data.fillups[i].mileage}</td>
          <td data-label="Price">$${data.fillups[i].price}</td>
          <td data-label="Gallons">${data.fillups[i].gallons}</td>
          <td data-label="$/gal">${data.fillups[i].pricePerGallon}</td>
          <td data-label="Brand">${data.fillups[i].brand ? data.fillups[i].brand : ''}</td>
          <td data-label="Location">${data.fillups[i].location ? data.fillups[i].location : ''}</td>
          <td data-label="Notes">${data.fillups[i].notes ? data.fillups[i].notes : ''}</td>
          <td class="edit-delete">
            <a href="#" class="edit-fillup"><i class="fa fa-pencil"></i></a>
            <a href="#" class="delete-fillup"><i class="fa fa-times"></i></a>
            <div class="delete-confirmation">
              Are you sure you want to delete this fillup?<br>
              <button class='confirm-delete-fillup js-confirm-delete-fillup' id='${data.fillups[i].id}' name="${data.fillups[i].car}"><i class="fa fa-check" aria-hidden="true"></i> Yes</button>
              <button class='cancel-delete-fillup js-cancel-delete-fillup'><i class="fa fa-times" aria-hidden="true"></i> No</button>
            </div>
          </td>
        </tr>

        <tr class="edit-row">
          <td colspan="9">
            <form method="post" action="/api/fillups/${data.fillups[i].id}" class="edit-fillup-form">
              <input type="hidden" name="id" value="${data.fillups[i].id}">
              <input type="hidden" name="car" value="${data.fillups[i].car}">
              <div>
                <label for="mileage">
                  <span>Mileage:</span>
                  <input type="text" name="mileage" class="mileage" id="mileage${[i]}" value="${data.fillups[i].mileage}">
                  <span class="error js-mileage-error"></span>
                </label>
              </div>
              <div>
                <label for="price">
                  <span>Total Price:</span>
                  <input type="text" name="price" class="price" id="price${[i]}" value="${data.fillups[i].price}">
                  <span class="error js-price-error"></span>
                </label>
              </div>
              <div>
                <label for="gallons">
                  <span>Gallons:</span>
                  <input type="text" name="gallons" class="gallons" id="gallons${[i]}" value="${data.fillups[i].gallons}">
                  <span class="error js-gallons-error"></span>
                </label>
              </div>
              <div>
                <label for="brand">
                  <span>Brand:</span>
                  <input type="text" name="brand" id="brand${[i]}" class="brand" value="${data.fillups[i].brand ? data.fillups[i].brand : ''}">
                </label>
              </div>
              <div>
                <label for="location">
                  <span>Location:</span>
                  <input type="text" name="location" id="location${[i]}" class="location" value="${data.fillups[i].location ? data.fillups[i].location : ''}">
                </label>
              </div>
              <div>
                <label for="notes">
                  <span>Notes:</span>
                  <input type="text" name="notes" id="notes${[i]}" class="notes" value="${data.fillups[i].notes ? data.fillups[i].notes : ''}">
                </label>
              </div>
              <button type="submit" name="submit" class="submit-edit-fillup">Edit fillup</button>
              <button type="reset" class="cancel-edit-fillup"><i class="fa fa-times-circle"></i></button>
              <span class="error js-submit-error"></span>
            </form>
          </td>
        </tr>`
    }
    fillupsHTML += `
        </tbody>
        </table>
      </section>`
  }

  $('.js-content').html(fillupsHTML)
}

function displayAddFillupForm (carId) {
  let addFillupFormHTML = `
    <form action="/api/fillups" method="post" id="new-fillup" novalidate>
      <h3>Add a Fill Up</h3>
      <input type="hidden" name="car" id="car" value="${carId}">
      <label for="brand">
        <span>Brand:</span>
        <input type="text" name="brand" id="brand">
      </label>

      <label for="location">
        <span>Location:</span>
        <input type="text" name="location" id="location">
      </label>

      <label for="mileage">
        <span>Mileage:</span>
        <input type="text" name="mileage" id="mileage">
        <span class="error js-mileage-error" aria-live="polite"></span>
      </label>

      <label for="gallons">
        <span>Gallons:</span>
        <input type="text" name="gallons" id="gallons">
        <span class="error js-gallons-error" aria-live="polite"></span>
      </label>

      <label for="price">
        <span>Total Price:</span>
        <input type="text" name="price" id="price">
        <span class="error js-price-error" aria-live="polite"></span>
      </label>

      <label for="notes">
        <textarea name="notes" id="notes" cols="30" rows="3" placeholder="Add fillup notes here..."></textarea>
      </label>

      <button type="submit" name="submit">Add fillup</button>
      <button type="reset" class="cancel-button"><i class="fa fa-times-circle"></i></button>
      <span class="error submit-error js-submit-error" aria-live="polite"></span>
    </form>`

  $('.js-add-fillup').html(addFillupFormHTML)
}

function displayAddCarForm () {
  let addCarFormHTML = `
    <form action="#" method="POST" id="new-car-form">
      <h3>Add a car</h3>
      <input type="hidden" name="token" id="token" value="${localStorage.token}">
      <label for="year">
        <span>Year:</span>
        <input type="text" name="year" id="year">
      </label>

      <label for="make">
        <span>Make:</span>
        <input type="text" name="make" id="make">
      </label>

      <label for="model">
        <span>Model:</span>
        <input type="text" name="model" id="model">
      </label>

      <label for="carName">
        <span>Car Name:</span>
        <input type="text" name="carName" id="carName">
        <span class="error js-carName-error" aria-live="polite"></span>
      </label>

      <label for="carNotes">
        <textarea name="carNotes" id="carNotes" cols="30" rows="3" placeholder="Add car notes here..."></textarea>
      </label>

      <button type="submit" name="submit">Submit</button>
      <button type="reset" class="cancel-button"><i class="fa fa-times-circle"></i></button>
      <span class="error submit-error js-submit-error" aria-live="polite"></span>
    </form>`

  $('nav').append(addCarFormHTML)
}

// set page title for car page
function setCarPageHeader (carName) {
  $('#page-title').text(`${carName} Fillups`)
  $('#add-fillup').css('display', 'inline-block')
}

function displaySignupError (message) {
  $('#signup span.js-submit-error').html(message)
}

function displayLandingPageSignupError (message) {
  $('#landing-page-signup span.js-submit-error').html(message)
}

function displayLoginError (message) {
  $('#login span.js-submit-error').html(message)
}

// close forms
$('nav').on('click', '.cancel-button', function (e) {
  $(this).parent('form').slideUp()
  $(this).parent('form').removeClass('error')
  $(this).parent('form').find('span.error').html('')
})

// show cars
$('#my-cars').on('click', function (e) {
  $('#new-fillup').slideUp()
  $('#my-cars ul').slideToggle()
  e.preventDefault()
})

// show add car form
$('#my-cars, .js-content').on('click', '#add-car-button', function (e) {
  $('#new-car-form').slideDown()
  e.preventDefault()
})

// show car page
$('#my-cars ul, .js-content').on('click', '.js-car-page-link', function (e) {
  e.preventDefault()
  let carId = $(this).attr('id')
  let carName = $(this).text()
  setCarPageHeader(carName)
  displayAddFillupForm(carId)
  getRecentFillups(carId, displayFillups)
})

// new car form
$('nav').on('submit', '#new-car-form', function (e) {
  // make sure new car has a name
  let newCarValid = true
  if ($('input#carName').val().length === 0) {
    $('.js-carName-error').html('car name is required')
    $(this).addClass('error')
    $('#new-car-form .js-submit-error').html('please correct the errors above')
    newCarValid = false
  }

  // if fields are valid, send form
  if (newCarValid) {
    $.ajax({
      datatype: "json",
      url: `/api/cars`,
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token)
        }
      },
      method: 'POST',
      data: {
        year: $('input#year').val(),
        make: $('input#make').val(),
        model: $('input#model').val(),
        name: $('input#carName').val(),
        notes: $('textarea#carNotes').val()
      }
    }).then(function(car) {
      displayMainNav()
      setCarPageHeader(car.name)
      displayAddFillupForm(car.id)
      getRecentFillups(car.id, displayFillups)
      flashMessage('Car added!')
      $('#new-car-form')[0].reset()
      $('#new-car-form').slideUp()
    })
  }

  e.preventDefault()
})

// show edit form
$('.js-content').on('click', '.edit-fillup', function (e) {
  e.preventDefault()
  $(this).parents('tr.data-row').hide()
  $(this).parents('tr.data-row').next('tr.edit-row').show()
})

// cancel edits
$('.js-content').on('click', '.cancel-edit-fillup', function () {
  $(this).parents('tr.edit-row').hide()
  $(this).parents('tr.edit-row').prev('tr.data-row').show()
  $(this).parent('form').removeClass('error')
  $(this).parent('form').find('span.error').html('')
})

// delete fillup confirm
$('.js-content').on('click', '.delete-fillup', function (e) {
  $(this).siblings('.delete-confirmation').fadeIn()

  e.preventDefault()
})

// delete fillup cancel
$('.js-content').on('click', '.js-cancel-delete-fillup', function (e) {
  $(this).parent('.delete-confirmation').fadeOut()

  e.preventDefault()
})

// delete fillup
$('.js-content').on('click', '.js-confirm-delete-fillup', function (e) {
  let carId = this.name

  $.ajax({
    url: `/api/fillups/${this.id}`,
    method: 'DELETE'
  })
  .then(() => {
    getRecentFillups(carId, displayFillups)
    flashMessage('Fillup deleted!')
  })

  e.preventDefault()
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

// validations for new fillup form
$('.js-add-fillup').on('input', 'input#price', function (event) {
  if (!testPriceField($(this).val())) {
    $('#new-fillup .js-price-error').html('must be a number')
  } else {
    $('#new-fillup .js-price-error').html('')
  }
})

$('.js-add-fillup').on('input', 'input#gallons', function (event) {
  if (!testGallonsField($(this).val())) {
    $('#new-fillup .js-gallons-error').html('must be a number')
  } else {
    $('#new-fillup .js-gallons-error').html('')
  }
})

$('.js-add-fillup').on('input', 'input#mileage', function (event) {
  if (!testMileageField($(this).val())) {
    $('#new-fillup .js-mileage-error').html('must be a number')
  } else {
    $('#new-fillup .js-mileage-error').html('')
  }
})

// new fillup form
$('.js-add-fillup').on('submit', '#new-fillup', function (event) {
  let carId = $('input#car').val()
  let newFillupValid = true
  // check price field
  if (!testPriceField($('input#price').val()) || $('input#price').val().length === 0) {
    $('#new-fillup .js-price-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    newFillupValid = false
  }

  // check gallons field
  if (!testGallonsField($('input#gallons').val()) || $('input#gallons').val().length === 0) {
    $('#new-fillup .js-gallons-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    newFillupValid = false
  }

  // check mileage field
  if (!testMileageField($('input#mileage').val()) || $('input#mileage').val().length === 0) {
    $('#new-fillup .js-mileage-error').html('must be a number')
    $(this).addClass('error')
    $('#new-fillup .js-submit-error').html('please correct the errors above')
    newFillupValid = false
  }

  // if fields are valid, send form
  if (newFillupValid) {
    $.ajax({
      datatype: "json",
      url: `/api/fillups`,
      method: 'POST',
      data: {
        brand: $('input#brand').val(),
        location: $('input#location').val(),
        mileage: $('input#mileage').val(),
        gallons: $('input#gallons').val(),
        price: $('input#price').val(),
        notes: $('textarea#notes').val(),
        car: carId
      }
    }).done(() => {
      getRecentFillups(carId, displayFillups)
      flashMessage('Fillup added!')
    })

    displayAddFillupForm(carId)
  }

  event.preventDefault()
})

// validations for edit fillup form
$('.js-content').on('input', 'input.mileage', function (event) {
  if (!testMileageField($(this).val())) {
    $(this).next('.js-mileage-error').html('<br>must be a number')
  } else {
    $(this).next('.js-mileage-error').html('')
  }
})

$('.js-content').on('input', 'input.price', function (event) {
  if (!testPriceField($(this).val())) {
    $(this).next('.js-price-error').html('<br>must be a number')
  } else {
    $(this).next('.js-price-error').html('')
  }
})

$('.js-content').on('input', 'input.gallons', function (event) {
  if (!testGallonsField($(this).val())) {
    $(this).next('.js-gallons-error').html('<br>must be a number')
  } else {
    $(this).next('.js-gallons-error').html('')
  }
})

// edit fillup form
$('.js-content').on('submit', '.edit-fillup-form', function (event) {
  let carId = $(this).find("input[name='car']").val()
  let fillupId = $(this).find("input[name='id']").val()
  let updateFillupValid = true
  // check mileage field
  if (!testMileageField($(this).find('input.mileage').val()) || $(this).find('input.mileage').val().length === 0) {
    $(this).find('.js-mileage-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    updateFillupValid = false
  }

  // check price field
  if (!testPriceField($(this).find('input.price').val()) || $(this).find('input.price').val().length === 0) {
    $(this).find('.js-price-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    updateFillupValid = false
  }

  // check gallons field
  if (!testGallonsField($(this).find('input.gallons').val()) || $(this).find('input.gallons').val().length === 0) {
    $(this).find('.js-gallons-error').html('<br>must be a number')
    $(this).addClass('error')
    $(this).find('.js-submit-error').html('<br>please correct the errors above')
    updateFillupValid = false
  }

  // if fields are valid, send form
  if (updateFillupValid) {
    $.ajax({
      datatype: "json",
      url: `/api/fillups/${fillupId}`,
      method: 'PUT',
      data: {
        id: fillupId,
        brand: $(this).find('input.brand').val(),
        location: $(this).find('input.location').val(),
        mileage: $(this).find('input.mileage').val(),
        gallons: $(this).find('input.gallons').val(),
        price: $(this).find('input.price').val(),
        notes: $(this).find('input.notes').val(),
        car: carId
      }
    }).done(function() {
      getRecentFillups(carId, displayFillups)
      flashMessage('Fillup updated!')
    })
  }

  event.preventDefault()
})

// Add a fillup buttons
$('#add-fillup a').on('click', function (e) {
  $('#new-car-form').slideUp()
  $('#my-cars ul').slideUp()
  $('#new-fillup').slideToggle()
  e.preventDefault()
})

$('.js-content').on('click', '#nofillups-add-fillup', function (e) {
  $('#new-car-form').slideUp()
  $('#my-cars ul').slideUp()
  $('#new-fillup').slideToggle()
  e.preventDefault()
})

function loginUser (username, password) {
  let auth = btoa(`${username}:${password}`)

  $.ajax({
    datatype: 'json',
    url: '/api/auth/login',
    method: 'POST',
    headers: {"Authorization": "Basic " + auth},
    success: function (data) {
      localStorage.token = data.authToken
      $('#login').hide()
    },
    error: function (err) {
      displayLoginError('Incorrect username or password')
    }
  }).then(function () {
    displayMainNav()
    displayLandingPage()
    flashMessage('Welcome to MyGarage.online!')
  })
}

// login button
$('#login-button').on('click', function (e) {
  $('#signup').hide()
  $('#login').slideToggle()
  e.preventDefault()
})

// login form
$('#login').on('submit', function (e) {
  let username = $('#login input[name=username]').val()
  let password = $('#login input[name=password]').val()

  loginUser(username, password)

  e.preventDefault()
  this.reset()
})

// signup button
$('#signup-button').on('click', function (e) {
  $('#login').hide()
  $('#signup').slideToggle()
  e.preventDefault()
})

// signup form
$('#signup').on('submit', function (e) {
  let firstName = $('#signup input[name=firstName]').val()
  let lastName = $('#signup input[name=lastName]').val()  
  let username = $('#signup input[name=username]').val()
  let password = $('#signup input[name=password]').val()

  $.ajax({
    datatype: 'json',
    url: '/api/users',
    method: 'POST',
    data: JSON.stringify({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName
    }),
    contentType: "application/json",
    success: function (data) {
      console.log(`created a user! ${data.username}`)
      $('#signup').hide()
    },
    error: function (data) {
      const message = `'${data.responseJSON.location}' ${data.responseJSON.message}`
      displaySignupError(message)
    }
  }).done(function () {
    loginUser(username, password)
  })

  e.preventDefault()
  this.reset()
})

// landing page signup form
$('.js-content').on('submit', '#landing-page-signup', function (e) {
  let firstName = $('#landing-page-signup input[name=firstName]').val()
  let lastName = $('#landing-page-signup input[name=lastName]').val()  
  let username = $('#landing-page-signup input[name=username]').val()
  let password = $('#landing-page-signup input[name=password]').val()

  $.ajax({
    datatype: 'json',
    url: '/api/users',
    method: 'POST',
    data: JSON.stringify({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName
    }),
    contentType: "application/json",
    success: function (data) {
      console.log(`created a user! ${data.username}`)
      $('#signup').hide()
    },
    error: function (data) {
      const message = `'${data.responseJSON.location}' ${data.responseJSON.message}`
      displayLandingPageSignupError(message)
    }
  }).done(function () {
    loginUser(username, password)
  })

  e.preventDefault()
  this.reset()
})

// Logout
$('#logout').on('click', function (e) {
  localStorage.clear()
  displayMainNav()
  displayLandingPage()
  flashMessage('Goodbye!')
  e.preventDefault()
})

// set footer copyright date
$('#copyright').text(`
  ©️ ${(new Date).getFullYear()} 
  MyGarage.online. All rights reserved.`
)

function getAndDisplayDashboard () {
  displayMainNav()
  displayAddCarForm()
  displayLandingPage()
}

$(getAndDisplayDashboard())
