$(document).ready(function(){
  var popoverPos = {
    "battery-lamp-plug": "left",
    "battery-plug": "bottom",
    "fan-plug": "left",
    "fan-arduino": "top",
    "lamp-plug": "right",
    "battery-arduino": "left"
  };
  $(".info-panel").each(function(){
    var id = $(this).attr("id");
    $(this).children(".popover").removeClass().addClass("popover fade in " + popoverPos[id]);
  });
  $('.info-panel').click(function(event){
    if (event.target === this){
      var pwidth = $(this).width
      var pheight = $(this).height

      $('.popover').toggle();
    }
  });

  $('.commands').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();
    var btn = $(this).find("input[type=submit][clicked=true]");
    var prop = btn.parent().data('property');
    var val = btn.val()
    data += '&value='+val;
    data += '&property='+prop;
    $.post(url,data,
      function(response){
        // alert(response);
      }
    );
  });
  $("form input[type=submit]").click(function() {
      $("input[type=submit]", $(this).parents("form")).removeAttr("clicked").removeClass('btn-primary active');
      $(this).attr("clicked", "true").addClass('btn-primary active');
      $(this).parent().data('property');
  });

  function getDataFromWS() {
      $.get( "dashboard_data", function( data ) {
          var disruption = data.disruption == false ? 'Normal' : 'Loss of Generation';
          $('#status').html(disruption);
          $('#total_power').html(data.total_power.magnitude.toFixed(2) + ' ' + data.total_power.unit)
          $('#price').html(data.price.toFixed(1) + ' ¢/kWh');
          var priceClass = 'panel panel-info';
          if(data.price > data.thresholds.low){
            priceClass = 'panel panel-warning';
          }
          if(data.price > data.thresholds.high ){
            priceClass = 'panel panel-success';
          }
          $('#thresholds').removeClass().addClass(priceClass);
          for(device in data.entities){
              devData = data.entities[device];
              var content = $('#' + devData['location']).find('.popover-content');
              content.html('');
              for(attr in devData){
                  if (attr != 'location' && attr != 'device_type'){
                      if(attr == 'speed' ){
                          $('#' + devData['location']).find('[data-property="speed"]').children().removeClass('btn-primary active').removeAttr('clicked');
                          $('#' + devData['location']).find('[data-property="speed"]').children('[value=' + capitalizeFirstLetter(devData[attr]) +']')
                              .addClass('btn-primary active').attr('clicked', 'true');
                      }
                      else if(attr == 'status'){
                          $('#' + devData['location']).find('[data-property="status"]').children().removeClass('btn-primary active').removeAttr('clicked');
                          $('#' + devData['location']).find('[data-property="status"]').children('[value=' + capitalizeFirstLetter(devData[attr]) +']')
                              .addClass('btn-primary active').attr('clicked', 'true');
                      }
                      else if (attr == 'power' || attr == 'voltage'){
                          content.prepend(capitalizeFirstLetter(attr) + ': ' + devData[attr].magnitude.toFixed(2) + ' ' + devData[attr].unit + '</br>');
                      }
                      else{
                          content.prepend(capitalizeFirstLetter(attr) + ': ' + devData[attr] + '</br>');
                      }
                  }
              }
          }
      });
  }
  setInterval(getDataFromWS, 2000);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
