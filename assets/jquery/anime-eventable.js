(function($){

	// without $.fn.
	$.animista = function( args ){ return new AnimistaObjective( this, args ); };
	$.animista.el = $.animista.select = function( selector ){ return new animeElement( selector ); };

	// with $.fn.
	$.fn.animista = function( args ){ return new Animista( this, ( args ? args : -1 ) ); };

	$.fn.name = $.fn.animation = function( name ){ return new animeName( this, name ); };
	$.fn.dur = $.fn.duration = function( duration ){ return new animeDuration( this, duration ); };
	$.fn.dly = $.fn.delay = function( delay ){ return new animeDelay( this, delay ); };

	$.fn.rand = $.fn.random = function( rands ){ return new animeRandom( this, rands ); };
	$.fn.chain = function( chains ){ return new animeChain( this, chains ); };

	// events
	$.fn.click = function(){ return new onClick( this, arguments ); };
	$.fn.hover = function(){ return new onHover( this, arguments ); };



	// CLASS FUNCTION

	function AnimistaObjective( el, args ){
		const $this = $( el );

		if( typeof( args ) === 'object' && args !== null ){
			animeSelect( args );
		}else{
			console.error(' YOUR ARE NOT USE `selector` AS FIRST KEYWORD, WELL, WE NOT FOUND YOUR SELECTOR TO SET ANIMATION TO IT! ');
		}

		return $this;
	}
	function Animista( el, args ){
		const $this = $( el );

		if( isObject( args ) && !isNull( args ) ){
			if( hasProperty(args, ['click', 'hover', 'infinite']) ){
				if( args?.hover ){ $this.hover(args.hover); }
				if( args?.click ){ $this.click(args.click); }
			}
			else if( hasProperty(args, ['rand', 'random', 'chain', 'comp', 'train']) ){
				let prop = ( (args?.rand || args?.random) || args?.chain || (args?.comp || args?.train) );
				if( isArray( prop ) && prop.length >= 2 ){
					if( hasProperty(args, ['rand', 'random']) ){
						$this.random(prop);
					}
					else if( hasProperty(args, ['chain']) ){
						$this.chain(prop);
					}
					else{}
				}else{
					console.error(` '${prop}' TYPE NOT ARRAY OR LENGTH NOT ENOUGH! CHECK SYNTAX FOR CHANGE IT TO ARRAY! `);
				}
			}
			else if( hasProperty(args, ['name', 'animation', 'dur', 'duration']) ){
				animeCss( $this, args );
			}else{
				console.warn(` '${ Object.keys( args ) }' KEYWORD NOT SUPPORTED OR NOT REALLY KEYWORD! MAYBE IN NEW UPDATE WE SET IT( OR YOU CHECK THIS KEYWORD AGAIN?! )! `);
			}
		}
		else if( args === -1 ){
			//
		}else{
			console.error(' YOUR `ARGUMENTS` IS NOT `OBJECT` OR IS `NULL` ');
		}

		return $this;
	}

	function animeElement( el ){
		return $(el);
	};

	// set css functions

	function animeName( el, name ){
		const $this = $( el );

		let animationName = ((name === null && 'unset') || (!name && 'unset') || name) || 'unset';

		$this.css({ animationName });

		return $this;
	}
	function animeDuration( el, duration ){
		const $this = $( el );

		var animationDuration = (isNull(duration) && 'unset') || durationCheck(duration);

		$this.css({ animationDuration });

		return $this;
	}

	function animeDelay( el, delay ){
		const $this = $( el );

		var animationDelay = (isNull(delay) && 'unset') || durationCheck(delay);

		$this.css({ animationDelay });

		return $this;
	}

	// set chain, random

	function animeRandom( el, rands ){
		const $this = $( el );

		console.log($this.constructor['clickable']);



		if( hasProperty($this.constructor, 'clickable') ){
			$this.random.randomList = rands;
			if( $this.constructor['clickable'] ) handleRand();
		}else{
			handleRand();
		}

		function handleRand(){
			if( isArray(rands) && rands.length >= 2 ){
				let selectedProp, randIndex, len = rands.length;

				randIndex = Number( Math.floor( Math.random() * len ) );

				selectedProp = rands[randIndex];

				$this.animista(selectedProp);
			}
			else{
				console.error(` MAYBE '`, rands,`' NOT ARRAY OR HAVEN'T ENOUGH LENGTH! PLEASE CHECK SYNTAX AGAIN  `);
			}
		}

		return $this;
	}

	// event class function

	function onClick( el, ...args ){
		const $this = $( el );

		$this.constructor['clickable'] = null;

		if( isArray(args) ){
			const arg = args[0];
			if( arg.length === 0 ){
				$this.on('click', function(){
					$(this).constructor['clickable'] = true;
					$(this).animista({ rand: $(this).random.randomList });
				});
			}
			else if( arg.length === 1 ){
				let arg1 = arg[0];
				// this argument type can have: {...} || { in: {...}, out: {...} } || [{...in}, {...out}]
				if( isArray( arg1 ) ){
					// this is second suggest
					if( arg1.length === 2 ){
						// options set in array index as in and out
						onClickInOut( $this, arg1[0], arg1[1] );
					}else{
						console.error(' YOUR `ARRAY PARAMETER` SHOULD HAVE `TWO(2) LENGTH` OF INDEXES! ');
					}
				}
				else if( isObject( arg1 ) && !isNull(arg1) ){
					// this is first suggest
					if( hasProperty( arg1, ['in', 'out'], 'and') ){
						// this is animeCss when $this.clicked.in or $this.clicked.out
						onClickInOut( $this, arg1.in, arg1.out );
					}
					else{
						// this is animeCss when $this.clicked
						$this.on('click', function(){
							$(this).constructor['clickable'] = true;
							$(this).animista({ rand: $(this).random.randomList });
						});
					}
				}
			}
			else if( arg.length === 2 ){
				let arg1 = arg[0], arg2 = arg[1];
				if( isObject( arg1 ) && isObject( arg2 ) && ( !isNull(arg1) && !isNull(arg2) ) ){
					// if( (args[0], ['name', 'animation', 'dur', 'duration']) )
					onClickInOut( $this, arg1, arg2 );
				}
				else{
					console.error(' YOUR LENGTH OF ARGUMENTS IS NOT TRUTHY! ');
				}
			}
			else{
				console.error(` ~ YOUR '`, arg, `' SHOULD HAVE 'one(1) OR two(2) length' INDEX! ~ `);
			}
		}
		else if( isObject(args) ){
			console.log(' objected ');
		}else{
			console.error(' YOUR ARE NOT HAVE ANY ARGUMENT AS PARAMTER IN `.click(...)`! ');
		}

		return $this;
	}
	function onClickInOut( el, inProp, outProp ){
		const $this = el;

		$.handleAnimista.clickIn = false;
		$.handleAnimista.clickOut = false;

		$this.on('mousedown', function(){
			$.handleAnimista.clickIn = true;
			return new Animista( $(this), inProp );
		});
		$this.on('mouseup', function(){
			$.handleAnimista.clickOut = true;
			return new Animista( $(this), outProp );
		});

		return $this;
	}

	function onHover( el, ...args ){
		const $this = $(el);
		if( isArray(args) ){
			const arg = args[0];
			if( arg.length === 1 ){
				let arg1 = arg[0];
				// this argument type can have: {...} || { in: {...}, out: {...} } || [{...in}, {...out}]
				if( isArray( arg1 ) ){
					// this is second suggest
					if( arg1.length === 2 ){
						// options set in array index as in and out
						onHoverInOut( $this, arg1[0], arg1[1] );
					}else{
						console.error(' YOUR `ARRAY PARAMETER` SHOULD HAVE `TWO(2) LENGTH` OF INDEXES! ');
					}
				}
				else if( isObject( arg1 ) && !isNull(arg1) ){
					// this is first suggest
					if( hasProperty( arg1, ['in', 'out'], 'and') ){
						// this is animeCss when $this.clicked.in or $this.clicked.out
						onHoverInOut( $this, arg1['in'], arg1['out'] );
					}
					else{
						// this is animeCss when $this.clicked
						$this.on('mouseover', function(){ return new Animista( this, arg1 ); });
					}
				}
			}
			else if( arg.length === 2 ){
				let arg1 = arg[0];
				let arg2 = arg[1];
				if( isObject( arg1 ) && isObject( arg2 ) && ( !isNull(arg1) && !isNull(arg2) ) ){
					// if( (args[0], ['name', 'animation', 'dur', 'duration']) )
					onHoverInOut( $this, arg1, arg2 );
				}
				else{
					console.error(' YOUR LENGTH OF ARGUMENTS IS NOT TRUTHY! ');
				}
			}
			else{
				console.error(' ~ YOUR `argument` SHOULD HAVE `one(1) OR two(2) length` INDEX! ~ ');
			}
		}
		else if( isObject(args) ){
			console.log(' objected ');
		}else{
			console.error(' YOUR ARE NOT HAVE ANY ARGUMENT AS PARAMTER IN `.hover(...)`! ');
		}

		return $this;
	}
	function onHoverInOut( el, inProp, outProp ){
		const $this = el;

		$this.on('mouseover', function(){ return new Animista( $(this), inProp ); });
		$this.on('mouseout', function(){ return new Animista( $(this), outProp ); });

		return $this;
	}

	function onTrigger( el, args ){
		const $this = $( el );

		console.log('on trigger event handle');

		return $this;
	}
	function onTriggerObjective( el, args ){
		const $this = $( el );

		console.log('objective on trigger event handle');

		return $this;
	}


	// other function
	function animeCss( el, options ){
		let o = options, $this = el;
		let name = ( o?.name || o?.animation ) || false,
		    dur  = ( o?.dur  || o?.duration  ) || false,
		    dly  = ( o?.dly  || o?.delay 	 ) || false;
		// import as function
		if( name ){ $this.name( name ); }
		if( dur  ){ $this.dur( dur ); 	}
		if( dly  ){ $this.dly( dly ); 	}
	}
	function animeSelect( options ){
		let o = options;
		return $.each(o, function( keywords, items ){
			return new Animista( $(keywords), items );
		});
	}
	function animeRemove( el, rlc ){
		const $this = el;

		// rlc = r: duration, l: delay, c: count | repeat
		let dr = rlc.dr,
			dl = rlc.dl,
			rp = rlc.rp;
		let t = Number(((dr + dl) * rp) * 1000);

		var st = window.setTimeout(() => {
			// $this.name(null).dur(null).dly(null);
			animeCss( $this, { name: null, dur: null, dly: null } );
			console.log(12345);
			window.clearTimeout(st);
		}, t);

		return $this;
	}
	function durationCheck(duration){
		var dur, def = 0.6;
		switch (typeof duration) {
			case 'string':
				// type of duration parameter is string
				switch (duration) {
					//  if use time speed keywords
					case 'slower': dur = 1.3; break;
					case 'slow'	 : dur = 0.8; break;
					case 'norm'	 : dur = def; break;
					case 'fast'  : dur = 0.5; break;
					case 'faster': dur = 0.3; break;
					default:
						// if not use time speed keywords
						if(/^([0-9].[0-9]|[0-9]){1,}(s)$/i.test(duration)){
							// second time duration with 's' keyword
							dur = Number(duration.substring(0, duration.length-1));
						}else if(/^[0-9]{1,}(ms)$/i.test(duration)){
							// millisecond time duration with 'ms' keyword
							// convert it from millisecond to second
							let d = Number(duration.substring(0, duration.length-2)) / 1000;
							dur = d;
						}else if(/^([0-9].[0-9]|[0-9]){1,}$/.test(duration)){
							// second time duration as string and without 's' keyword
							dur = Number(duration);
						}else{
							dur = def;
						}
						break;
				}
				break;
			case 'number':
				// type of number
				dur = duration;
				break;
			default:
				dur = def;
				break;
		}

		return `${dur}s`;
	}
	function hasProperty(object, keywords, cond = 'or'){
		var resArray = [];
		if( isArray(keywords) && keywords.length >= 2 ){
			keywords.forEach(item => {
				let res = Object(object).hasOwnProperty(item);
				resArray.push(res);
			});
			if(cond === 'or'){
				return(resArray.includes(true));
			}else if(cond === 'and'){
				return(!resArray.includes(false));
			}
		}
		else if( isArray(keywords) && keywords.length === 1 ){
			return Object(object).hasOwnProperty(keywords[0]);
		}
		else if( typeof keywords === 'string' ){
			return Object(object).hasOwnProperty(keywords);
		}else{
			return null;
		}
	}

	function isObject(param){
		return( typeof param === 'object' && param !== null );
	}
	function isArray(param){
		return( isObject(param) && param instanceof Array );
	}
	function f(a, b=true, c=true, d=false){
		return a === b ? c : d;
	}
	function isNull(value){
		return value === null ? true : false;
	}


}(jQuery));
