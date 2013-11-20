/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
(function($) {
    var re = /(?:(?=(?:http|https):)([a-zA-Z][-+.a-zA-Z\d]*):(?:((?:[-_.!~*'()a-zA-Z\d;?:@&=+$,]|%[a-fA-F\d]{2})(?:[-_.!~*'()a-zA-Z\d;\/?:@&=+$,\[\]]|%[a-fA-F\d]{2})*)|(?:(?:\/\/(?:(?:(?:((?:[-_.!~*'()a-zA-Z\d;:&=+$,]|%[a-fA-F\d]{2})*)@)?(?:((?:(?:(?:[a-zA-Z\d](?:[-a-zA-Z\d]*[a-zA-Z\d])?)\.)*(?:[a-zA-Z](?:[-a-zA-Z\d]*[a-zA-Z\d])?)\.?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[(?:(?:[a-fA-F\d]{1,4}:)*(?:[a-fA-F\d]{1,4}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:(?:[a-fA-F\d]{1,4}:)*[a-fA-F\d]{1,4})?::(?:(?:[a-fA-F\d]{1,4}:)*(?:[a-fA-F\d]{1,4}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))?)\]))(?::(\d*))?))?|((?:[-_.!~*'()a-zA-Z\d$,;:@&=+]|%[a-fA-F\d]{2})+))|(?!\/\/))(\/(?:[-_.!~*'()a-zA-Z\d:@&=+$,]|%[a-fA-F\d]{2})*(?:;(?:[-_.!~*'()a-zA-Z\d:@&=+$,]|%[a-fA-F\d]{2})*)*(?:\/(?:[-_.!~*'()a-zA-Z\d:@&=+$,]|%[a-fA-F\d]{2})*(?:;(?:[-_.!~*'()a-zA-Z\d:@&=+$,]|%[a-fA-F\d]{2})*)*)*)?)(?:\?((?:[-_.!~*'()a-zA-Z\d;\/?:@&=+$,\[\]]|%[a-fA-F\d]{2})*))?)(?:\#((?:[-_.!~*'()a-zA-Z\d;\/?:@&=+$,\[\]]|%[a-fA-F\d]{2})*))?)/img,

        makeHTML = function(textNode) {
            var source = textNode.data;
            return source.replace(re, function() {
                var url = arguments[0],
                    a = $('<a></a>').attr({'href': url}).text(url);
                return url.match(/^https?:\/\/$/) ? url : $('<div></div>').append(a).html();
            });
        },

        eachText = function(node, callback) {
            $.each(node.childNodes, function() {
                if (this.nodeType != 8 && this.nodeName != 'A') {
                    this.nodeType != 1 ? callback(this) : eachText(this, callback);
                }
            });
        };

    $.fn.autolink = function() {
        return this.each(function() {
            var queue = [];
            eachText(this, function(e) {
                var html = makeHTML(e);
                if (html != e.data) {
                    queue.push([e, html]);
                }
            });
            $.each(queue, function(i, x) {
                $(x[0]).replaceWith(x[1]);
            });
        });
    };
}(window.jQuery));
(function ($) {
	'use strict';

    var

    /**
     * Defaults configurations
     */
    _defaults = {
        hotKeys: {
            'ctrl+b meta+b': 'bold',
            'ctrl+i meta+i': 'italic',
            'ctrl+u meta+u': 'underline',
            'ctrl+z meta+z': 'undo',
            'ctrl+y meta+y meta+shift+z': 'redo',
            'ctrl+l meta+l': 'justifyleft',
            'ctrl+r meta+r': 'justifyright',
            'ctrl+e meta+e': 'justifycenter',
            'ctrl+j meta+j': 'justifyfull',
            'shift+tab': 'outdent',
            'tab': 'indent'
        },
        editorId: 'wysiwyg',
        editorClass: 'wysiwyg',
        activeToolbarClass: 'btn-primary',
        imageUploadUrl: null,
        redirectIframeUrl: null,
        uploadData: {}
    },

    _escapeDiv = $('<div></div>'),

    _filesUploadRenderer = function(files, error){
        var files_txt = '';
        for(var i = 0; i < files.length; i++){
            files_txt += ['<li class="clearfix">',
                (files[i].error || error ?
                    '<div class="alert alert-danger"><strong>' + _escapeDiv.text(files[i].name).html() + '</strong>&nbsp;' + (files[i].error || error) + '</div>' :
                    '<div class="file-name">' + _escapeDiv.text(files[i].name).html() + '</div>' +
                        '<div class="pull-right"><button type="button" class="btn btn-sm btn-danger cancel-upload"><i class="quag-q-remove"></i></button></div>' +
                        '<div class="progress"><div class="progress-bar" style="width: 0%;"></div></div>'
                    ),
                '</li>'].join('');
        }
        return $(files_txt);
    },

    _toolbarRenderer = function(options){
       return $(['<div class="btn-toolbar" data-target="' + options.editorId + '">',
                   '<div class="pull-left">',
                       '<a class="btn" data-action="bold" title="', gettext('Bold (Ctrl/Cmd+B)'), '"><i class="icon-bold"></i></a>',
                       '<a class="btn" data-action="italic" title="', gettext('Italic (Ctrl/Cmd+I)'), '"><i class="icon-italic"></i></a>',
                       '<a class="btn" data-action="underline" title="', gettext('Underline (Ctrl/Cmd+U)'), '"><i class="icon-underline"></i></a>',
                   '</div>',
                   '<div class="pull-left">',
                       '<a class="btn" data-action="insertunorderedlist" title="', gettext('Bullet list'), '"><i class="icon-list-ul"></i></a>',
                       '<a class="btn" data-action="insertorderedlist" title="', gettext('Number list'), '"><i class="icon-list-ol"></i></a>',
                       '<a class="btn" data-action="outdent" title="', gettext('Reduce indent (Shift+Tab)'), '"><i class="icon-indent-left"></i></a>',
                       '<a class="btn" data-action="indent" title="', gettext('Indent (Tab)'), '"><i class="icon-indent-right"></i></a>',
                   '</div>',
                   '<div class="pull-left">',
                       '<a class="btn" data-action="justifyleft" title="', gettext('Align Left (Ctrl/Cmd+L)'), '"><i class="icon-align-left"></i></a>',
                       '<a class="btn" data-action="justifycenter" title="', gettext('Center (Ctrl/Cmd+E)'), '"><i class="icon-align-center"></i></a>',
                       '<a class="btn" data-action="justifyright" title="', gettext('Align Right (Ctrl/Cmd+R)'), '"><i class="icon-align-right"></i></a>',
                       '<a class="btn" data-action="justifyfull" title="', gettext('Justify (Ctrl/Cmd+J)'), '"><i class="icon-align-justify"></i></a>',
                   '</div>',
                   '<div class="pull-left">',
                       '<a class="btn dropdown-toggle lnk" data-toggle="dropdown" data-custom="link" title="', gettext('Hyperlink'), '"><i class="icon-link"></i></a>',
                       '<div class="dropdown-menu">',
                           '<form data-action="createLink" action="javascript:;" method="get">',
                               '<div class="input-group">',
                                   '<input type="text" class="form-control input-sm" placeholder="http://www.example.com">',
                                   '<span class="input-group-btn">',
                                        '<button class="btn btn-default btn-small" type="submit">', gettext('Add'), '</button>',
                                   '</span>',
                               '</div>',
                           '</form>',
                       '</div>',
                       '<a class="btn" data-custom="unlink" data-action="unlink" title="', gettext('Remove Hyperlink'), '"><i class="icon-unlink"></i></a>',
                   '</div>',
                   (options.imageUploadUrl ?
                       '<div class="pull-left">' +
                           '<a class="btn file-input" title="' + gettext('Insert picture (or just drag & drop)') + '" >' +
                                '<i class="icon-picture"></i>' +
                                '<input class="file-upload" data-action="insertImage" type="file" name="image">' +
                           '</a>' +
                       '</div>' : ''),
                   '<input type="text" lang="it" data-action="inserttext" class="voice-btn" x-webkit-speech="">',
                   '<button type="button" class="close pull-right">&times;</button>',
                '</div>',
                (options.imageUploadUrl ? '<div class="upload-panel"><ul class="list-unstyled"></ul></div>' : '')].join(''));
    },

    /**
     * Main object
     */
    Wysiwyg = function(el, options){
        this.init(el, options);
    };

    Wysiwyg.prototype = {
        init: function(el, options){

            // Target element for inline editor
            this.options = $.extend({}, _defaults, options);
            this.target = el;
            this.editor = null;
            this.toolbar = null;
            this.toolbarBtns = null;
            this.currSelection = null;
            this._startup();
        },

        /**
         * Initialize the plugin, create the dom and then associate listeners
         */
        _startup: function(){
            this.target.data('init-hidden', this.target.is(':hidden')).hide();
            this.container = $('<div class="wc"></div>');
            this.editor = $('<div id="' + this.options.editorId + '" class="' + this.options.editorClass + '" contenteditable="true" aria-multiline="true" role="textbox" spellcheck="true"></div>').html(this.target.val());
            this.endEl = $('<p class="end"></p>');
            this.target.val('').attr('value', '');
            this.toolbar = _toolbarRenderer(this.options);
            this.container.append(this.toolbar).append(this.editor).insertAfter(this.target);
            this.toolbarBtns = this.toolbar.find('a[data-action]');
            this.toolbarCustomBtns = this.toolbar.find('a[data-custom]');
            this.uploaderPanel = this.container.find('.upload-panel');
            this.uploaderPanelList = this.uploaderPanel.find('ul');
            this._bind();
            this.editor.focus();
            this.target.trigger('wysiwyg-inited');
        },

        destroy: function(save){
            if(save){
                this.save();
            }
            if($.fn.webkitimageresize){
                this.editor.webkitimageresize('destroy');
            }
            this.editor.remove();
            this.toolbar.remove();
            this.container.remove();
            this.toolbarBtns = null;
            this.toolbarCustomBtns = null;
            this.target.removeData('wysiwyg');
            if(!this.target.data('init-hidden')){
                this.target.show();
            }
            this.target.trigger('wysiwyg-destroy');
        },

        save: function(){
            this.editor.autolink();
            var html = this.editor.html();
            this.target.val(html && $.trim(html).replace(/(<p><br><\/p>|<p><\/br><\/p>|<div><br><\/div>|<div><\/br><\/div>)/g, '</br>').replace(/(<\/br>|<br>){2,}/g, '</br></br>').replace(/(<p class="end"><\/p>|<p><\/p>)*/g, ''));
        },

        /**
         * Bind events handlers
         */
        _bind: function(){
            var self = this;
            this._bindHotkeys();
            this._bindToolbar();

            this.target.closest('form').submit($.proxy(this.save, this));
            this.editor.on('mouseup keyup', function () {
                self._saveSelection();
                self._updateToolbar();
            }).on('blur keyup paste', function(){
                self.editor.find('font').contents().unwrap(); // IE9 fix for font tag inserted
            }).on('keypress', function(evt){
                switch(evt.which){
                    case 13:
                        self._execCommand('formatBlock', "p");
                        setTimeout(function(){self.editor.autolink();}, 0);
                        break;
                    case 32:
                        setTimeout(function(){
                            var offset = window.RTU.getCaretOffset(self.editor[0]);
                            self.editor.autolink();
                            window.RTU.setCaretAt(self.editor[0], offset);
                        }, 0);
                        break;
                }
            });

            if($.fn.webkitimageresize){
                this.editor.webkitimageresize().on('webkitresize-select', function(evt, img){
                    var range = document.createRange();
                    range.selectNodeContents(img);
                    var sel = window.RTU.getSelection();
                    if (sel.rangeCount > 0){
                        sel.removeAllRanges();
                    }
                    sel.addRange(range);
                });
            }

            $(window).on('touchend', function (e) {
                var isInside = (self.editor.is(e.target) || self.editor.has(e.target).length > 0),
                    currentRange = window.RTU.getCurrentRange(),
                    clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
                if (!clear || isInside) {
                    self._saveSelection();
                    self._updateToolbar();
                }
            });
        },

        /**
         * Bind events for hotkeys
         */
        _bindHotkeys: function () {
            var self = this;
            $.each(this.options.hotKeys, function (hotkey, command) {
                self.editor.keydown(hotkey, function (e) {
                    if (self.editor.attr('contenteditable') && self.editor.is(':visible')) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._execCommand(command);
                    }
                }).keyup(hotkey, function (e) {
                        if (self.editor.attr('contenteditable') && self.editor.is(':visible')) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                });
            });
        },

        /**
         * Bind events for toolbar
         */
        _bindToolbar: function() {
            var self = this;
            // Add actions to toolbar buttons
            this.toolbarBtns.click($.proxy(this._doAction, this));
            this.toolbar.find('form[data-action]').submit($.proxy(this._doAction, this));
            this.toolbar.find('.lnk').click($.proxy(this._linkCustomClick, this));

            if(this.options.imageUploadUrl){
                this.toolbar.find('.file-upload').fileupload({
                        url: this.options.imageUploadUrl,
                        redirect: this.options.redirectIframeUrl,
                        formData: $.extend(this.options.uploadData, {cors: $.support.cors?1:0}),
                        dataType: 'json',
                        dropZone: this.editor,
                        pasteZone: this.editor,
                        limitMultiFileUploads: 1,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                        maxFileSize: 5000000, // 5MB
                        i18n: gettext
                    })
                    .on('fileuploadadd', $.proxy(this._onFileUploadAdd, this))
                    .on('fileuploaddone', $.proxy(this._onFileUploadDone, this))
                    .on('fileuploadfail', $.proxy(this._onFileUploadFail, this))
                    .on('fileuploadalways', $.proxy(this._onFileUploadAlways, this))
                    .on('fileuploadprogress', $.proxy(this._onFileUploadProgress, this));
            }

            // Speek change on webkit browsers
            if ("onwebkitspeechchange" in document.createElement("input")) {
                this.toolbar.find('.voice-btn').on('webkitspeechchange', $.proxy(this._doAction, this));
            } else {
                this.toolbar.find('.voice-btn').hide();
            }

            // Bind closing of the editor
            this.toolbar.find('.close').click(function(){self.destroy();});

            // Fix dropdown behavior
            this.toolbar.find('[data-toggle=dropdown]').click(function(){window.RTU.restoreSelection(self.currSelection);}); // Needed to maintain focus on the textarea selection
            this.toolbar.find('.dropdown-menu input').click(function() {return false;});
        },

        // FILE UPLOAD HANDLER FUNCTIONS
        _closeUploadPanel: function(data){
            var self = this;
            setTimeout(function(){
                if (data.context) {
                    data.context.remove();
                }
                if(self.uploaderPanelList.children().length == 0){
                    self.uploaderPanel.hide();
                }
            }, 1000);
        },

        _onFileUploadAdd: function(e, data){
            var self = this, position = this.editor.position();
            this.uploaderPanel.show();

            // This approach is needed for handle file type errors
            data.process(function () {
                return $(e.currentTarget).fileupload('process', data);
            }).always(function () {
                // Add context to this events flow calls
                data.context = _filesUploadRenderer(data.files).appendTo(self.uploaderPanelList);
                if(data.files.error){
                    self._closeUploadPanel(data);
                } else{
                    // Abort upload when click to cancel button
                    data.context.find('button.cancel-upload').click(function(){data.jqXHR.abort();});
                }
            });
        },

        _onFileUploadDone: function(e, data){
            if(data.result.success){
                this._doAction(e, {url: data.result.file.thumbnail_url});
            } else{
                var files = _filesUploadRenderer(data.files, data.result.message);
                data.context.replaceWith(files);
                data.context = files;
            }
        },

        /**
         * Handle Error for aborting requests
         * @param e
         * @param data
         * @private
         */
        _onFileUploadFail: function(e, data){
            var files = _filesUploadRenderer(data.files, gettext('We have encountered some problems, please retry later.'));
            data.context.replaceWith(files);
            data.context = files;

        },

        _onFileUploadAlways: function(e, data){
            this._closeUploadPanel(data);
        },

        _onFileUploadProgress: function(e, data){
            if (data.context) {
                var progress = Math.floor(data.loaded / data.total * 100);
                data.context.find('.progress-bar').css('width', progress + '%');
            }
        },

        // EDITOR METHODS

        /**
         * Execute command into the editor
         * @param commandWithArgs
         * @param valueArg
         */
        _execCommand: function (commandWithArgs, valueArg) {
            var commandArr = commandWithArgs.split(' '),
                command = commandArr.shift(),
                args = commandArr.join(' ') + (valueArg || '');
            this.editor.append(this.endEl);
            document.execCommand(command, 0, args);
            this.endEl.remove();
            this._updateToolbar();
        },

        _saveSelection: function () {
            this.currSelection = window.RTU.getCurrentRange();
        },

        /**
         * Perform editor action according to execCommant specifications
         */
        _doAction: function(evt, data){
            var target = $(evt.currentTarget),
                doCommand = true,
                valueArg = null,
                action = target.data('action');

            // Perform specific customizations based on action type
            switch(action){
                case 'createLink':
                    var input = target.find('input[type=text]');
                    valueArg = input.val();
                    doCommand = valueArg != 'http://';
                    input.val('').attr('value', '');
                    target.blur();
                    break;
                case 'inserttext':
                    valueArg = target.val();
                    break;
                case 'insertImage':
                    valueArg = data.url;
                    break;
            }
            window.RTU.restoreSelection(this.currSelection);
            if (doCommand) {
                this.editor.focus();
                this._execCommand(action, valueArg);
                this._fixEditorElementsFor(action);
            }
            this._saveSelection();
        },

        /**
         * Fix editor elements and do some actions based on the current action
         * @private
         */
        _fixEditorElementsFor: function(action){
            var self = this;
            switch(action){
                case 'insertImage':
                    this.editor.find('img').each(function(){
                        var target = $(this);
                        if(!target.parent().is('p')){
                            target.load(function(){self._execCommand('formatBlock', "p")});
                        }
                    });
                    break;
            }
        },

        /**
         * Update state for link custom button
         * @private
         */
        _linkCustomUpdate: function(target, nodes){
            var a = nodes.filter('a');
            if(a.length > 0){
                target.addClass(this.options.activeToolbarClass)
                    .next().find('form[data-action=createLink] input').val(a.attr('href'));
                this.toolbarCustomBtns.filter('[data-custom=unlink]').removeClass('disabled');
            }else{
                target.removeClass(this.options.activeToolbarClass)
                    .next().find('form[data-action=createLink] input').val('');
                this.toolbarCustomBtns.filter('[data-custom=unlink]').addClass('disabled');
            }
        },

        /**
         * Autofocus for link panel
         * @private
         */
        _linkCustomClick: function(evt, data){
            setTimeout(function(){
                $(evt.currentTarget).parent().find('input').focus();
            }, 300);
        },

        /**
         * This is a specific function for update special buttons
         * @private
         */
        _updateToolbarCustomButtons: function(){
            var self = this,
                selection = window.RTU.getSelection(),
                range = window.RTU.getCurrentRange(),
                comprng = document.createRange ? document.createRange() : document.body.createTextRange(),
                nodes = this.editor.find('*').filter(function(){return this.nodeType == 1 && window.RTU.containsNode(selection, range, comprng, this);});
            this.toolbarCustomBtns.each(function(){
                var target = $(this);
                if(self['_' + target.data('custom') + 'CustomUpdate']){
                    self['_' + target.data('custom') + 'CustomUpdate'](target, nodes);
                }
            });
        },

        _updateToolbarButtons: function(){
            var self = this;
            this.toolbarBtns.each(function () {
                var btn = $(this),
                    actionTarget = btn.data('action')? btn : btn.next('.dropdown-menu').find('[data-action]'),
                    commandArr = actionTarget.data('action').split(' '),
                    command = commandArr[0];
                if (commandArr.length > 1 && document.queryCommandEnabled(command) && document.queryCommandValue(command) == commandArr[1]) {
                    $(this).addClass(self.options.activeToolbarClass);
                } else if (commandArr.length === 1 && document.queryCommandEnabled(command) && document.queryCommandState(command)) {
                    btn.addClass(self.options.activeToolbarClass);
                } else {
                    btn.removeClass(self.options.activeToolbarClass);
                }
            });
        },

        _updateToolbar: function () {
            this._updateToolbarCustomButtons();
            this._updateToolbarButtons();
        }

};

	$.fn.wysiwyg = function (options, args) {
        if(typeof options=="string" && this.data('wysiwyg')){
            return this.data('wysiwyg')[options](args);
        } else if(typeof options=="object"){
            this.data('wysiwyg', new Wysiwyg(this, options));
        }
        return this;
	};
}(window.jQuery));
