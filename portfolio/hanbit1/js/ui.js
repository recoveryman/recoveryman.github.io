/* ----------------------------------------------
 * HanbitSoft Infra Development Team
 * 알트리아1차티저 UI Script
 * Author - juy89@hanbitsoft.co.kr 180517
 ------------------------------------------------- */

(function($){

	var $opLoader = {
			backgroundColor:	"#000",
			backgroundRepeat:	"repeat",
			progressShow:		true,
			progressColor: 		"#fff",
			progressHeight: 	"10px",
			progressPosition:	"bottom",
			percentShow:		true,
			percentFontFamily:	"Verdana, Geneva, sans-serif",
			percentFontSize:	"50px",	
			animationComplete: 	"fade",
			minimumTime:		.5,
			onStart:			function(){},
			onComplete:			function(){}
		};
	
	var CONTAINER;
	var _urlImages 	= [];
	var startTime;
	var finishTime;
	var hiddenContainer;
	var imageCount = 0;
	var imageCalc  = 0;
	var divOverlay;
	var divBarProgress;
	var divPercentProgress;
	var divLogoImage;
							
	$.fn.teaserLoder = function( options ){
		CONTAINER = this;
		if( options ) $.extend( $opLoader, options );	
		
		this.find("*").each( function(){
			selectImages( this );
		});
		
		createLoader();

		return this;
	}
	
	var selectImages = function( element ){
		var url = "";

        if( $( element ).css( "background-image" ) != "none" ) {var url = $( element ).css( "background-image" ).replace( "url(", "" ).replace( ")", "" ).slice(0, -1).substring(1);
        }
		else if( typeof ( $( element ).attr( "src" ) ) != "undefined" && element.nodeName.toLowerCase() == "img" ) {var url = $( element ).attr( "src" );
		}
		if( url != "" ){
			 _urlImages.push( url );
		}
	}
	
	var createLoader = function(){
		var date = new Date();
		startTime = date.getTime();
		
		if( _urlImages != "" ){
			 createElementsPreLoader();
			 createContainer();
			 
			 $opLoader.onStart();
		}else{
			 $opLoader.onComplete();
		}
	}

	var createElementsPreLoader = function(){
		CONTAINER.css({ overflow: "hidden" });
		
		divOverlay = $( "<div id=\"preloader-overlay\"></div>" )
		.appendTo( CONTAINER )
		.css({
			width: CONTAINER.width(),
			height: CONTAINER.height(),
			backgroundColor: $opLoader.backgroundColor,
			backgroundImage: "url(" + $opLoader.backgroundImage + ")",
			backgroundRepeat: $opLoader.backgroundRepeat,
			backgroundPosition: "fixed",
			position: "fixed",
			zIndex: 999999,
			top: /*CONTAINER.offset().top*/0,
			left: CONTAINER.offset().left						 
		});
		
		if( $opLoader.progressShow ){
			divBarProgress = $( "<div id=\"preloader-bar-progress\"></div>" )
			.appendTo( divOverlay )
			.css({
				width: "0%",
				height: $opLoader.progressHeight,
				backgroundColor: $opLoader.progressColor,
				position: "absolute",
				left: 0
			});
							  
			switch( $opLoader.progressPosition ){
				case "top":
						divBarProgress.css({ top: 0, marginTop: 0 });
					break;
				case "center":
						divBarProgress.css({ top: "50%", marginTop: "-" + ( parseFloat($opLoader.progressHeight) / 2 ) + "px" });
					break;
				case "bottom":
						divBarProgress.css({ bottom: 0, marginBottom: 0 });
					break;
			}
		}
						  
		if( $opLoader.percentShow ){
			divPercentProgress = $( "<div id=\"preloader-percent-progress\"></div>" )
			.appendTo( divOverlay )
			.css({
				width: "200px",
				height: $opLoader.percentFontSize,
				position: "absolute",
				top: "50%",
				left: "50%",
				marginTop: ( parseFloat($opLoader.progressHeight) / 2 ) + 15 + "px",
				marginLeft: "-100px",
				fontFamily: "Verdana, Geneva, sans-serif",
				fontSize: $opLoader.percentFontSize,
				fontWeight: "bold",
				color: $opLoader.progressColor,
				textAlign: "center",
				lineHeight: $opLoader.percentFontSize
			})
			.html("0%"); 
		}
		
		if( $opLoader.logoImage != "" ){
			divLogoImage = $( "<div id=\"preloader-logo-image\"></div>" )
			.appendTo( divOverlay )
			.css({
				width: "100%",
				height: "100%", 
				position: "absolute",
				bottom: "50%",
				left: "0",
				marginBottom: ( parseFloat($opLoader.progressHeight) / 2 ) + 20 + "px",
				backgroundImage: "url(" + $opLoader.logoImage + ")",
				backgroundPosition: "center bottom",
				backgroundRepeat: "no-repeat"
			});
		}
	}
	
	var createContainer = function(){
		hiddenContainer = $( "<div></div>" ).appendTo( CONTAINER )
	  	.css({
			display: "none",
			overflow: "hidden",
			width: 0,
			height: 0
		});
		
		for( var i = 0; i < _urlImages.length; i++ ){
			var image = new Image();

			$( image ).one({
				load: function(){
					timePercent();	
				},
				error: function(){
					timePercent();
				}
			})
			.attr( "src", _urlImages[i] )
			.appendTo( hiddenContainer );			
		}
	}
	
	var timePercent = function(){
		imageCount++;
		var percent = ( imageCount / _urlImages.length ) * 100 ;
		
		if( $opLoader.progressShow ){
			divBarProgress.stop().animate({
				width: percent + "%",
				minWidth: percent + "%",
			}, 400);
		}
									  
		if( $opLoader.percentShow ) divPercentProgress.text( Math.ceil( percent ) + "%" );
		if( imageCount == _urlImages.length ) destroyLoader();
	}
	
	var destroyLoader = function(){
		hiddenContainer.remove();
		animateOutPreLoader();
	}
	
	var animateOutPreLoader = function(){
		finishTime = $opLoader.minimumTime * 1000;
		
		var date = new Date();
		
		if( ( date.getTime() - startTime ) < finishTime ) finishTime = ( finishTime - ( date.getTime() - startTime ) );

		switch( $opLoader.animationComplete ){
			case "fade":
				divOverlay.delay( finishTime )
				.fadeOut( 500, function(){ 					
					functionOutPreLoader();
				 } );
				break;
			case "hide":
				divOverlay.delay( finishTime )
				.hide( 0, function(){			
					functionOutPreLoader();
				 });
				break;
			case "slideUp":
				divOverlay.delay( finishTime )
				.css( { position: "absolute" } )
				.animate( { top: "-=100%" }, 500, function(){					
					functionOutPreLoader();
				 } );
				break;
			case "slideDown":
				divOverlay.delay( finishTime )
				.css( { position: "absolute" } )
				.animate( { top: "+=100%" }, 500, function(){									
					functionOutPreLoader();
				 } );
				break;
			case "slideLeft":
				divOverlay.delay( finishTime )
				.css( { position: "absolute" } )
				.animate( { left: "-=100%" }, 500, function(){
					functionOutPreLoader();
				 } );
				break;
			case "slideRight":
				divOverlay.delay( finishTime )
				.css( { position: "absolute" } )
				.animate( { left: "+=100%" }, 500, function(){					
					functionOutPreLoader();
				 } );
				break;
		}
	}
	var functionOutPreLoader = function(){
		$( CONTAINER ).removeAttr("style");
		divOverlay.remove(); 
		$opLoader.onComplete();
	}

})(jQuery);







var ui = {
	intro: {
		FullSizeVideo: function() {
			this.event();
		},
		PopupVideo: function() {
			this.event();
		},
		IntroAni: function() {
			this.event();
		},
		MinerIEvideo: function() {
			this.event();
		},
		aniPosition: [
			{top: -120, opacity: 1},
			{bottom: 280,  opacity: 1},
			{bottom: 100, opacity: 1}
		]
	},
	window: {
		OpenEvent: function() {
			var windowInfo = ui.window.info(),
				audio = new ui.Audio();
				
			if((windowInfo.IEVersionCheck() != "8.0") && (windowInfo.IEVersionCheck() != "9.0") && !(windowInfo.noComp)){
				
				$(window).on("mousewheel DOMMouseScroll", function(e) {
					e.preventDefault();
				})

				var fullSizeVideo = new ui.intro.FullSizeVideo();

				var popupVideo = new ui.intro.PopupVideo();
				// var fog = new ui.window.FogAni();
				// windowInfo.backgroundIntro.css("display", "block");
			}else{
				$(window).off("mousewheel DOMMouseScroll", function(e) {
					e.preventDefault();
				})

				var minerPopup = new ui.intro.MinerIEvideo();
				var fog = new ui.window.FogAni();
				windowInfo.backgroundIntro.css("display", "block");

				$('.character .btn_multi').click(function() {
					var index = $(this).index();
					$('.chbox').hide();
					$('.chbox').eq(index).show();
				})

				$('.system .btn_multi').click(function() {
					var index = $(this).index();
					$('.sysbox').hide();
					$('.sysbox').eq(index).show();
				})
				$('.bg_video').hide();
			}
		},
		LoadingImg: function(selector) {
			var $wrap = null;

			this.init(selector);
			this.loadingEvent();
		},
		FogAni: function() {
			this.event();
		}
	},
	TabMenu: function(selector) {
		var $remoconWrap = null,
			$remoconMenu = null,
			$selectMenuThis = null,
			$scrollArea = null,
			$evtBox = null,
			$evtWrap = null;

		this.init(selector);
		this.event();
		this.scrollEvent();
		this.hoverEvent();
	},
	Vars: {
		tabIndex: 0,
		oldTabIndex: 0,
		viewState: false
	},
	Audio: function() {
		var $myAudio = null,
			$my_jPlayer2 = null;
			
		this.init();
		this.binding();
		this.event();
	},
	AudioVars: {
		opt_play_first2: false,
		opt_auto_play2: true,
		first_track2: true
	},
	PopupSlider: function(selector) {
		var $selector = null,
			$lt = null,
			$gt = null,
			$index = null,
			$maxLength = null,
			$btnClose = null;

		this.init(selector);
		this.event();
	},
	sectionEvent: {
		Story: function() {
			var $ani = null,
				$stone = null;

			this.init();
		},
		StoryVars: [
			['.story .img1', 'fadeInRight', 'fadeOutRight'],
			['.story .img2', 'fadeIn', 'fadeOut'],
			['.story .img3', 'fadeInLeft', 'fadeOutLeft']
		],
		StVars: ['fadeInUpBig', 'slideInDown', 'slideOutUp', 'fadeOutDownBig'],
		Field: function() {
			var $multiBox = null,
				$ani1 = null,
				$ani2 = null,
				$ani3 = null;

			this.init();
		},
		FieldVars0: ['fadeInRight', 'fadeOutRight'],
		FieldVars1: [
			['zoomInLeft', 'zoomOutLeft'],
			['zoomInLeft', 'zoomOutLeft']
		],
		FieldVars2: [
			['zoomIn', 'zoomOut'],
			['zoomIn', 'zoomOut'],
			['zoomIn', 'zoomOut']
		],
		FieldVars3: [
			['slideInLeft', 'slideOutLeft'],
			['slideInRight', 'slideOutRight']
		],
		FieldVars1_Selector: $('.field1 .ani_evt'),
		FieldVars2_Selector: $('.field2 .ani_evt'),
		FieldVars3_Selector: $('.field3 .ani_evt'),
		Character: function() {
			var $multiBox = null,
				$ani1 = null,
				$ani2 = null;

			this.init();
		},
		CharVars0: ['fadeInLeft', 'fadeOutLeft'],
		CharVars1: [
			['fadeIn', 'fadeOut'],
			['slideInUp', 'slideOutDown']
		],
		CharVars2: [
			['zoomInUp', 'fadeOut'],
			['bounceInUp', 'slideOutDown']
		],
		CharVars1_Selector: $('.character .ch1 .ani_evt'),
		CharVars2_Selector: $('.character .ch2 .ani_evt'),
		Monster: function() {
			var $multiBox = null,
				$ani1 = null,
				$ani2 = null,
				$ani3 = null;

			this.init();
		},
		MonsterVars0: ['fadeInLeft', 'fadeOutLeft'],
		MonsterVars1: [
			['zoomInRight', 'zoomOutRight'],
			['zoomInLeft', 'zoomOutLeft'],
			['zoomInLeft', 'zoomOutLeft'],
			['zoomInLeft', 'zoomOutLeft']
		],
		MonsterVars2: [
			['zoomInRight', 'zoomOutRight'],
			['zoomIn', 'zoomOut'],
			['zoomIn', 'zoomOut'],
			['zoomIn', 'zoomOut'],
			['zoomIn', 'zoomOut']
		],
		MonsterVars1_Selector: $('.monster1 .ani_evt'),
		MonsterVars2_Selector: $('.monster2 .ani_evt'),
		System: function() {
			var $multiBox = null,
				$ani1 = null,
				$ani2 = null;

			this.init();
		},
		SystemVars0: ['fadeInLeft', 'fadeOutLeft'],
		SystemVars1: [
			['rotateIn', 'rotateOut'],
			['rotateIn', 'rotateOut'],
			['rotateIn', 'rotateOut'],
			['rotateIn', 'rotateOut'],
			['rotateIn', 'rotateOut'],
			['fadeInRightBig', 'fadeOutRightBig'],
			['fadeIn', 'fadeOut'],
		],
		SystemVars2: [
			['fadeInRightBig', 'fadeOutRightBig'],
			['fadeInRightBig', 'fadeOutRightBig'],
			['fadeInRightBig', 'fadeOutRightBig'],
		],
		SystemVars1_Selector: $('.system .sys1 .ani_evt'),
		SystemVars2_Selector: $('.system .sys2 .ani_evt')
	},
	Stselector: $('.story .stone'),
	field: {
		Tab: function(btn, ly, bg2, dec, btnSc) {
			var $fieldSelector = null,
				$fieldMultiLy = null,
				$btnSc = null,
				$fdBg2 = null,
				$fdDec = null,
				$onSelecMenuItem = null;
				
			this.init(btn, ly, bg2, dec, btnSc);
			this.hoverEvent();
			this.clickEvent();
		}
	},
	character: {
		Tab: function(btn, dec) {
			var $chSelector = null,
				$chDec = null,
				$onSelecMenuItem = null;
				
			this.init(btn, dec);
			this.hoverEvent();
			this.clickEvent();
		}
	},
	monster: {
		Tab: function(btn, ly, dec) {
			var $monsterSelector = null,
				$monsterMultiLy = null,
				$monDec = null,
				$onSelecMenuItem = null;
				
			this.init(btn, ly, dec);
			this.hoverEvent();
			this.clickEvent();
		}
	},
	system: {
		Tab: function(btn, dec, btnSc) {
			var $systemSelector = null,
				$systemDec = null,
				$btnSc = null,
				$onSelecMenuItem = null;
				
			this.init(btn, dec, btnSc);
			this.hoverEvent();
			this.clickEvent();
		}
	},
	Slider: function(selector) {
		var $selector = null,
			$lt = null,
			$gt = null,
			$index = null,
			$maxLength = null;

		this.init(selector);
		this.event();
	}
}





var stone = ui.Stselector,
	stoneInfo = ui.sectionEvent.StVars,
	startSt = null;

function stF() {
	startSt = setInterval(function() {
		setTimeout(function() {
			var st = stone;
			if(st.hasClass(stoneInfo[2])) {
				st.removeClass(stoneInfo[0]).removeClass(stoneInfo[2]).addClass(stoneInfo[1]);
			}else {
				st.removeClass(stoneInfo[0]).removeClass(stoneInfo[1]).addClass(stoneInfo[2]);
			}
		})
	}, 2000)
}



ui.intro.info = function() {
	var info = {
		fullVideoWrap: $(".fullsize_video"),
		fullVideoBox: $(".video_box"),
		popupVideoWrap: $(".video_pop"),
		popupVideoBox: $(".popupsize_video"),
		showVideo: $(".btn_videoShow"),
		closeVideo: $(".btn_videoHide"),
		aniMateItem: $(".intro .introAni")
	}
	return info;
}
ui.intro.FullSizeVideo.prototype = {
	event: function() {
		var selector = ui.intro.info(),
			videos = [
				{
					videoURL: "ksMeWCwdTMc",
					containment: selector.fullVideoBox,
					autoPlay: true,
					mute: true,
					startAt: 0,
					showControls: false
				}
			];

		selector.fullVideoWrap.YTPlaylist(videos, true);
	}
}
ui.intro.PopupVideo.prototype = {
	event: function() {
		var selector = ui.intro.info(),
			popupVideos = {
				initialVideo: "eZdHTd6Jsl8",
				autoPlay: false,
				onPlayerPlaying: function(){
					$(this).tubeplayer("volume", 20);
				},
				showRelated: false,
				width: 932,
				height: 521,
				loop: 1
			};

		selector.popupVideoBox.tubeplayer(popupVideos);

		selector.showVideo.click(function(e){
			e.preventDefault();
			$(".jp-pause").click();
			ui.Vars.viewState = true;
			selector.popupVideoWrap.show();
			selector.popupVideoBox.tubeplayer("play");
			selector.fullVideoWrap.YTPPause();
		});
		selector.closeVideo.click(function(e){
			e.preventDefault();
			$(".jp-play").click();
			ui.Vars.viewState = false;
			selector.popupVideoWrap.hide();
			selector.popupVideoBox.tubeplayer("pause");
			selector.fullVideoWrap.YTPPlay()
		});
	}
}
ui.intro.MinerIEvideo.prototype = {
	event: function() {
		var selector = ui.intro.info(),
			ytNum = ui.window.info().ytNum;

		selector.showVideo.click(function(e){
			e.preventDefault();
			if(!ytNum){
				ytNum = true;
				ui.Vars.viewState = true;
				$(".btn_audio").click();
				selector.popupVideoBox.append('<embed width="932" height="521" src="http://www.youtube.com/v/eZdHTd6Jsl8" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>');
				selector.popupVideoWrap.show();
			}
		})

		selector.closeVideo.click(function(e){
			e.preventDefault();
			ui.Vars.viewState = false;
			selector.popupVideoWrap.hide();
			$("embed").detach();
			$(".jp-play").click();
			ytNum = false;
		})
	}
}
ui.intro.IntroAni.prototype = {
	event: function() {
		var selector = ui.intro.info(),
			aniPosition = ui.intro.aniPosition;

		selector.aniMateItem.each(function(index) {
			$(this).delay(index*350).animate(aniPosition[index], 700);
		})
		function autoTitleAni() {
			var inTitle = setInterval(function() {
				if(parseInt(selector.aniMateItem.eq(0).find("img").css("top")) > -23000) {
					selector.aniMateItem.eq(0).find("img").css("top", parseInt(selector.aniMateItem.eq(0).find("img").css("top")) - 1000);
				}else {
					clearInterval(inTitle);
					selector.aniMateItem.eq(0).find("img").css("top", 0);
				}
			}, 35)
		}
		setInterval(autoTitleAni, 5000);
		setTimeout(function() {
			var remocon = new ui.TabMenu(".remocon");

			remocon.selectMenuInde(0);

			$('.field .img1').removeClass('zoomInLeft').css({opacity: 0});
			$('.field .img2').removeClass('zoomInLeft').css({opacity: 0});
			$('.character .img1').removeClass('fadeIn').css({opacity: 0});
			$('.character .img2').removeClass('slideInUp').css({opacity: 0});
			$('.monster .img1').removeClass('zoomInRight').css({opacity: 0});
			$('.monster .img2, .monster .img3, .monster .img4').removeClass('fadeIn').css({opacity: 0});
			$('.system .img1,.system .img2,.system .img3,.system .img4,.system .img5').removeClass('rotateIn').css({opacity: 0});
			$('.system .img6').removeClass('fadeInRightBig').css({opacity: 0});
			$('.system .img7').removeClass('fadeIn').css({opacity: 0});
		}, 1400)
		setTimeout(autoTitleAni, 1400);
		function wheelAni() {
			var wheelImg = setInterval(function() {
				if(parseInt(selector.aniMateItem.eq(2).css("bottom")) >= 100) {
					selector.aniMateItem.eq(2).stop().animate({bottom: 50},300);
				}else {
					
					selector.aniMateItem.eq(2).stop().animate({bottom: 100},300);
				}
				
			}, 200)
		}
		setTimeout(wheelAni, 1400);
	}
}
ui.window.info = function() {
	var info = {
		noComp: navigator.userAgent.indexOf( "MSIE 7" ) > 0 && navigator.userAgent.indexOf( "Trident" ),
		IEVersionCheck: function() {
			var word;
			var version = "N/A";
			var agent = navigator.userAgent.toLowerCase();
			var name = navigator.appName;
			// IE old version ( IE 10 or Lower )
			if (name == "Microsoft Internet Explorer") word = "msie ";
			else {
				// IE 11
				if (agent.search("trident") > -1) word = "trident/.*rv:";
				// IE 12  ( Microsoft Edge )
				else if (agent.search("edge/") > -1) word = "edge/";
			}
			var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
			if (reg.exec( agent ) != null)
				version = RegExp.$1 + RegExp.$2;
			return version;
		},
		backgroundIntro: $(".bg_introBackground"),
		ytNum: false,

	};
	return info;
}
ui.window.LoadingImg.prototype = {
	init: function(selector) {
		this.$wrap = $(selector);
	},
	loadingEvent: function() {
		this.$wrap.teaserLoder({
			backgroundColor:    "#000",
			minimumTime:        .5,
			progressHeight:     "1px",
			progressPosition:   "center",
			progressColor:      "#fff",
			percentFontFamily:  "Verdana, Geneva, sans-serif",
			percentFontSize:    "20px",
			animationComplete: 	"slideUp",
			onComplete:         function() {
				var introAni = new ui.intro.IntroAni();
				$(".jp-play").click();
			}
		});
	}
}
ui.TabMenu.prototype = {
	init: function(selector) {
		this.$remoconWrap = $(selector);
		this.$remoconMenu = this.$remoconWrap.find("li");
		this.$scrollArea = $(".hideArea");
		this.$evtBox = $(".evt_box");
		this.$evtWrap = $(".evt_wrap");
	},
	event: function() {
		var objThis = this;

		this.$remoconMenu.on("click", function() {
			if(!$(this).hasClass('menu7')) {
				objThis.selectMenu($(this));
			}
		})
	},
	selectMenu: function($selectMenu) {
		objThis = this;

		if(!ui.Vars.viewState) {
			if(this.$selectMenuThis) {
				this.$selectMenuThis.removeClass("on");
			}
			ui.Vars.tabIndex = $selectMenu.index();
			this.$selectMenuThis = $selectMenu;
			this.$selectMenuThis.addClass("on");

			ui.Vars.tabIndex = $selectMenu.index();

			if($selectMenu.index() < ui.Vars.oldTabIndex) {
				objThis.upWheel();
			}else if($selectMenu.index() > ui.Vars.oldTabIndex) {
				objThis.downWheel();
			}
		}

		if(ui.Vars.viewState != 2) {
			$('.field .btn_multi').eq(0).click();
		}
		if(ui.Vars.viewState != 3) {
			$('.character .btn_multi').eq(0).click();
		}
		if(ui.Vars.viewState != 4) {
			$('.monster .btn_multi').eq(0).click();
		}
		if(ui.Vars.viewState != 5) {
			$('.system .btn_multi').eq(0).click();
		}
	},
	selectMenuInde: function(index) {
		var $remoconMenu = this.$remoconMenu.eq(index);
		this.selectMenu($remoconMenu);
	},
	scrollEvent: function() {
		var evtbox = this.$evtBox,
			indexItem = this.$remoconMenu;
			
		this.$scrollArea.on("mousewheel DOMMouseScroll", function(e) {

			e.preventDefault();

			var E = e.originalEvent,
				delta = 0;
				
			if(E.detail) {
				delta = E.detail * -40;
			}else{
				delta = E.wheelDelta;
			};

			if( delta < 0 && !ui.Vars.viewState && ui.Vars.tabIndex < evtbox.length-1 ) {
				ui.Vars.tabIndex ++;
				indexItem.eq(ui.Vars.tabIndex).click();
			}

			if(delta > 0 && !ui.Vars.viewState && ui.Vars.tabIndex > 0) {
				ui.Vars.tabIndex --;
				indexItem.eq(ui.Vars.tabIndex).click();
			}
		})
	},
	hoverEvent: function() {
		this.$remoconMenu.hover(function(e) {
			if(!$(this).hasClass('on')) {
				$(this).find('img').stop().animate({top: -80}, 200);
			}
		}, function() {
			$(this).find('img').stop().animate({top: 0}, 200);
		})
	},
	downWheel: function() {
		ui.Vars.viewState = true;

		var evtbox = this.$evtBox,
			evtWrap = this.$evtWrap,
			storyEvent = new ui.sectionEvent.Story(),
			fieldEvent = new ui.sectionEvent.Field(),
			characterEvent = new ui.sectionEvent.Character(),
			monsterEvent = new ui.sectionEvent.Monster(),
			systemEvent = new ui.sectionEvent.System();

		ui.Vars.oldTabIndex = ui.Vars.tabIndex;

		evtbox.eq(ui.Vars.tabIndex).siblings(".evt_box").fadeOut(600);
		evtbox.eq(ui.Vars.tabIndex).css({
			"z-index": 1,
			top: (evtWrap.height())
		}).animate({
			top: 0
		}, 600, function() {
			$(this).find(".scrollBlind").scrollTop(0)
			evtbox.eq(ui.Vars.tabIndex).siblings(".evt_box").css({
				top: (evtWrap.height()),
				"display": "block"
			})
			evtbox.eq(ui.Vars.tabIndex).css({
				"z-index": 0
			})
			ui.Vars.viewState = false;
		})

		if(ui.Vars.tabIndex === 1){
			storyEvent.addEvent();
		}else if(ui.Vars.tabIndex != 1){
			storyEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 2){
			fieldEvent.addEvent();
		}else if(ui.Vars.tabIndex != 2){
			fieldEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 3){
			characterEvent.addEvent();
		}else if(ui.Vars.tabIndex != 3){
			characterEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 4){
			monsterEvent.addEvent();
		}else if(ui.Vars.tabIndex != 4){
			monsterEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 5){
			systemEvent.addEvent();
		}else if(ui.Vars.tabIndex != 5){
			systemEvent.removeEvent();
		}
	},
	upWheel: function() {
		ui.Vars.viewState = true;

		var evtbox = this.$evtBox,
			evtWrap = this.$evtWrap,
			storyEvent = new ui.sectionEvent.Story(),
			fieldEvent = new ui.sectionEvent.Field(),
			characterEvent = new ui.sectionEvent.Character(),
			monsterEvent = new ui.sectionEvent.Monster(),
			systemEvent = new ui.sectionEvent.System();

		ui.Vars.oldTabIndex = ui.Vars.tabIndex;

		evtbox.eq(ui.Vars.tabIndex).siblings(".evt_box").fadeOut(600);
		evtbox.eq(ui.Vars.tabIndex).css({
			"z-index": 1,
			top: -(evtWrap.height())
		}).animate({
			top: 0
		}, 600, function() {
			$(this).find(".scrollBlind").scrollTop(0)
			evtbox.eq(ui.Vars.tabIndex).siblings(".evt_box").css({
				top: (evtWrap.height()),
				"display": "block"
			})
			evtbox.eq(ui.Vars.tabIndex).css({
				"z-index": 0
			})
			ui.Vars.viewState = false;
		})


		if(ui.Vars.tabIndex === 1){
			storyEvent.addEvent();
		}else if(ui.Vars.tabIndex != 1){
			storyEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 2){
			fieldEvent.addEvent();
		}else if(ui.Vars.tabIndex != 2){
			fieldEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 3){
			characterEvent.addEvent();
		}else if(ui.Vars.tabIndex != 3){
			characterEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 4){
			monsterEvent.addEvent();
		}else if(ui.Vars.tabIndex != 4){
			monsterEvent.removeEvent();
		}

		if(ui.Vars.tabIndex === 5){
			systemEvent.addEvent();
		}else if(ui.Vars.tabIndex != 5){
			systemEvent.removeEvent();
		}
	}
}
ui.window.FogAni.prototype = {
	event: function() {
		var windowInfo =  ui.window.info().backgroundIntro;

		setInterval(function() {
			if(parseInt(windowInfo.find("img").eq(0).css("left")) < 2000) {
				windowInfo.find("img").eq(0).animate({left: 2000},70000, "linear", function() {
					$(this).css("left", -802)
				})
			}
		})
		setInterval(function() {
			if(parseInt(windowInfo.find("img").eq(1).css("right")) < 2000) {
				windowInfo.find("img").eq(1).animate({right: 2000},20000, "linear", function() {
					$(this).css("right", -782)
				})
			}
		})
		setInterval(function() {
			if(parseInt(windowInfo.find("img").eq(2).css("right")) < 2000) {
				windowInfo.find("img").eq(2).animate({right: 2000},40000, "linear", function() {
					$(this).css("right", -1624)
				})
			}
		})
		setInterval(function() {
			if(parseInt(windowInfo.find("img").eq(3).css("left")) < 2000) {
				windowInfo.find("img").eq(3).animate({left: 2000},90000, "linear", function() {
					$(this).css("left", -1191)
				})
			}
		})
		
	}
}
ui.Audio.prototype = {
	init: function() {
		this.$myAudio = $("#jp_container2 .track");
		this.$my_jPlayer2 = $("#jquery_jplayer2");
	},
	binding: function() {
		var myAudio = this.$myAudio;

		this.$my_jPlayer2.jPlayer({
			ready: function () {
				myAudio.click();
			},
			swfPath: "js/vendor",
			cssSelectorAncestor: "#jp_container2",
			supplied: "mp3",
			wmode: "window"
		});
	},
	event: function() {
		var my_jPlayer2 = this.$my_jPlayer2;

		this.$myAudio.click(function(e){
			my_jPlayer2.jPlayer("setMedia", {
				mp3: $(this).attr("href")
			});
			if((ui.AudioVars.opt_play_first2 && ui.AudioVars.first_track2) || (ui.AudioVars.opt_auto_play2 && !ui.AudioVars.first_track2)) {
				my_jPlayer2.jPlayer("play");
			}
			
			ui.AudioVars.first_track2 = false;
			$(this).blur();
			return false;
		});
	}
}
ui.sectionEvent.Story.prototype = {
	init: function(){
		this.$ani = $('.story .ani_evt');
		this.$stone = ui.Stselector;
	},
	addEvent: function() {

		var ani = this.$ani,
			stone = this.$stone,
			aniInfo = ui.sectionEvent.StoryVars,
			stoneInfo = ui.sectionEvent.StVars;

		setTimeout(lev, 300)

		function lev() {
			ani.each(function(index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo[index][1]).removeClass(aniInfo[index][2]).css("opacity", 1);
				}, index*100)
			})
		}

		setTimeout(stv, 100)
		setTimeout(stF, 700)

		clearInterval(startSt);
		
		function stv() {
			stone.each(function(index) {
				var st = $(this);
				setTimeout(function() {
					st.removeClass(stoneInfo[3]).addClass(stoneInfo[0]).css("opacity", 1);
				},index*100)
			})
		}
	},
	removeEvent: function() {
		var ani = this.$ani,
			stone = this.$stone,
			aniInfo = ui.sectionEvent.StoryVars,
			stoneInfo = ui.sectionEvent.StVars;

		ani.each(function(index) {
			var row = $(this);
			setTimeout(function() {
				row.addClass(aniInfo[index][2]).removeClass(aniInfo[index][1]).css("opacity", 0);
			}, index*100)
		})

		clearInterval(startSt);

		stone.each(function(index) {
			$(this).removeClass(stoneInfo[2]).removeClass(stoneInfo[1]).addClass(stoneInfo[3]).css("opacity", 0);
		})
	}
}
ui.field.Tab.prototype = {
	init: function(btn, ly, bg2, dec, btnSc) {
		this.$fieldSelector = $(btn);
		this.$fieldMultiLy = $(ly);
		this.$fdBg2 = $(bg2);
		this.$fdDec = $(dec);
		this.$btnSc = $(btnSc);
	},
	hoverEvent: function() {
		this.$fieldSelector.hover(function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: -60}, 200)
			}
		}, function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: 0}, 200)
			}
		})
	},
	clickEvent: function() {
		var objThis = this,
			fdLy = this.$fieldMultiLy;

		this.$fieldSelector.click(function(e) {
			e.preventDefault();
			var index = $(this).index();

			objThis.onArea($(this));

			fdLy.animate({
				left: -($(this).index()*2000)
			},200)
		})
	},
	onArea: function($itemSt) {
		var index = $($itemSt).index(),
			ani1 = ui.sectionEvent.FieldVars1_Selector,
			ani2 = ui.sectionEvent.FieldVars2_Selector,
			ani3 = ui.sectionEvent.FieldVars3_Selector,
			aniInfo1 = ui.sectionEvent.FieldVars1,
			aniInfo2 = ui.sectionEvent.FieldVars2,
			aniInfo3 = ui.sectionEvent.FieldVars3;

		if(this.$onSelecMenuItem) {
			this.$onSelecMenuItem.removeClass('on').find('img').stop().animate({top: 0});
			this.$fdBg2.stop().fadeOut();
			this.$fdDec.stop().fadeOut();
			this.$btnSc.removeClass('sc0').removeClass('sc1').remove('sc2');
			ani1.addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani2.addClass(aniInfo2[0][1]).removeClass(aniInfo2[0][0]).css("opacity", 1);
			ani3.eq(0).addClass(aniInfo3[0][1]).removeClass(aniInfo3[0][0]).css("opacity", 1);
			ani3.eq(1).addClass(aniInfo3[1][1]).removeClass(aniInfo3[1][0]).css("opacity", 1);
		}

		this.$onSelecMenuItem = $itemSt;
		this.$onSelecMenuItem.addClass('on');
		this.$fdBg2.eq(index).stop().fadeIn();
		this.$fdDec.eq(index).stop().fadeIn();
		this.$btnSc.addClass('sc'+index);

		function lev1() {
			ani1.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[$index][0]).removeClass(aniInfo1[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		function lev2() {
			ani2.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo2[$index][0]).removeClass(aniInfo2[$index][1]).css("opacity", 1);
				}, $index*300)
			})
		}
		function lev3() {
			ani3.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo3[$index][0]).removeClass(aniInfo3[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		if(index === 0) {
			lev1()
		}
		if(index === 1) {
			lev2()
		}
		if(index === 2) {
			lev3()
		}
	},
	onAreaAt: function(index) {
		var $fieldSelector = this.$fieldSelector.eq(index);

		this.onArea($fieldSelector);
	}
}
ui.PopupSlider.prototype = {
	init: function(selector) {
		this.$selector = $(selector);
		this.$lt = this.$selector.find('.lt');
		this.$gt = this.$selector.find('.gt');
		this.$index = this.$selector.find('.img_index');
		this.$maxLength = this.$selector.find('.img_length');
		this.$btnClose = this.$selector.find('.btn_sclose');
	},
	event: function() {
		var $sld = this.$selector,
			$lt = this.$lt,
			$gt = this.$gt,
			$index = this.$index,
			$maxLength = this.$maxLength,
			$btnClose = this.$btnClose,
			mxLength = $sld.find('.sc_hidden ul li').length,
			sldState = false;

		$sld.find('.sc_hidden ul li').each(function(index) {
			$(this).attr("data-number", index+1);
		})
		$index.text($sld.find('.sc_hidden ul li:first').attr("data-number"));
		$maxLength.text(mxLength);

		$gt.on('click', function() {
			if(!sldState) {
				sldState = true;
				$sld.find('.sc_hidden ul').animate({
					left: -932
				}, function() {
					$(this).css("left", 0);
					$(this).find('li:first').insertAfter($(this).find("li:last"));
					$index.text($sld.find('.sc_hidden ul li:first').attr("data-number"));
					sldState = false;
				})
			}
		})
		$lt.on('click', function() {
			if(!sldState) {
				sldState = true;
				$sld.find('.sc_hidden ul li:last').insertBefore($sld.find('.sc_hidden ul li:first'));
				$sld.find('.sc_hidden ul').css("left", -932);
				$sld.find('.sc_hidden ul').animate({left: 0}, function() {
					$index.text($sld.find('.sc_hidden ul li:first').attr("data-number"));
					sldState = false;
				})
			}
		})
		$btnClose.on('click', function() {
			ui.Vars.viewState = false;
			$(this).parents(".sc_wrap").fadeOut();
		})
	}
}
ui.Slider.prototype = {
	init: function(selector) {
		this.$selector = $(selector);
		this.$lt = this.$selector.find('.lt2');
		this.$gt = this.$selector.find('.gt2');
		this.$index = this.$selector.find('.img_index2');
		this.$maxLength = this.$selector.find('.img_length2');
	},
	event: function() {
		var $sld = this.$selector,
			$lt = this.$lt,
			$gt = this.$gt,
			$index = this.$index,
			$maxLength = this.$maxLength,
			mxLength = $sld.find('.sc_hidden2 ul li').length,
			sldState = false;

		$sld.find('.sc_hidden2 ul li').each(function(index) {
			$(this).attr("data-number", index+1);
		})
		$index.text($sld.find('.sc_hidden2 ul li:first').attr("data-number"));
		$maxLength.text(mxLength);

		$gt.on('click', function() {
			if(!sldState) {
				sldState = true;
				$sld.find('.sc_hidden2 ul').animate({
					left: -469
				}, function() {
					$(this).css("left", 0);
					$(this).find('li:first').insertAfter($(this).find("li:last"));
					$index.text($sld.find('.sc_hidden2 ul li:first').attr("data-number"));
					sldState = false;
				})
			}
		})
		$lt.on('click', function() {
			if(!sldState) {
				sldState = true;
				$sld.find('.sc_hidden2 ul li:last').insertBefore($sld.find('.sc_hidden2 ul li:first'));
				$sld.find('.sc_hidden2 ul').css("left", -469);
				$sld.find('.sc_hidden2 ul').animate({left: 0}, function() {
					$index.text($sld.find('.sc_hidden2 ul li:first').attr("data-number"));
					sldState = false;
				})
			}
		})
	}
}
ui.sectionEvent.Field.prototype = {
	init: function() {
		this.$multiBox = $('.field .multi_box');
		this.$ani1 = $('.field1 .ani_evt');
		this.$ani2 = $('.field2 .ani_evt');
		this.$ani3 = $('.field3 .ani_evt');
	},
	addEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			ani3 = this.$ani3,
			aniInfo0 = ui.sectionEvent.FieldVars0,
			aniInfo1 = ui.sectionEvent.FieldVars1;

		setTimeout(lev1, 300)

		multiBox.delay(300).addClass(aniInfo0[0]).removeClass(aniInfo0[1]).css("opacity", 1);

		function lev1() {
			ani1.each(function(index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[index][0]).removeClass(aniInfo1[index][1]).css("opacity", 1);
				}, index*100)
			})
		}
	},
	removeEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			ani3 = this.$ani3,
			aniInfo0 = ui.sectionEvent.FieldVars0,
			aniInfo1 = ui.sectionEvent.FieldVars1;

		multiBox.addClass(aniInfo0[1]).removeClass(aniInfo0[0]).css("opacity", 0);

		ani1.each(function(index) {
			var row = $(this);
			setTimeout(function() {
				row.addClass(aniInfo1[index][1]).removeClass(aniInfo1[index][0]).css("opacity", 0);
			}, index*100)
		})
	}
}
ui.character.Tab.prototype = {
	init: function(btn, dec) {
		this.$chSelector = $(btn);
		this.$chDec = $(dec);
	},
	hoverEvent: function() {
		this.$chSelector.hover(function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: -60}, 200)
			}
		}, function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: 0}, 200)
			}
		})
	},
	clickEvent: function() {
		var objThis = this;

		this.$chSelector.click(function(e) {
			e.preventDefault();
			var index = $(this).index();

			objThis.onArea($(this));
		})
	},
	onArea: function($itemSt) {
		var index = $($itemSt).index();
			ani1 = ui.sectionEvent.CharVars1_Selector,
			ani2 = ui.sectionEvent.CharVars2_Selector,
			aniInfo1 = ui.sectionEvent.CharVars1,
			aniInfo2 = ui.sectionEvent.CharVars2;
			

		if(this.$onSelecMenuItem) {
			this.$onSelecMenuItem.removeClass('on').find('img').stop().animate({top: 0});
			this.$chDec.stop().fadeOut();
			ani1.eq(0).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(1).addClass(aniInfo1[1][1]).removeClass(aniInfo1[1][0]).css("opacity", 1);
			ani2.eq(0).addClass(aniInfo2[0][1]).removeClass(aniInfo2[0][0]).css("opacity", 1);
			ani2.eq(1).addClass(aniInfo2[1][1]).removeClass(aniInfo2[1][0]).css("opacity", 1);
		}

		this.$onSelecMenuItem = $itemSt;
		this.$onSelecMenuItem.addClass('on');
		this.$chDec.eq(index).stop().fadeIn();

		function lev1() {
			ani1.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(ui.sectionEvent.CharVars1[$index][0]).removeClass(ui.sectionEvent.CharVars1[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		function lev2() {
			ani2.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo2[$index][0]).removeClass(aniInfo2[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		if(index === 0) {
			lev1()
		}
		if(index === 1) {
			lev2()
		}
	},
	onAreaAt: function(index) {
		var $chSelector = this.$chSelector.eq(index);

		this.onArea($chSelector);
	}
}
ui.sectionEvent.Character.prototype = {
	init: function() {
		this.$multiBox = $('.character .multi_box');
		this.$ani1 = ui.sectionEvent.CharVars1_Selector;
		this.$ani2 = ui.sectionEvent.CharVars2_Selector;
	},
	addEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.CharVars0,
			aniInfo1 = ui.sectionEvent.CharVars1;

		setTimeout(lev1, 300)

		multiBox.delay(300).addClass(aniInfo0[0]).removeClass(aniInfo0[1]).css("opacity", 1);

		function lev1() {
			ani1.each(function(index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[index][0]).removeClass(aniInfo1[index][1]).css("opacity", 1);
				}, index*100)
			})
		}
	},
	removeEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.CharVars0,
			aniInfo1 = ui.sectionEvent.CharVars1;

		multiBox.addClass(aniInfo0[1]).removeClass(aniInfo0[0]).css("opacity", 0);

		ani1.each(function(index) {
			var row = $(this);
			setTimeout(function() {
				row.addClass(aniInfo1[index][1]).removeClass(aniInfo1[index][0]).css("opacity", 0);
			}, index*100)
		})
	}
}
ui.monster.Tab.prototype = {
	init: function(btn, ly, dec) {
		this.$monsterSelector = $(btn);
		this.$monsterMultiLy = $(ly);
		this.$monDec = $(dec);
	},
	hoverEvent: function() {
		this.$monsterSelector.hover(function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: -60}, 200)
			}
		}, function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: 0}, 200)
			}
		})
	},
	clickEvent: function() {
		var objThis = this,
			monLy = this.$monsterMultiLy;

		this.$monsterSelector.click(function(e) {
			e.preventDefault();
			var index = $(this).index();

			objThis.onArea($(this));

			monLy.animate({
				left: -($(this).index()*2000)
			},200)
		})
	},
	onArea: function($itemSt) {
		var index = $($itemSt).index(),
			ani1 = ui.sectionEvent.MonsterVars1_Selector,
			ani2 = ui.sectionEvent.MonsterVars2_Selector,
			aniInfo1 = ui.sectionEvent.MonsterVars1,
			aniInfo2 = ui.sectionEvent.MonsterVars2;

		if(this.$onSelecMenuItem) {
			this.$onSelecMenuItem.removeClass('on').find('img').stop().animate({top: 0});
			this.$monDec.stop().fadeOut();
			ani1.eq(0).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(1).addClass(aniInfo1[1][1]).removeClass(aniInfo1[1][0]).css("opacity", 1);
			ani1.eq(2).addClass(aniInfo1[1][1]).removeClass(aniInfo1[1][0]).css("opacity", 1);
			ani1.eq(3).addClass(aniInfo1[1][1]).removeClass(aniInfo1[1][0]).css("opacity", 1);
			ani2.eq(0).addClass(aniInfo2[0][1]).removeClass(aniInfo2[0][0]).css("opacity", 1);
			ani2.eq(1).addClass(aniInfo2[1][1]).removeClass(aniInfo2[1][0]).css("opacity", 1);
			ani2.eq(2).addClass(aniInfo2[1][1]).removeClass(aniInfo2[1][0]).css("opacity", 1);
			ani2.eq(3).addClass(aniInfo2[1][1]).removeClass(aniInfo2[1][0]).css("opacity", 1);
			ani2.eq(4).addClass(aniInfo2[1][1]).removeClass(aniInfo2[1][0]).css("opacity", 1);
		}

		this.$onSelecMenuItem = $itemSt;
		this.$onSelecMenuItem.addClass('on');
		this.$monDec.eq(index).stop().fadeIn();

		function lev1() {
			ani1.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[$index][0]).removeClass(aniInfo1[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		function lev2() {
			ani2.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo2[$index][0]).removeClass(aniInfo2[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		if(index === 0) {
			lev1()
		}
		if(index === 1) {
			lev2()
		}
	},
	onAreaAt: function(index) {
		var $monsterSelector = this.$monsterSelector.eq(index);

		this.onArea($monsterSelector);
	}
}
ui.sectionEvent.Monster.prototype = {
	init: function() {
		this.$multiBox = $('.monster .multi_box');
		this.$ani1 = $('.monster1 .ani_evt');
		this.$ani2 = $('.monster2 .ani_evt');
	},
	addEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.MonsterVars0,
			aniInfo1 = ui.sectionEvent.MonsterVars1;

		setTimeout(lev1, 300)

		multiBox.delay(300).addClass(aniInfo0[0]).removeClass(aniInfo0[1]).css("opacity", 1);

		function lev1() {
			ani1.each(function(index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[index][0]).removeClass(aniInfo1[index][1]).css("opacity", 1);
				}, index*100)
			})
		}
	},
	removeEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.MonsterVars0,
			aniInfo1 = ui.sectionEvent.MonsterVars1;

		multiBox.addClass(aniInfo0[1]).removeClass(aniInfo0[0]).css("opacity", 0);

		ani1.each(function(index) {
			var row = $(this);
			setTimeout(function() {
				row.addClass(aniInfo1[index][1]).removeClass(aniInfo1[index][0]).css("opacity", 0);
			}, index*100)
		})
	}
}
ui.system.Tab.prototype = {
	init: function(btn, dec, btnSc) {
		this.$systemSelector = $(btn);
		this.$systemDec = $(dec);
		this.$btnSc = $(btnSc);
	},
	hoverEvent: function() {
		this.$systemSelector.hover(function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: -60}, 200)
			}
		}, function() {
			if(!$(this).hasClass('on')) {
				$('img',this).stop().animate({top: 0}, 200)
			}
		})
	},
	clickEvent: function() {
		var objThis = this;

		this.$systemSelector.click(function(e) {
			e.preventDefault();
			var index = $(this).index();

			objThis.onArea($(this));
		})
	},
	onArea: function($itemSt) {
		var index = $($itemSt).index();
			ani1 = ui.sectionEvent.SystemVars1_Selector,
			ani2 = ui.sectionEvent.SystemVars2_Selector,
			aniInfo1 = ui.sectionEvent.SystemVars1,
			aniInfo2 = ui.sectionEvent.SystemVars2;
			

		if(this.$onSelecMenuItem) {
			this.$onSelecMenuItem.removeClass('on').find('img').stop().animate({top: 0});
			this.$systemDec.stop().fadeOut();
			this.$btnSc.removeClass('sc3').removeClass('sc4');
			ani1.eq(0).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(1).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(2).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(3).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(4).addClass(aniInfo1[0][1]).removeClass(aniInfo1[0][0]).css("opacity", 1);
			ani1.eq(5).addClass(aniInfo1[5][1]).removeClass(aniInfo1[5][0]).css("opacity", 1);
			ani1.eq(6).addClass(aniInfo1[6][1]).removeClass(aniInfo1[6][0]).css("opacity", 1);
			ani2.addClass(aniInfo2[0][1]).removeClass(aniInfo2[0][0]).css("opacity", 1);
		}

		this.$onSelecMenuItem = $itemSt;
		this.$onSelecMenuItem.addClass('on');
		this.$systemDec.eq(index).stop().fadeIn();
		this.$btnSc.addClass('sc'+(index+3));

		function lev1() {
			ani1.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[$index][0]).removeClass(aniInfo1[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		function lev2() {
			ani2.each(function($index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo2[$index][0]).removeClass(aniInfo2[$index][1]).css("opacity", 1);
				}, $index*100)
			})
		}
		if(index === 0) {
			lev1()
		}
		if(index === 1) {
			lev2()
		}
	},
	onAreaAt: function(index) {
		var $systemSelector = this.$systemSelector.eq(index);

		this.onArea($systemSelector);
	}
}
ui.sectionEvent.System.prototype = {
	init: function() {
		this.$multiBox = $('.system .multi_box');
		this.$ani1 = ui.sectionEvent.SystemVars1_Selector;
		this.$ani2 = ui.sectionEvent.SystemVars2_Selector;
	},
	addEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.SystemVars0,
			aniInfo1 = ui.sectionEvent.SystemVars1;

		setTimeout(lev1, 300)

		multiBox.delay(300).addClass(aniInfo0[0]).removeClass(aniInfo0[1]).css("opacity", 1);

		function lev1() {
			ani1.each(function(index) {
				var row = $(this);
				setTimeout(function() {
					row.addClass(aniInfo1[index][0]).removeClass(aniInfo1[index][1]).css("opacity", 1);
				}, index*100)
			})
		}
	},
	removeEvent: function() {
		var multiBox = this.$multiBox,
			ani1 = this.$ani1,
			ani2 = this.$ani2,
			aniInfo0 = ui.sectionEvent.SystemVars0,
			aniInfo1 = ui.sectionEvent.SystemVars1;

		multiBox.addClass(aniInfo0[1]).removeClass(aniInfo0[0]).css("opacity", 0);

		ani1.each(function(index) {
			var row = $(this);
			setTimeout(function() {
				row.addClass(aniInfo1[index][1]).removeClass(aniInfo1[index][0]).css("opacity", 0);
			}, index*100)
		})
	}
}




$(function(){

	var lodingImg = new ui.window.LoadingImg('.evt_wrap'),
		openEvent = new ui.window.OpenEvent(),
		fieldTab = new ui.field.Tab('.field .btn_multi', '.field .multiLayer', '.field .bg2', '.field .dec', '.field .btn_screen'),
		fieldSld1 = new ui.PopupSlider(".field1 .sc_wrap"),
		fieldSld2 = new ui.PopupSlider(".field2 .sc_wrap"),
		fieldSld3 = new ui.PopupSlider(".field3 .sc_wrap"),
		chSld = new ui.Slider(".character .sc_box2"),
		monSld1 = new ui.Slider(".monster .dec:eq(0) .sc_box2"),
		monSld2 = new ui.Slider(".monster .dec:eq(1) .sc_box2"),
		characterTab = new ui.character.Tab('.character .btn_multi', '.character .dec'),
		monsterTab = new ui.monster.Tab('.monster .btn_multi', '.monster .multiLayer', '.monster .dec'),
		systemTab = new ui.system.Tab('.system .btn_multi', '.system .dec', '.system .btn_screen'),
		systemSld2 = new ui.PopupSlider(".sysSc1 .sc_wrap"),
		systemSld3 = new ui.PopupSlider(".sysSc2 .sc_wrap");

	fieldTab.onAreaAt(0);
	characterTab.onAreaAt(0);
	monsterTab.onAreaAt(0);
	systemTab.onAreaAt(0);

	$('.btn_screen ').on('click', function() {
		ui.Vars.viewState = true;
		if($(this).hasClass('sc0')) {
			$('.field1 .sc_wrap').fadeIn();
		}else if($(this).hasClass('sc1')) {
			$('.field2 .sc_wrap').fadeIn();
		}else if($(this).hasClass('sc2')) {
			$('.field3 .sc_wrap').fadeIn();
		}else if($(this).hasClass('sc3')) {
			$('.sysSc1 .sc_wrap').fadeIn();
		}else if($(this).hasClass('sc4')) {
			$('.sysSc2 .sc_wrap').fadeIn();
		}
	})
	

	/*$('.sc_box2 .sc_hidden2 li img').on('click', function() {
		console.log($(this).parents('.sc_hidden2').find('li'));
	});*/
})
