# jQuery plugin Announcement

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flelinhtinh%2Fannouncement.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flelinhtinh%2Fannouncement?ref=badge_shield)

Adds a fixed widget at the bottom of your browser screen to display announcements.

![Screenshot](https://lelinhtinh.github.io/announcement/screenshot.png)

## Demo

https://lelinhtinh.github.io/announcement/

## Installation

Get the latest *release* of this plugin on [Release page](https://github.com/baivong/announcement/releases) or use the command line:

[Bower](http://bower.io/)

```bash
$ bower install jquery.announcement
```

[npm](http://www.npmjs.com/)

```bash
$ npm install jquery.announcement
```

## Usage

Announcement depends on jQuery. Include Announcement script and stylesheet in your document:

```html
<!-- Add jQuery 1.7+ library -->
<script src="jquery.js" type="text/javascript"></script>

<!-- Add jQuery plugin Announcement -->
<link href="jquery.announcement.css" rel="stylesheet" type="text/css">
<script src="jquery.announcement.js" type="text/javascript"></script>
```

Create list elements will contain the content you wish to display within the Announcement.

```html
<ul class="newsticker">
    <li>News content 1</li>
    <li>News content 2</li>
    <li>News content n</li>
</ul>
```

... then in your code do:

```javascript
$(function() {
    $('.newsticker').announcement();
});
```

### Configuration

| Name       |      Type      |    Default     | Description                                                      |
|------------|:--------------:|:--------------:|------------------------------------------------------------------|
| title      |     String     | 'Announcement' | Display after the announcement widget is minimized.              |
| showToggle |    Boolean     |      true      | Display maximize/minimize button.                                |
| showClose  |    Boolean     |     false      | Display close button.                                            |
| autoHide   | String, Number |     'auto'     | Timer minimizes. Can be numeric or `'auto'`. Set `0` to disable. |
| autoClose  | String, Number |       0        | Timer close. Can be numeric or `'auto'`. Set `0` to disable.     |
| position   |     String     | 'bottom-right' | `bottom-left` or `bottom-right`                                  |
| width      | String, Number |      300       | Width of announcement. Can be numeric or `'auto'`.               |
| height     | String, Number |     'auto'     | Height of announcement. Can be numeric or `'auto'`.              |
| zIndex     |     Number     |      99999     | Set CSS `z-index` property of the announcement widget.           |
| speed      |     Number     |       10       | Slideshow speed in seconds. Set `0` to disable.                  |
| effect     |     String     |    'fading'    | `fading`, `zoom-in`, `zoom-out`, `rotate-left`, `rotate-right`, `move-top`, `move-right`, `move-bottom`, `move-left`, `skew-top`, `skew-right`, `skew-bottom`, `skew-left`, `random`, `shuffle` |

### Publish method

Get plugin instance
```javascript
var instance = $('.newsticker').data('plugin_announcement');
```

#### .active(index)

Show announcement according to `index`
```javascript
instance.active(0);
```

#### .start()

Start slideshow
```javascript
instance.start();
```

#### .stop()

Stop slideshow
```javascript
instance.stop();
```

#### .toggle()

Minimize/maximize Announcement widget
```javascript
instance.toggle();
```

#### .close()

Remove Announcement widget
```javascript
instance.close();
```

#### .autoResize()

Update size of the widget when window size changes
```javascript
instance.autoResize();
```

#### .getCookie(name)

Get cookie has name is `jquery.announcement`
```javascript
instance.getCookie('jquery.announcement');
```

#### .setCookie(name, value, exdays, path)

Set cookie to hide Announcement widget
```javascript
instance.setCookie('jquery.announcement', 'hidden', 1);
```

Remove cookie
```javascript
instance.setCookie('jquery.announcement', '', -1);
```

### .detectCSSFeature(name)

Detecting browser supports CSS feature
```javascript
instance.detectCSSFeature('transform');
```

## Thanks to

[jQuery boilerplate team](http://jqueryboilerplate.com) and a bunch of awesome [contributors](https://github.com/jquery-boilerplate/boilerplate/graphs/contributors).

## License

[MIT License](https://baivong.mit-license.org/) © Zzbaivong


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flelinhtinh%2Fannouncement.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flelinhtinh%2Fannouncement?ref=badge_large)
