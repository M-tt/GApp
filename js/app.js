$(document).ready(function() {

});

var viewsWithDrawerMenu = ["startView", "aboutView"];

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

    if (viewsWithDrawerMenu.find(function(v) {return v === viewId;})) {
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

    /* //stuff from google toggleDrawer() method
    var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    // Set accessibility properties.
    if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
        this.drawer_.setAttribute('aria-hidden', 'false');
        drawerButton.setAttribute('aria-expanded', 'true');
    } else {
        this.drawer_.setAttribute('aria-hidden', 'true');
        drawerButton.setAttribute('aria-expanded', 'false');
    }
    */
}