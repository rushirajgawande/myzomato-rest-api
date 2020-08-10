// function showMyLoader(){
//   $('body').loading('toggle');
//   setTimeout(function(){
//     $('body').loading('toggle');
//   },3000);
// }

function searchmycity(value){

  $.ajax({
    type: "GET",
    url: "https://developers.zomato.com/api/v2.1/cities",
    data: {
      'q' : value
    },
    headers: {
      'user-key' : 'dfb97587d51a4a280f62c46ab46f57aa'
    },
    success: function(data){
      switch (data.status) {
        case "success":
            $('#finalresults').empty();
            $('#locationresults').empty();
            for (var i = 0; i < data.location_suggestions.length; i++) {
              $('#locationresults').append(
                '<div class="col-md-2 col-sm-12">' +
                  '<div class="card">' +
                    '<div class="card-body">' +
                      '<h6>' +
                          data.location_suggestions[i]["name"] +
                          ', <small>' + data.location_suggestions[i]["country_name"] + '</small>' +
                          '<button class="btn btn-info btn-sm" onclick="setmycityid(' + data.location_suggestions[i]["id"] + ', \'' + data.location_suggestions[i]["name"] + '\')">SELECT</button>' +
                          '<br>' +
                      '</h6>' +
                    '</div>' +
                  '</div>' +
                '</div>'
              );
            }
          break;
        default:
            $('#locationresults').append(
              '<div class="col-md-3 col-sm-12">' +
                '<div class="card">' +
                  '<div class="card-header">' +
                    '<h3>Sorry, therea re no results found!</h3>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          break;

      }
    },
    error: function(data){
      //console.log(data);
    }
  });
}


function setmycityid( id, cityname){
  $('#locationresults').empty();
  $('#citytitleline').replaceWith(
    '<h2 class="title" id="citytitleline">Order food online in ' + cityname + '</h2>'
  );

  $.ajax({
    type:"GET",
    url: "https://developers.zomato.com/api/v2.1/cuisines",
    data:{
      'city_id' : id
    },
    headers: {
      'user-key' : 'dfb97587d51a4a280f62c46ab46f57aa'
    },
    success: function(data){
      $('#locationresults').empty();
      $('#available-cuisines').empty();
      if (
        data.cuisines.length > 0
      ) {
        for (var i = 0; i < data.cuisines.length; i++) {
          $('#locationresults').append(
            '<div class="col-md-3 col-sm-12">' +
              '<div class="card">' +
                '<div class="card-body">' +
                  data.cuisines[i]["cuisine"]["cuisine_name"] +
                  '<br>' +
                  '<button class="btn btn-info btn-sm" onclick="setmycuisineid(' + data.cuisines[i]["cuisine"]["cuisine_id"] + ', ' + id + ')">SELECT</button>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
          $('#available-cuisines').append(
            '<option value="'+data.cuisines[i]["cuisine"]["cuisine_id"]+'">' + data.cuisines[i]["cuisine"]["cuisine_name"] + '</option>'
          );
        }
      } else {
        $('#available-cuisines').append(
          '<option disabled selected >No cuisines available!</option>'
        );
        $('#locationresults').append(
          '<div class="col-md-3 col-sm-12">' +
            '<div class="card">' +
              '<div class="card-header">' +
                '<h3>Sorry, therea re no cuisines found!</h3>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }
    },
    error: function(data){

    }
  });

}
function setmycuisineid(cuisine_id, city_id){

  $('#locationresults').empty();
  console.log(
    "City ID is " + city_id +
    " | Cuisine ID is " + cuisine_id
  );
  $.ajax({
    url: "https://developers.zomato.com/api/v2.1/search",
    type: "GET",
    data: {
      'entity_id' : city_id,
      'cuisines' : cuisine_id,
      'entity_type' : 'city'
    },
    headers: {
      'user-key' : 'dfb97587d51a4a280f62c46ab46f57aa'
    },
    success: function(data){
      //console.log(data);

      if (
        data.restaurants.length > 0
      ) {
        $('#finalresults').empty();
        for (var i = 0; i < data.restaurants.length; i++) {
          $('#finalresults').append(
            '<div class="col-md-6">' +
              '<div class="card">' +
                '<div class="row">' +
                  '<div class="col-md-4 " >' +
                    '<img class="img-thumbnail mt-2 ml-2" src="' + data.restaurants[i]["restaurant"]["thumb"] + '" class="card-img" alt="...">' +
                  '</div>' +
                  '<div class="col-md-8">' +
                    '<div class="card-body">' +
                      '<h5 class="card-title">' +
                         data.restaurants[i]["restaurant"]["name"] +
                      '</h5>' +
                      '<p class="card-text text-muted">' +
                        data.restaurants[i]["restaurant"]["cuisines"] +
                        '<br>' +
                        'Average Cost For 2 ₹' +
                        data.restaurants[i]["restaurant"]["average_cost_for_two"] +
                        '<br>' +
                        '<small>' +
                            data.restaurants[i]["restaurant"]["location"]["address"] +
                        '</small>' +
                      '</p>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="card-footer pt-2 pb-2 text-right" style="">' +
                  data.restaurants[i]["restaurant"]["timings"] +
                  '<a target="_blank" href="'+data.restaurants[i]["restaurant"]["order_url"]+'" class="btn btn-danger btn-sm pull-right">' +
                      ' Order Now <i class="fas fa-arrow-right"></i> ' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        }
      } else {
        $('#finalresults').append(
          '<div class="col-md-3 col-sm-12">' +
            '<div class="card">' +
              '<div class="card-header">' +
                '<h3>Sorry, there are no restaurants found!</h3>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }
    },
    error: function(data){
      //console.log(data);
    }
  });
}


function setdefaultresults(){
  $.ajax({
    url: "https://developers.zomato.com/api/v2.1/search",
    type: "GET",
    headers: {
      'user-key' : 'dfb97587d51a4a280f62c46ab46f57aa'
    },
    success: function(data){
      if (
        data.restaurants.length > 0
      ) {
        $('#finalresults').empty();
        for (var i = 0; i < data.restaurants.length; i++) {
          $('#finalresults').append(
            '<div class="col-md-6">' +
              '<div class="card">' +
                '<div class="row">' +
                  '<div class="col-md-4 " >' +
                    '<img class="img-thumbnail mt-2 ml-2" src="' + data.restaurants[i]["restaurant"]["thumb"] + '" class="card-img" alt="...">' +
                  '</div>' +
                  '<div class="col-md-8">' +
                    '<div class="card-body">' +
                      '<h5 class="card-title">' +
                         data.restaurants[i]["restaurant"]["name"] +
                      '</h5>' +
                      '<p class="card-text text-muted">' +
                        data.restaurants[i]["restaurant"]["cuisines"] +
                        '<br>' +
                        'Average Cost For 2 ₹' +
                        data.restaurants[i]["restaurant"]["average_cost_for_two"] +
                        '<br>' +
                        '<small>' +
                            data.restaurants[i]["restaurant"]["location"]["address"] +
                        '</small>' +
                      '</p>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="card-footer pt-2 pb-2 text-right" style="">' +
                  data.restaurants[i]["restaurant"]["timings"] +
                  '   <a target="_blank" href="'+data.restaurants[i]["restaurant"]["order_url"]+'" class="btn btn-danger btn-sm pull-right">' +
                      '   Order Now <i class="fas fa-arrow-right"></i> ' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        }
      } else {
        $('#finalresults').append(
          '<div class="col-md-3 col-sm-12">' +
            '<div class="card">' +
              '<div class="card-header">' +
                '<h3>Sorry, there are no restaurants found!</h3>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }
    },
    error: function(data){
      //console.log(data);
    }
  });
}
