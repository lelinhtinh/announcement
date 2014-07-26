/*!
 * jQuery Plugin announcement v0.1
 *
 * by zzbaivong
 * http://devs.forumvi.com/
 */
(function($) {
    "use strict";

    var my_getcookie = function(name) {
        var cname = name + '=';
        var cpos = document.cookie.indexOf(cname);
        if (cpos != -1) {
            var cstart = cpos + cname.length;
            var cend = document.cookie.indexOf(";", cstart);
            if (cend == -1) {
                cend = document.cookie.length;
            }
            return unescape(document.cookie.substring(cstart, cend));
        }
        return null;
    };

    var my_setcookie = function(name, value, sticky, path) {
        var expires = "";
        var domain = "";
        if (sticky) {
            expires = "; expires=Wed, 1 Jan 2020 00:00:00 GMT";
        }
        if (!path) {
            path = "/";
        }
        document.cookie = name + "=" + value + "; path=" + path + expires + domain + ';';
    };

    $.fn.announcement = function(options) {
        var setting = $.extend({
            width: 300, // px
            speed: 30000, // mili giây
            autoPlay: true, // boolean
            close: false, // boolean
            title: "Thông báo", // Tiêu đề bảng thông báo
            icon: {
                show: "http://i.imgur.com/1bDKWJT.png", // URL nút hiện
                hide: "http://i.imgur.com/aCZ3EGZ.png", // URL ảnh nút ẩn
                close: "http://i.imgur.com/uPes6CG.png" // URL ảnh nút đóng
            }
        }, options);

        var $list = $(this); // Danh sách tin nhắn

        $list.addClass("zzAnnouncement-list").wrap('<div id="zzAnnouncement"><div class="zzAnnouncement-content"></div></div>');
        // Tạo bảng thông báo

        var $announcement = $("#zzAnnouncement"); // Bảng thông báo
        var $content = $(".zzAnnouncement-content"); // Khung nội dung
        var $item = $("li", $list); // Tin nhắn

        $content.before('<div class="zzAnnouncement-title"><h2>' + setting.title + '</h2><div class="zzAnnouncement-button"><div class="zzAnnouncement-toggle">Toggle</div></div></div>');
        // Thêm tiêu đề vào bảng thông báo

        var $toggle = $(".zzAnnouncement-toggle"); // Nút ẩn/hiện    

        var leg = $item.length; // Số lượng tin nhắn
        var n = 0; // Vị trí tin đang hiển thị
        var $paging, $number; // Đặt biến cho phần số trang
        var loop; // Đặt biến cho hàm chuyển đổi tin hiển thị để dừng lại khi cần thiết

        var slideshow = function() {
            if ($content.is(":visible")) { // Nếu khung nội dung đang hiện
                loop = setInterval(function() {
                    n += 1; // Chuyển đến tin kế tiếp
                    if (n == leg) { // Nếu vượt qua tin cuối cùng
                        n = 0; // Thì trở lại tin đầu tiên
                    }
                    $number.eq(n).click(); // Kích hoạt sự kiện click lên số trang để hiển thị tin nhắn
                }, setting.speed); // Hàm chuyển đổi tin hiển thị
            }
        }; // Hàm chạy slideshow

        $announcement.width(setting.width); // Hiện bảng thông báo

        if (leg > 1) { // Nếu số tin nhắn lớn hơn 1

            $paging = $("<div>", {
                "class": "zzAnnouncement-paging"
            }); // Tạo khung chứa số thứ tự tin nhắn        
            $list.after($paging); // Thêm khung thứ tự tin vào sau danh sách tin nhắn

            var max = 0; // Đặt biến tính chiều cao tối đa của tin nhắn
            $item.each(function(index, ele) { // Duyệt qua từng tin nhắn
                var hi = $(this).height(); // Lấy chiều cao của tin đang xét
                if (hi > max) { // Nếu chiều cao lớn hơn mức tối đa
                    max = hi; // Đặt mức tối đa là chiều cao của tin đang xét
                }
                $paging.append($("<span>", {
                    "data-index": index,
                    text: (index + 1)
                })); // Tạo số thứ tự tin nhắn và thêm vào khung chứa
            });

            $list.add($item).height(max); // Đặt chiều cao cho danh sách tin và từng tin theo chiều cao tối đa tính được ở trên
            $item.first().addClass("show"); // Hiển thị tin đầu tiên
            $item.css("position", "absolute"); // Tách lớp từng tin nhắn

            $number = $("span", $paging); // Đặt biến cho số thứ tự tin nhắn
            $number.first().addClass("active"); // Đánh dấu số đầu tiên

            $number.click(function() { // Khi click vào số thứ tự
                var $this = $(this);
                var i = $this.data("index"); // Lấy giá trị vị trí tin nhắn
                n = i; // Cập nhật vị trí tin nhắn

                $("li.show", $list).removeClass("show"); // Ẩn tin đang hiện
                $item.eq(i).addClass("show"); // Hiện tin vừa click

                $("span.active", $paging).removeClass("active"); // Xóa đánh dấu số thứ tự tin
                $this.addClass("active"); // Đánh dấu số thứ tự tin vừa click
            });

            if (setting.autoPlay) { // Nếu cho phép chạy slideshow                
                slideshow(); // Chạy slideshow
                $announcement.hover(function() { // Rê chuột vào bảng thông báo
                    clearInterval(loop); // Dừng slideshow
                }, function() { // Rê chuột ra ngoài bảng thông báo
                    slideshow(); // Chạy slideshow
                });
            }
        }

        var save = my_getcookie("zzAnnouncement"); // Lấy giá trị cookie thông báo
        if (save == "hidden") { // Nếu giá trị là "hidden"
            $toggle.css("backgroundImage", "url(" + setting.icon.hide + ")"); // Thay icon nút ẩn/hiện
            $content.hide(); // Ẩn khung nội dung
        } else if (save == "remove") { // Nếu giá trị là "remove"
            $announcement.remove(); // Xóa bảng thông báo
        } else {
            $content.hide().slideDown("slow");
        }

        $toggle.click(function() { // Khi click vào nút ẩn/hiện
            $content.stop(true, false).slideToggle("slow", function() { // Ẩn/hiện khung nội dung bằng hàm .slideToggle()
                var hide, img; // Đặt biến thay đổi
                if ($content.is(":hidden")) { // Nếu khung nội dung bị ẩn
                    hide = "hidden";
                    img = setting.icon.hide;
                } else {
                    hide = null;
                    img = setting.icon.show;
                }
                $toggle.css("backgroundImage", "url(" + img + ")"); // Đổi icon nút ẩn/hiện
                my_setcookie("zzAnnouncement", hide, true); // Đặt cookie null hoặc "hidden" cho thông báo
            });
        });

        if (setting.close) { // Nếu cho phép dùng nút close
            var $close = $("<div>", {
                "style": "background-image: url(" + setting.icon.close + ")",
                "class": "zzAnnouncement-close"
            }); // Tạo nút đóng
            $toggle.before($close); // Thêm nút đóng vào phía trước nút ẩn/hiện
            $close.click(function() { // Click vào nút đóng
                $announcement.remove(); // Xóa bảng thông báo
                my_setcookie("zzAnnouncement", "remove", true); // Đặt cookie "remove" cho thông báo
            });
        }
    };
    // my_setcookie("zzAnnouncement", null, true);
})(jQuery);