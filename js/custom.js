$(document).ready(function(){

	/* ------------------------>>> Прижать футер к низу <<<------------------------------------------------- */
    (function(){

        footer();

        $(window).resize(function() {
            footer();
        });

        function footer() {
            var docHeight = $(window).height(),
                footerHeight = $('footer').outerHeight(),
                footerTop = $('footer').position().top + footerHeight;

            if (footerTop < docHeight) {
                // $('footer').css('margin-top', (docHeight - footerTop) + 'px');

                $('.content__main').css('height', (docHeight - footerHeight) + 'px');
            }
        }

    })();
	/* ------------------------>>> Прижать футер к низу End <<<--------------------------------------------- */





});