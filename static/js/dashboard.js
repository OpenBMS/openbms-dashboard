$(document).ready(function(){
  $('.info-panel').click(function(){
    $(this).children('.popover').toggle();
  });
  $('.commands').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();
    var val = $("input[type=submit][clicked=true]").val()
    data += '&value='+val;
    data += '&property=switch';
    $.post(url,data,
      function(response){
        alert(response);
      }
    );
  });
  $("form input[type=submit]").click(function() {
      $("input[type=submit]", $(this).parents("form")).removeAttr("clicked").removeClass('btn-primary active');
      $(this).attr("clicked", "true").addClass('btn-primary active');
      $(this).parent().data('property');
  });
});
