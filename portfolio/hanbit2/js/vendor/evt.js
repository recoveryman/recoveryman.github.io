/* ----------------------------------------------
 * http://recoveryman.tistory.com
 * 알트리아2차티저 UI Script
 * Author - recoveryman
 ------------------------------------------------- */
 
var evt = (function($, window, document){

	var action = {};
		action.interaction = {};

	var event = {};

	var setting = {};
	setting = {
		scrollState: false,
		scrollDelta: 0,
		menuLength: null,
		OLDINDEX: null,
		NEWINDEX: null,
		SECTION_SETTING: {}
	}

	var audioSetting = {};
	audioSetting = {
		opt_play_first2: false,
		opt_auto_play2: true,
		first_track2: true
	}

	event = {
		ImagesLoder: function(selector, option) {
			var $selector = null,
				$option = null,
				CONTAINER = null,
				_urlImages = null,
				_divOverlay = null,
				_divBarProgress = null,
				_divPercentProgress = null,
				_divLogoImage = null,
				_hiddenContainer = null,
				_imageCount = null,
				_startTime = null,
				_finishTime = null;

			this._init(selector);
			this._event(option);
		},
		NavTab: function(option) {
			this.$selectMenu = null;
			this.$selectMenuList = null;

			this._init(option);
			this._event();
			this._mouseWheel();
		},
		Audio: function(option) {
			var $myAudio = null,
				$my_jPlayer2 = null;
				
			this._init(option);
			this._binding(option);
			this._event();
		},
		Slider: function(selector, option) {
			var $selector = null,
				$lt = null,
				$gt = null,
				$index = null,
				$maxLength = null,
				$lyOpen = null;

			this._init(selector);
			this._event(option);
		},
		InnerTab: function(selector) {
			var $tabSelect = null,
				$innerList = null,
				$aniState = null;

			this._init(selector);
			this._event();
		},
		IntroAni: function(menu, evt, option) {
			var $menu = null,
				$evt = null;

			this._init(menu, evt);
			this._event(option);
		},
		PopupSlider: function(selector, option) {
			var $popupBtn = null,
				$popupSlider = null,
				$closeBtn = null,
				$sldState = null;

			this._init(selector, option);
			this._event(option);
		}
	}

	event.ImagesLoder.prototype = {
		_init: function(selector, option) {
			this.$selector = $(selector);
			this.$option = {
				backgroundColor:	"#000",
				backgroundImage:	"",
				backgroundRepeat:	"repeat",
				logoImage:			"",
				progressShow:		true,
				progressColor: 		"#FFF",
				progressHeight: 	"10px",
				progressPosition:	"bottom",
				percentShow:		true,
				percentFontFamily:	"Verdana, Geneva, sans-serif",
				percentFontSize:	"50px",			
				animationComplete: 	"fade",
				minimumTime:		.5,
				onStart: function(){},
				onComplete: function(){}
			};
			this._urlImages = [];
			this._imageCount = 0;
		},
		_event: function(option) {
			var objThis = this;

			if(option)
				$.extend(this.$option, option);

			this.$selector.find("*").each(function() {
				objThis._selectImages(this);
			})

			this._createLoader();
		},
		_selectImages: function(element) {
			var url = "";

			if($(element).css("background-image") != "none")
				var url = $(element).css("background-image").replace("url(", "").replace( ")", "" ).slice(0, -1).substring(1);
			else if(typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img")
				var url = $(element).attr( "src" );

			if(url != "")
				this._urlImages.push(url);
		},
		_createLoader: function() {
			var date = new Date();
			this._startTime = date.getTime();

			if(this._urlImages != ""){
				this._createElementsPreLoader();
				this._createContainer();

				this.$option.onStart();
			}else {
				this.$option.onComplete();

			}
		},
		_createElementsPreLoader: function() {
			this.$selector.css({overflow: "hidden"});

			this._divOverlay = $("<div id=\"loading-layer\"></div>")
							.appendTo(this.$selector)
							.css({
								width: this.$selector.width(),
								height: this.$selector.height(),
								backgroundColor: this.$option.backgroundColor,
								backgroundImage: "url(" + this.$option.backgroundImage + ")",
								backgroundRepeat: this.$option.backgroundRepeat,
								backgroundPosition: "fixed",
								position: "fixed",
								zIndex: 999999,
								top: this.$selector.offset().top,
								left: this.$selector.offset().left	
							});

			if(this.$option.progressShow) {
				this._divBarProgress = $("<div id=\"loading-bar-progress\"></div>")
										.appendTo(this._divOverlay)
										.css({
											width: "0%",
											height: this.$option.progressHeight,
											backgroundColor: this.$option.progressColor,
											position: "absolute",
											left: 0
										});

				switch(this.$option.progressPosition) {
					case "top":
						this._divBarProgress.css({top: 0, marginTop: 0});
						break;
					
					case "center":
						this._divBarProgress.css({top: "50%", marginTop: "-" + ( parseFloat(this.$option.progressHeight) / 2 ) + "px"});
						break;
					
					case "bottom":
						this._divBarProgress.css({bottom: 0, marginBottom: 0});
						break;
				}

				if(this.$option.percentShow){
					this._divPercentProgress = $("<div id=\"loading-percent-progress\"></div>")
					.appendTo(this._divOverlay)
					.css({
						width: "200px",
						height: this.$option.percentFontSize,
						position: "absolute",
						top: "50%",
						left: "50%",
						marginTop: (parseFloat(this.$option.progressHeight) / 2 ) + 15 + "px",
						marginLeft: "-100px",
						fontFamily: this.$option.percentFontFamily,
						fontSize: this.$option.percentFontSize,
						fontWeight: "bold",
						fontStyle: 'italic',
						color: this.$option.progressColor,
						textAlign: "center",
						lineHeight: this.$option.percentFontSize
					})
					.html("0%");
				}

				if( this.$option.logoImage != "" ){
					this._divLogoImage = $("<div id=\"loading-logo-image\"></div>")
					.appendTo(this._divOverlay)
					.css({
						width: "100%",
						height: "100%", 
						position: "absolute",
						bottom: "50%",
						left: "0",
						marginBottom: (parseFloat(this.$option.progressHeight) / 2 ) + 20 + "px",
						backgroundImage: "url(" + this.$option.logoImage + ")",
						backgroundPosition: "center bottom",
						backgroundRepeat: "no-repeat"
					});
				}
			}
		},
		_createContainer: function() {
			this._hiddenContainer = $("<div></div>").appendTo(this.$selector)
			.css({
				display: "none",
				overflow: "hidden",
				width: 0,
				height: 0
			});

			for(var i = 0; i < this._urlImages.length; i++){
				var image = new Image(),
					objThis = this;

				$(image).one({
					load: function(){
						objThis._timePercent();
					},
					error: function(){
						objThis._timePercent();
					}
				})
				.attr( "src", objThis._urlImages[i] )
				.appendTo(objThis._hiddenContainer);
			}
		},
		_timePercent: function() {
			this._imageCount++;
			var percent = (this._imageCount / this._urlImages.length) * 100;

			if(this.$option.progressShow){
				this._divBarProgress.stop().animate({
					width: percent + "%",
					minWidth: percent + "%",
				}, 400);
			}
										  
			if(this.$option.percentShow)
				this._divPercentProgress.text( Math.ceil(percent) + "%");

			if(this._imageCount == this._urlImages.length)
				this._destroyLoader();
		},
		_destroyLoader: function() {
			this._hiddenContainer.remove();
			this._animateOutPreLoader();
		},
		_animateOutPreLoader: function() {
			this._finishTime = this.$option.minimumTime * 1000;
			var date = new Date(),
				objThis = this;

			if((date.getTime() - this._startTime) < this._finishTime)
				this._finishTime = (this._finishTime - (date.getTime() - this._startTime));

			switch(this.$option.animationComplete){

				case "fade":
					this._divOverlay.delay(objThis._finishTime)
					.fadeOut( 500, function(){
						objThis._functionOutPreLoader();
					});
					break;

				case "hide":
					this._divOverlay.delay(objThis._finishTime)
					.hide(0, function(){
						objThis._functionOutPreLoader();
					});
					break;

				case "slideUp":
					this._divOverlay.delay(objThis._finishTime)
					.css({position: "absolute"})
					.animate({top: "-=100%"}, 500, function(){
						objThis._functionOutPreLoader();
					});
					break;

				case "slideDown":
					this._divOverlay.delay(objThis._finishTime)
					.css({position: "absolute"})
					.animate({top: "+=100%"}, 500, function(){
						objThis._functionOutPreLoader();
					});
					break;

				case "slideLeft":
					this._divOverlay.delay(objThis._finishTime)
					.css({position: "absolute"})
					.animate({left: "-=100%" }, 500, function(){
						objThis._functionOutPreLoader();
					});
					break;

				case "slideRight":
					this._divOverlay.delay(objThis._finishTime)
					.css({position: "absolute" })
					.animate({left: "+=100%" }, 500, function(){
						objThis._functionOutPreLoader();
					});
				break;

			}
		},
		_functionOutPreLoader: function() {
			this.$selector.removeAttr("style");
			this._divOverlay.remove(); 
			this.$option.onComplete();
		}
	}


	event.NavTab.prototype = {
		_init: function(option) {
			this.$selectorMenu = $(option.selectMenu);
			this.$selectorWheel = $(option.selectWheel);
		},
		_event: function() {
			var objThis = this;

			this.$selectorMenu.find('li').on('click', function(e) {
				if($(this).index() != 6) {
					e.preventDefault();
					var index = $(this).index();
					objThis._clickMenu($(this), index);
				}
			})
		},
		_clickMenu: function($selectMenu, index) {
			if(!setting.scrollState) {

				if(this.$selectMenuList) {
					this.$selectMenuList.removeClass('on');
					setting.OLDINDEX = this.$selectMenuList.index();
				}

				this.$selectMenuList = $selectMenu;
				setting.NEWINDEX = this.$selectMenuList.index();
				this.$selectMenuList.addClass('on');

				if(setting.OLDINDEX != null) {
					if(setting.OLDINDEX != setting.NEWINDEX){
						this._SECTION_EFFECT(setting.OLDINDEX, setting.NEWINDEX);
					}
				}
			}
		},
		_mouseWheel: function() {
			var objThis = this;

			this.$selectorWheel.on('mousewheel DOMMouseScroll', function(e) {
				var E = e.originalEvent;
				e.preventDefault();

				if (E.detail) {
					setting.scrollDelta = E.detail * -40;
				}else{
					setting.scrollDelta = E.wheelDelta;
				};

				if(setting.scrollDelta < 0 &&
					!setting.scrollState &&
					setting.NEWINDEX < (setting.menuLength-1)){					
					
					if(setting.SECTION_SETTING.scrollBreackIndex === setting.NEWINDEX){
						$(window).scrollTop($(window).scrollTop()+20)

						if(($(window).scrollTop()+$(window).height()) - $(document).height() === 0) {
							setting.NEWINDEX++;

							objThis.$selectorMenu.find('li').eq(setting.NEWINDEX).click();
						}
					}else{
						setting.NEWINDEX++;
						objThis.$selectorMenu.find('li').eq(setting.NEWINDEX).click();
					}
				};
				if(setting.scrollDelta > 0 &&
					!setting.scrollState &&
					(setting.NEWINDEX) > 0){

					if(setting.SECTION_SETTING.scrollBreackIndex === setting.NEWINDEX){
						$(window).scrollTop($(window).scrollTop()-20)

						if($(window).scrollTop() === 0) {
							setting.NEWINDEX--;

							objThis.$selectorMenu.find('li').eq(setting.NEWINDEX).click();
						}
					}else {
						setting.NEWINDEX--;
						objThis.$selectorMenu.find('li').eq(setting.NEWINDEX).click();
					}
				};
			});
		},
		_SECTION_EFFECT: function(OIDX, NIDX) {
			setting.scrollState = true;

			if(setting.NEWINDEX === 2){
				$(setting.SECTION_SETTING.breakSelector).height(setting.SECTION_SETTING.maxHeight);
			}else {
				$(setting.SECTION_SETTING.breakSelector).height(setting.SECTION_SETTING.minHeight);
			}

			$(setting.SECTION_SETTING.wrap).eq(OIDX).hide(setting.SECTION_SETTING.closeEffect, {percent: 50}, setting.SECTION_SETTING.speed);
			$(setting.SECTION_SETTING.wrap).eq(NIDX).show(setting.SECTION_SETTING.startEffect, {percent: 100}, setting.SECTION_SETTING.speed, function() {
				$('html, body').animate({scrollTop: 0},50);
			});

			var aniMaxLength = $(setting.SECTION_SETTING.wrap).eq(NIDX).find(setting.SECTION_SETTING.eventTarget).length,
				defaultNum = 0;

			$(setting.SECTION_SETTING.wrap).eq(NIDX).find(setting.SECTION_SETTING.eventTarget).each(function(index) {
				$(this).delay(index*100).show('explod', function() {
					defaultNum++;
					if(defaultNum === aniMaxLength){
						$(setting.SECTION_SETTING.wrap).eq(OIDX).find(setting.SECTION_SETTING.eventTarget).hide();
						setting.scrollState = false;
					}
				});
			})
		},
		clickMenuAt: function(index) {
			var $menuItem = this.$selectorMenu.find('li').eq(index);
			this._clickMenu($menuItem);
		}
	}


	event.Audio.prototype = {
		_init: function(option) {
			this.$myAudio = $(option.selectAudio);
			this.$my_jPlayer2 = $(option.player);
		},
		_binding: function(option) {
			var myAudio = this.$myAudio;
			myAudio.attr('href', option.musicPath);

			audioSetting.opt_play_first2 = true,
			audioSetting.opt_auto_play2 = true;

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
		_event: function() {
			var my_jPlayer2 = this.$my_jPlayer2;

			this.$myAudio.click(function(e){
				my_jPlayer2.jPlayer("setMedia", {
					mp3: $(this).attr("href")
				});
				if((audioSetting.opt_play_first2 && audioSetting.first_track2) || (audioSetting.opt_auto_play2 && !audioSetting.first_track2)) {
					my_jPlayer2.jPlayer("play");
				}
				
				audioSetting.first_track2 = false;
				$(this).blur();
				return false;
			});
		}
	}


	event.Slider.prototype = {
		_init: function(selector) {
			this.$selector = $(selector);
			this.$lt = this.$selector.find('.btn_lt');
			this.$gt = this.$selector.find('.btn_gt');
			this.$index = this.$selector.find('.now');
			this.$maxLength = this.$selector.find('.max');
			this.$lyOpen = $('.btn_ly');
		},
		_event: function(option) {
			var $sld = this.$selector,
				$lt = this.$lt,
				$gt = this.$gt,
				$index = this.$index,
				$maxLength = this.$maxLength,
				mxLength = $sld.find('.sld_view ul li').length,
				sldState = false,
				$btnLy = this.$lyOpen;

			$sld.find('.sld_view ul li').each(function(index) {
				$(this).attr("data-number", index+1);
			})
			$index.text($sld.find('.sld_view ul li:first').attr("data-number"));
			$maxLength.text(mxLength);

			$gt.on('click', function(e) {
				e.preventDefault();
				if(!sldState) {
					sldState = true;
					$sld.find('.sld_view ul').animate({
						left: option.moveSize
					}, function() {
						$(this).css("left", 0);
						$(this).find('li:first').insertAfter($(this).find("li:last"));
						$index.text($sld.find('.sld_view ul li:first').attr("data-number"));
						sldState = false;
					})
				}
			});

			$lt.on('click', function(e) {
				e.preventDefault();
				if(!sldState) {
					sldState = true;
					$sld.find('.sld_view ul li:last').insertBefore($sld.find('.sld_view ul li:first'));
					$sld.find('.sld_view ul').css("left", option.moveSize);
					$sld.find('.sld_view ul').animate({left: 0}, function() {
						$index.text($sld.find('.sld_view ul li:first').attr("data-number"));
						sldState = false;
					})
				}
			});
		}
	}


	event.InnerTab.prototype = {
		_init: function(selector) {
			this.$tabSelect = $(selector);
			this.$aniState = false;
		},
		_event: function() {
			objThis = this;

			this.$tabSelect.on('click', function(e) {
				e.preventDefault();
				var index = $(this).index();

				if(!objThis.$aniState) {
					objThis.$aniState = true;
					$(this).siblings('li').removeClass('on');
					$(this).addClass('on');
					$(this).parents('.tab_area').find('.dec_wrap').find('.decbox').eq(index).siblings('.decbox').stop().hide('slide');
					$(this).parents('.tab_area').find('.dec_wrap').find('.decbox').eq(index).stop().show('slide', function() {objThis.$aniState = false;});
					$(this).parents('.tab_area').siblings('.chbox').eq(index).siblings('.chbox').removeClass('ani_evt').stop().hide('puff');
					$(this).parents('.tab_area').siblings('.chbox').eq(index).addClass('ani_evt').stop().show('puff');
				}	
			})
		},
		_clickEvent: function($this) {
			if(this.$innerList) {
				this.$innerList.removeClass('on');
			}

			this.$innerList = $this;
			this.$innerList.addClass('on');
		},
		clickMenuAt: function(number) {
			var $innerMenuItem = this.$tabSelect.eq(number);
			this._clickEvent($innerMenuItem);
		}
	}


	event.IntroAni.prototype = {
		_init: function(menu, evt) {
			this.$menu = $(menu);
			this.$evt = $(evt);
		},
		_event: function(option) {
			this.$menu.show('slide');
			this.$evt.each(function(index) {
				$(this).delay(index*100).show(option[index]);
			})
		}
	}

	event.PopupSlider.prototype = {
		_init: function(selector, option) {
			this.$popupBtn = $(selector);
			this.$popupSlider = $(option.sldOutSelector);
			this.$closeBtn = $(option.popupClose);
			this.$sldState = false;
		},
		_event: function(option) {
			var objThis = this;

			this.$popupBtn.on('click', function(e) {
				e.preventDefault();
				setting.scrollState = true;

				var List = $(this).parents(option.viewBox).find('li').clone(),
					indexClone = $(this).parents(option.viewBox).siblings(option.dirBox).find(option.nowIndex).text(),
					maxIndexClone = $(this).parents(option.viewBox).siblings(option.dirBox).find(option.maxIndex).text();

				objThis.$popupSlider.parents('.sld_ly').fadeIn();
				objThis.$popupSlider.find('ul').html(List);
				objThis.$popupSlider.find(option.nowIndex).text(indexClone);
				objThis.$popupSlider.find(option.maxIndex).text(maxIndexClone);
			
				objThis.$popupSlider.find(option.nowIndex).text($(this).siblings('ul').find('li:first').attr("data-number"));
				objThis.$popupSlider.find(option.maxIndex).text($(this).siblings('ul').find('li').length)

				objThis.$popupSlider.find('.btn_gt').on('click', function(e) {
					e.preventDefault();
					if(!objThis.$sldState) {
						objThis.$sldState = true;
						objThis._btnGt(option);
					}
				});

				objThis.$popupSlider.find('.btn_lt').on('click', function(e) {
					e.preventDefault();
					if(!objThis.$sldState) {
						objThis.$sldState = true;
						objThis._btnLt(option);
					}
				});
			})

			this.$closeBtn.on('click', function(e) {
				e.preventDefault();
				$('.sld_ly').fadeOut(400, function() {
					setting.scrollState = false;
				});
			})
		},
		_btnGt: function(option) {
			var objThis = this;

			objThis.$popupSlider.find('.sld_view ul').animate({
				left: option.moveSize
			}, function() {
				objThis.$popupSlider.find('ul').css("left", 0);
				objThis.$popupSlider.find('ul').find('li:first').insertAfter(objThis.$popupSlider.find('ul').find("li:last"));
				objThis.$popupSlider.find(option.nowIndex).text(objThis.$popupSlider.find('.sld_view ul li:first').attr("data-number"));
				objThis.$sldState = false;
			})
		},
		_btnLt: function(option) {
			var objThis = this;

			objThis.$popupSlider.find('.sld_view ul li:last').insertBefore(objThis.$popupSlider.find('.sld_view ul li:first'));
			objThis.$popupSlider.find('.sld_view ul').css("left", option.moveSize);
			objThis.$popupSlider.find('.sld_view ul').animate({left: 0}, function() {
				objThis.$popupSlider.find(option.nowIndex).text(objThis.$popupSlider.find('.sld_view ul li:first').attr("data-number"));
				objThis.$sldState = false;
			})
		}
	}


	return {
		jquery: {
			imagesloder: function(selector, $option) {
				action.interaction.imagesloder = new event.ImagesLoder(selector, $option);
				return this;
			},
			navTab: function(option) {
				action.interaction.navTab = new event.NavTab(option);
				action.interaction.navTab.clickMenuAt(option.startIndex);
				setting.menuLength = $(option.selectMenu).find('li').length;
				return this;
			},
			audioPlay: function(option) {
				action.interaction.audioPlay = new event.Audio(option);
				return this;
			},
			sectionSetting: function(option) {
				setting.SECTION_SETTING = option;
				return this;
			},
			slider: function(selector, option) {
				action.interaction.slider = new event.Slider(selector, option);
				return this;
			},
			innerTab: function(selector, option) {
				action.interaction.innerTab = new event.InnerTab(selector);
				action.interaction.innerTab.clickMenuAt(option.startIndex);
				return this;
			},
			introAni: function(menu, evt, option) {
				action.interaction.introAni = new event.IntroAni(menu, evt, option);
				return this;
			},
			popupSlider: function(selector, option) {
				action.interaction.popupSlider = new event.PopupSlider(selector, option);
				return this;
			}
		}
	}

})(jQuery, window, document);

if(typeof define === "function" && define.amd) {
	define( "evt", [], function() {
		return evt;
	});
}