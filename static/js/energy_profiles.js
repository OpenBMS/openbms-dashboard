$(document).ready(function(){
  $('.commands').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    var btn = $(this).children('.btn-group').children('input[type=submit][clicked=true]');
    // var type = btn.parent().data('property');s
    var val = btn.val()
    var data = 'value='+val;
    $.post(url,data,
      function(response){
        // alert(response);
      }
    );
  });
  $(".commands  input[type=submit]").click(function() {
      $("input[type=submit]", $(this).parents("form")).removeAttr("clicked").removeClass('btn-primary active').addClass('btn-default');
      $(this).attr("clicked", "true").addClass('btn-primary active').removeClass('btn-default');
      $(this).parent().data('property');
  });
  $('.threshold').submit(function(event){
    event.preventDefault();
    var url = $(this).attr('action');
    // var type = btn.parent().data('property');s

    var data = $(this).serialize();

    $.post(url,data,
      function(response){
        // alert(response);
      }
    );
  });
});
