$(document).ready(function() {
    initTodoListHandler();
    bindEvents();
});


function bindEvents() {

    //make questionnaire info text in intro card also clickable
    $("#questionnaireInfoText").click(function() {
        $("#questionnaireIcon").parents("a")[0].click();
    })

}

var viewsWithDrawerMenu = ["startView", "aboutView", "communityView", "matchingView", "lawyerView"];

var viewHistory = ["startView"];

function switchToView(viewId) {

    // hides and unhides the tabs
    var tabBar = $("#startViewTabBar").parent()[0];
    tabBar.style = "display:none;";
    if (viewId === "startView") {
        tabBar.style = "";
    }

    // transforms drawer menu button to back button and vice versa
    var drawerButton = $("#drawerMenuButton")[0];
    var backButton = $("#backButton")[0];

    drawerButton.style = "display: none;";
    backButton.style = "display: none;";

    if (viewsWithDrawerMenu.find(name => name === viewId)) {
        drawerButton.style = "";
    } else {
        backButton.style = "";
    }

    //toggles the viewable items
    var views = $(".bakery-view");
    for (let i = 0; i < views.length; i++) {
        views[i].classList.remove("is-active");
    }

    var view = $("#"+viewId+".bakery-view");
    view.addClass("is-active");

    closeDrawer();

    viewHistory.push(viewId);
}

function goBack() {
    viewHistory.pop();
    var lastView = viewHistory.pop();
    switchToView(lastView);
}

function closeDrawer() {
    $('.mdl-layout__drawer')[0].classList.remove("is-visible");
    $('.mdl-layout__obfuscator')[0].classList.remove("is-visible");
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function closeIntroCard() {
    $("#introCardCell").hide();
}

function scrollToQuestionnaireInfoCard() {
    $(".mdl-layout__content").scrollTo("#questionnaireInfoCard", 600, {
        offset: -16
    });

    $("#questionnaireInfoCard").addClass("shakeFast");
}

function removeShakeFromQuestionnaireInfoCard() {
    $("#questionnaireInfoCard").removeClass("shakeFast");
}