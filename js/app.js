$(document).ready(function() {

});


function switchToView(viewId) {

    // hides and unhides the tabs
    $("#startViewTabBar").parent()[0].style = "display:none;";
    if (viewId == "startView") {
        $("#startViewTabBar").parent()[0].style = "";
    }

    //toggles the viewable items
    var views = $(".bakery-view");
    for (let i = 0; i < views.length; i++) {
        views[i].classList.remove("is-active");
    }

    var view = $("#"+viewId+".bakery-view");
    view.addClass("is-active");

    closeDrawer();
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