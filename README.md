bootstrap-wysiwyg
=================

Tiny bootstrap-compatible WISWYG rich text editor, based on browser execCommand. For more info on execCommand, see
http://www.quirksmode.org/dom/execCommand.html and https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla

Basic Usage
-----------

See http://mindmup.github.com/bootstrap-wysiwyg/

Customising 
-----------
You can assign commands to hotkeys and toolbar buttons. For a toolbar button, just put the command name into a data-edit attribute. 

	<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
	    <a class="btn btn-large" data-edit="bold"><i class="icon-bold"></i></a>
	</div>

For a hotkey, specify a hotkey and a command in the hotKeys option. eg

	$('#editor').wysiwyg({
			hotKeys: {
					'ctrl+b meta+b': 'bold',
					'ctrl+i meta+i': 'italic',
					'ctrl+u meta+u': 'underline',
					'ctrl+z meta+z': 'undo',
					'ctrl+y meta+y meta+shift+z': 'redo'
	        }
	});

Dependencies
------------
* JQuery http://jquery.com/
* JQuery HotKeys https://github.com/jeresig/jquery.hotkeys
* Bootstrap http://twitter.github.com/bootstrap/
