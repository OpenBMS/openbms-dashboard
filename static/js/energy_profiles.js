$(document).ready(function(){
  $('.commands').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    var val = $("input[type=submit][clicked=true]").val()
    var data = 'value='+val;
    $.post(url,data,
      function(response){
        alert(response);
      }
    );
  });
  $("form input[type=submit]").click(function() {
      $("input[type=submit]", $(this).parents("form")).removeAttr("clicked").removeClass('btn-primary active').addClass('btn-default');
      $(this).attr("clicked", "true").addClass('btn-primary active').removeClass('btn-default');
      $(this).parent().data('property');
  });
});
