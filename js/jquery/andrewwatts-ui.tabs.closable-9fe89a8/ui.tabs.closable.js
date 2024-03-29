/*!
 * Copyright (c) 2010 Andrew Watts
 *
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL (GPL_LICENSE.txt) licenses
 * 
 * http://github.com/andrewwatts/ui.tabs.closable
 */
(function() {
    
var ui_tabs_tabify = $.ui.tabs.prototype._tabify;

$.extend($.ui.tabs.prototype, {

    _tabify: function() {
        var self = this;

        ui_tabs_tabify.apply(this, arguments);

        // if closable tabs are enable, add a close button
        if (self.options.closable === true) {

            var unclosable_lis = this.lis.filter(function() {
                // return the lis that do not have a close button
                return $('span.ui-icon-closethick', this).length === 0;
            });

            // append the close button and associated events
            unclosable_lis.each(function() {
                $(this)
                    .prepend('<div class="fermerOnglet"><span class="ui-icon ui-icon-closethick"></span></div>')
                    .find('div:last')
                        .hover(
                            function() {
                                $(this).css('cursor', 'pointer');
                            },
                            function() {
                                $(this).css('cursor', 'default');
                            }
                        )
                        .click(function() {
                            var index = self.lis.index($(this).parent());
                            if (index > -1) {
                                // call _trigger to see if remove is allowed
                                if (false === self._trigger("closableClick", null, self._ui( $(self.lis[index]).find( "div" )[ 0 ], self.panels[index] ))) return;

                                // remove this tab
                                self.remove(index)
                            }

                            // don't follow the link
                            return false;
                        })
                    .end();
            });
        }
    }
});
    
})(jQuery);
