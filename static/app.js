function loadFileCss(fpath) {
		var setLink = document.createElement('link');
		setLink.setAttribute('rel','stylesheet');
		setLink.setAttribute('type','text/css');
		setLink.setAttribute('href',fpath + '');
		document.body.appendChild(setLink);
}
function sdf_FTS(_number,_decimal,_separator)
{
	var decimal=(typeof(_decimal)!='undefined')?_decimal:2;
	var separator=(typeof(_separator)!='undefined')?_separator:' ';
	var r=parseFloat(_number)
	var exp10=Math.pow(10,decimal);// приводим к правильному множителю
	r=Math.round(r*exp10)/exp10;// округляем до необходимого числа знаков после запятой
	rr=Number(r).toFixed(decimal).toString().split('.');
	r=rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1"+separator);
	return r;// возвращаем результат
}
function format_number(number)
{
	number = number.replace(/\s/g, "")*1;
	return number;
}




$(document).ready(function(){



function makeShow(){ $(this).animate({"width": "289px"}, "slow")};
function makeHide(){ $(this).animate({"width": "33px"}, "slow")};
var cartPanel=$('#cart_detail_box');
var idleTimer = null;

cartPanel.hoverIntent({
	over: makeShow,
	timeout: 500,
	out: makeHide
});

function UpdateBasketSumm(){
	var $summ = 0;
	$('table.user_cart td.item_summ').each( function(){
		$summ =$summ + format_number($(this).html());	
	})
	$('#order_summ_all').html(sdf_FTS($summ));
}

		//Добавление в корзину
		$(".add2basket").live('click', function(){
			var PID = $(this).attr('rel');
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'add2basket'},function(data){
				if (!(cartPanel.hasClass('show'))) {
				clearTimeout(idleTimer);
					cartPanel.addClass('show').animate({"width": "289px"}, "slow");
					idleTimer = setTimeout(function(){ 
						cartPanel.removeClass('show').animate({"width": "33px"}, "slow");
					}, 3000);
				}
				$(".order_detail_box[rel="+PID+"]").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });	
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });	
				  
			  });	
			return false;
		});
		  
		
		//order_set
		$("#order_set").live('click', function(){ 
			var PID = $(this).attr('rel');
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'add2basket', 'composition':true},function(data){
			  if (!(cartPanel.hasClass('show'))) {
				clearTimeout(idleTimer);
					cartPanel.addClass('show').animate({"width": "289px"}, "slow");
					idleTimer = setTimeout(function(){ 
						cartPanel.removeClass('show').animate({"width": "33px"}, "slow");
					}, 3000);
				}
				
				$("#ord-btn").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });	
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });					  
			  });	
			return false;
		});		
		
		
		$(".deleteBasketItem").live('click', function(){
			var PID = $(this).attr('rel');
			var composition = $(this).hasClass('composition');
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'delete', 'composition':composition},function(data){

				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });				  
			  
			  if(composition)
				$("#ord-btn").html(data);
			  else
				$(".order_detail_box[rel="+PID+"]").html(data);
				
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });					  
			  });	
			return false;		
		});

		$(".prev").live('click', function(){
			var PID = $(this).attr('rel');
			var quant = parseInt($(".num[rel="+PID+"]").val());
			var composition = $(this).hasClass('composition');
			if(quant > 0)
				quant--;
			$(".num[rel="+PID+"]").val(quant)
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'update', 'quantity':quant},function(data){
			  if(composition)
				$("#ord-btn").html(data);
			  else
				$(".order_detail_box[rel="+PID+"]").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });			
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });					  
			  });

			if ($(this).is('.basket')){				
				$(".item_summ[rel="+PID+"]").html(sdf_FTS($(".item_price[rel="+PID+"]").attr('data')*quant));
				UpdateBasketSumm();
			}
			return false;
		});	
		
		$(".next").live('click', function(){
			var PID = $(this).attr('rel');
			var quant = parseInt($(".num[rel="+PID+"]").val());
			var composition = $(this).hasClass('composition');
			quant++;
			$(".num[rel="+PID+"]").val(quant)
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'update', 'quantity':quant},function(data){
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });				  
			  if(composition)
				$("#ord-btn").html(data);
			  else
				$(".order_detail_box[rel="+PID+"]").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });					
			  });
			if ($(this).is('.basket')){				
				$(".item_summ[rel="+PID+"]").html(sdf_FTS($(".item_price[rel="+PID+"]").attr('data')*quant));
				UpdateBasketSumm();
			}			  
			return false;
		});	
		
		$(".user_cart input.num").change(function(){
			
			var PID = $(this).attr('rel');
			var quant = parseInt($(this).val());
			var composition = $(this).hasClass('composition');
			if(isNaN(quant)){
				quant=0;
				$(this).val('');
			}else{
				$(this).val(quant)
			}
			
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'update', 'quantity':quant},function(data){
			  if(composition)
				$("#ord-btn").html(data);
			  else
				$(".order_detail_box[rel="+PID+"]").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });			
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });					  
			  });
				$(".item_summ[rel="+PID+"]").html(sdf_FTS($(".item_price[rel="+PID+"]").attr('data')*quant));
				UpdateBasketSumm();

			return false;
		});
		
		$(".order_detail_box input.num").live('change', function(){
			
			var PID = $(this).attr('rel');
			var quant = parseInt($(this).val());
			var composition = $(this).hasClass('composition');
			if(isNaN(quant)){
				quant=0;
				$(this).val('');
			}else{
				$(this).val(quant)
			}
			
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'update', 'quantity':quant},function(data){
			  if(composition)
				$("#ord-btn").html(data);
			  else
				$(".order_detail_box[rel="+PID+"]").html(data);
				  $.post("/include/cart.php",{},function(data2){
					$("#cart_detail_box .content").html(data2);
				  });			
				  $.post("/include/link2basket.php",{},function(data2){
					$("#linktobasket").html(data2);
				  });					  
			  });

			return false;
		});
		
		
		$('#map_shops .item').mouseenter(function(){
			$(this).find('.tooltip').show();
		});
		$('#map_shops .item').mouseleave(function(){
			$(this).find('.tooltip').hide();
		});
		
		function tabClick(tab_id) {
		if (tab_id != $('#tabs a.active').attr('id') ) {
			$('#tabs .tabs').removeClass('active');
			$('#tabs > ul li').removeClass('active');
			$('#'+tab_id).addClass('active').parent().addClass('active');
			$('#con_' + tab_id).addClass('active');
		}    
		}
		$('#tabs > ul li').click(function() {
			var tab_id=$(this).find('a').attr('id');
			tabClick(tab_id);
			return false;
		});
		
		$('#tabs .remove').click(function(){
			$(this).parent().css({"display":"none"});
			return false;
		});
		
		$('#news_list .item button').click(function(){
			window.location=$(this).closest("a").attr("href");
			return false;
		});
		
		
	$(".link-close").click(function () {
      $(".close_block").toggle();
	  $(this).toggleClass("link-open");
	  	if ($(".close_block").is(":visible")) {
            $(".link-close span").text('Скрыть');
        } else {
            $(".link-close span").text('Подробнее');
        }
    });
		
		
		
		
});

		
//  new js 2012-11-26   

/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);


$(document).ready(function(){

		// ссылка подробнее
		$("#product_descr_box .show").click(function(){
		$(this).nextAll('div.full').addClass('open');
		$(this).addClass('close');
		return false;
		});
		
		$("#product_descr_box .hide").click(function(){
			$(this).parent().removeClass('open').prev('div.show').removeClass('close');
			return false;
		});
		
		/*
		
		// выезжающая панель 
		$('#cart_detail_box').mouseenter(function(){ 
			var self = $(this);
			function foo() {
				self.stop(true,true).animate({"width": "+=256px"}, "slow");
			}
			var id = setTimeout(foo, 400);
		}).mouseleave(function(){
			var self = $(this);
			function foo() {
				self.stop(true,true).animate({"width": "-=256px"}, "slow");
			}
			var id = setTimeout(foo, 400);
		});
*/

/*
		function makeShow(){ $(this).animate({"width": "+=256px"}, "slow")};
		function makeHide(){ $(this).animate({"width": "-=256px"}, "slow")};
		$('#cart_detail_box').hoverIntent({
			over: makeShow, // function = onMouseOver callback (REQUIRED)    
			timeout: 500, // number = milliseconds delay before onMouseOut    
			out: makeHide // function = onMouseOut callback (REQUIRED)
		});
*/

		
		// вкладки 
		function tabClick(tab_id) {
			if (tab_id != $('#tabs input.active').attr('id') ) {
				$('#tabs .tabs').removeClass('active');
				$('#tabs fieldset').removeClass('active');
				$('#tabs > .menu_tabs fieldset input').removeClass('active').attr('checked', false);
				$('#'+tab_id).addClass('active').attr('checked', 'checked').parent().addClass('active');
				$('#con_' + tab_id).addClass('active');
				$('#tb_' + tab_id).addClass('active');
			}    
		}
		$('#tabs > .menu_tabs fieldset').click(function() {
			var tab_id=$(this).find('input').attr('id');
			tabClick(tab_id);
			return false;
		});
		
		/* new 17/01/13 */
		$('#tb_0').addClass('active');
		/*$('#tabs fieldset').attr('rel','tb0').addClass('active');*/
		/*
		$('#tabs fieldset').attr('rel','tb0').click(function() {
			$('#tabs fieldset').attr('rel','tb0').addClass('active');
			$('#tabs fieldset').attr('rel','tb1').removeClass('active');
			return false;
		});
		
		$('#tabs fieldset').attr('rel','tb1').click(function() {
			$('#tabs fieldset').attr('rel','tb1').addClass('active');
			$('#tabs fieldset').attr('rel','tb0').removeClass('active');
			return false;
		});
		*/
		/* end new 17/01/13 */
		
		$(".culc").live('click', function(){ 
			location.reload();
			return false;
		});
		

		
		
		// корзина 
		$('.user_cart .close').live('click', function(){
		if (confirm("Вы уверены, что хотите удалить этот товар из корзины?")) {
			// Удаляем товар 
			$(this).closest('tr').remove();
			var PID = $(this).attr('rel');
			  $.post("/include/add2basket.php",{'PID':PID, 'action':'delete', 'redirect':true},function(data){
				$("#cart-reload").html(data);
				  $.post("/include/basket-big.php",{},function(data2){
					$("#basket-big").html(data2);
				  });					
			  });			
			
		}
			return false;		 
		});
		
		$('.user_cart .clean').click(function(){
			if (confirm("Вы уверены, что хотите очистить корзинy?")) {
			  $.post("/include/add2basket.php",{'action':'deleteAll'},function(data){
				  $.post("/include/basket-big.php",{},function(data2){
					$("#basket-big").html(data2);
					location.reload();
				  });					
			  });				
			return false;
				return true;
			} else {
				return false;
			}
		});
		
// end new js		
		
		$(".make_up_order").click(function(){
			$("#sbmt").click();
			return false;
		});
		
		
		
		// Happy New Year
		var my_width = $(window).width();
		if (my_width > 1380){
			$(".right_ny").show();
			$(".right_sn").show();
		} else {
			$(".right_ny").hide();
			$(".right_sn").hide();
		}
		
		$( window ).resize(function() {
		var my_width = $(window).width();
		if (my_width > 1380){
			$(".right_ny").show();
			$(".right_sn").show();
		} else {
			$(".right_ny").hide();
			$(".right_sn").hide();
		}
	});
		
		
	$('.detail_popup_link').bind('click', function(){
		$(this).closest('.detail_popup').find('.detail_popup_text').slideToggle();
		return false;
	});	
	
	var allChekers = $('.materials .checker');
	$('.materials .checker ins').bind('click', function(){
		allChekers.removeClass('checked');
		$(this).parent().addClass('checked');
	});	
});