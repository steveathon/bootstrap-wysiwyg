/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global $*/
/*jslint browser:true*/
$.fn.cleanHtml = function () {
	'use strict';
	var html = $(this).html();
	return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
};
$.fn.wysiwyg = function (options) {
	'use strict';
	var editor = this,
		selectedRange,
		defaultOptions = {
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
			toolbarRole: 'editor-toolbar',
			commandRole: 'edit'
		},
		execCommand = function (commandWithArgs, valueArg) {
			var commandArr = commandWithArgs.split(' '),
				command = commandArr.shift(),
				args = commandArr.join(' ') + (valueArg || '');
			document.execCommand(command, 0, args);
		},
		bindHotkeys = function (hotKeys) {
			$.each(hotKeys, function (hotkey, command) {
				editor.keydown(hotkey, function (e) {
					e.preventDefault();
					e.stopPropagation();
					execCommand(command);
				}).keyup(hotkey, function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
			});
		},
		saveSelectionRange = function () {
			var sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				selectedRange = sel.getRangeAt(0);
			}
		},
		restoreSelectionRange = function () {
			var selection = window.getSelection();
			if (selectedRange) {
				selection.removeAllRanges();
				selection.addRange(selectedRange);
			}
		},
		bindToolbar = function (toolbar, options) {
			toolbar.find('a[data-' + options.commandRole + ']').click(function () {
				restoreSelectionRange();
				execCommand($(this).data(options.commandRole));
				saveSelectionRange();
			});
			toolbar.find('input[data-' + options.commandRole + ']').change(function () {
				var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
				this.value = '';
				restoreSelectionRange();
				if (newValue) {
					execCommand($(this).data(options.commandRole), newValue);
				}
				saveSelectionRange();
			});
		};
	options = $.extend({}, defaultOptions, options);
	bindHotkeys(options.hotKeys);
	$.each($.find('[data-role=' + options.toolbarRole + ']'), function () { bindToolbar($(this), options); });
	$.each(this, function () {
		var before,
			element = $(this);
		element.attr('contenteditable', true)
			.on('focus', function () {
				before = element.html();
			})
			.on('mouseup keyup mouseout', saveSelectionRange)
			.on('input blur keyup paste', function () {
				if (before !== element.html()) {
					before = element.html();
					element.trigger('change');
				}
			});
	});
	return this;
}
