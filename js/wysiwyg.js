/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
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
        fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
    },

    _filesUploadRenderer = function(files, error){
        var files_txt = '';
        for(var i = 0; i < files.length; i++){
            files_txt += ['<li class="clearfix">',
                (files[i].error || error ?
                    '<div class="alert alert-danger"><strong>' + files[i].name + '</strong>&nbsp;' + (files[i].error || error) + '</div>' :
                    '<div class="pull-left">' + files[i].name + '</div>' +
                        '<div class="pull-right"><button type="button" class="btn btn-danger cancel-upload"><i class="icon icon-remove"></i></button></div>' +
                        '<div class="progress"><div class="progress-bar" style="width: 0%;"></div></div>'
                    ),
                '</li>'].join('');
        }
        return $(files_txt);
    },

    _toolbarRenderer = function(options){
       return $(['<div class="btn-toolbar" data-target="', options.editorId ,'">',
                   '<div class="btn-group">',
                       '<a class="btn" data-action="bold" title="', gettext('Bold (Ctrl/Cmd+B)'), '"><i class="icon-bold"></i></a>',
                       '<a class="btn" data-action="italic" title="', gettext('Italic (Ctrl/Cmd+I)'), '"><i class="icon-italic"></i></a>',
                       '<a class="btn" data-action="underline" title="', gettext('Underline (Ctrl/Cmd+U)'), '"><i class="icon-underline"></i></a>',
                   '</div>',
                   '<div class="btn-group">',
                       '<a class="btn" data-action="insertunorderedlist" title="', gettext('Bullet list'), '"><i class="icon-list-ul"></i></a>',
                       '<a class="btn" data-action="insertorderedlist" title="', gettext('Number list'), '"><i class="icon-list-ol"></i></a>',
                       '<a class="btn" data-action="outdent" title="', gettext('Reduce indent (Shift+Tab)'), '"><i class="icon-indent-left"></i></a>',
                       '<a class="btn" data-action="indent" title="', gettext('Indent (Tab)'), '"><i class="icon-indent-right"></i></a>',
                   '</div>',
                   '<div class="btn-group">',
                       '<a class="btn" data-action="justifyleft" title="', gettext('Align Left (Ctrl/Cmd+L)'), '"><i class="icon-align-left"></i></a>',
                       '<a class="btn" data-action="justifycenter" title="', gettext('Center (Ctrl/Cmd+E)'), '"><i class="icon-align-center"></i></a>',
                       '<a class="btn" data-action="justifyright" title="', gettext('Align Right (Ctrl/Cmd+R)'), '"><i class="icon-align-right"></i></a>',
                       '<a class="btn" data-action="justifyfull" title="', gettext('Justify (Ctrl/Cmd+J)'), '"><i class="icon-align-justify"></i></a>',
                   '</div>',
                   '<div class="btn-group">',
                       '<a class="btn dropdown-toggle" data-toggle="dropdown" data-custom="link" title="', gettext('Hyperlink'), '"><i class="icon-link"></i></a>',
                       '<div class="dropdown-menu">',
                           '<form data-action="createLink" action="javascript:;" method="get">',
                               '<div class="input-group">',
                                   '<span class="input-group-addon input-small">http://</span>',
                                   '<input type="text" class="form-control input-small" placeholder="www.example.com">',
                                   '<span class="input-group-btn">',
                                        '<button class="btn btn-default btn-small" type="submit">', gettext('Add'), '</button>',
                                   '</span>',
                               '</div>',
                           '</form>',
                       '</div>',
                       '<a class="btn" data-custom="unlink" data-action="unlink" title="', gettext('Remove Hyperlink'), '"><i class="icon-unlink"></i></a>',
                   '</div>',
                   (options.imageUploadUrl ?
                       '<div class="btn-group">' +
                           '<a class="btn file-input" title="' + gettext('Insert picture (or just drag & drop)') + '" >' +
                                '<i class="icon-picture"></i>' +
                                '<input class="file-upload" data-action="insertImage" type="file" name="image">' +
                           '</a>' +
                       '</div>' : ''),
                   '<input type="text" lang="it" data-action="inserttext" class="voice-btn" x-webkit-speech="">',
                   '<button type="button" class="close pull-right">&times;</button>',
                '</div>',
                (options.imageUploadUrl ? '<div class="upload-panel"><ul></ul></div>' : '')].join(''));
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
            this.container = $('<div class="wysiwyg-container"></div>');
            this.editor = $('<div id="' + this.options.editorId + '" class="' + this.options.editorClass + '" contenteditable="true"></div>').html(this.target.val());
            this.target.val('').attr('value', '');
            this.toolbar = _toolbarRenderer(this.options);
            this.container.append(this.toolbar).append(this.editor).insertAfter(this.target);
            this.toolbarBtns = this.toolbar.find('a[data-action]');
            this.toolbarCustomBtns = this.toolbar.find('a[data-custom]');
            this.uploaderPanel = this.container.find('.upload-panel');
            this.uploaderPanelList = this.uploaderPanel.find('ul');
            this._bind();
            this.target.trigger('wysiwyg-inited');
        },

        destroy: function(save){
            if(save){
                this.save();
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
            var html = this.editor.html();
            this.target.val(html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, ''));
        },

        /**
         * Bind events handlers
         */
        _bind: function(){
            var self = this;
            this._bindHotkeys();
            this._bindToolbar();

            //$('a[title]').tooltip({container:'body'});
            this.target.parents('form').submit($.proxy(this.save, this));
            this.editor.on('mouseup keyup', function () {
                self._saveSelection();
                self._updateToolbar();
            });
            $(window).on('touchend', function (e) {
                var isInside = (self.editor.is(e.target) || self.editor.has(e.target).length > 0),
                    currentRange = self._getCurrentRange(),
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

            if(this.options.imageUploadUrl){
                this.toolbar.find('.file-upload').fileupload({
                        url: this.options.imageUploadUrl,
                        redirect: this.options.redirectIframeUrl,
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
                var editorOffset = this.editor.offset();
                this.toolbar.find('.voice-btn').on('webkitspeechchange', $.proxy(this._doAction, this)).css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+this.editor.innerWidth()-35});
            } else {
                this.toolbar.find('.voice-btn').hide();
            }

            // Bind closing of the editor
            this.toolbar.find('.close').click(function(){self.destroy();});

            // Fix dropdown behavior
            this.toolbar.find('[data-toggle=dropdown]').click($.proxy(this._restoreSelection, this)); // Needed to maintain focus on the textarea selection
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
            this.uploaderPanel.css({top: position.top, left: position.left, width: this.editor.outerWidth(true), height: this.editor.outerHeight(true)}).show();

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
                for(var i=0; i < data.result.files.length; i++){
                    this._doAction(e, {url: data.result.files[i].thumbnail_url});
                }
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

        _getSelection: function(){
            if (typeof window.getSelection === 'function') {
                return window.getSelection();
            } else if (document.selection) {
                return document.selection.createRange().htmlText  //IE6 7 8
            }
        },

        /**
         * Execute command into the editor
         * @param commandWithArgs
         * @param valueArg
         */
        _execCommand: function (commandWithArgs, valueArg) {
            var commandArr = commandWithArgs.split(' '),
                command = commandArr.shift(),
                args = commandArr.join(' ') + (valueArg || '');
            document.execCommand(command, 0, args);
            this._updateToolbar();
        },

        _getCurrentRange: function () {
            var sel = this._getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            } else {
                return document.selection.createRange();
            }
        },

        _saveSelection: function () {
            this.currSelection = this._getCurrentRange();
        },

        _restoreSelection: function () {
            var selection = this._getSelection();
            if (this.currSelection) {
                try {
                    selection.removeAllRanges();
                    selection.addRange(this.currSelection);
                } catch (ex) {
                    this.currSelection.select();
                }
            }
        },
                
        /**
         * Check if a node is in the selected range
         * @param {type} selection
         * @param {type} range
         * @param {type} comprng
         * @param {type} node
         * @returns {Boolean|@exp;selection@call;containsNode}
         */
        _containsNode: function(selection, range, comprng, node){
            if(typeof selection.containsNode === 'function'){
                return selection.containsNode(node, true);
            }
            // determine if element el[i] is within the range
            if (document.createRange) { // w3c
                comprng.selectNodeContents(node);
                if (range.compareBoundaryPoints(Range.END_TO_START, comprng) < 0 &&
                    range.compareBoundaryPoints(Range.START_TO_END, comprng) > 0) {
                    return true;
                }
            }
            else { // microsoft
                comprng.moveToElementText(node);
                if (range.compareEndPoints("StartToEnd", comprng) < 0 &&
                    range.compareEndPoints("EndToStart", comprng) > 0) {
                    return true;
                }
            }
            return false;
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
                    valueArg = 'http://' + input.val();
                    doCommand = valueArg != 'http://';
                    input.val('').attr('value', '');
                    break;
                case 'inserttext':
                    valueArg = target.val();
                    break;
                case 'insertImage':
                    valueArg = data.url;
                    break;
            }
            this._restoreSelection();
            if (doCommand) {
                this.editor.focus();
                this._execCommand(action, valueArg);
            }
            this._saveSelection();
        },

        /**
         * Update state for link custom button
         * @private
         */
        _linkCustomUpdate: function(target, nodes){
            var a = nodes.filter('a');
            if(a.length > 0){
                target.addClass(this.options.activeToolbarClass)
                    .next().find('form[data-action=createLink] input').val(a.attr('href').replace('http://', ''));
                this.toolbarCustomBtns.filter('[data-custom=unlink]').removeClass('disabled');
            }else{
                target.removeClass(this.options.activeToolbarClass)
                    .next().find('form[data-action=createLink] input').val('');
                this.toolbarCustomBtns.filter('[data-custom=unlink]').addClass('disabled');
            }
        },

        /**
         * This is a specific function for update special buttons
         * @private
         */
        _updateToolbarCustomButtons: function(){
            var self = this,
                selection = this._getSelection(),
                range = this._getCurrentRange(),
                comprng = document.createRange ? document.createRange() : document.body.createTextRange(),
                nodes = this.editor.find('*').filter(function(){return this.nodeType == 1 && self._containsNode(selection, range, comprng, this);});
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
