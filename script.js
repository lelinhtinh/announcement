jQuery(function($) {

    'use strict';

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

    function onlyCheck($check, $output, key) {
        $check.prop('checked', config[key]);
        $output.text(config[key]);
    }

    function multiOptions($output, id, key) {
        $('input:checked', id).prop('checked', false);
        $('input[value="' + config[key] + '"]', id).prop('checked', true);
        addText($output, config[key], true);
    }

    function dualTypes($text, $check, $output, key, val) {
        if (config[key] === 'auto') {
            $text.val(val).prop('disabled', true);
            $check.prop('checked', true);
            addText($output, 'auto', true, true);
        } else {
            $text.val(config[key]).prop('disabled', false);
            $check.prop('checked', false);
            addText($output, config[key], false, true);
        }
    }

    function onlyNumber ($input, $output, key) {
        $input.val(config[key]);
        $output.text(config[key]);
    }

    var config = {

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


        $title = $('input', '#title'),
        $titleConfig = $('#titleConfig'),

        $showToggle = $('input[name="showToggle"]', '#button'),
        $showToggleConfig = $('#showToggleConfig'),

        $showClose = $('input[name="showClose"]', '#button'),
        $showCloseConfig = $('#showCloseConfig'),

        $hideTime = $('input[name="hideTime"]', '#autoHide'),
        $hideAuto = $('input[name="hideAuto"]', '#autoHide'),
        $autoHideConfig = $('#autoHideConfig'),

        $closeTime = $('input[name="closeTime"]', '#autoClose'),
        $closeAuto = $('input[name="closeAuto"]', '#autoClose'),
        $autoCloseConfig = $('#autoCloseConfig'),

        $position = $('input', '#position'),
        $positionConfig = $('#positionConfig'),

        $widthpx = $('input[name="widthpx"]', '#width'),
        $widthauto = $('input[name="widthauto"]', '#width'),
        $widthConfig = $('#widthConfig'),

        $heightpx = $('input[name="heightpx"]', '#height'),
        $heightauto = $('input[name="heightauto"]', '#height'),
        $heightConfig = $('#heightConfig'),

        $zIndex = $('input', '#zIndex'),
        $zIndexConfig = $('#zIndexConfig'),

        $speed = $('input', '#speed'),
        $speedConfig = $('#speedConfig'),

        $effect = $('input', '#effect'),
        $effectConfig = $('#effectConfig');


    if (sessionStorage.announcementConfig) {
        config = JSON.parse(sessionStorage.announcementConfig);

        $title.val(config.title);
        addText($titleConfig, config.title, true);

        onlyCheck($showToggle, $showToggleConfig, 'showToggle');

        onlyCheck($showClose, $showCloseConfig, 'showClose');

        dualTypes($hideTime, $hideAuto, $autoHideConfig, 'autoHide', 30);

        dualTypes($closeTime, $closeAuto, $autoCloseConfig, 'autoClose', 0);

        multiOptions($positionConfig, '#position', 'position');

        dualTypes($widthpx, $widthauto, $widthConfig, 'width', 300);

        dualTypes($heightpx, $heightauto, $heightConfig, 'height', 100);

        onlyNumber ($speed, $speedConfig, 'speed');

        onlyNumber ($zIndex, $zIndexConfig, 'zIndex');

        multiOptions($effectConfig, '#effect', 'effect');
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

    $hideTime.on('input', function() {
        config.autoHide = toInt(this.value);
        $autoHideConfig.text(config.autoHide);
    });
    $hideAuto.on('change', function() {
        if (this.checked) {
            config.autoHide = 'auto';
        } else {
            config.autoHide = toInt($hideTime.val());
        }
        $hideTime.prop('disabled', this.checked);
        addText($autoHideConfig, config.autoHide, this.checked, true);
    });

    $closeTime.on('input', function() {
        config.autoClose = toInt(this.value);
        $autoCloseConfig.text(config.autoClose);
    });
    $closeAuto.on('change', function() {
        if (this.checked) {
            config.autoClose = 'auto';
        } else {
            config.autoClose = toInt($closeTime.val());
        }
        $closeTime.prop('disabled', this.checked);
        addText($autoCloseConfig, config.autoClose, this.checked, true);
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

    $zIndex.on('input', function() {
        config.zIndex = toInt(this.value);
        $zIndexConfig.text(config.zIndex);
    });

    $effect.on('change', function() {
        config.effect = $(this).val();
        addText($effectConfig, config.effect, true);
    });

    $('#submit').on('click', function() {
        sessionStorage.setItem('announcementConfig', JSON.stringify(config));
        location.reload(true);
    });

    $('#reset').on('click', function() {
        var instance = $('#ticker').data('plugin_announcement');

        if (instance.getCookie('jquery.announcement') !== null) instance.setCookie('jquery.announcement', null, -1);
        if (sessionStorage.announcementConfig) sessionStorage.removeItem('announcementConfig');
        location.reload(true);
    });

});
