/* ----------------------------------------------
 * http://recoveryman.tistory.com
 * 알트리아2차티저 UI Script
 * Author - recoveryman
 ------------------------------------------------- */

 requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': './vendor/jquery-1.12.4.min',
		'jq_ui': './vendor/jquery-ui.min',
		'easing': './vendor/easing',
		'jq_audio': './vendor/jquery.jplayer.min',
		'evt': './vendor/evt'
	},
	shim: {
		'jq_ui': {
			deps: ['jquery']
		},
		'easing': {
			deps: ['jquery']
		},
		'jq_audio': {
			deps: ['jquery']
		},
		'evt': {
			deps: ['jquery', 'easing', 'jq_ui']
		}
	}
});

requirejs([
		'jquery',
		'evt',
		'jq_ui',
		'jq_audio'
	], function($, evt, jq_ui){

		evt.jquery
			.imagesloder('#wrap', {
				backgroundColor:    "#0c1040",
				minimumTime:        .5,
				progressHeight:     "5px",
				progressPosition:   "center",
				progressColor:      "#fff",
				percentFontFamily:  "Bodoni MT, Malgun Gothic,'맑은고딕'",
				percentFontSize:    "20px",
				animationComplete:  "fade",
				onComplete:         function(){
					evt.jquery
					.sectionSetting({
						wrap:              'section',
						closeEffect:       'slide',
						startEffect:       'puff',
						speed:              700,
						scrollBreackIndex:  2,
						breakSelector:     '.menu_standard, header',
						maxHeight:         1159,
						minHeight:         999,
						eventTarget:       '.ani_evt'
					})
					.navTab({
						selectMenu:  'nav',
						selectWheel: 'body',
						startIndex:   0
					})
					.audioPlay({
						selectAudio: '#jp_container2 .track',
						player:      '#jquery_jplayer2',
						musicPath:   'sound/2.Drogo_Like_a_Devil_Breaking.mp3'
					})
					.introAni('header', '.intro .ani_evt', [
						{effect: 'fade'},
						{effect: 'puff'},
						{effect: 'fade'},
						{effect: 'drop', direction: 'left'},
						{effect: 'size'},
						{effect: 'drop', direction: 'right'},
						{effect: 'puff'}
					]);
				}
			})
			.slider('.field .sld_in', {moveSize: -541})
			.slider('.character .sld_in', {moveSize: -541})
			.slider('.monster .dec1 .sld_in', {moveSize: -541})
			.slider('.monster .dec2 .sld_in', {moveSize: -541})
			.slider('.mission .dec1 .sld_in', {moveSize: -541})
			.slider('.mission .dec2 .sld_in', {moveSize: -541})
			.popupSlider('.btn_ly', {
				moveSize: -852,
				sldOutSelector: '.sld_out',
				popupClose: '.btn_close',
				viewBox: '.sld_view',
				dirBox: '.sld_dir',
				nowIndex: '.now',
				maxIndex: '.max'
			})
			.innerTab('.character .tab_inner>li', {startIndex: 0})
			.innerTab('.monster .tab_inner>li', {startIndex: 0})
			.innerTab('.mission .tab_inner>li', {startIndex: 0})
			
	}
)