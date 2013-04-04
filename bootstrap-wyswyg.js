/*!
 * Bootstrap Wysiwyg Rich Text Editor v1.0
 * https://github.com/mindmup/bootstrap-wysiwyg
 *
 * Copyright 2013, Gojko Adzic 
 * Licensed under the MIT license.
 * https://github.com/mindmup/bootstrap-wysiwyg/license
 *
 */
/*global $*/
/*jslint browser:true*/
$.fn.wysiwyg = function () {
	'use strict';
	return $.each(this, function () {
		var before,
			element = $(this);
		element.attr('contenteditable', true);
		element.on('focus', function () {
			before = element.html();
		}).on('input blur keyup paste', function () {
			if (before !== element.html()) {
				before = element.html();
				element.trigger('change');
			}
		});
	});
}
