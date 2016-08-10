/*!
*  jquery.announcement - v1.3.0
*  Adds a fixed widget at the bottom of your browser screen to display announcements.
*  https://github.com/baivong/announcement
*
*  Made by Zzbaivong
*  Under MIT License
*/

(function($, window, document, undefined) {

    'use strict';

    var pluginName = 'announcement',
        defaults = {

            title: 'Announcement', // String

            showToggle: true, // Boolean
            showClose: false, // Boolean

            autoHide: 'auto', // Number [s] (0: disable, 'auto': when finished slideshow)
            autoClose: 0, // Number [s] (0: disable, 'auto': when finished slideshow)

            position: 'bottom-right', // 'bottom-right' | 'bottom-left'

            width: 300, // 'auto' | Number [px]
            height: 'auto', // 'auto' | Number [px]
            zIndex: 99999, // Number

            speed: 10, // Number [s] (0: disable autorun)

            effect: 'fading' // 'fading'
                // 'zoom-in' | 'zoom-out'
                // 'rotate-left' | 'rotate-right'
                // 'move-top' | 'move-right' | 'move-bottom' | 'move-left'
                // 'skew-top' | 'skew-right' | 'skew-bottom' | 'skew-left'
                // 'random' | 'shuffle'

        },

        $window = $(window);

    function Plugin(element, options) {
        if (this.getCookie('jquery.' + pluginName) === 'remove') {
            $(element).remove();
            return;
        }

        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.nodes = {};
        this.size = 0;
        this.current = 0;
        this.count = 0;
        this.isHide = false;
        this.isClose = true;
        this.run = undefined;

        this.build();
        this.init();
    }

    $.extend(Plugin.prototype, {
        // http://stackoverflow.com/a/14763909
        detectCSSFeature: function(featurename) {
            var feature = false,
                domPrefixes = 'Webkit Moz ms O'.split(' '),
                elm = document.createElement('div'),
                featurenameCapital = null;

            featurename = featurename.toLowerCase();

            if (elm.style[featurename] !== undefined) { feature = true; }

            if (feature === false) {
                featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + featurenameCapital] !== undefined) {
                        feature = true;
                        break;
                    }
                }
            }
            return feature;
        },
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        getCookie: function(name) {
            var cname = name + '=',
                cpos = document.cookie.indexOf(cname),
                cstart,
                cend;

            if (cpos !== -1) {
                cstart = cpos + cname.length;
                cend = document.cookie.indexOf(';', cstart);
                if (cend === -1) cend = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(cstart, cend));
            }

            return null;
        },
        setCookie: function(cname, cvalue, exdays, path) {
            var domain = '',
                d = new Date();

            if (exdays) {
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                exdays = '; expires=' + d.toUTCString();
            }
            if (!path) path = '/';

            document.cookie = cname + '=' + cvalue + '; path=' + path + exdays + domain + ';';
        },
        randomEffect: function(shuffle) {
            var effect = 'zoom-in zoom-out rotate-left rotate-right move-top move-right move-bottom move-left skew-top skew-right skew-bottom skew-left';

            if (shuffle) this.nodes.list.removeClass(effect);

            effect = effect.split(' ');
            effect = effect[Math.floor(Math.random() * effect.length)];

            return effect;
        },
        genNode: function(clazz) {
            return $('<div>', {
                class: pluginName + '-' + clazz
            });
        },
        build: function() {
            var _this = this,
                set = _this.settings,
                effect = set.effect,

                $wrap = _this.genNode('wrap'),
                $title = _this.genNode('title'),
                $content = _this.genNode('content'),
                $buttons = _this.genNode('button'),
                $toggle,
                $close,
                $list = $(_this.element).addClass(pluginName + '-list'),
                $items = $list.children('li'),
                $paging = this.genNode('paging'),
                $numbers;

            _this.size = $items.length;

            if (!_this.size) return;

            $content.append($list);
            $wrap.addClass(set.position);
            $wrap.append($buttons).append($title).append($content).appendTo('body');

            if (set.zIndex !== 99999 && typeof set.zIndex === 'number') $wrap.css('z-index', set.zIndex);

            if (set.showClose) {
                $close = _this.genNode('close');
                $buttons.append($close);
            }
            if (set.showToggle) {
                $toggle = _this.genNode('toggle');
                $buttons.append($toggle);
            }

            if (!set.showToggle && !set.showClose) $title.addClass('no-button');
            if (set.showToggle && set.showClose) $title.addClass('two-button');
            if (set.title !== '') $title.text(set.title);

            if (effect !== 'fading' && _this.detectCSSFeature('transform')) {
                if (set.effect === 'random' || set.effect === 'shuffle') effect = _this.randomEffect() + ' fading';
            } else {
                effect = 'fading';
            }
            $list.addClass(effect);

            if (_this.size > 1) {
                $content.append($paging);

                $items.each(function(index) {
                    var $num = $('<span>', {
                        'data-index': index,
                        text: (index + 1)
                    });

                    $num.appendTo($paging);

                    if (index === 0) {
                        $numbers = $num;
                    } else {
                        $numbers = $numbers.add($num);
                    }
                });
            }

            _this.nodes = {
                wrap: $wrap,
                title: $title,
                content: $content,
                toggle: $toggle,
                close: $close,
                list: $list,
                items: $items,
                numbers: $numbers
            };

            _this.autoResize();
            if (_this.getCookie('jquery.' + pluginName) === 'hidden') {
                $wrap.addClass('hidden');
                $content.hide();
                _this.isHide = true;

                if (set.autoHide !== 0) set.autoHide = 0;
            }

            _this.isClose = false;
        },
        autoResize: function() {
            var set = this.settings,
                $wrap = this.nodes.wrap,
                $list = this.nodes.list,
                $items = this.nodes.items,
                $content = this.nodes.content,
                wrapHeight,
                winHeight = $window.height(),
                wrapWidth,
                winWidth = $window.width(),
                maxHeight = 0;

            $wrap.add($list).css({
                width: 'auto',
                height: 'auto'
            });

            if (this.isHide) $content.show();

            if (set.width === 'auto') set.width = $list.width();
            $list.width(set.width);
            $wrap.width($wrap.width());

            wrapWidth = $wrap.outerWidth();
            if (wrapWidth > winWidth) {
                $wrap.width(winWidth - 2);
                $list.width(winWidth - (wrapWidth - $list.outerWidth()));
            }

            if (this.size === 1) {
                maxHeight = $items.eq(0).height();
            } else {
                $items.each(function() {
                    var currHeight = $(this).height();

                    if (currHeight > maxHeight) maxHeight = currHeight;
                });
            }

            if (set.height !== 'auto' && $.type(set.height) === 'number') maxHeight = set.height;
            if (maxHeight > 0) $list.height(maxHeight);

            wrapHeight = $wrap.outerHeight();
            if (wrapHeight > winHeight) {
                $list.height(winHeight - (wrapHeight - maxHeight));
            }

            $items.css({
                width: $list.width(),
                height: $list.height()
            });

            if (this.isHide) $content.hide();
        },
        active: function(index) {
            var $announce = this.nodes,
                set = this.settings,
                $active = $announce.items.eq(index);

            if (!$active.length) return;

            if (set.effect === 'shuffle') $announce.list.addClass(this.randomEffect(true));

            $announce.content.find('.active').removeClass('active');
            $announce.items.eq(index).addClass('active');
            if (this.size > 1) $announce.numbers.eq(index).addClass('active');

            this.current = index;
            this.count++;

            if (this.count > this.size) {
                if (set.autoHide === 'auto') {
                    this.toggle();
                    set.autoHide = 0;
                }

                if (set.autoClose === 'auto') {
                    this.close();
                    set.autoClose = 0;
                }
            }
        },
        start: function() {
            var _this = this,
                set = _this.settings;

            if (set.speed === 0 || _this.size === 1 || _this.isHide || _this.isClose) return;

            _this.current++;
            if (_this.current >= _this.size) _this.current = 0;

            clearTimeout(_this.run);
            _this.run = setTimeout(function() {
                _this.active(_this.current);
                _this.start();
            }, (set.speed * 1000));
        },
        stop: function() {
            if (this.settings.speed === 0 || this.size === 1 || this.isHide || this.isClose || !this.run) return;

            clearTimeout(this.run);
            this.run = undefined;
            this.current--;
        },
        toggle: function() {
            var _this = this,
                $wrap = this.nodes.wrap;

            if (_this.isClose) return;

            _this.nodes.content.stop(true, false).slideToggle('slow', function() {
                if (_this.isClose) return;

                if (_this.isHide) {
                    $wrap.removeClass('hidden');
                    _this.isHide = false;

                    _this.start();
                    _this.setCookie('jquery.' + pluginName, 'hidden', -1);
                } else {
                    $wrap.addClass('hidden');
                    _this.isHide = true;

                    _this.stop();
                    _this.setCookie('jquery.' + pluginName, 'hidden', 1);
                }
            });
        },
        close: function() {
            var _this = this,
                $wrap = _this.nodes.wrap;

            if (_this.isClose) return;

            this.stop();
            $wrap.fadeOut('slow', function() {
                if (_this.isClose) return;

                $wrap.remove();
                _this.isClose = true;
            });
            this.setCookie('jquery.' + pluginName, 'remove', 1);
        },
        init: function() {
            var _this = this,
                set = _this.settings,
                $announce = _this.nodes,
                responsive;

            if (_this.size === 0 || _this.isClose) return;

            _this.active(_this.current);
            _this.start();

            responsive = _this.debounce(function() {
                _this.autoResize();
            }, 250);
            $window.on('resize', responsive);

            if (_this.size > 1) $announce.numbers.on('click', function() {
                var index = $(this).data('index');

                _this.active(index);

                if (set.autoHide !== 0) set.autoHide = 0;
                if (set.autoClose !== 0) set.autoClose = 0;
            });

            if (set.showToggle) $announce.toggle.on('click', function() {
                _this.toggle();
            });
            if (set.showClose) $announce.close.on('click', function() {
                _this.close();
            });

            if (set.speed > 0) $announce.wrap.on('mouseleave', function() {
                _this.start();
            }).on('mouseenter', function() {
                _this.stop();
            });

            if ((typeof set.autoHide === 'number' && set.autoHide > 0) || (set.autoHide === 'auto' && _this.size === 1)) {
                if (set.autoHide === 'auto') set.autoHide = set.speed;

                setTimeout(function() {
                    if (!_this.isHide) _this.toggle();
                }, set.autoHide * 1000);
            }
            if ((typeof set.autoClose === 'number' && set.autoClose > 0) || (set.autoClose === 'auto' && _this.size === 1)) {
                if (set.autoClose === 'auto') set.autoClose = set.speed;

                setTimeout(function() {
                    _this.close();
                }, set.autoClose * 1000);
            }
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
