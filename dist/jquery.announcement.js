/*!
*  jquery.announcement - v1.0.1
*  This plugin adds a fixed board at the bottom of your browser screen to display announcements.
*  https://github.com/baivong/announcement
*
*  Made by Zzbaivong
*  Under MIT License
*/(function($, window, document, undefined) {

    'use strict';

    var pluginName = 'announcement',
        defaults = {

            title: 'Announcement', // String

            showToggle: true, // Boolean
            showClose: false, // Boolean

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
        this.active = 0;
        this.run = undefined;
        this.build();
        this.init();
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

            if (this.size === 1) {
                max = $items.eq(0).height();
            } else {

                $paging = this.genNode('paging');
                $content.append($paging);

                if (set.width !== 'auto' && $.type(set.width) === 'number') $list.add($items).width(set.width);
                $list.add($items).width($list.width());
                $wrap.width($wrap.width());

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
        show: function(index) {
            var $announce = this.nodes;

            if (this.settings.effect === 'shuffle') $announce.list.addClass(this.randomEffect(true));

            $announce.content.find('.active').removeClass('active');
            $announce.items.eq(index).addClass('active');
            $announce.numbers.eq(index).addClass('active');

            this.active = index;
        },
        play: function() {
            var _this = this,
                set = _this.settings;

            if (set.speed === 0 || _this.nodes.wrap.hasClass('hidden')) return;

            _this.active++;
            if (_this.active >= _this.size) _this.active = 0;

            clearTimeout(_this.run);
            _this.run = setTimeout(function() {
                _this.show(_this.active);
                _this.play();
            }, (set.speed * 1000));
        },
        stop: function() {
            if (this.run) {
                clearTimeout(this.run);
                this.run = undefined;
                this.active--;
            }
        },
        init: function() {
            var _this = this,
                set = _this.settings,
                $announce = _this.nodes;

            _this.show(0);
            _this.play();

            if (_this.size > 1) $announce.numbers.on('click', function() {
                var index = $(this).data('index');
                if (index !== _this.active) _this.show(index);
            });

            if (set.showToggle) $announce.toggle.on('click', function() {
                $announce.content.slideToggle('slow', function() {
                    if ($announce.wrap.hasClass('hidden')) {
                        $announce.wrap.removeClass('hidden');
                        _this.play();
                        _this.setCookie('jquery.announcement', 'hidden', -1);
                    } else {
                        $announce.wrap.addClass('hidden');
                        _this.stop();
                        _this.setCookie('jquery.announcement', 'hidden', 1);
                    }
                });
            });

            if (set.showClose) $announce.close.on('click', function() {
                _this.stop();
                $announce.wrap.remove();
                _this.setCookie('jquery.announcement', 'remove', 1);
            });

            if (set.speed > 0) $announce.wrap.on('mouseleave', function() {
                _this.play();
            }).on('mouseenter', function() {
                _this.stop();
            });
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
