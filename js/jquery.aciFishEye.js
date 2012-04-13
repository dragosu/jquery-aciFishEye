
/*
 * aciFishEye jQuery Plugin v1.0
 * http://acoderinsights.ro
 *
 * Copyright (c) 2012 Dragos Ursu
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Require jQuery Library http://jquery.com
 *
 * Date: Fri Apr 6 19:15 2012 +0200
 */

(function($){

    $.aciFishEye = {
        nameSpace: '.aciFishEye'
    };

    $.fn.aciFishEye = function(options, data){
        if (typeof options == 'string')
        {
            return $(this)._aciFishEye(options, data);
        }
        return this.each(function(){
            return $(this)._aciFishEye(options, data);
        });
    };

    // default options
    $.fn.aciFishEye.defaults = {
        'left' : '.aciLeft',        // selector to tell if it's left-align
        'right' : '.aciRight',      // selector to tell if it's right-align
        'top' : '.aciTop',          // selector to tell if it's top-align
        'bottom' : '.aciBottom',    // selector to tell if it's bottom-align
        'block' : 'li',             // selector to get a list of elements
        'element' : 'img',          // element selector (to grow/shrink)
        'show' : null,              // selector for extra element(s) to show
        'hide' : null,              // selector for extra element(s) to hide
        'display' : null,           // show/hide callback(jQuery object as of show/hide selectors, boolean show/hide, speed in miliseconds)
        'fixed' : true,             // if it's fixed size - margin top/left will be used
        'width' : 50,               // element maximum width (minimum it's the current element width)
        'height' : 50,              // element maximum height (minimum it's the current element height)
        'grow' : 50,                // duration of the grow animation
        'shrink' : 200,             // duration of the shrink animation (when mouse out of the elements)
        'easing' : 'swing'          // easing used on grow/shrink
    };

    $.fn._aciFishEye = function(options, data){

        var $this = this;

        var _options = $.extend({}, $.fn.aciFishEye.defaults, options);

        // init control based on options
        var _initUi = function(){
            if ((typeof options == 'undefined') || (typeof options == 'object'))
            {
                _customUi();
            }
            // process custom request
            if (typeof options == 'string')
            {
                if ($this.data('customUi' + $.aciFishEye.nameSpace))
                {
                    // we get here is this was initialized
                    switch (options)
                    {
                        case 'options':
                            return $this.data('options' + $.aciFishEye.nameSpace);
                        case 'destroy':
                            // destroy the control
                            _destroyUi();
                    }
                }
                else
                {
                    switch (options)
                    {
                        case 'options':
                            return _options;
                    }
                }
            }
            // return this object
            return $this;
        };

        // destroy control
        var _destroyUi = function(){
            if ($this.data('customUi' + $.aciFishEye.nameSpace))
            {
                // destroy if initialized
                $this.removeData('customUi' + $.aciFishEye.nameSpace);
                $this.removeData('options' + $.aciFishEye.nameSpace);
                $this.find(_options.block).unbind($.aciFishEye.nameSpace);
            }
        }; // end _destroyUi

        // init custom UI
        var _customUi = function(){
            if ($this.data('customUi' + $.aciFishEye.nameSpace))
            {
                // return if already initialized
                return;
            }

            $this.data('customUi' + $.aciFishEye.nameSpace, true);
            // keep options
            $this.data('options' + $.aciFishEye.nameSpace, _options);

            var _element = $this.find(_options.block + ':first');

            var _horizontal = (_element.css('float') == 'left') || (_element.css('float') == 'right');

            _element = _element.find(_options.element);

            // keep min size
            var _min = {
                'width': _element.width(),
                'height': _element.height()
            };

            // keep max size
            var _max = {
                'width': _options.width,
                'height': _options.height
            };

            // get top/left margin (if fixed size)
            var _pos = function(over, min){
                if (over)
                {
                    return {
                        left: 0,
                        top: 0
                    };
                }
                if ($this.is(_options.left))
                {
                    return {
                        left: 0,
                        top: _options.fixed ? Math.floor((_max.height - min.height) / 2) : 0
                    };
                }
                else
                if ($this.is(_options.right))
                {
                    return {
                        left: _max.width - min.width,
                        top: _options.fixed ? Math.floor((_max.height - min.height) / 2) : 0
                    };
                }
                else
                if ($this.is(_options.top))
                {
                    return {
                        left: _options.fixed ? Math.floor((_max.width - min.width) / 2) : 0,
                        top: 0
                    };
                }
                else
                if ($this.is(_options.bottom))
                {
                    return {
                        left: _options.fixed ? Math.floor((_max.width - min.width) / 2) : 0,
                        top: _max.height - min.height
                    };
                }
                else
                {
                    if (_horizontal)
                    {
                        return {
                            left: _options.fixed ? Math.floor((_max.width - min.width) / 2) : 0,
                            top: Math.floor((_max.height - min.height) / 2)
                        };
                    }
                    else
                    {
                        return {
                            left: Math.floor((_max.width - min.width) / 2),
                            top: _options.fixed ? Math.floor((_max.height - min.height) / 2) : 0
                        };
                    }
                }
            };

            // get animation speed
            var _speed = function (element, width)
            {
                var size = _max.width - _min.width;
                var diff = Math.abs(width - element.width());
                return Math.ceil(diff * _options.grow / size);
            }

            // keep current element
            var _current = null;

            // process display option
            var _display = function(obj, state, speed) {
                if (_current)
                {
                    var current = _current;
                    _current = null;
                    _display(current, !state, speed);
                }
                if (obj)
                {
                    _current = obj;
                    if (_options.show)
                    {
                        var element = $(obj).find(_options.show);
                        if (_options.display)
                        {
                            _options.display(element, state, speed);
                        }
                        else
                        {
                            if (state)
                            {
                                element.stop().hide().css('opacity', 1).fadeIn(speed);
                            }
                            else
                            {
                                element.stop().fadeOut(speed);
                            }
                        }
                    }
                    if (_options.hide)
                    {
                        var element = $(obj).find(_options.hide);
                        if (_options.display)
                        {
                            _options.display(element, !state, speed);
                        }
                        else
                        {
                            if (state)
                            {
                                element.stop().fadeOut(speed);
                            }
                            else
                            {
                                element.stop().hide().css('opacity', 1).fadeIn(speed);
                            }
                        }
                    }
                }
            };

            // handle mouse enter
            var _enter = function(){
                var pos = _pos(true, _min);
                var element = $(this).find(_options.element);
                var speed = _speed(element, _max.width);
                element.stop().animate({
                    'easing': _options.easing,
                    'margin-left': pos.left + 'px',
                    'margin-top': pos.top + 'px',
                    'width': _max.width + 'px',
                    'height': _max.height + 'px'
                }, speed);
                _display(this, true, speed);
            };

            // handle mouse move
            var _move = function(event) {
                var x = event.pageX - $(this).offset().left;
                var y = event.pageY - $(this).offset().top;
                var list = $this.find(_options.block);
                // check if it's horizontal
                if (_horizontal)
                {
                    var diff = x - _max.width / 2;
                    var proc = 0.7 * Math.abs(diff) / _max.width;
                }
                else
                {
                    var diff = y - _max.height / 2;
                    var proc = 0.7 * Math.abs(diff) / _max.height;
                }
                var index = list.index(this);
                var sizeX = (_max.width - _min.width) / 3;
                var sizeY = (_max.height - _min.height) / 3;
                // resize top/left elements
                var diffX = sizeX * proc * ((diff < 0) ? 1 : -1);
                var diffY = sizeY * proc * ((diff < 0) ? 1 : -1);
                var width = Math.floor(_min.width + sizeX + diffX);
                var height = Math.floor(_min.height + sizeY + diffY);
                for (var i = index - 2; i < index; i++)
                {
                    if (i >= 0)
                    {
                        var pos = _pos(false, {
                            'width': width,
                            'height': height
                        });
                        var element = list.eq(i).find(_options.element);
                        element.stop().animate({
                            'easing': _options.easing,
                            'margin-left': pos.left + 'px',
                            'margin-top': pos.top + 'px',
                            'width': width + 'px',
                            'height': height + 'px'
                        }, _speed(element, width));
                    }
                    width += Math.floor(sizeX + diffX);
                    height += Math.floor(sizeY + diffY);
                }
                // resize bottom/right elements
                diffX = -diffX;
                diffY = -diffY;
                width = Math.floor(_min.width + sizeX + diffX);
                height = Math.floor(_min.height + sizeY + diffY);
                for (var i = index + 2; i > index; i--)
                {
                    if (i <= list.length - 1)
                    {
                        var pos = _pos(false, {
                            'width':width,
                            'height':height
                        });
                        var element = list.eq(i).find(_options.element);
                        element.stop().animate({
                            'easing': _options.easing,
                            'margin-left': pos.left + 'px',
                            'margin-top': pos.top + 'px',
                            'width': width + 'px',
                            'height': height + 'px'
                        }, _speed(element, width));
                    }
                    width += Math.floor(sizeX + diffX);
                    height += Math.floor(sizeY + diffY);
                }
            }

            // handle mouse leave
            var _leave = function(event){
                if (event.relatedTarget)
                {
                    var list = $this.find(_options.block);
                    var index = list.index(event.relatedTarget);
                    if (index < 0)
                    {
                        var pos = _pos(false, _min);
                        list.find(_options.element).stop().animate({
                            'easing': _options.easing,
                            'margin-left': pos.left + 'px',
                            'margin-top': pos.top + 'px',
                            'width': _min.width + 'px',
                            'height': _min.height + 'px'
                        }, _options.shrink);
                        _display(null, true, _options.shrink);
                    }
                }
            };

            // bind events
            $this.find(_options.block).on('mouseenter' + $.aciFishEye.nameSpace, _enter);
            $this.find(_options.block).on('mousemove' + $.aciFishEye.nameSpace, _move);
            $this.find(_options.block).on('mouseleave' + $.aciFishEye.nameSpace, _leave);

        };

        // init the control
        return _initUi();

    };

})(jQuery);
