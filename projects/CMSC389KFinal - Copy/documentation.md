# ShoeStars Shoe Review Hub

---

Name: Dagmawi Assefa

Date: May 11th, 2020

Project Topic: Sneaker Review

URL: http://103.283.293.13:3000/
---

### 1.Data Format

Data points in ShoeSchema:

-`Field 1`:Name              `Type:String`
-`Field 2`:Image Link        `Type:String`
-`Field 3`:Price             `Type:Number`
-`Field 4`:Reviews           `Type:[ReviewSchema]`

Schema:
```javascript
{
    name:String,
    image:String,
    cost:Number,
    reviews:[reviewSchema]
}
```

Data points in Review Schema:

-`Field 1`:Rating            `Type:Number`
-`Field 2`:Reviewer's Name   `Type:String`
-`Field 3`:Comment           `Type:Number`
-`Field 4`:Reviews           `Type:[ReviewSchema]`

Schema:
```javascript
{
    rating:Number,
    user:String,
    comment:String
}
```

### 2. Add New Shoes

HTML form route: `/addShoes`

POST endpoint route: `/api/addShoes`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/addShoes',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'Air Jordan 1 Retro High UNC', 
        image: 'https://cdn.flightclub.com/1800/TEMPLATE/012304/1.jpg',
        cost: 800.00
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. Add New Review

HTML form route: `/addReview`

POST endpoint route: `/shoe/review`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/shoe/:id/review',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        rating: 4.9,
        name: "John Smith", 
        comment: 'These shoes are a must buy'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 4. View Data

GET endpoint route: `/catalog.`

### 5. Navigation Pages

Navigation Filters
1. $$$ -> `/expensiveShoes`
2. Best rated -> `/bestReviews`
3. Jordans -> `/jordan`
4. Best on a Budget -> `/budgeting`
5. Random -> `/random`