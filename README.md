[![Build Status](https://travis-ci.org/jhnnyk/garage.svg?branch=master)](https://travis-ci.org/jhnnyk/garage)
# My Garage

A web app to track fuel fillups for your vehicle(s).

---
## Live site
http://www.mygarage.online/

The live site has a front-end client (built with HTML, CSS & JavaScript/jQuery) that accesses the Node/Express backend API.

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

