$(document).ready(function(){
  $('.info-panel').click(function(){
    var pwidth = $(this).width
    var pheight = $(this).height

    $(this).children('.popover').toggle();
  });
  $('.commands').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();
    var btn = $("input[type=submit][clicked=true]");
    var prop = btn.parent().data('property')
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
          $('#total_power').html(data.total_power.magnitude + ' ' + data.total_power.unit)
          for(device in data.entities){
              var content = $('#' + device).find('.popover-content');
              content.html('');
              for(attr in data.entities[device]){
                  if (attr != 'location' && attr != 'device_type'){
                      if (attr == 'power' || attr == 'voltage'){
                          content.prepend(attr + ': ' + data.entities[device][attr].magnitude + ' ' + data.entities[device][attr].unit + '</br>');
                      }
                      else{
                          content.prepend(attr + ': ' + data.entities[device][attr] + '</br>');
                      }
                  }
              }
          }
      });
  }
  setInterval(getDataFromWS, 5000)
});
