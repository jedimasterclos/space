// DELETE AJAX
$(function() {
 $('.delete-link').click(function(e) {
   e.preventDefault();
   var url = $(this).attr('href');
   $.ajax({
     url: url,
     method: 'DELETE'
   }).done(function() {
     window.location.href = '/gallery';
   });
 });
});

