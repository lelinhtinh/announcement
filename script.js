jQuery(function($) {

    'use strict';

    function getCookie(name) {
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
    }

    function setCookie(cname, cvalue, exdays, path) {
        var domain = '',
            d = new Date();

        if (exdays) {
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            exdays = '; expires=' + d.toUTCString();
        }
        if (!path) path = '/';

        document.cookie = cname + '=' + cvalue + '; path=' + path + exdays + domain + ';';
    }


    function toInt(str) {
        return parseInt(str, 10);
    }

    function addText($element, value, isString, changeColor) {
        if (isString) {
            if (changeColor) $element.css('color', '#183691');
            $element.text('\'' + value + '\'');
        } else {
            if (changeColor) $element.css('color', '#0086b3');
            $element.text(value);
        }
    }


    var config = {

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

        },


        $title = $('input', '#title'),
        $titleConfig = $('#titleConfig'),

        $showToggle = $('input[name="showToggle"]', '#button'),
        $showToggleConfig = $('#showToggleConfig'),

        $showClose = $('input[name="showClose"]', '#button'),
        $showCloseConfig = $('#showCloseConfig'),

        $position = $('input', '#position'),
        $positionConfig = $('#positionConfig'),

        $widthpx = $('input[name="widthpx"]', '#width'),
        $widthauto = $('input[name="widthauto"]', '#width'),
        $widthConfig = $('#widthConfig'),

        $heightpx = $('input[name="heightpx"]', '#height'),
        $heightauto = $('input[name="heightauto"]', '#height'),
        $heightConfig = $('#heightConfig'),

        $speed = $('input', '#speed'),
        $speedConfig = $('#speedConfig'),

        $effect = $('input', '#effect'),
        $effectConfig = $('#effectConfig');


    if (sessionStorage.announcementConfig) {
        config = JSON.parse(sessionStorage.announcementConfig);

        $title.val(config.title);
        addText($titleConfig, config.title, true);

        $showToggle.prop('checked', config.showToggle);
        $showToggleConfig.text(config.showToggle);

        $showClose.prop('checked', config.showClose);
        $showCloseConfig.text(config.showClose);

        $('input:checked', '#position').prop('checked', false);
        $('input[value="' + config.position + '"]', '#position').prop('checked', true);
        addText($positionConfig, config.position, true);

        if (config.width === 'auto') {
            $widthpx.val(300).prop('disabled', true);
            $widthauto.prop('checked', true);
            addText($widthConfig, 'auto', true, true);
        } else {
            $widthpx.val(config.width).prop('disabled', false);
            $widthauto.prop('checked', false);
            addText($widthConfig, config.width, false, true);
        }

        if (config.height === 'auto') {
            $heightpx.val(100).prop('disabled', true);
            $heightauto.prop('checked', true);
            addText($heightConfig, 'auto', true, true);
        } else {
            $heightpx.val(config.height).prop('disabled', false);
            $heightauto.prop('checked', false);
            addText($heightConfig, config.height, false, true);
        }

        $speed.val(config.speed);
        $speedConfig.text(config.speed);

        $('input:checked', '#effect').prop('checked', false);
        $('input[value="' + config.effect + '"]', '#effect').prop('checked', true);
        addText($effectConfig, config.effect, true);
    }


    $('#ticker').announcement(config);


    $title.on('input', function() {
        config.title = this.value.trim();
        addText($titleConfig, config.title, true);
    });

    $showToggle.on('change', function() {
        config.showToggle = this.checked;
        $showToggleConfig.text(config.showToggle);
    });

    $showClose.on('change', function() {
        config.showClose = this.checked;
        $showCloseConfig.text(config.showClose);
    });

    $position.on('change', function() {
        config.position = $(this).val();
        addText($positionConfig, config.position, true);
    });

    $widthpx.on('input', function() {
        config.width = toInt(this.value);
        $widthConfig.text(config.width);
    });
    $widthauto.on('change', function() {
        if (this.checked) {
            config.width = 'auto';
        } else {
            config.width = toInt($widthpx.val());
        }
        $widthpx.prop('disabled', this.checked);
        addText($widthConfig, config.width, this.checked, true);
    });

    $heightpx.on('input', function() {
        config.height = toInt(this.value);
        $heightConfig.text(config.height);
    });
    $heightauto.on('change', function() {
        if (this.checked) {
            config.height = 'auto';
        } else {
            config.height = toInt($heightpx.val());
        }
        $heightpx.prop('disabled', this.checked);
        addText($heightConfig, config.height, this.checked, true);
    });

    $speed.on('input', function() {
        config.speed = toInt(this.value);
        $speedConfig.text(config.speed);
    });

    $effect.on('change', function() {
        config.effect = $(this).val();
        addText($effectConfig, config.effect, true);
    });

    $('#submit').on('click', function() {
        sessionStorage.setItem('announcementConfig', JSON.stringify(config));
        location.reload();
    });

    $('#reset').on('click', function() {
        if (getCookie('jquery.announcement') !== null) setCookie('jquery.announcement', null, -1);
        if (sessionStorage.announcementConfig) sessionStorage.removeItem('announcementConfig');
        location.reload();
    });

});
