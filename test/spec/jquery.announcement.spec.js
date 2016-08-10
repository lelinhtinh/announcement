(function($, QUnit) {

    'use strict';

    var $testCanvas = $('#testCanvas');
    var $fixture = null;

    QUnit.module('jQuery Announcement', {
        beforeEach: function() {

            // fixture is the element where your jQuery plugin will act
            $fixture = $('<ul/>').append($('<li/>', {
                text: 'News ticker 1'
            })).append($('<li/>', {
                text: 'News ticker 2'
            })).append($('<li/>', {
                text: 'News ticker 3'
            }));

            $testCanvas.append($fixture);
        },
        afterEach: function() {

            // we remove the element to reset our plugin job :)
            $fixture.remove();
        }
    });

    QUnit.test('is inside jQuery library', function(assert) {
        assert.equal(typeof $.fn.announcement, 'function', 'has function inside jquery.fn');
        assert.equal(typeof $fixture.announcement, 'function', 'another way to test it');
    });

    QUnit.test('returns jQuery functions after called (chaining)', function(assert) {
        assert.equal(typeof $fixture.announcement().on, 'function', '"on" function must exist after plugin call');
    });

    QUnit.test('caches plugin instance', function(assert) {
        $fixture.announcement();
        assert.ok(
            $fixture.data('plugin_announcement'),
            'has cached it into a jQuery data'
        );
    });

    QUnit.test('enable custom config', function(assert) {
        $fixture.announcement({
            foo: 'bar'
        });

        var pluginData = $fixture.data('plugin_announcement');

        assert.deepEqual(
            pluginData.settings, {
                title: 'Announcement',
                showToggle: true,
                showClose: false,
                autoHide: 'auto',
                autoClose: 0,
                position: 'bottom-right',
                width: 300,
                height: 'auto',
                zIndex: 99999,
                speed: 10,
                effect: 'fading',
                foo: 'bar'
            },
            'extend plugin settings'
        );

    });

    QUnit.test('changes the element class', function(assert) {
        $fixture.announcement();

        assert.equal($fixture.attr('class'), 'announcement-list fading');
    });

    QUnit.test('has #build working as expected', function(assert) {
        $fixture.announcement();

        var instance = $fixture.data('plugin_announcement'),
            index = 1;

        instance.active(index);
        assert.equal(instance.current, index);
    });

}(jQuery, QUnit));
