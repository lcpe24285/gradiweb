/* Se utiliza el endpoint solicitado para la obtencion de informacion del producto*/
var apiGW = "https://graditest-store.myshopify.com/products/free-trainer-3-mmw.js";
var variants;
(function() {
  /*carga datos codificados en JSON desde el servidor mediante una solicitud GET HTTP*/
  $.getJSON( apiGW, {
    tags: "product",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      /*Cargar dinamica de la informacion del producto */
      $('#title').html(data.title);
      var by = $('.producto-marca').html();
      $('.producto-marca').html(by+' '+data.vendor);
      $('.producto-nombre').html(data.title);
      $('.producto-precioventa').data('price',data.price).attr('data-price',data.price).html('$ '+data.price);
      $('#totalPrice').html('$ '+data.price);
      $('.producto-preciocomparacion').html('$ '+data.compare_at_price);

      $('.producto-descripcion').html(data.description);

      /*calculo del ancho de los Thumbnails*/
      var widthThum = 100/data.media.length;
      $.each( data.media, function( i, item ) {
        /*creacion dinamica de las imagenes de carousel*/
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

      /*almacenamiento de las variante en variable global para el uso posterior de las mismas*/
      variants = data.variants; 
       
      /*Creacion dinamica de las variantes presentadas en las opciones del producto*/
      $.each( data.options, function( i, item ) { //producto-variantes
        var conte = $( "<div>" ).addClass('row pl-4').appendTo( ".producto-variantes" );
        $( "<div>" ).addClass('col producto-varianteName ').html(item.name+":").appendTo( conte );
        var padre = $( "<div>" ).addClass('row d-flex producto-varianteValues-'+item.name).appendTo( conte );
        
        $.each(item.values, function( i, value ) { //producto-variantes
          var sele='';
          if (i==0)
            sele=' selected';
          var contorno = $( "<div>" ).attr("data-value", value).attr("data-variante", item.name).addClass('producto-varianteName producto-variantecontorno-'+item.name+sele).appendTo( padre);
          
          /*presentacion visual de variantes para color*/
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
    /*Inicializacion de input numerico para cantidad de productos, 
    con minimo de 1 y max de 10*/
    $("input[type='number']").inputSpinner();

    /*Animacion al agregar producto a favoritos*/
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

    /*Seleccion de variantes en cualquiera de sus combinaciones*/
    $( ".producto-variantes" ).on( "click",".producto-variante", function() {
      var padre= $(this).parent().attr('class'); 
      padre = padre.replace(" ", ".");
      
      $('.'+padre).removeClass('selected');
      $(this).parent().addClass('selected');

      var variant1 =$(".producto-variantecontorno-Color.selected .producto-variante" ).data('value');
      var variant2 =$(".producto-variantecontorno-Size.selected .producto-variante" ).data('value');  

      $.each( variants, function( i, item ) { 
        $.each( item.options, function( i, valore ) { 
          if(item.options[i+1] && ((variant1 == valore && variant2==item.options[i+1]) || (variant2 == valore && variant1==item.options[i+1]) ) ){
            $('.producto-precioventa').data('price',item.price).attr('data-price',item.price).html('$ '+item.price);
            $('.producto-preciocomparacion').html('$ '+item.compare_at_price);

            var $inputLoop = $(".producto-cantidad .form-control").val()
            
            /*Calculo de total a pagar*/
            $('#totalPrice').html('$ '+item.price*$inputLoop);
          }
        });
      });
    });

    /*Evento al cambiar la cantidad de articulos, re-calcula total a pagar*/
    var $changedInput = $("#changedInput")
    $changedInput.on("change", function (event) {
        var countAdd = $(event.target).val()
        var price = $('.producto-precioventa').data('price');
         $('#totalPrice').html('$ '+price*countAdd);
    });

    /*Modal para semejar el carrito de compras de un ecommerce
    * se muestra dinamicamente: 1)el nombre
    * 2) variables seleccionadas
    * 3) costo del articulo
    * 4) cantidad seleccionada
    * 5) total a pagar por ese articulo
    */
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