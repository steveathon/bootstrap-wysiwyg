/* 
* Webkitresize (http://editorboost.net/webkitresize)
* Copyright 2012 Editorboost. All rights reserved. 
*
* Webkitresize commercial licenses may be obtained at http://editorboost.net/home/licenses.
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3. For GPL requirements, please
* review: http://www.gnu.org/copyleft/gpl.html
*
* Version date: March 19 2013
* REQUIRES: jquery 1.7.1+
*/

;
(function(){
    'use strict';
    var
        /**
         * Defaults configurations
         */
        _defaults = {},

        /**
         * Main object
         */
        WebkitImageResize = function(el, options){
            this.init(el, options);
        };

    WebkitImageResize.prototype = {
        init: function(el, options){

            if (!el.attr('contenteditable')) {
                return;
            }

            // Target element for inline editor
            this.options = $.extend({}, _defaults, options);
            this.target = el;
            this.body = $(document.body);
            this.resizeElements = $(
                "<span class='img-resize-selector'></span>" +
                "<span class='img-resize-region region-top-right'></span>" +
                "<span class='img-resize-region region-top-down'></span>" +
                "<span class='img-resize-region region-right-down'></span>" +
                "<span class='img-resize-region region-down-left'></span>"
            ).hide();
            this.body.append(this.resizeElements);
            this.currentImage = null;

            // Vars for resize operations
            this._lastCrc = this._crc(this.target.html());
            this._imageResizeinProgress = false;
            this._currentImage_HxW_Rate = null;
            this._currentImage_WxH_Rate = null;
            this._initialHeight = null;
            this._initialWidth = null;

            this._bind();
        },

        destroy: function(){
            this._reset();
            this.resizeElements.remove();
            $(document).off('.webkitimageresize');
            $(window).off('.webkitimageresize');
            this.target.off('.webkitimageresize').removeData('webkitimageresize');
        },

        _bind: function(){
            var self = this;

            // Live event on img click into editor
            $(document)
                .on('click.webkitimageresize', '#' + this.target.attr('id') + ' img', $.proxy(this._onImageClick, this))
                .on('mouseup.webkitimageresize', $.proxy(this._onDocumentMouseUp, this))
                .on('mousemove.webkitimageresize', $.proxy(this._onDocumentMouseMove, this));
            this.target.on('scroll.webkitimageresize', function () {self._reset();});

            this.resizeElements.filter(".img-resize-selector").mousedown($.proxy(this._onResizeMouseDown, this));


            if (!this.target.get(0).crcChecker) {
                this.target.get(0).crcChecker = setInterval(function () {
                    var currentCrc = self._crc(self.target.html());
                    if (self._lastCrc != currentCrc) {
                        self._lastCrc = currentCrc;
                        self._reset();
                    }
                }, 1000);
            }

            $(window).on('resize.webkitimageresize', function(){
                self._reset();
            });

            this._refresh();
        },

        _onImageClick: function (evt) {
            this.currentImage =  $(evt.currentTarget);
            this._showResizers();
            this.target.trigger('webkitresize-select', [this.currentImage.get(0)]);
        },

        _onResizeMouseDown: function (evt) {
            var imgH = this.currentImage.height();
            var imgW = this.currentImage.width();

            this._currentImage_HxW_Rate = imgH / imgW;
            this._currentImage_WxH_Rate = imgW / imgH;
            if(imgH > imgW){
                this._initialHeight = 0;
                this._initialWidth = (imgH - imgW) * -1;
            }
            else{
                this._initialWidth = 0;
                this._initialHeight = (imgW - imgH) * -1;
            }

            this._imageResizeinProgress = true;

            return false;
        },

        _onDocumentMouseUp: function () {
            if (this._imageResizeinProgress) {
                this.currentImage
                    .attr("width", this.resizeElements.filter('.region-top-right').width())
                    .attr('height', this.resizeElements.filter(".region-top-down").height());
                this._refresh();
                this._lastCrc = this._crc(this.target.html());
                this._imageResizeinProgress = false;
            } else{
                 this.resizeElements.hide();
            }
        },

        _onDocumentMouseMove: function (evt) {
            if (this._imageResizeinProgress) {
                var imgHeight = this.currentImage.outerHeight();
                var imgWidth = this.currentImage.outerWidth();
                var elPos = this.target.offset();
                var imgPosition = this.currentImage.position();
                var elScrollTop = this.target.scrollTop();
                var elScrollLeft = this.target.scrollLeft();
                var resWidth = this.currentImage.outerHeight();
                var resHeight = this.currentImage.outerWidth();

                resHeight = evt.pageY - (elPos.top + imgPosition.top - elScrollTop);
                resWidth = evt.pageX - (elPos.left + imgPosition.left - elScrollLeft);

                if (resHeight < 1) {
                    resHeight = 1;
                }
                if (resWidth < 1) {
                    resWidth = 1;
                }

                if(this.options.keepAspectRatio || evt.ctrlKey){
                    var heightDiff = this._initialHeight - resHeight;
                    if(heightDiff < 0){
                        heightDiff = heightDiff * -1.0;
                    }
                    var widthDiff = this._initialWidth - resWidth;
                    if(widthDiff < 0){
                        widthDiff = widthDiff * -1.0;
                    }

                    if(heightDiff > widthDiff){
                        resWidth = resHeight * self._currentImage_WxH_Rate;
                    }
                    else{
                        resHeight = resWidth * self._currentImage_HxW_Rate;
                    }
                }

                this.resizeElements.filter(".img-resize-selector").css("top", (elPos.top + imgPosition.top - elScrollTop + resHeight - 10) + 'px').css("left", (elPos.left + imgPosition.left - elScrollLeft + resWidth - 10) + "px");
                this.resizeElements.filter(".region-top-right").css("width", resWidth + "px");
                this.resizeElements.filter(".region-top-down").css("height", resHeight + "px");
                this.resizeElements.filter(".region-right-down").css("left", (elPos.left + imgPosition.left - elScrollLeft + resWidth) + "px").css("height", resHeight + "px");
                this.resizeElements.filter(".region-down-left").css("top", (elPos.top + imgPosition.top - elScrollTop + resHeight) + "px").css("width", resWidth + "px");
                return false;
            }
        },

        _showResizers: function(){
            if (!this.currentImage) {
                return;
            }

            var imgHeight = this.currentImage.outerHeight();
            var imgWidth = this.currentImage.outerWidth();
            var elPos = this.target.offset();
            var imgPosition = this.currentImage.position();
            var elScrollTop = this.target.scrollTop();
            var elScrollLeft = this.target.scrollLeft();

            this.resizeElements.filter('.img-resize-selector').css({top: (elPos.top + imgPosition.top - elScrollTop + imgHeight - 10) + 'px', left: (elPos.left + imgPosition.left - elScrollLeft + imgWidth - 10) + 'px'});
            this.resizeElements.filter('.region-top-right').css({top: (elPos.top + imgPosition.top - elScrollTop) + 'px', left: (elPos.left + imgPosition.left - elScrollLeft) + 'px', width: imgWidth + 'px'});
            this.resizeElements.filter('.region-top-down').css({top: (elPos.top + imgPosition.top - elScrollTop) + 'px', left: (elPos.left + imgPosition.left - elScrollLeft) + 'px', height: imgHeight + 'px'});
            this.resizeElements.filter('.region-right-down').css({top: (elPos.top + imgPosition.top - elScrollTop) + 'px', left: (elPos.left + imgPosition.left - elScrollLeft + imgWidth) + 'px', height: imgHeight + 'px'});
            this.resizeElements.filter('.region-down-left').css({top: (elPos.top + imgPosition.top - elScrollTop + imgHeight) + 'px', left: (elPos.left + imgPosition.left - elScrollLeft) + 'px', width: imgWidth + 'px'});
            this.resizeElements.show();
        },

        _refresh: function () {
            if (!this.currentImage) {
                return;
            }

            this._showResizers();

            this._lastCrc = this._crc(this.target.html());
        },

        _reset: function () {
            if (this.currentImage != null) {
                this.currentImage = null;
                this._imageResizeinProgress = false;
                this.resizeElements.hide();
            }
        },

        _crc: function (str) {
            var hash = 0, c = '';
            if (str.length == 0) return hash;
            for (var i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + c;
                hash = hash & hash;
            }
            return hash;
        }
    };

    $.fn.webkitimageresize = function(options) {
        if(typeof options=="string" && this.data('webkitimageresize')){
            return this.data('webkitimageresize')[options]();
        } else {
            this.data('webkitimageresize', new WebkitImageResize(this, options));
        }
        return this;
    }

})();