[![Build Status](https://travis-ci.org/jhnnyk/garage.svg?branch=master)](https://travis-ci.org/jhnnyk/garage)
# My Garage

A web app to track fuel fillups for your vehicle(s).

![screenshot](/public/images/mygarage-screenshot.png)

---
## Live site
http://www.mygarage.online/

The live site has a front-end client (built with HTML, CSS & JavaScript/jQuery) that accesses the Node/Express backend API.

**Demo account:** user: `demo`, password: `password`

---
## API
### Login
* URL: `/api/auth/login`
* Method: `POST`
* Sample Call:
```javascript
  $.ajax({
    datatype: 'json',
    url: '/api/auth/login',
    method: 'POST',
    headers: {"Authorization": "Basic " + btoa(`${username}:${password}`)},
    success: function (data) {
      console.log(data)
    }
  })
```

### Get Cars
* URL: `/api/cars`
* Method: `GET`
* Sample Call:
```javascript
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
```

### Add a New Car
* URL: `/api/cars`
* Method: `POST`
* Sample Call:
```javascript
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
        year: year,
        make: make,
        model: model,
        name: name, // required
        notes: notes
      }
    })
```


### Get Fillups
* URL: `/api/fillups/:carId`
* Method: `GET`
* Sample Call:
```javascript
  $.getJSON(`/api/fillups/${carId}`)
```

### Add Fillups
* URL: `/api/fillups`
* Method: `POST`
* Sample Call:
```javascript
  $.ajax({
      datatype: "json",
      url: `/api/fillups`,
      method: 'POST',
      data: {
        brand: brand,
        location: location,
        mileage: mileage, // required
        gallons: gallons, // required
        price: price, // required
        notes: notes,
        car: carId // required
      }
    })
```

### Edit Fillups
* URL: `/api/fillups/:fillupId`
* Method: `PUT`
* Sample Call:
```javascript
  $.ajax({
      datatype: "json",
      url: `/api/fillups/${fillupId}`,
      method: 'PUT',
      data: {
        id: fillupId,
        brand: brand,
        location: location,
        mileage: mileage, // required
        gallons: gallons, // required
        price: price, // required
        notes: notes,
        car: carId // required
      }
    })
```

### Delete Fillup
* URL: `/api/fillups/:fillupId`
* Method: `DELETE`
* Sample Call:
```javascript
  $.ajax({
    url: `/api/fillups/${this.id}`,
    method: 'DELETE'
  })
```
