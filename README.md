# jQuery plugin Announcement

This plugin adds a fixed board at the bottom of your browser screen to show announcements.

## Demo

http://baivong.github.io/announcement/

## How to Use?

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

### Plugin Options

| Name       |      Type      |    Default     | Description                                                     |
|------------|:--------------:|:--------------:|-----------------------------------------------------------------|
| title      |     String     | 'Announcement' | It will be displayed after the announcement board is minimized. |
| showToggle |    Boolean     |      true      | Display maximize/minimize button.                               |
| showClose  |    Boolean     |     false      | Display close button.                                           |
| position   |     String     | 'bottom-right' | `bottom-left` or `bottom-right`                                 |
| width      | String, Number |      300       | Width of announcement. Can be numeric or 'auto'.                |
| height     | String, Number |     'auto'     | Height of announcement. Can be numeric or 'auto'.               |
| speed      |     Number     |       10       | Slideshow speed in seconds. Set `0` to disable.                 |
| effect     |     String     |    'fading'    | `fading`, `zoom-in`, `zoom-out`, `rotate-left`, `rotate-right`, `move-top`, `move-right`, `move-bottom`, `move-left`, `skew-top`, `skew-right`, `skew-bottom`, `skew-left`, `random`, `shuffle` |

## Thanks to

[jQuery boilerplate team](http://jqueryboilerplate.com) and a bunch of awesome [contributors](https://github.com/jquery-boilerplate/boilerplate/graphs/contributors).

## License

[MIT License](https://opensource.org/licenses/MIT) © Zzbaivong
