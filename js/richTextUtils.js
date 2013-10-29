window['RTU'] = (function(){
    var
        /**
         * Recoursively extract the Text node who contain the offset
         */
        _extractTextNode = function(el, offset){
            if(el.nodeType == 3){ // Text Node then return new offset
                if(offset <= el.nodeValue.length){  // Match found
                    return  {el: el, offset: offset};
                }
                return {offset: offset - el.nodeValue.length};
            }
            for(var i = 0; i < el.childNodes.length; i++){
                var partialRes = _extractTextNode(el.childNodes[i], offset);
                if(partialRes.el){
                    return partialRes;
                } else{
                    offset = partialRes.offset
                }
            }
            return {offset: offset};
        },

        /**
         * Retrieve the current selection
         * @returns {*}
         * @private
         */
        _getSelection = function(){
            if (typeof window.getSelection === 'function') {
                return window.getSelection();
            } else if (document.selection) {
                return document.selection.createRange().htmlText  //IE6 7 8
            }
        };

    return {

        /**
         * Return the current caret offset chars
         */
        getCaretOffset: function(el) {
            var caretOffset = 0;
            var doc = el.ownerDocument || el.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win.getSelection != "undefined") {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(el);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            } else if ( (sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(el);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        },

        /**
         * Move the caret to the given offset
         */
        setCaretAt: function(el, offset){
            var range,selection,
                nodeRange = _extractTextNode(el, offset);
            if(document.createRange){//Firefox, Chrome, Opera, Safari, IE 9+
                range = document.createRange();//Create a range (a range is a like the selection but invisible)
                range.setStart(nodeRange.el, nodeRange.offset);
                range.collapse(true);
                selection = window.getSelection();//get the selection object (allows you to change selection)
                selection.removeAllRanges();//remove any selections already made
                selection.addRange(range);//make the range you have just created the visible selection
            }
            else if(document.selection){//IE 8 and lower
                range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
                range.moveToElementText(el);//Select the entire contents of the element with the range
                range.move('character', offset); // Move to the offset char
                range.select();//Select the range (make it the visible selection
            }
            el.focus();
        },

        getSelection: _getSelection,

        /**
         * Retrieve current range
         * @returns {*}
         */
        getCurrentRange: function () {
            var sel = _getSelection();
            if (sel && sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            } else {
                return document.selection.createRange();
            }
        },

        /**
         * Restore current selection
         * @param currSelection
         */
        restoreSelection: function (currSelection) {
            var selection = window.RTU.getSelection();
            if (currSelection) {
                try {
                    selection.removeAllRanges();
                    selection.addRange(currSelection);
                } catch (ex) {
                    currSelection.select();
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
        containsNode: function(selection, range, comprng, node){
            if(selection && typeof selection.containsNode === 'function'){
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
                if (range.compareEndPoints != undefined &&
                    range.compareEndPoints("StartToEnd", comprng) < 0 &&
                    range.compareEndPoints("EndToStart", comprng) > 0) {
                    return true;
                }
            }
            return false;
        }
    }
})();