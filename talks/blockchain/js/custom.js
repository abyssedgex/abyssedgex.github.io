$(document).ready(function() {
    impress().init(); //starts impress.js

    // Entering State  (step)
    window.addEventListener('impress:stepenter', function() {

        // #Ready starts animation
        $('#ready.active').parents().find(".oneColm").animate({
            "top": "-50px",
            "opacity": .7
        }, 250);

        $('#ready.active').parents().find(".twoColm").animate({
            "top": "-500px",
            "opacity": 1
        }, 250);

        $('#ready.active').animate({
            "top": "-700px"
        }, 450).find(".fa-comments-o").show().addClass("animated bounceInRight");


        // #old start animation
        $('#old.active').parents('body').find("#block").css({
            "opacity": 1
        });

        // template
        $('#detailTempDirec.active').parents('body').find("#templateDirectives").css({
            "opacity": 1,
            "border-bottom": ""
        });
        $('#block.active .fa-bitcoin').css("position", "relative")
            .show()
            .animate({
                "left": "626px"
            }, 900)
            .animate({
                "left": "0"
            }, 900);

        $("#old.active .vsDivider").addClass("animated rotateIn");

        //how?
        $("#how.active h2").addClass("animated bounceInLeft");
        $("#how.active img").addClass("animated rotateIn");

        // why?
        $("#why.active .fa").addClass("animated tada");

        // Test for all
        $("#app2.present .land").animate({
            "top": "-30",
            "left": "30%"
        }, 1000);




    });

    //Leaving state (step)
    window.addEventListener('impress:stepleave', function() {

        //Ready Animation returns back
        $('#ready.past').parents("body").find(".slide")
            .animate({
                "top": "0"
            }, 1300).css("opacity", "");

        $('#ready.past').animate({
            "top": "0"
        }, 1000);

        $('#ready.past .fa-comments-o').hide().removeClass("animated bounceInRight");


        // #old ends animation
        $('#old.past').parents('body').find("#twoWay").css({
            "opacity": "",
            "border-bottom": ""
        });

        // #Tempalte and directive ends animation
        $('#detailTempDirec.past').parents('body').find("#templateDirectives").css({
            "opacity": "",
            "border-bottom": ""
        });

        // old
        $("#old.past").find(".vsDivider").removeClass("animated rotateIn");

        // how?
        $("#how.past h2").removeClass("animated bounceInLeft");
        $("#how.past img").removeClass("animated rotateIn");


        // why?
        $("#why.past .fa").removeClass("animated tada");

        //returns back the rocket in TestAll
        $("#app2.past .land").animate({
            "top": "60%",
            "left": "70px",
            "opacity": "1"
        }, 1000);
    });

    //entering state (substep)
    window.addEventListener('impress:substep-active', function() {
        $(".fly.present").animate({
            "top": "-20px",
            "left": "140%",
        }, 200);

        //explode subset is reached
        var browserDiv = $(".explode.present").parents();

        var rocketDiv = browserDiv.find('.land');
        //get ready position
        rocketDiv.css({
            "-webkit-transform": "rotate(80deg)",
            "-ms-transform": "rotate(80deg)",
            "-o-transform": "rotate(80deg)",
            "transform": "rotate(80deg)"
        });
        //go kill ie
        rocketDiv.animate({
            "top": "65%",
            "left": "470px",
            "opacity": 0
        }, 900);
        //browser explosion occur here
        var browserExplod = "./img/browserExplosion.gif";

        browserDiv.find(".imgBrowser").css({
            "background": "url(" + browserExplod + ") no-repeat center",
            "opacity": 1
        });

    });

    //leaving state (substep)
    window.addEventListener('impress:substep-inactive', function() {
        // $(".explode.past").parent().find(".imgBrowser").show();
        $('.fly.future').css({
            "top": "60%",
            "left": "70px"
        });

    });

});






    // var browserLink = "./img/browser.png";

    //     $('.fly.future').browserDiv.css(
    //         "background", "url(" + browserLink + ") no-repeat center")


    //              "-webkit-transform": "rotate(45deg)",
    //         "-ms-transform": "rotate(45deg)",
    //         "-o-transform": "rotate(45deg)",
    //         "transform": "rotate(45deg)",
