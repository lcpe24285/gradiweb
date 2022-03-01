var apiGW = "https://graditest-store.myshopify.com/products/free-trainer-3-mmw.js";
var variants;

(function() {
  $.getJSON( apiGW, {
    tags: "product",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      $('#title').html(data.title);
      var by = $('.producto-marca').html();
      $('.producto-marca').html(by+' '+data.vendor);
      $('.producto-nombre').html(data.title);
      $('.producto-precioventa').data('price',data.price).attr('data-price',data.price).html('$ '+data.price);
      $('#totalPrice').html('$ '+data.price);
      $('.producto-preciocomparacion').html('$ '+data.compare_at_price);

      $('.producto-descripcion').html(data.description);

      var widthThum = 100/data.media.length;
      $.each( data.media, function( i, item ) {
        var classCarousel = 'carousel-item';
        var selector = '';
        if (i == 0){
          classCarousel += ' active';
          selector = 'selected';
        }
        var itemCarousel = $( "<div>" ).addClass(classCarousel).appendTo( "#images" );
        $( "<img>" ).attr( "src", item.src ).appendTo( itemCarousel );

        var itemList = $( "<li>" ).css( "width", widthThum+'%' ).addClass("list-inline-item"+classCarousel).appendTo( "#carouselList" );
        var linkImg = $( "<a>" ).attr( "id", 'carousel-selector-'+i ).addClass(selector).appendTo( itemList );
        $( "<img>" ).attr( "src", item.src ).attr( "data-slide-to", i ).attr( "data-target", '#custCarousel' ).appendTo( linkImg );
      });

      variants = data.variants;
       
      $.each( data.options, function( i, item ) { //producto-variantes
        var conte = $( "<div>" ).addClass('row pl-4').appendTo( ".producto-variantes" );
        $( "<div>" ).addClass('col producto-varianteName ').html(item.name+":").appendTo( conte );
        var padre = $( "<div>" ).addClass('row d-flex producto-varianteValues-'+item.name).appendTo( conte );
        
        $.each(item.values, function( i, value ) { //producto-variantes
          var sele='';
          if (i==0)
            sele=' selected';
          var contorno = $( "<div>" ).attr("data-value", value).attr("data-variante", item.name).addClass('producto-varianteName producto-variantecontorno-'+item.name+sele).appendTo( padre);
          
          if(item.name==='Color')
            $( "<div>" ).data("value", value).addClass('producto-variante '+item.name).css('background-color',value).appendTo( contorno );
          else
            $( "<div>" ).data("value", value).attr("data-value", value).addClass('producto-variante '+item.name).text(value).appendTo( contorno );
        });

        $( "<div>" ).addClass('separador').appendTo( ".producto-variantes" );
        
      });
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = "Ha ocurrido un error..." + textStatus+", " + error;
      console.log( err );
    })
    .always(function() {
      console.log( "complete" );
    });
})();

$( document ).ready(function() {
    $("input[type='number']").inputSpinner();

    $( ".producto-addfavorito" ).on( "click", function() { 
      var info = $('.text-favorito').html();
      $( ".text-favorito" ).removeClass('d-none');
      $( ".text-favorito" ).addClass('d-flex');
      var div = $( ".text-favorito" );
      if (window.matchMedia('(max-width: 600px)').matches)
      {
         div.animate({fontSize: '0.9em'}, "slow");
      }else{
        div.animate({fontSize: '1.3em'}, "slow");
      }
      

    });

    $( ".producto-variantes" ).on( "click",".producto-variante", function() {
      var padre= $(this).parent().attr('class'); 
      padre = padre.replace(" ", ".");
      
      $('.'+padre).removeClass('selected');
      $(this).parent().addClass('selected');

      var variant1 =$( ".producto-variantecontorno-Color.selected .producto-variante" ).data('value');
      var variant2 =$( ".producto-variantecontorno-Size.selected .producto-variante" ).data('value');  

      $.each( variants, function( i, item ) { 
        $.each( item.options, function( i, valore ) { 
          if(item.options[i+1] && ((variant1 == valore && variant2==item.options[i+1]) || (variant2 == valore && variant1==item.options[i+1]) ) ){
            $('.producto-precioventa').data('price',item.price).attr('data-price',item.price).html('$ '+item.price);
            $('.producto-preciocomparacion').html('$ '+item.compare_at_price);

            var $inputLoop = $(".producto-cantidad .form-control").val()
            
            $('#totalPrice').html('$ '+item.price*$inputLoop);
          }
        });
      });
    });


    var $changedInput = $("#changedInput")

    $changedInput.on("change", function (event) {
        var countAdd = $(event.target).val()
        var price = $('.producto-precioventa').data('price');
         $('#totalPrice').html('$ '+price*countAdd);
    });

    $( ".producto-addcart " ).on( "click", function() { 
      var $inputLoop = $(".producto-cantidad .form-control").val()
      var price = $('.producto-precioventa').data('price');
      $('#cantidad').text($inputLoop);
      $('.modal-body #totalPrice').html('$ '+price*$inputLoop);

      var divs = $('.producto-varianteName.selected'); 
      $( ".variantes" ).text('');
      $.each( divs, function( i, item ) { 
        $( "<div>" ).addClass('col').text($(this).data('variante')+': '+$(this).data('value')).appendTo( ".variantes" );
      });
    });
});