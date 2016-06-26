( function( $ ) {

$.fn.jacksSlider = function() {
    
	// Setup
	var	slider = {};
	var currentSlide = 0;
	var nextSlide = 0;
	var numOfImages;
	var numOfText;

	slider.controls = {};
	slider.pager = {};
	slider.images = [];
	slider.text = [];

	// Get control buttons
	slider.controls.next = this.find(".next");
	slider.controls.prev = this.find(".previous");

	// Get pager elements
	slider.pager.current = this.find(".cNum");
	slider.pager.total = this.find(".tNum");

	$(slider.pager.current).text(nextSlide+1);


	// Put all images into an array
	this.find(".slider").children().each(function() {
		slider.images.push(this);
	});

	numOfImages = $(slider.images).size();


	// Load up text slide array
	this.find(".text-slider").find(".text").each(function() {
		slider.text.push(this);
	});

	numOfText = $(slider.text).size();


	// Set pager total
	$(slider.pager.total).text(numOfImages);

	// Set up first slides to show
	$(slider.text).first().show();
	$(slider.images).first().show();


	// Setup click functions to bind
	var clickNextBind = function(e) {
		goToSlide("next");
		//alert(numOfImages);
	}

	var clickPrevBind = function(e) {
		goToSlide("prev");
		//alert(numOfImages);
	}


	// Bind the click events to the controls
	slider.controls.next.bind("click", clickNextBind);
	slider.controls.prev.bind("click", clickPrevBind);


	// Main function!
	function goToSlide(direction) {

		var d = direction;

		if(d == "next") {

			if(currentSlide >= numOfImages - 1) {
				nextSlide = 0;
			} else {
				nextSlide = currentSlide + 1;
			}

			$(slider.text[nextSlide])
				.stop()
				.show()
				.css("left", "+100%")
				.animate({'left':'0'});

			$(slider.text[currentSlide])
				.stop()
				.animate({'left': "-100%"}, function() {
					$(this).css({"left":"auto", "right":"auto", "display":"none"});
				});

		} else if(d == "prev") {

			if(currentSlide == 0) {
				nextSlide = numOfImages - 1;
			} else {
				nextSlide = currentSlide - 1;
			}

			$(slider.text[nextSlide])
				.stop()
				.show()
				.css("left", "-100%")
				.animate({'left':'0'});

			$(slider.text[currentSlide])
				.stop()
				.animate({'left': "+100%"}, function() {
					$(this).css({"right":"auto", "left":"auto", "display":"none"});
				});

		}

		// Animate the slides
		$(slider.images[currentSlide]).delay(200).fadeOut();
		$(slider.images[nextSlide]).fadeIn();

		

		// Change pager
		$(slider.pager.current).text(nextSlide+1);

		currentSlide = nextSlide;

	}


    return this;

} // End jacksSlider


} )( jQuery );









// Other JS

( function( $ ) {

// JS for Main Menu
$("header .menu, #open-menu .close").click(function() {
	$("#open-menu").fadeToggle();
});

$("#explore-lanique").click(function() {
    $('html, body').animate({
        scrollTop: $("#instagram-feed").offset().top
    }, 1000);
});

$(".readmore-history").click(function() {
	window.location = "/history";
});

// JS for Where To Buy Desktop
$(".wtb-map-images img").click(function() {
	var region = $(this).attr("data-region");

	$(".wtb-map-images img").removeClass("active");
	$(this).addClass("active");

	var infoClass = ".wtb-info." + region;

	console.log(infoClass);

	$(".wtb-info").slideUp();

	$(infoClass).delay(400).slideDown();
});


// JS for Home History bg image if screen width is < or = to 568px
if($(document).width() <= 568 ) {

	$("#history div").css("background-size", parseInt($(document).width()));

}





} )( jQuery );









( function( $ ) {

$.fn.jacksSliderMobile = function() {

	// Setup
	var	slider = {};
	var currentSlide = 0;
	var nextSlide = 0;
	var numOfSlides = 0;

	slider.controls = [];
	slider.slides = [];
	slider.text = [];
	slider.nav = {};

	var mainElement = this;

	// Put all images into an array
	this.find(".slide").each(function() {
		slider.slides.push(this);
	});

	numOfSlides = $(slider.slides).size();

	// Set up first slides to show
	$(slider.slides).first().show();

	// Get control buttons
	slider.nav = this.find("nav");

	for(var i = 1; i <= numOfSlides; ++i) {
		slider.nav.append("<button id='" + i + "'></button>");
	}

	//console.log("num of slides " + numOfSlides);

	// Make first nav button active

	slider.nav.children().first().addClass("active");

	// Set Height of slider

	var findHeight = [];
	var maxHeight;

	for (var i = 0; i < numOfSlides; i++) {
		findHeight.push($(slider.slides[i]).outerHeight());

		maxHeight = Math.max.apply(null, findHeight);

	}

	var mSlideHeight = parseInt(maxHeight);

	this.find(".inner-wrapper").css("height", mSlideHeight);

	this.css("height", parseInt(mSlideHeight) + 40 + "px");

	// console.log("1st" + mSlideHeight);

	// Setup click functions to bind
	$(slider.nav).children().each(function() {
		$(this).click(function() {
			var id = $(this).attr('id')
			goToSlide(id-1, null);
		});
	});

	// Set up swipe events
	//$(this).on( "swipeleft", goToSlide(currentSlide+1) );
	//$(this).on( "swiperight", goToSlide(currentSlide-1) );


	$(this).append(

		"<div class='left' style='height:" + (mSlideHeight - 23) + "px'></div>" +
		"<div class='right' style='height:" + (mSlideHeight - 23) + "px'></div>"

	);

	$(this).find(".left").click(function() {
		goToSlide(null, "left");
	});;

	$(this).find(".right").click(function() {
		goToSlide(null, "right");
	});;

	// Main function!
	function goToSlide(index, side) {

		var d;

		if(!index) {
			if(currentSlide == numOfSlides-1 && side == "right") {
				index = 0;
			} else if(currentSlide == 0 && side == "left") {
				index = numOfSlides - 1;
			} else {
				switch(side) {
					case "right":
						index = currentSlide+1;
						break;
					case "left":
						index = currentSlide-1;
						break;
				}
			}
		}

		slider.nav.children().removeClass("active");
		slider.nav.children().eq(index).addClass("active");

		if(index > currentSlide && index <= numOfSlides) {
			d = "next";
		} else if(index < currentSlide && index >= 0) {
			d = "prev";
		}

		nextSlide = index;


		// console.log("d = " + d);

		if(d == "next") {

			$(slider.slides[nextSlide])
				.stop()
				.show()
				.css("left", "+100%")
				.animate({'left':'0'});

			$(slider.slides[currentSlide])
				.stop()
				.animate({'left': "-100%"}, function() {
					$(this).css({"left":"auto", "right":"auto", "display":"none"});
				});

		} else if(d == "prev") {

			$(slider.slides[nextSlide])
				.stop()
				.show()
				.css("left", "-100%")
				.animate({'left':'0'});

			$(slider.slides[currentSlide])
				.stop()
				.animate({'left': "+100%"}, function() {
					$(this).css({"right":"auto", "left":"auto", "display":"none"});
				});

		}

		

		// Change pager
		//$(slider.pager.current).text(nextSlide+1);

		currentSlide = nextSlide;


	}


    return this;

} // End jacksSliderMobile


} )( jQuery );


