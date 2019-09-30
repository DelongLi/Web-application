//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>

function getloc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      // 获取成功
      latitude = String(position.coords.latitude);
      longitude = String(position.coords.longitude);
      console.debug(position);

      // $.ajax({
      //   type: 'GET',
      //   url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAo8vjYh47C7PAAixWhUNUA5v6vYON_UoI&latlng="+latitude+","+longitude+"&sensor=true",
      //   success: function (result) {
      //     street = result.results[0].address_components[0].short_name + " " + result.results[0].address_components[1].short_name;
      //     city = result.results[0].address_components[2].short_name;
      //     console.debug(result);
      //     document.getElementById("location").innerText = result.results[0].address_components[1].long_name+", "+result.results[0].address_components[3].short_name;
      //   },
      //   error: function (msg) {
      //     window.alert(msg);
      //   }
      // });
      $.get("https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=405aedac1b82d1ee20b4d0b217ac3079", function(data){
        console.log(data);
        document.getElementById("temperature").innerText = Math.round(data.main.temp - 273.15);
        document.getElementById("weather").innerText = data.weather[0].description;
        document.getElementById("location").innerText = data.name+", "+data.sys.country;
      })
    }, function (err) {
      // 获取失败
      window.alert(err);
    });
  } else {
    window.alert('不支持获取GPS地理位置');
  }

}
getloc();