/*!
*  jquery.announcement - v1.2.0
*  Adds a fixed board at the bottom of your browser screen to display announcements.
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

            speed: 10, // Number [s] (0: disable autorun)

            effect: 'fading' // 'fading'
                // 'zoom-in' | 'zoom-out'
                // 'rotate-left' | 'rotate-right'
                // 'move-top' | 'move-right' | 'move-bottom' | 'move-left'
                // 'skew-top' | 'skew-right' | 'skew-bottom' | 'skew-left'
                // 'random' | 'shuffle'

        };

    function Plugin(element, options) {
        if (this.getCookie('jquery.announcement') === 'remove') {
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
        this.run = undefined;

        this.build();
        if (this.size > 0) this.init();
    }

    $.extend(Plugin.prototype, {
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
                'class': 'announcement-' + clazz
            });
        },
        build: function() {
            var set = this.settings,
                effect = set.effect,

                $wrap = this.genNode('wrap'),
                $title = this.genNode('title'),
                $content = this.genNode('content'),
                $buttons = this.genNode('button'),
                $toggle,
                $close,
                $list = $(this.element).addClass('announcement-list'),
                $items = $list.children('li'),
                $paging,
                $numbers,

                max = 0;

            this.size = $items.length;

            if (!this.size) return;

            $content.append($list);
            $wrap.addClass(set.position);
            $wrap.append($buttons).append($title).append($content).appendTo('body');

            if (set.showClose) {
                $close = this.genNode('close');
                $buttons.append($close);
            }
            if (set.showToggle) {
                $toggle = this.genNode('toggle');
                $buttons.append($toggle);
            }

            if (!set.showToggle && !set.showClose) $title.addClass('no-button');
            if (set.showToggle && set.showClose) $title.addClass('two-button');
            if (set.title !== '') $title.text(set.title);

            if (set.width === 'auto') set.width = $list.width();
            $list.add($items).width(set.width);
            $wrap.width($wrap.width());

            if (this.size === 1) {
                max = $items.eq(0).height();
            } else {

                $paging = this.genNode('paging');
                $content.append($paging);

                $items.each(function(index, value) {
                    var $num = $('<span>', {
                            'data-index': index,
                            text: (index + 1)
                        }),
                        currHeight = $(value).height();

                    if (currHeight > max) max = currHeight;

                    $num.appendTo($paging);

                    if (index === 0) {
                        $numbers = $num;
                    } else {
                        $numbers = $numbers.add($num);
                    }
                });

            }

            if (set.height !== 'auto' && $.type(set.height) === 'number') max = set.height;
            if (max > 0) $list.add($items).height(max);

            if (set.effect === 'random' || set.effect === 'shuffle') effect = this.randomEffect();
            if (effect !== 'fading') effect += ' fading';
            $list.addClass(effect);

            if (this.getCookie('jquery.announcement') === 'hidden') {
                $wrap.addClass('hidden');
                $content.hide();
            }

            this.nodes = {
                wrap: $wrap,
                title: $title,
                content: $content,
                toggle: $toggle,
                close: $close,
                list: $list,
                items: $items,
                numbers: $numbers
            };
        },
        active: function(index) {
            var $announce = this.nodes,
                set = this.settings;

            if (set.effect === 'shuffle') $announce.list.addClass(this.randomEffect(true));

            $announce.content.find('.active').removeClass('active');
            $announce.items.eq(index).addClass('active');
            if (this.size > 1) $announce.numbers.eq(index).addClass('active');

            this.current = index;
            this.count++;

            if (this.count > this.size) {
                if (set.autoHide === 'auto' && set.showToggle) {
                    this.minmax();
                    set.autoHide = 0;
                }

                if (set.autoClose === 'auto') {
                    this.destroy();
                    set.autoClose = 0;
                }
            }
        },
        play: function() {
            var _this = this,
                set = _this.settings,
                $announce = _this.nodes;

            if (set.speed === 0 || set.size === 1 || $announce.wrap.hasClass('hidden')) return;

            _this.current++;
            if (_this.current >= _this.size) _this.current = 0;

            clearTimeout(_this.run);
            _this.run = setTimeout(function() {
                _this.active(_this.current);
                _this.play();
            }, (set.speed * 1000));
        },
        stop: function() {
            if (this.run) {
                clearTimeout(this.run);
                this.run = undefined;
                this.current--;
            }
        },
        minmax: function() {
            var _this = this,
                $wrap = this.nodes.wrap;

            if (!$wrap.length) return;

            _this.nodes.content.slideToggle('slow', function() {
                if ($wrap.hasClass('hidden')) {
                    $wrap.removeClass('hidden');
                    _this.play();
                    _this.setCookie('jquery.announcement', 'hidden', -1);
                } else {
                    $wrap.addClass('hidden');
                    _this.stop();
                    _this.setCookie('jquery.announcement', 'hidden', 1);
                }
            });
        },
        destroy: function() {
            var $wrap = this.nodes.wrap;

            if (!$wrap.length) return;

            this.stop();
            $wrap.fadeOut('slow', function() {
                $wrap.remove();
            });
            this.setCookie('jquery.announcement', 'remove', 1);
        },
        init: function() {
            var _this = this,
                set = _this.settings,
                $announce = _this.nodes;

            _this.active(0);
            _this.play();

            if (_this.size > 1) $announce.numbers.on('click', function() {
                var index = $(this).data('index');
                if (index !== _this.current) _this.active(index);
            });

            if (set.showToggle) $announce.toggle.on('click', function() {
                _this.minmax();
            });
            if (set.showClose) $announce.close.on('click', function() {
                _this.destroy();
            });

            if (set.speed > 0) $announce.wrap.on('mouseleave', function() {
                _this.play();
            }).on('mouseenter', function() {
                _this.stop();
            });

            if (set.showToggle && ((typeof set.autoHide === 'number' && set.autoHide > 0) || (set.autoHide === 'auto' && _this.size === 1))) {
                if (set.autoHide === 'auto') set.autoHide = set.speed;

                setTimeout(function() {
                    if (!$announce.wrap.hasClass('hidden')) _this.minmax();
                }, set.autoHide * 1000);
            }
            if ((typeof set.autoClose === 'number' && set.autoClose > 0) || (set.autoClose === 'auto' && _this.size === 1)) {
                if (set.autoClose === 'auto') set.autoClose = set.speed;

                setTimeout(function() {
                    _this.destroy();
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
