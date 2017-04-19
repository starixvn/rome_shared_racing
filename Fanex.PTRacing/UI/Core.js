if (typeof Fanex == 'undefined') {
    Fanex = {};
};

Fanex.copy = function (obj, to) {
    if (obj == null || typeof obj != "object") return obj;
    if (obj.constructor != Object && obj.constructor != Array) return obj;
    if (obj.constructor == Date || obj.constructor == RegExp || obj.constructor == Function ||
            obj.constructor == String || obj.constructor == Number || obj.constructor == Boolean)
        return new obj.constructor(obj);

    to = to || new obj.constructor();

    for (var name in obj) {
        to[name] = typeof to[name] == "undefined" ? Fanex.copy(obj[name], null) : to[name];
    }

    return to;
};
Fanex.hasClass = function (ele, cls) {
    if (ele.className)
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    return false;
};
Fanex.addClass = function (ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
};
Fanex.removeClass = function (ele, cls) {
    if (Fanex.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
};

Fanex.setAttrByClass = function (cls, name, value) {
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' ' + cls + ' ')
                > -1) {
            elems[i].setAttribute(name, value);
        }
    }
}

Fanex.removeAttrByClass = function (cls, name) {
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' ' + cls + ' ')
                > -1) {
            elems[i].removeAttribute(name);
        }
    }
}

Fanex.getMaxPt = function (uplineMaxPt, uplinePt, maxPt) {
    if (maxPt == 0)
        return uplineMaxPt - uplinePt;
    return Math.min(uplineMaxPt - uplinePt, maxPt);
}

String.Empty = ""; // Extend static string
String.prototype.Format = function (args) {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
String.prototype.FormatNumber = function (number) { // Format a number to 1,234,567.89
    number += String.Empty;
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : String.Empty;
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return this + x1 + x2;
};
String.prototype.escapeHtml = function () { // Replace all ampersands with &amp; and all <’s and >’s with &lt; and &gt;, respectively:
    var result = String.Empty;
    for (var i = 0; i < this.length; i++) {
        if (this.charAt(i) == "&" && this.length - i - 1 >= 4 && this.substr(i, 4) != "&amp;") {
            result = result + "&amp;";
        } else if (this.charAt(i) == "<") {
            result = result + "&lt;";
        } else if (this.charAt(i) == ">") {
            result = result + "&gt;";
        } else {
            result = result + this.charAt(i);
        }
    }
    return result;
};
(function () { // Parse float with string has commas inside parseFloat(string, true)
    var proxied = window.parseFloat;
    window.parseFloat = function () {
        if (arguments[1] === true && typeof (arguments[0]) == 'string') {
            arguments[0] = arguments[0].replace(/,/g, String.Empty); // Replace all occurrences of comma to empty
        }
        return proxied.apply(this, arguments);
    };
})();
Fanex.FormatNumberFloat = function (number) { // Format a number to 12,345
    if (number == String.Empty) return 0;
    var sign;
    if (isNaN(number)) {
        number = String.Empty;
    }
    sign = (number == (number = Math.abs(number)));
    number = Math.floor(number * 100 + 0.50000000001);
    number = Math.floor(number / 100).toString();
    for (var i = 0; i < Math.floor((number.length - (1 + i)) / 3); i++) {
        number = number.substring(0, number.length - (4 * i + 3)) + ',' + number.substring(number.length - (4 * i + 3));
    }
    return (((sign) ? String.Empty : '-') + number);
};
// Format input number on event e, using: onkeyup=Fanex.FormatNumber(event)
Fanex.FormatNumber = function (event, isFloat) {
    var evt = event ? event : window.event; // Fix for IE7

    if (evt.keyCode === 9) return true; // Ignore TAB key

    var obj = evt.currentTarget ? evt.currentTarget : evt.srcElement; // Fix for IE7
    var value = obj.value;
    var num;
    var dotPosition = 0;
    var afterDot;
    var caretPosition = Fanex.GetCaretPosition(obj);

    num = value.toString().replace(/\$|\,/g, String.Empty);
    dotPosition = num.indexOf(".");
    if ((typeof (isFloat) != 'undefined') && isFloat && dotPosition > 0) {
        afterDot = num.substring(dotPosition + 1, num.length).replace(/[^0-9]/g, String.Empty);
        num = num.substring(0, dotPosition);
    }
    num = Fanex.FormatNumberFloat(num);
    if ((typeof (isFloat) != 'undefined') && isFloat && dotPosition > 0) {
        eval(obj).value = num + "." + afterDot;
        num = obj.value;
    } else {
        eval(obj).value = num;
    }

    if (num.length > value.length)
        caretPosition = caretPosition + 1;
    Fanex.SetCaretPosition(obj, caretPosition);
    return true;
};

// Arguments: number to round, number of decimal places
Fanex.RoundNumber = function (number, decimals) {
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber); // Output the result to the form field (change for your purposes)
};

Fanex.Round = function (value) { //Format a number from 0.0199999 to 0.02
    return Math.round(value * 10000) / 10000;
};

// Returns the caret (cursor) position of the specified text field.
Fanex.GetCaretPosition = function (oField) {
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {
        oField.focus();
        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange();
        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);
        iCaretPos = oSel.text.length;
    }
    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0')
        iCaretPos = oField.selectionStart;

    // Return results
    return (iCaretPos);
};

// Sets the caret (cursor) position of the specified text field.
Fanex.SetCaretPosition = function (oField, iCaretPos) {
    // IE Support
    if (document.selection) {
        oField.focus();

        // Create empty selection range
        var oSel = document.selection.createRange();

        // Move selection start and end to desired position
        oSel.moveStart('character', iCaretPos);
        oSel.moveEnd('character', iCaretPos - oField.value.length);
        oSel.select();
    }
    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0') {
        oField.selectionStart = iCaretPos;
        oField.selectionEnd = iCaretPos;
        oField.focus();
    }
}

if (typeof (Fanex.PTRacing) == 'undefined') { // Define Fanex.PTRacing namespace
    Fanex.PTRacing = {
        PT_STEP10: 1,
        PT_STEP100: 10,
        PT_STEP: 0.1,
        COMMISSION_STEP: 0.0005,
        HR_UKIRISHTOTE_WIN:
        {
            sportId: 151,
            toteId: 41,
            betTypeId: 41
        },
        DisableClassName: "BetTypeInactive",
        DisableChildren: function (element, cssApplied) { // Check dublicated disable
            if (typeof (element) != 'object') return;
            if (element.nodeType == 3) return; // text node

            var isDisabled = (element.className.indexOf(Fanex.PTRacing.DisableClassName) != -1);

            if (element.tagName == "DIV" || element.tagName == "LABEL") {
                if (!isDisabled) {
                    element.setAttribute("previousValue", element.className);
                    element.className += " " + Fanex.PTRacing.DisableClassName;
                };
            };

            var count = element.childNodes.length;
            if (typeof (count) == 'undefined') return;

            for (var i = 0; i < count; i++) {
                if (element.childNodes[i].tagName == "INPUT" || element.childNodes[i].tagName == "SELECT") {
                    var previousValue = element.childNodes[i].disabled;
                    if (!isDisabled || !element.childNodes[i].disabled) {
                        element.childNodes[i].setAttribute('disabled', 'disabled');
                        element.childNodes[i].setAttribute("previousValue", previousValue);
                    };
                } else {
                    Fanex.PTRacing.DisableChildren(element.childNodes[i]);
                }
            }
        },
        EnableChildren: function (element) {
            if (typeof (element) != 'object') return;
            if (element.nodeType == 3) return; // text node

            var isDisabled = (element.className.indexOf(Fanex.PTRacing.DisableClassName) != -1);

            if (element.tagName == "DIV" || element.tagName == "LABEL") {
                if (isDisabled) {
                    var previousValue = element.getAttribute("previousValue");
                    if (previousValue != null && typeof (previousValue) != 'undefined') {
                        element.setAttribute("previousValue", element.className);
                        element.className = previousValue;
                    }
                }
            }

            var count = element.childNodes.length;
            if (typeof (count) == 'undefined') return;
            for (var i = 0; i < count; i++) {
                if (element.childNodes[i].tagName == "INPUT" || element.childNodes[i].tagName == "SELECT") {
                    if (isDisabled) {
                        var previousValue = element.childNodes[i].getAttribute("previousValue");
                        if (previousValue != null && typeof (previousValue) != 'undefined') {
                            element.childNodes[i].setAttribute("previousValue", element.childNodes[i].disabled);                            
                            if (previousValue == "true" || previousValue == true) {
                                element.childNodes[i].setAttribute('disabled', 'disabled');
                            }
                            else {
                                element.childNodes[i].removeAttribute('disabled');
                            }
                        }
                    }
                }
                else {
                    Fanex.PTRacing.EnableChildren(element.childNodes[i]);
                }
            }
        },
        PT_Descrease: function (id, f) {
            var select = document.getElementById(id);
            if (select.disabled) return;
            var selectedIndex = select.selectedIndex;
            var newSelectedIndex = selectedIndex + f;
            if (newSelectedIndex >= select.options.length) newSelectedIndex = select.options.length - 1;
            select.selectedIndex = newSelectedIndex;
            if (select.onchange) {
                select.onchange();
            }
        },
        PT_Increase: function (id, f) {
            var select = document.getElementById(id);
            if (select.disabled) return;
            var selectedIndex = select.selectedIndex;
            var newSelectedIndex = selectedIndex - f;
            if (newSelectedIndex <= 0) newSelectedIndex = 0;
            select.selectedIndex = newSelectedIndex;
            if (select.onchange) {
                select.onchange();
            }
        },
        PT_ValidateSelect: function (select) {
            // Enable combo box and fix selected value is out of range
            try {
                var selected = parseFloat(select.value);
                var c = select.options.length;
                var min = select.min;
                var max = select.max;
                if (selected >= min && selected <= max) {
                    return;
                }
                // Reset selected value
                for (var i = 0; i < c; i++) {
                    var value = parseFloat(select.options[i].value);
                    if (max == value) {
                        if (document.all) {
                            select.options[i].selected = true;
                        }
                        else {
                            select.value = max;
                        }
                    }
                    else if (selected == value) { // Remove out of range item
                        select.options[i] = null;
                        c = select.options.length;
                    }
                }
            } catch (e) {
            }
        },
        PT_SetSelect: function (select, min, max, step, selectedValue) {
            var index = -1;
            var itemIndex = 0;
            select.options.length = 0;
            if (min > max) {
                min = max;
            }
            select.min = min;
            select.max = max;
            if (selectedValue > max) { // Insert selected value at top
                var selectedOpt = document.createElement("option");
                selectedOpt.text = selectedOpt.value = selectedValue;
                select.options.add(selectedOpt);
                index = 0;
            }
            var c = Math.round((max * 10000 - min * 10000) / (step * 10000));
            if (c < 0) { // Not range
                var opt = document.createElement("option");
                opt.text = opt.value = Math.round(min * 10000) / 10000;
                select.options.add(opt);
            } else {
                for (var i = c; i >= 0; i--) {
                    var f = Math.round(min * 10000 + (i * step * 10000)) / 10000;
                    var opt = document.createElement("option");
                    if (parseFloat(selectedValue) == parseFloat(f)) {
                        index = itemIndex; // Store selected item
                    }
                    opt.text = opt.value = f;
                    select.options.add(opt);
                    itemIndex++;
                }
            }
            if (selectedValue < min) { // Insert selected value at bottom
                var selectedOpt = document.createElement("option");
                selectedOpt.text = selectedOpt.value = selectedValue;
                select.options.add(selectedOpt);
                index = select.options.length - 1;
            }
            // Set selected item
            if (typeof (selectedValue) == 'number') {
                if (index == -1) {
                    var opt = document.createElement("option");
                    opt.text = opt.value = selectedValue;
                    select.options.add(opt);
                    index = itemIndex + 1;
                }
                if (document.all) {
                    select.options[index].selected = true;
                } else {
                    select.value = selectedValue;
                }
            }
        },
        PT_RenderSelect: function (min, max, step, selectedValue, showButtons) { // Render select box
            var index = -1;
            var itemIndex = 0;
            var select = document.createElement("select");
            select.className = "PTSelect";
            Fanex.PTRacing.PT_SetSelect(select, min, max, step, selectedValue);
            var box = document.createElement("DIV");
            box.appendChild(select);
            box.select = select;
            // Return element
            return box;
        },
        FormTypes: {
            ADD: 0,
            // Add new customer (both systems)
            EDIT_PT: 1,
            // Edit PT of existing customer (both systems)
            EDIT_MIN_PT: 2,
            // Edit Min PT in Agency
            EDIT_MIN_MAX_PT: 3,
            // Edit Min/Max PT in Accounting
            VIEW_PT: 4
        },
        Context: function (roleId, targetRoleId, form) {
            this.roleId = roleId;
            this.targetRoleId = targetRoleId;
            this.formId = form;
        },
        CURRENT_CONTEXT: {
            roleId: 2,
            targetRoleId: 1,
            formId: 1,
            language: 'en-US'
        },
        // BetType class, need to create each bet type class for each PT form
        BetType: function (item) {
            this.name = item.name; // Handicap, Over / Under
            this.title = item.title; // Title  Handicap, Over / Under
            this.id = item.id; // Bet type id
            this.sportId = item.sportId;
            this.showButtons = false; // Show 4 buttons (increase, decrease) after selection
            this.pt = {
                s4: 0,
                s3: 0,
                s1: 0,
                m4: 0,
                m3: 0,
                m2: 0,
                m1: 0,
                a4: 0,
                a2: 0,
                a1: 0,
                us3: 0,
                us1: 0,
                is3: 0,
                is1: 0,
                um2: 0,
                um1: 0,
                im2: 0,
                im1: 0,
                n4: 0,
                n3: 0,
                n2: 0,
                l4: 0.9,
                l3: 0.9,
                l2: 0.9,
                iBC: 0,
                iBCMax: 0
            };
            if (typeof (item.pt) == 'object') {
                this.pt = item.pt;
            }
            this.suffixId = this.sportId + "$" + this.id;
            this.context = Fanex.copy(Fanex.PTRacing.CURRENT_CONTEXT);
            if (this.context.formId == Fanex.PTRacing.FormTypes.ADD) { // Use the same implementation for Edit PT / Add New
                this.context.formId = Fanex.PTRacing.FormTypes.EDIT_PT;
            }
            this.element = document.createElement("DIV");
            this.actived = true;
            this.Active = function () {
                if (this.actived) return;
                Fanex.PTRacing.EnableChildren(this.element);
                this.actived = true;
            };
            this.Inactive = function (copiedItem) {
                if (!this.actived) return;
                Fanex.PTRacing.DisableChildren(this.element, "BetTypeInactive");
                this.actived = false;
            };
            this.Render = function (owner) { // Render each bet type section
                // Just edit member form require roldId in implementation
                var formId = this.context.formId;
                var roleId = (this.context.targetRoleId == 1 || formId != Fanex.PTRacing.FormTypes.EDIT_PT) ? this.context.roleId : 0;
                var targetRoleId = this.context.targetRoleId;
                var box = null;
                var method = this['Render_'.concat(roleId, '_', targetRoleId, '_', formId)];
                if (typeof (method) == "function") {
                    box = method.call(this, owner);
                } else {
                    console.log("Could not find the implementation of " + methodName);
                }
                if (box != null) {
                    this.element = box;
                    // Append or return the object
                    if (typeof (owner) == 'object') {
                        owner.appendChild(box);
                    };
                };
                return box;
            };
        },
        // BetTypeGroup, could have "Copy From " check box
        BetTypeGroup: function (betTypeGroup) { // Each group normaly contains 4 or 5 bet types
            this.id = betTypeGroup.id;
            this.isHide = betTypeGroup.isHide;
            this.name = betTypeGroup.name;
            this.title = betTypeGroup.title;
            this.betTypes = betTypeGroup.betTypes;
            this.allowCurrencies = betTypeGroup.allowCurrencies
            this.sportId = betTypeGroup.sportId;
            this.suffixId = this.sportId + "$" + this.id;
            this.elements = []; // Child bet type HTML elements
            this.items = []; // Bet type objects

            this.context = Fanex.copy(Fanex.PTRacing.CURRENT_CONTEXT);
            if (this.context.formId == Fanex.PTRacing.FormTypes.ADD) { // Use the same implementation for Edit PT / Add New
                this.context.formId = Fanex.PTRacing.FormTypes.EDIT_PT;
            }
            this.copiedItem = null; // Store bet type item copied to other bet types
            this.copiedFromFirst = false;
            // Find an item {sportId, id, isLive}
            this.Find = function (object) {
                if (typeof (object.id) != 'number') return null; // Bet type id is not a number, return null
                var items = this.items;
                var count = this.items.length;
                for (var i = 0; i < count; i++) {
                    var item = items[i];
                    if (item.id == object.id && items[i].sportId == object.sportId) {
                        return item; // Return found bet type
                    };
                };
                return null;
            };
            this.Active = function () {
                var count = this.elements.length;
                this.copiedItem = null;
                for (var i = 0; i < count; i++) {
                    this.items[i].Active();
                    if (count > 0 && this.copiedFromFirst) {
                        this.copiedItem = {
                            sportId: this.items[0].sportId,
                            groupId: this.id,
                            id: this.items[0].id
                        };
                        break;
                    }
                };
                if (this.applyAllMembersElement) {
                    Fanex.PTRacing.EnableChildren(this.applyAllMembersElement);
                }
            };
            this.Inactive = function (copiedItem) {
                if (typeof (copiedItem) != 'object') {
                    return;
                };
                this.copiedItem = copiedItem;
                var count = this.elements.length;
                for (var i = 0; i < count; i++) {
                    if (this.id == copiedItem.groupId && this.items[i].id == copiedItem.id && this.sportId == copiedItem.sportId) {
                        this.items[i].Active(); // Activate if first item matching copied item
                        continue;
                    };
                    this.items[i].Inactive(copiedItem);
                }
                if (this.applyAllMembersElement) {
                    if (this.id != copiedItem.groupId || this.sportId != copiedItem.sportId) {
                        Fanex.PTRacing.DisableChildren(this.applyAllMembersElement, "BetTypeInactive");
                    }
                }
            };
            this.Save = function () { // Get data for each bet types
                var count = this.items.length;
                var result = [];
                var copiedItem = (this.copiedItem == null) ? null : Fanex.copy(this.copiedItem); // Avoid changing copiedItem by reference
                // Find PT of copied item
                var grid = this.parent.parent; // Parent grid object
                var item = grid.Find(copiedItem);
                if (item != null && item instanceof Fanex.PTRacing.BetType) {
                    item.Save();
                    copiedItem.pt = Fanex.copy(item.pt);
                }
                for (var i = 0; i < count; i++) {
                    if (this.isHide) {
                        result[i] = new Object();
                        result[i].id = this.items[i].id;
                    }
                    else {
                        if (copiedItem != null) {
                            result[i] = Fanex.copy(copiedItem);
                            result[i].sportId = this.sportId; // Do not copy sport type id
                            result[i].id = this.items[i].id; // Do not copy bet type id
                        } else {
                            result[i] = Fanex.copy(this.items[i].Save());
                        };
                    }
                };

                /*#region betting - comm*/
                var bettingCommSetting = null;
                if (!this.isHide) {
                    if (this.context.roleId - this.context.targetRoleId == 1) {
                        var isApplyPresetPt = false;
                        if (document.getElementById('btnCopyBettingComm').getAttribute('copyBettingComm') == '1') { // copy all is checked
                            var discount = Fanex.RoundNumber(parseFloat(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.discountElement.value, true), 5);
                            var disable = !(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.enableElement.checked);
                            var disableDownlines = null;
                            var minBet = Fanex.RoundNumber(parseFloat(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.minBetElement.value, true), 1);
                            var maxBet = Fanex.RoundNumber(parseFloat(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.maxBetElement.value, true), 1);
                            var maxPerMatch = Fanex.RoundNumber(parseFloat(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.maxPerMatchElement.value, true), 1);

                            if (this.context.targetRoleId != 1) {
                                disableDownlines = !(grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.enableDownlinesElement.checked);
                            }

                            if (document.getElementById('btnEditBetSetting').getAttribute('copybetsetting') != '1')
                            {
                                var minBet = Fanex.RoundNumber(parseFloat(document.getElementById('minbet_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1);
                                var maxBet = Fanex.RoundNumber(parseFloat(document.getElementById('maxbet_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1);
                                var maxPerMatch = Fanex.RoundNumber(parseFloat(document.getElementById('maxpermatch_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1);
                            }

                            if (document.getElementById('btnEditComm').getAttribute('copyComm') != '1') {
                                discount = Fanex.RoundNumber(parseFloat(document.getElementById('comm_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 5);
                            }
                            if (document.getElementById('btnEditStatus').getAttribute('copyStatus') != '1') {
                                disable = !(document.getElementById('enable_' + this.items[0].sportId + '_' + this.items[0].id).checked);
                                if (this.context.targetRoleId != 1) {
                                    disableDownlines = !(document.getElementById('downlines_enable_' + this.sportId + '_' + this.id).checked);
                                }
                            }
                            if (this.context.targetRoleId != 1 && this.context.targetRoleId != 4) {
                                if (copiedItem) {
                                    isApplyPresetPt = (document.getElementById('isApplyPtPreset$' + copiedItem.sportId + '$' + copiedItem.groupId).checked);
                                }
                                else {
                                    isApplyPresetPt = (document.getElementById('isApplyPtPreset$' + this.sportId + '$' + this.id).checked);
                                }
                            }
                            bettingCommSetting = {
                                MinBet: minBet,
                                MaxBet: maxBet,
                                MaxPerMatch: maxPerMatch,
                                Discount: discount,
                                Disable: disable,
                                DisableDownlines: disableDownlines,
                                IsApplyPresetPt: isApplyPresetPt
                            };
                        }
                        else {
                            var disableDownlines = grid.sportTypes[0].betTypeGroups[0].bettingCommSetting.disableDownlines;
                            if (this.context.targetRoleId != 1 && this.context.targetRoleId != 4) {
                                if (copiedItem) {
                                    isApplyPresetPt = (document.getElementById('isApplyPtPreset$' + copiedItem.sportId + '$' + copiedItem.groupId).checked);
                                }
                                else {
                                    isApplyPresetPt = (document.getElementById('isApplyPtPreset$' + this.sportId + '$' + this.id).checked);
                                }
                            }
                            if (this.context.targetRoleId != 1 || this.context.roleId != 2) {
                                disableDownlines = !(document.getElementById('downlines_enable_' + this.sportId + '_' + this.id).checked);
                            }
                            bettingCommSetting = {
                                MinBet: Fanex.RoundNumber(parseFloat(document.getElementById('minbet_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1),
                                MaxBet: Fanex.RoundNumber(parseFloat(document.getElementById('maxbet_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1),
                                MaxPerMatch: Fanex.RoundNumber(parseFloat(document.getElementById('maxpermatch_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 1),
                                Discount: Fanex.RoundNumber(parseFloat(document.getElementById('comm_' + this.items[0].sportId + '_' + this.items[0].id).value, true), 5),
                                Disable: !(document.getElementById('enable_' + this.items[0].sportId + '_' + this.items[0].id).checked),
                                DisableDownlines: disableDownlines,
                                IsApplyPresetPt: isApplyPresetPt
                            };
                        }
                    }
                }
                /*#endregion betting - comm*/
                return {
                    id: this.id,
                    betTypes: result,
                    bettingCommSetting: bettingCommSetting
                };
            };
            this.Render = function (owner) {
                var box = null;
                var elements = []; // Child bet type element
                if (typeof (this.betTypes) != 'object' || typeof (this.betTypes.length) == 'undefined' || this.betTypes.length <= 0) {
                    console.log("Input data source betTypes is empty.");
                } else {
                    box = document.createElement("DIV")
                    var totalGroupWidth = 0;
                    var bettypeGroupBox = null;
                    var roleId = this.context.roleId;
                    if (this.context.targetRoleId != 1 && (this.context.roleId == 0 || this.context.roleId - this.context.targetRoleId == 1)) {
                        roleId = 0;
                    }
                    var targetRoleId = this.context.targetRoleId;
                    var formId = this.context.formId;
                    var method = this['Render_'.concat(roleId, '_', targetRoleId, '_', formId)];
                    if (typeof (method) == "function") {
                        bettypeGroupBox = method.call(this, owner);
                    } else {
                        console.log("Could not find the implementation of " + methodName);
                    }
                    if (bettypeGroupBox != null) {
                        elements = this.elements;
                        box.appendChild(bettypeGroupBox);
                    }
                };
                if (this.elements.length == 0) {
                    box = null;
                };
                if (box != null) {
                    if (this.context.formId != 4) {
                        if (this.elements.length > 1) {
                            // Copy all check box
                            var copyCheck = document.createElement("INPUT");
                            copyCheck.type = "checkbox";
                            copyCheck.id = copyCheck.name = "c$" + this.betTypes[0].id + "$" + this.betTypes[0].sportId;
                            var copyDiv = document.createElement("DIV"); // to hide copyCheck
                            copyDiv.appendChild(copyCheck);
                            copyDiv.className = "PTCheckCopied";
                            this.elements[0].firstChild.title = Language.COPY_FROM.Format(this.betTypes[0].name);
                            var bettypeCopiedDiv = document.createElement("DIV");
                            bettypeCopiedDiv.className = "PTBetTypeCopied";
                            this.elements[0].firstChild.appendChild(bettypeCopiedDiv);
                            this.elements[0].firstChild.className = "BetTypeHeader2";
                            this.elements[0].firstChild.appendChild(copyDiv);
                            copyCheck.icon = bettypeCopiedDiv;
                            copyCheck.parent = this;
                            var items = this.items;
                            this.elements[0].firstChild.onclick = function () {
                                if (copyCheck.parent.parent.copiedItem != null) { // Return when already existed copied item
                                    return;
                                };
                                var count = elements.length;
                                copyCheck.checked = !copyCheck.checked;
                                copyCheck.parent.copiedFromFirst = copyCheck.checked;
                                if (copyCheck.checked) {
                                    var copiedItem = {
                                        sportId: items[0].sportId,
                                        groupId: copyCheck.parent.id,
                                        id: items[0].id
                                    };
                                    copyCheck.parent.copiedItem = copiedItem; // First bet type item
                                    copyCheck.parent.Inactive(copiedItem);
                                    copyCheck.icon.className = "PTBetTypeCopiedActive";
                                } else {
                                    copyCheck.parent.copiedItem = null;
                                    copyCheck.parent.Active();
                                    copyCheck.icon.className = "PTBetTypeCopied";
                                }
                            }
                        }
                    }
                    box.className = "PTGroup";
                    this.DOM = box;
                    // Append or return the object
                    if (typeof (owner) == 'object') {
                        owner.appendChild(box);
                    };
                };
                return box;
            };
        },
        SportType: function (sportType) {
            if (typeof (sportType) != 'object') {
                console.log("Input sport type is an invalid object.");
                return null;
            }
            this.id = sportType.id; // Sport type id
            this.context = Fanex.copy(Fanex.PTRacing.CURRENT_CONTEXT);
            this.name = sportType.name; // Sport type name as Soccer, Handicap
            this.key = sportType.key; // Sport type key as Soccer, Handicap
            this.title = sportType.title;
            this.betTypeGroups = sportType.betTypeGroups;
            this.elements = []; // Bet type group set HTML elements
            this.items = []; // Bet Type group set objects
            this.cloneButton = null; // Copy all button for Soccer and Basketball
            this.copiedItem = null;
            this.collapsed = typeof (sportType.collapsed) == 'undefined' ? true : sportType.collapsed; // Default collapse or not
            // Find an item {sportId, id, isLive}
            this.Find = function (object) {
                if (typeof (object.id) != 'number') return this; // Bet type id is not a number, return sport type
                var items = this.items;
                var count = this.items.length;
                for (var i = 0; i < count; i++) {
                    if (object.sportId == this.id) {
                        var item = items[i].Find(object);
                        if (item != null) return item;
                    }
                };
                return null;
            };
            this.Active = function () {
                this.copiedItem = null;
                var count = this.items.length;
                for (var i = 0; i < count; i++) {
                    this.items[i].Active();
                }
            };
            this.Inactive = function (copiedItem) {
                if (typeof (copiedItem) != 'object') {
                    return;
                };
                this.copiedItem = copiedItem;
                var count = this.items.length;
                for (var i = 0; i < count; i++) {
                    this.items[i].Inactive(copiedItem);
                }
            };
            this.Save = function () {
                var count = this.items.length;

                var result = [];
                var grid = this.parent;
                for (var i = 0; i < count; i++) {
                    result[i] = this.items[i].Save();

                    if (this.items[i].isHide) {
                        result[i].bettingCommSetting = grid.backup.bettingCommSetting;
                        for (var j = 0; j < grid.backup.betTypes.length; j++) {
                            result[i].betTypes[j].pt = grid.backup.betTypes[j].pt;
                        }
                    }

                    if (this.id == Fanex.PTRacing.HR_UKIRISHTOTE_WIN.sportId && this.items[i].id == Fanex.PTRacing.HR_UKIRISHTOTE_WIN.betTypeId) {
                        grid.backup = result[i];
                    }
                };
                return {
                    id: this.id,
                    key: this.key,
                    betTypeGroups: result
                };
            };
            this.Render = function (owner) {
                var box = null;
                var elements = []; // Child bet type group sets element
                if (typeof (this.betTypeGroups) != 'object' || typeof (this.betTypeGroups.length) == 'undefined' || this.betTypeGroups.length <= 0) {
                    console.log("Input data source betTypeGroups is empty.");
                }
                else {
                    box = document.createElement("DIV");

                    // Add sport type name label
                    var header = document.createElement("DIV");
                    header.innerHTML = this.name;
                    header.title = this.title;
                    header.id = "ptsportheader_" + this.id;
                    header.className = "PTSportLabel";
                    header.parent = this;
                    box.appendChild(header);

                    var box2 = document.createElement("DIV");
                    // Each bet type group sets
                    var count = this.betTypeGroups.length;
                    for (var i = 0; i < count; i++) {
                        var item = this.betTypeGroups[i];
                        item.sportId = this.id;
                        var groupSetItem = new Fanex.PTRacing.BetTypeGroup(item);
                        groupSetItem.parent = this; // Keep reference to current sport type
                        if (groupSetItem.isHide) {
                            groupSetItem.items = [];
                            for (var j = 0; j < groupSetItem.betTypes.length; j++) {
                                groupSetItem.items[j] = {
                                    id: groupSetItem.betTypes[j].id,
                                    pt: null
                                };
                            }
                            this.items[i] = groupSetItem;
                            // todo, set toan bo betTypes theo id
                        }
                        else {
                            var element = groupSetItem.Render(box2);
                            if (element != null) {
                                elements[i] = element;
                                this.items[i] = groupSetItem;
                            }
                        }
                    }
                    box2.className = "PTGroups";
                    this.elements = elements;


                    // Copy from sport
                    var copyCheck = document.createElement("INPUT");
                    copyCheck.type = "checkbox";
                    copyCheck.id = copyCheck.name = "cp$" + this.id; // Copy from sport check box
                    copyCheck.className = "PTCheckCopied";
                    var copyDiv = document.createElement("DIV");
                    copyDiv.appendChild(copyCheck);
                    copyDiv.parent = this;
                    if (this.id == Fanex.PTRacing.HR_UKIRISHTOTE_WIN.sportId) { // For Horse Racing
                        copyDiv.className = "PTSportCopied";
                        copyDiv.title = Language.COPY_ALL_OTHER_POSITION_TAKING_FROM.Format(Language.HORSE_RACING_UI_IRISH_TOTE, this.betTypeGroups[0].betTypes[0].name);
                    } else {
                        copyDiv.className = "PTSportCopiedInactive";
                        copyDiv.onclick = function () {
                            copyDiv.parent.Toggle(true); // Expand
                            if (copyDiv.parent.parent.copiedItem == null) return;
                            var actived = (copyDiv.className == "PTSportEditCopied");
                            if (!actived) {
                                copyDiv.parent.Active(); // Active
                            } else {
                                copyDiv.parent.Inactive(copyDiv.parent.parent.copiedItem);
                            };
                            copyDiv.className = actived ? "PTSportEdit" : "PTSportEditCopied";
                            if (copyDiv.parent.parent.activeCopiedTitle) {
                                copyDiv.title = actived ? Language.EDIT : Language.COPY_ALL_POSITION_TAKING_FROM.Format(copyDiv.parent.name, copyDiv.parent.parent.activeCopiedTitle);
                            };
                        };
                    };

                    this.cloneButton = copyDiv; // Keep reference for implementation in parent level
                    //                    copyDiv.appendChild(copyCheck);
                    box.appendChild(copyDiv);
                    if (this.context.formId == 4) {
                        copyDiv.style.display = "none";
                    }

                    // Handle default collapse / expand
                    if (this.collapsed) {
                        box2.style.display = "none"; // box2 contains PT setting
                    }
                    // Event click to collapse sportType
                    this.Toggle = function (expanded) {
                        var collapsed = false;
                        if (typeof (expanded) != "undefined") {
                            collapsed = !expanded;
                        } else {
                            collapsed = (box2.style.display != "none");
                        };
                        if (!collapsed) {
                            box2.style.display = String.Empty;
                            this.collapsed = false;
                        } else {
                            box2.style.display = "none";
                        }
                        this.collapsed = collapsed;
                    };
                    header.onclick = function () {
                        header.parent.Toggle();
                    };
                    box.appendChild(box2);
                }
                if (this.elements.length == 0) {
                    box = null;
                }
                if (box != null) {
                    box.className = "PTSport";
                    this.DOM = box;
                    // Append or return the object
                    if (typeof (owner) == 'object') {
                        owner.appendChild(box);
                    }
                }
                return box;
            }
        },
        PTGrid: function (source) {
            this.elements = []; // Sport type HTML elements
            this.items = []; // Sport type objects
            this.backup = null // Backup result Horse Racing - UK/Irish Tote
            this.sportTypes = [];
            if (typeof (source) == 'object') {
                this.name = source.name;
                this.sportTypes = source.sportTypes;
            };

            // Find an item {sportId, id, isLive}
            this.Find = function (object) {
                if (typeof (object) != 'object' || object == null) return null;
                if (typeof (object.sportId) != 'number') return null;
                var items = this.items;
                var count = this.items.length;
                for (var i = 0; i < count; i++) {
                    if (items[i].id == object.sportId) {
                        var item = items[i].Find(object);
                        if (item != null) return item;
                    };
                };
                return null;
            };
            this.Save = function () {
                var count = this.items.length;
                var result = [];
                for (var i = 0; i < count; i++) {
                    result[i] = this.items[i].Save();
                };
                return {
                    sportTypes: result
                };
            };
            this.Validate = function (ptSetting, isMulti) {
                var ptGrid = this;
                this.GetPt = function (sportTypeId, betTypeId) {
                    var sportCount = ptGrid.sportTypes.length;
                    for (var i = 0; i < sportCount; i++) {
                        var sport = ptGrid.sportTypes[i];
                        if (sport.id == sportTypeId) {
                            var betTypeGroupsLength = sport.betTypeGroups.length;
                            for (var j = 0; j < betTypeGroupsLength; j++) {
                                var betTypeGroup = sport.betTypeGroups[j];
                                var betTypeLength = betTypeGroup.betTypes.length;
                                for (var k = 0; k < betTypeLength; k++) {
                                    var betType = betTypeGroup.betTypes[k];
                                    if (betType.id == betTypeId) {
                                        return betType.pt;
                                    }
                                }
                            }
                        }
                    }
                    return null;
                };
                var memberMaxPt = function () {
                    this.context = Fanex.copy(Fanex.PTRacing.CURRENT_CONTEXT);

                    // Each sport types
                    var sportCount = ptGrid.sportTypes.length;
                    for (var i = 0; i < sportCount; i++) {
                        var sport = ptGrid.sportTypes[i];
                        var betTypeGroupsLength = sport.betTypeGroups.length;
                        for (var j = 0; j < betTypeGroupsLength; j++) {
                            var betTypeGroup = sport.betTypeGroups[j];
                            if (betTypeGroup.isHide) {
                                continue;
                            }
                            var betTypeLength = betTypeGroup.betTypes.length;
                            for (var k = 0; k < betTypeLength; k++) {
                                var betType = betTypeGroup.betTypes[k];
                                var pt = betType.pt;
                                var sportTypeId = Fanex.PTRacing.HR_UKIRISHTOTE_WIN.sportId;
                                var betTypeId = Fanex.PTRacing.HR_UKIRISHTOTE_WIN.betTypeId;

                                if (this.context.targetRoleId == 2) { // Edit Agent
                                    var im2 = document.getElementById('im2' + '$' + sport.id + '$' + betType.id);
                                    if (im2 != null && !im2.checked) {
                                        if (isMulti || im2.checked != pt.im2) {
                                            var pt = ptGrid.GetPt(sportTypeId, betTypeId);
                                            if (pt) {
                                                var l2 = pt.l2;
                                                var a2 = document.getElementById('a2$' + sportTypeId + '$' + betTypeId);
                                                return Fanex.Round(l2 - parseFloat(a2.value));
                                            }
                                        }
                                    }
                                }
                                else if (this.context.targetRoleId == 3) { // Edit Master
                                    var is3 = document.getElementById('is3' + '$' + sport.id + '$' + betType.id);
                                    if (is3 != null && !is3.checked) {
                                        if (isMulti || is3.checked != pt.is3) {
                                            var pt = ptGrid.GetPt(sportTypeId, betTypeId);
                                            if (pt) {
                                                var l3 = pt.s4;
                                                var m3 = document.getElementById('m3$' + sportTypeId + '$' + betTypeId);
                                                return Fanex.Round(l3 - parseFloat(m3.value));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return null;
                } ();

                if (memberMaxPt != null) {
                    Popups.Confirm(memberMaxPt);
                    return true;
                }

                return false;
            };
            this.ShowCloneHint = function () {
                if (this.copiedItem == null) {
                    return;
                }
                var copiedElement = this.items[0].items[0].items[0].element;
                var hint = Language.COPY_ALL_HINT.Format('<b>' + this.activeCopiedTitle + '</b>');
                var otherBetTypesOf = Language.OTHER_BET_TYPE_OF.Format(this.items[0].name);
                hint = hint + '<div class="ul-position"><ul><li>' + otherBetTypesOf + '</li>';
                // Find all copied items to generate tooltip
                var count = this.items.length;
                var top = 0;
                for (var i = 1; i < count; i++) {
                    if (this.items[i].copiedItem != null && this.items[i].copiedItem.sportId == this.copiedItem.sportId) {
                        hint += '<li>' + this.items[i].name + '</li>';
                        top += 18;
                    }
                }

                hint = hint + '</ul></div>';
                top = top + 40;
                // Show tooltip
                var context = Fanex.PTRacing.CURRENT_CONTEXT;
                var hintclass = 'hint-pointer';
                var xpos = 0;
                var pointerXPos = 10;
                var pointerYPos = top + 20;
                var ypos = -top - 20;
                if (context.roleId == 2 && context.targetRoleId == 1) {
                    hintclass = 'hint-pointer-right';
                    xpos = 233;
                    ypos += 93;
                    pointerXPos = -10;
                    pointerYPos = 10;
                }

                Validators.show(copiedElement, hint, xpos, pointerXPos, ypos, pointerYPos, top, 30000, hintclass);
            };
            this.Render = function (owner) {
                var box = null;
                var elements = []; // Child sport type elements
                if (typeof (this.sportTypes) != 'object' || typeof (this.sportTypes.length) == 'undefined') {
                    console.log("Input data source sportTypes is empty.");
                } else {
                    box = document.createElement("DIV");
                    // Each sport types
                    var count = this.sportTypes.length;
                    for (var i = 0; i < count; i++) {
                        var item = this.sportTypes[i];
                        var sportItem = new Fanex.PTRacing.SportType(item);
                        sportItem.parent = this; // Keep reference to current grid
                        var element = sportItem.Render(box);
                        var clear = document.createElement("DIV");
                        clear.style.clear = "both";
                        box.appendChild(clear);
                        if (element != null) {
                            elements[i] = element;
                            this.items[i] = sportItem;
                        }
                    }
                    this.elements = elements;
                }
                if (this.elements.length == 0) {
                    box = null;
                }
                if (box != null) {
                    box.className = "PTGrid";
                    var items = this.items;
                    // Implementation for clone button of Soccer 1 and Basketball 2
                    var cloneFromSoccer = this.items[0].cloneButton;
                    var copiedItemSoccer = {
                        sportId: Fanex.PTRacing.HR_UKIRISHTOTE_WIN.sportId,
                        groupId: Fanex.PTRacing.HR_UKIRISHTOTE_WIN.toteId,
                        id: Fanex.PTRacing.HR_UKIRISHTOTE_WIN.betTypeId
                    };
                    cloneFromSoccer.parent = this;
                    var hideHintTimeout = 0;
                    cloneFromSoccer.onmouseover = function () {
                        if (cloneFromSoccer.parent.copiedItem != null && cloneFromSoccer.parent.copiedItem.sportId == 151) {
                            if (hideHintTimeout != 0) {
                                clearTimeout(hideHintTimeout);
                            }
                            cloneFromSoccer.parent.ShowCloneHint();
                        }
                    }
                    cloneFromSoccer.onmouseout = function () {
                        if (hideHintTimeout != 0) {
                            clearTimeout(hideHintTimeout);
                        }
                        hideHintTimeout = setTimeout(Validators.hide, 1000);
                    }
                    cloneFromSoccer.onclick = function () {
                        Validators.hide();
                        var count = items.length;
                        cloneFromSoccer.firstChild.checked = !cloneFromSoccer.firstChild.checked;
                        cloneFromSoccer.parent.copiedItem = copiedItemSoccer;
                        cloneFromSoccer.parent.activeCopiedTitle = "{0} {1}".Format(Language.HORSE_RACING_UI_IRISH_TOTE, items[0].betTypeGroups[0].betTypes[0].name);
                        cloneFromSoccer.className = cloneFromSoccer.firstChild.checked ? "PTSportCopiedActive" : "PTSportCopied";
                        cloneFromSoccer.parent.items[0].Toggle(true); // Expand

                        // Show / Hide edit button of Basketball
                        if (cloneFromSoccer.firstChild.checked) {
                            cloneFromSoccer.title = String.Empty;
                        } else {
                            cloneFromSoccer.title = Language.COPY_ALL_OTHER_POSITION_TAKING_FROM.Format(items[0].name, items[0].betTypeGroups[0].betTypes[0].name);
                        }
                        for (var i = 0; i < count; i++) {
                            if (cloneFromSoccer.firstChild.checked) {
                                items[i].Inactive(Fanex.copy(copiedItemSoccer));
                            } else {
                                items[i].Active();
                                cloneFromSoccer.parent.copiedItem = null;
                            }
                        };

                        for (var i = 0; i < count; i++) {
                            if (cloneFromSoccer.firstChild.checked) {
                                items[i].Inactive(Fanex.copy(copiedItemSoccer));
                            } else {
                                items[i].Active();
                                cloneFromSoccer.parent.copiedItem = null;
                            }
                            if (i > 0) {
                                items[i].cloneButton.className = cloneFromSoccer.firstChild.checked ? "PTSportEdit" : "PTSportCopiedInactive";
                                items[i].cloneButton.title = cloneFromSoccer.firstChild.checked ? Language.EDIT : String.Empty;
                            }
                        };
                        cloneFromSoccer.parent.ShowCloneHint();
                    };
                    this.DOM = box;
                    // Append or return the object
                    if (typeof (owner) == 'object') {
                        owner.appendChild(box);
                    }
                }
                return box;
            };
        },
        ToggleBetCommSetting: function (grid) {
            var copyAllInput = document.getElementById("btnCopyBettingComm");
            var isCopyAll = (copyAllInput.getAttribute('copyBettingComm') == "1");

            var copyBetSettingAllInput = document.getElementById("btnEditBetSetting");
            var isBetSettingAll = (copyBetSettingAllInput.getAttribute('copyBetSetting') == "1");

            var commEditAllInput = document.getElementById("btnEditComm");
            var isCommEditAll = (commEditAllInput.getAttribute('copycomm') == "1");

            var statusEditAllInput = document.getElementById("btnEditStatus");
            var isStatusEditAll = (statusEditAllInput.getAttribute('copystatus') == "1");

            var sportLength = grid.items.length;
            for (var i = 0; i < sportLength; i++) {
                var sportType = grid.items[i];
                var toteLength = sportType.betTypeGroups.length;
                for (var j = 0; j < toteLength; j++) {
                    var tote = sportType.betTypeGroups[j];
                    if (!tote.isHide) {
                        // bet settings
                        var minbetElement = document.getElementById("minbet_" + sportType.id + "_" + tote.id).parentNode;
                        var maxbetElement = document.getElementById("maxbet_" + sportType.id + "_" + tote.id).parentNode;
                        var maxpermatchElement = document.getElementById("maxpermatch_" + sportType.id + "_" + tote.id).parentNode;
                        if (isCopyAll && isBetSettingAll && (i != 0 || j != 0)) {
                            //if (i == 0 && j == 0) {
                            //    Fanex.PTRacing.EnableChildren(minbetElement);
                            //    Fanex.PTRacing.EnableChildren(maxbetElement);
                            //    Fanex.PTRacing.EnableChildren(maxpermatchElement);
                            //}
                            //else {
                            //    Fanex.PTRacing.DisableChildren(minbetElement);
                            //    Fanex.PTRacing.DisableChildren(maxbetElement);
                            //    Fanex.PTRacing.DisableChildren(maxpermatchElement);
                            //}
                            Fanex.PTRacing.DisableChildren(minbetElement);
                            Fanex.PTRacing.DisableChildren(maxbetElement);
                            Fanex.PTRacing.DisableChildren(maxpermatchElement);
                        }
                        else {
                            Fanex.PTRacing.EnableChildren(minbetElement);
                            Fanex.PTRacing.EnableChildren(maxbetElement);
                            Fanex.PTRacing.EnableChildren(maxpermatchElement);
                        }

                        // bet commission
                        var commElement = document.getElementById("comm_" + sportType.id + "_" + tote.id).parentNode;
                        if (isCopyAll && isCommEditAll && (i != 0 || j != 0)) {
                            Fanex.PTRacing.DisableChildren(commElement);
                        }
                        else {
                            Fanex.PTRacing.EnableChildren(commElement);
                        }

                        // bet status
                        var enableElement = document.getElementById("enable_" + sportType.id + "_" + tote.id).parentNode;
                        if (grid.context.targetRoleId != 1) {
                            var downlinesElement = document.getElementById("downlines_enable_" + sportType.id + "_" + tote.id).parentNode;
                        }
                        if (isCopyAll && isStatusEditAll && (i != 0 || j != 0)) {
                            Fanex.PTRacing.DisableChildren(enableElement);
                            if (grid.context.targetRoleId != 1) {
                                Fanex.PTRacing.DisableChildren(downlinesElement);
                            }
                        }
                        else {
                            Fanex.PTRacing.EnableChildren(enableElement);
                            if (grid.context.targetRoleId != 1) {
                                Fanex.PTRacing.EnableChildren(downlinesElement);
                            }
                        }
                    }
                }
            }
        },
        EnableBetCommSetting: function (sportTypes) {
            var sportLength = sportTypes.length;
            for (var i = 0; i < sportLength; i++) {
                var sportType = sportTypes[i];
                var toteLength = sportType.betTypeGroups.length;
                for (var j = 0; j < toteLength; j++) {
                    if (i != 0 || j != 0) {
                        var tote = sportType.betTypeGroups[j];
                        var element = document.getElementById("divBettingComm_BettypeGroup_" + sportType.id + "_" + tote.id);
                        if (element) {
                            var row = element.parentNode;
                            var count = row.childNodes.length;
                            for (var k = 1; k < count; k++) {
                                Fanex.PTRacing.EnableChildren(row.childNodes[k]);
                            }
                        }
                    }
                }
            }
        }
    }
};
// Validators library
var Validators = {
    add: function (elementInput, expr, message) {
        // Bind onchange event of input
        // Validate with expr
        // Show message and animate background color
    },
    show: function (elementInput, message, xPos, pointerXPos, yPos, pointerYPos, height, timeout, hintclass) {
        // <span class="hint"><span>This is the message.<span><span class="hint-pointer">&nbsp;</span></span>
        var hint = document.getElementById('fHint');
        var hintPointer = null;
        if (hint == null) {
            var hint = document.createElement("SPAN");
            hint.className = 'hint';
            var hintMsg = document.createElement("SPAN");
            hint.appendChild(hintMsg);
            hintPointer = document.createElement("SPAN");
            hint.appendChild(hintPointer);
            hint.id = 'fHint';
            hint.style.top = '10px';
            hint.style.left = '10px';
            hint.style.zIndex = 999999;
            hint.onclick = function () { // Hide onclick
                hint.style.display = 'none';
            };
            document.body.appendChild(hint);
        };
        hintPointer = hint.lastChild;
        if (typeof hintclass == 'undefined') {
            hintclass = 'hint-pointer';
        }
        hintPointer.className = hintclass;
        hint.firstChild.innerHTML = message;
        if (this.timeOutHideTooltip) {
            clearTimeout(this.timeOutHideTooltip);
            this.timeOutHideTooltip = null;
        };
        if (typeof (timeout) == 'undefined') {
            timeout = 3000;
        }
        this.timeOutHideTooltip = setTimeout(function () {
            if (hint == null) {
                return;
            }
            hint.style.display = 'none';
        }, timeout); // Auto hide in 10s
        if (elementInput != null) {
            if (typeof xPos == 'undefined') {
                xPos = 0;
            }
            if (typeof pointerXPos == 'undefined') {
                pointerXPos = 10;
            }
            if (typeof yPos == 'undefined') {
                yPos = -45;
            }
            if (typeof (pointerYPos) == 'undefined') {
                pointerYPos = 38;
            }
            if (typeof (height) == 'undefined') {
                height = 18;
            }
            hint.style.height = height + 'px';
            hintPointer.style.left = (pointerXPos + 'px');
            hintPointer.style.top = (pointerYPos + 'px');
            var pos = Validators.utils.findPos(elementInput);
            hint.style.left = (pos[0] + xPos) + 'px';
            hint.style.top = (pos[1] + yPos) + 'px';
            elementInput.onchange = function () {
                hint.style.display = 'none';
            };
            //elementInput.focus();
            if (elementInput.style.visibility == "hidden" || elementInput.style.display == "none" || elementInput.disabled == true) {
                //do something because it can't accept focus()
            } else {
                elementInput.focus();
            }
        };
        hint.style.display = 'block';
    },
    showDown: function (elementInput, message, xPos, pointerXPos, yPos, pointerYPos, height, timeout) {
        // <span class="fHintDown"><span>This is the message.<span><span class="hint-pointer">&nbsp;</span></span>
        var hint = document.getElementById('fHintDown');
        var hintPointer = null;
        if (hint == null) {
            var hint = document.createElement("SPAN");
            hint.className = 'hint';
            var hintMsg = document.createElement("SPAN");
            hint.appendChild(hintMsg);
            hintPointer = document.createElement("SPAN");
            hintPointer.className = 'hint-pointer-down';
            hint.appendChild(hintPointer);
            hint.id = 'fHintDown';
            hint.style.top = '10px';
            hint.style.left = '10px';
            hint.style.zIndex = 999999;
            hint.onclick = function () { // Hide onclick
                hint.style.display = 'none';
            };
            document.body.appendChild(hint);
        };
        hintPointer = hint.lastChild;
        hint.firstChild.innerHTML = message;
        if (this.timeOutHideTooltip) {
            clearTimeout(this.timeOutHideTooltip);
            this.timeOutHideTooltip = null;
        };
        if (typeof (timeout) == 'undefined') {
            timeout = 1000;
        }
        this.timeOutHideTooltip = setTimeout(function () {
            if (hint == null) {
                return;
            }
            hint.style.display = 'none';
        }, timeout); // Auto hide in 1s
        if (elementInput != null) {
            if (typeof xPos == 'undefined') {
                xPos = 0;
            }
            if (typeof pointerXPos == 'undefined') {
                pointerXPos = 10;
            }
            if (typeof yPos == 'undefined') {
                yPos = -45;
            }
            if (typeof (pointerYPos) == 'undefined') {
                pointerYPos = 38;
            }
            if (typeof (height) == 'undefined') {
                height = 18;
            }
            hint.style.height = height + 'px';
            hintPointer.style.left = (pointerXPos + 'px');
            hintPointer.style.top = (pointerYPos + 'px');
            var pos = Validators.utils.findPos(elementInput);
            hint.style.left = (pos[0] + xPos) + 'px';
            hint.style.top = (pos[1] + yPos) + 'px';
            elementInput.onchange = function () {
                hint.style.display = 'none';
            };
            elementInput.focus();
        };
        hint.style.display = 'block';
    },
    hide: function () {
        var hint = document.getElementById('fHint');
        if (hint == null) {
            return;
        }
        hint.style.display = 'none';
    },
    animate: function (input) {
        var previousColor = input.style.color;
        var previousBackground = input.style.backgroundColor;
        var c = 4;
        if (this.intervalAnimate) {
            clearInterval(this.intervalAnimate);
            this.intervalAnimate = null;
        }
        var interval = this.intervalAnimate = setInterval(function () {
            c--;
            if (input.style.backgroundColor == previousBackground) {
                input.style.backgroundColor = '#ff7700';
                input.style.color = '#ffffff';
            } else {
                input.style.backgroundColor = previousBackground;
                input.style.color = previousColor;
            }
            if (c == 0) {
                clearInterval(interval);
            }
        }, 300);
    },
    utils: {
        // findPos() by quirksmode.org
        // Finds the absolute position of an element on a page
        findPos: function (obj) {
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }

            return [curleft, curtop];
        },
        // getPageScroll() by quirksmode.org
        // Finds the scroll position of a page
        getPageScroll: function () {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                yScroll = document.documentElement.scrollTop;
                xScroll = document.documentElement.scrollLeft;
            } else if (document.body) { // all other Explorers
                yScroll = document.body.scrollTop;
                xScroll = document.body.scrollLeft;
            }
            return [xScroll, yScroll]
        },
        // Finds the position of an element relative to the viewport.
        findPosRelativeToViewport: function (obj) {
            var objPos = this.findPos(obj)
            var scroll = this.getPageScroll()
            return [objPos[0] - scroll[0], objPos[1] - scroll[1]]
        }
    },
    validateNumber: function (value) {
        if (value && value != "") {
            value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var intRegex = /^\d+$/;

            if (!intRegex.test(value)) {
                return false;
            }

            return true;
        } else {
            return false;
        }
    },

    validateInput: function (value) {
        if (value && value != "") {
            value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

            if (value != "")
                return true;

            return false;
        }

        return false;
    },

    validatePassword: function (str) {
        var s = str.toLowerCase();
        var numbers = "0123456789";

        var i = 0;
        var nCount = 0;

        while (i < s.length) {
            (numbers.indexOf(s.substring(i, i + 1)) >= 0) ? nCount++ : false;
            i++;
        }

        var validNumber = ((nCount > (s.length - 2)) || nCount < 2 || s.length < 6) ? false : true;

        var letters = "abcdefghijklmnopqrstuvwxyz";

        i = 0;
        nCount = 0;

        while (i < s.length) {
            (letters.indexOf(s.substring(i, i + 1)) >= 0) ? nCount++ : false;
            i++;
        }

        var validLetter = ((nCount > (s.length - 2)) || nCount < 2 || s.length < 6) ? false : true;

        return validNumber & validLetter;
    },

    validateName: function (str) {
        var reg = /^[A-z0-9 ]+$/;

        if (!reg.test(str)) {
            return false;
        }

        return true;
    },

    validateKey: function (str) {
        var reg = /^[A-z0-9]+$/;

        if (!reg.test(str)) {
            return false;
        }

        return true;
    }
};

// Modal Popup
var Popups = {
    Confirm: function (memberMaxPt) {
        var title = Language.CONFIRM_UPDATE_MEMBERS_PT;
        ModalPopups.Confirm("idConfirm",
                title,
                "<div style='padding: 10px;'>" + Language.WANT_TO_UPDATE_ALL_MEMBER_POSITION_TAKING + "<select id='selectedMemberPositionTaking' name='selectedMemberPositionTaking'/></div>",
                {
                    yesButtonText: Language.YES,
                    noButtonText: Language.NO,
                    onYes: "ConfirmYes()",
                    onNo: "ConfirmNo()",
                    width: 400
                }

            );
        Fanex.PTRacing.PT_SetSelect(document.getElementById("selectedMemberPositionTaking"), 0, memberMaxPt, Fanex.PTRacing.PT_STEP, memberMaxPt);
    },

    Close: function () {
        ModalPopups.Close("idConfirm");
    },

    GetNewPt: function () {
        var element = document.getElementById('selectedMemberPositionTaking');
        return element.value;
    }
};

// Modal popup library is compressed
var ModalPopupsDefaults = { shadow: true, shadowSize: 5, shadowColor: "#999999", backgroundColor: "#FAFBFC", borderColor: "#999999", titleBackColor: "#3C3C3C", titleFontColor: "#ffffff", popupBackColor: "#ECECEC", popupFontColor: "black", footerBackColor: "#ECECEC", footerFontColor: "#15428B", okButtonText: "OK", yesButtonText: "Yes", noButtonText: "No", cancelButtonText: "Cancel", fontFamily: "Tahoma,Arial,helvetica,sans-serif", fontSize: "8pt" }; var ModalPopups = { Init: function () { }, SetDefaults: function (a) { a = a || {}; ModalPopupsDefaults.shadow = a.shadow != null ? a.shadow : ModalPopupsDefaults.shadow; ModalPopupsDefaults.shadowSize = a.shadowSize != null ? a.shadowSize : ModalPopupsDefaults.shadowSize; ModalPopupsDefaults.shadowColor = a.shadowColor != null ? a.shadowColor : ModalPopupsDefaults.shadowColor; ModalPopupsDefaults.backgroundColor = a.backgroundColor != null ? a.backgroundColor : ModalPopupsDefaults.backgroundColor; ModalPopupsDefaults.borderColor = a.borderColor != null ? a.borderColor : ModalPopupsDefaults.borderColor; ModalPopupsDefaults.okButtonText = a.okButtonText != null ? a.okButtonText : ModalPopupsDefaults.okButtonText; ModalPopupsDefaults.yesButtonText = a.yesButtonText != null ? a.yesButtonText : ModalPopupsDefaults.yesButtonText; ModalPopupsDefaults.noButtonText = a.noButtonText != null ? a.noButtonText : ModalPopupsDefaults.noButtonText; ModalPopupsDefaults.cancelButtonText = a.cancelButtonText != null ? a.cancelButtonText : ModalPopupsDefaults.cancelButtonText; ModalPopupsDefaults.titleBackColor = a.titleBackColor != null ? a.titleBackColor : ModalPopupsDefaults.titleBackColor; ModalPopupsDefaults.titleFontColor = a.titleFontColor != null ? a.titleFontColor : ModalPopupsDefaults.titleFontColor; ModalPopupsDefaults.popupBackColor = a.popupBackColor != null ? a.popupBackColor : ModalPopupsDefaults.popupBackColor; ModalPopupsDefaults.popupFontColor = a.popupFontColor != null ? a.popupFontColor : ModalPopupsDefaults.popupFontColor; ModalPopupsDefaults.footerBackColor = a.footerBackColor != null ? a.footerBackColor : ModalPopupsDefaults.footerBackColor; ModalPopupsDefaults.footerFontColor = a.footerFontColor != null ? a.footerFontColor : ModalPopupsDefaults.footerFontColor; ModalPopupsDefaults.fontFamily = a.fontFamily != null ? a.fontFamily : ModalPopupsDefaults.fontFamily; ModalPopupsDefaults.fontSize = a.fontSize != null ? a.fontSize : ModalPopupsDefaults.fontSize }, Alert: function (f, d, b, a) { a = a || {}; if (!d) { d = "Alert" } a.buttons = "ok"; a.okButtonText = a.okButtonText != null ? a.okButtonText : ModalPopupsDefaults.okButtonText; var e = ModalPopups._createAllLayers(f, d, b, a); var c = e[4]; c.innerHTML = b; ModalPopups._styleAllLayers(f, a, e) }, Confirm: function (f, d, a, b) { b = b || {}; if (!d) { d = "Confirm" } b.buttons = "yes,no"; b.yesButtonText = b.yesButtonText != null ? b.yesButtonText : ModalPopupsDefaults.yesButtonText; b.noButtonText = b.noButtonText != null ? b.noButtonText : ModalPopupsDefaults.noButtonText; var e = ModalPopups._createAllLayers(f, d, a, b); var c = e[4]; c.innerHTML = a; ModalPopups._styleAllLayers(f, b, e) }, YesNoCancel: function (f, d, a, b) { b = b || {}; if (!d) { d = "YesNoCancel" } b.buttons = "yes,no,cancel"; b.yesButtonText = b.yesButtonText != null ? b.yesButtonText : ModalPopupsDefaults.yesButtonText; b.noButtonText = b.noButtonText != null ? b.noButtonText : ModalPopupsDefaults.noButtonText; b.cancelButtonText = b.cancelButtonText != null ? b.cancelButtonText : ModalPopupsDefaults.cancelButtonText; var e = ModalPopups._createAllLayers(f, d, a, b); var c = e[4]; c.innerHTML = a; ModalPopups._styleAllLayers(f, b, e) }, Prompt: function (h, f, a, d) { d = d || {}; if (!f) { f = "Prompt" } d.buttons = "ok,cancel"; d.okButtonText = d.okButtonText != null ? d.okButtonText : "OK"; d.cancelButtonText = d.cancelButtonText != null ? d.cancelButtonText : "Cancel"; var g = ModalPopups._createAllLayers(h, f, a, d); var e = g[4]; var c = ""; if (d.width != null) { c = "width:95%;" } var b = a + "<br/>"; b += "<input type=text id='" + h + "_promptInput' value='' style='border: solid 1px #859DBE; " + c + "'>"; e.innerHTML = b; ModalPopups._styleAllLayers(h, d, g); ModalPopupsSupport.findControl(h + "_promptInput").focus() }, GetPromptInput: function (b) { var a = ModalPopupsSupport.findControl(b + "_promptInput"); return a }, GetPromptResult: function (b) { var a = ModalPopupsSupport.findControl(b + "_promptInput"); return a }, GetCustomControl: function (a) { return ModalPopupsSupport.findControl(a) }, Indicator: function (f, d, b, a) { a = a || {}; if (!d) { d = "Indicator" } if (a.buttons == null) { a.buttons = "" } var e = ModalPopups._createAllLayers(f, d, b, a); var c = e[4]; c.innerHTML = b; ModalPopups._styleAllLayers(f, a, e) }, Custom: function (f, d, b, a) { a = a || {}; if (!d) { d = "Custom" } if (a.buttons == null) { alert("buttons is a required parameter. ie: buttons: 'yes,no' or buttons: 'ok'.\nPossible buttons are yes, no, ok, cancel"); return } var e = ModalPopups._createAllLayers(f, d, b, a); var c = e[4]; c.innerHTML = b; ModalPopups._styleAllLayers(f, a, e) }, Close: function (a) { window.onresize = null; window.onscroll = null; document.body.removeChild(ModalPopupsSupport.findControl(a + "_background")); document.body.removeChild(ModalPopupsSupport.findControl(a + "_popup")); document.body.removeChild(ModalPopupsSupport.findControl(a + "_shadow")) }, Cancel: function (a) { ModalPopups.Close(a) }, _zIndex: 10000, _createAllLayers: function (l, t, h, e) { var i = ModalPopupsSupport.makeLayer(l + "_background", true, null); var r = ModalPopupsSupport.makeLayer(l + "_popup", true, null); var b = ModalPopupsSupport.makeLayer(l + "_shadow", true, null); var n = ModalPopupsSupport.makeLayer(l + "_popupTitle", true, r); var d = ModalPopupsSupport.makeLayer(l + "_popupBody", true, r); var m = ModalPopupsSupport.makeLayer(l + "_popupFooter", true, r); var j = e.okButtonText != null ? e.okButtonText : ModalPopupsDefaults.okButtonText; var p = e.yesButtonText != null ? e.yesButtonText : ModalPopupsDefaults.yesButtonText; var c = e.noButtonText != null ? e.noButtonText : ModalPopupsDefaults.noButtonText; var o = e.cancelButtonText != null ? e.cancelButtonText : ModalPopupsDefaults.cancelButtonText; var s = e.onOk != null ? e.onOk : 'ModalPopups.Close("' + l + '");'; var a = e.onYes != null ? e.onYes : 'ModalPopups.Close("' + l + '");'; var k = e.onNo != null ? e.onNo : 'ModalPopups.Close("' + l + '");'; var g = e.onCancel != null ? e.onCancel : 'ModalPopups.Close("' + l + '");'; n.innerHTML = "<div style='float: left'><b>" + t + "</b></div><div class='closePopup' onclick='javascript:Popups.Close();'></div>"; m.innerHTML = ""; e.fontFamily = e.fontFamily != null ? e.fontFamily : ModalPopupsDefaults.fontFamily; var q = e.buttons.split(","); for (x in q) { if (q[x] == "ok") { m.innerHTML += "<input name='" + l + "_okButton' id='" + l + "_okButton' type=button value='" + j + "' style='font-family:Verdana,Arial; font-size:8pt; border: solid 1px #859DBE; background-color: white; width:75px; height:20px; margin-right: 5px; margin-left: 5px;' onclick='" + s + "'/>" } if (q[x] == "yes") { m.innerHTML += "<input name='" + l + "_yesButton' id='" + l + "_yesButton' type=button value='" + p + "' style='font-family:Verdana,Arial; font-size:8pt; border: solid 1px #859DBE; background-color: white; width:75px; height:20px; margin-right: 5px; margin-left: 5px; cursor: pointer;' onclick='" + a + "'/>" } if (q[x] == "no") { m.innerHTML += "<input name='" + l + "_noButton' id='" + l + "_noButton' type=button value='" + c + "' style='font-family:Verdana,Arial; font-size:8pt; border: solid 1px #859DBE; background-color: white; width:75px; height:20px; margin-right: 5px; margin-left: 5px; cursor: pointer;' onclick='" + k + "'/>" } if (q[x] == "cancel") { m.innerHTML += "<input name='" + l + "_cancelButton' id='" + l + "_cancelButton' type=button value='" + o + "' style='font-family:Verdana,Arial; font-size:8pt; border: solid 1px #859DBE; background-color: white; width:75px; height:20px; margin-right: 5px; margin-left: 5px;' onclick='" + g + "'/>" } } var f = new Array(i, r, b, n, d, m); if (e.autoClose != null) { setTimeout('ModalPopups.Close("' + l + '");', e.autoClose) } return f }, _styleAllLayers: function (n, e, h) { var i = h; var k = i[0]; var t = i[1]; var a = i[2]; var r = i[3]; var d = i[4]; var p = i[5]; ModalPopups._zIndex += 3; var m = ModalPopups._zIndex; e.borderColor = e.borderColor != null ? e.borderColor : ModalPopupsDefaults.borderColor; var w = "display:inline; position:absolute; z-index: " + (m) + "; left:0px; top:0px; width:100%; height:100%; filter:alpha(opacity=70); opacity:0.7;"; if (ModalPopupsSupport.isOlderIE()) { var s = ModalPopupsSupport.getViewportDimensions(); w = "display:inline; position:absolute; z-index: 10; left:0px; top:0px; width:" + s.width + "px; height:" + s.height + "px; filter:alpha(opacity=70); opacity:0.7; overflow:hidden;" } var f = "display:inline; position:absolute; z-index: " + (m + 1) + ";"; var u = "display:inline; position:absolute; z-index: " + (m + 2) + "; background-color:white; color:black; border:solid 1px " + e.borderColor + "; padding:1px;"; e.backgroundColor = e.backgroundColor != null ? e.backgroundColor : ModalPopupsDefaults.backgroundColor; w += " background-color:" + e.backgroundColor + ";"; e.fontFamily = e.fontFamily != null ? e.fontFamily : ModalPopupsDefaults.fontFamily; e.fontSize = e.fontSize != null ? e.fontSize : ModalPopupsDefaults.fontSize; var c = "position: absolute; font-family:" + e.fontFamily + "; font-size:" + e.fontSize + "; padding: 5px; text-align:left;"; var l = "position: absolute; font-family:" + e.fontFamily + "; font-size:" + e.fontSize + "; padding: 5px; text-align:left;"; var v = "position: absolute; font-family:" + e.fontFamily + "; font-size:" + e.fontSize + "; padding: 5px; text-align:center;"; if (ModalPopupsSupport.isIE) { r.style.cssText = c; d.style.cssText = l; p.style.cssText = v } else { r.setAttribute("style", c); d.setAttribute("style", l); p.setAttribute("style", v) } e.titleBackColor = e.titleBackColor != null ? e.titleBackColor : ModalPopupsDefaults.titleBackColor; e.titleFontColor = e.titleFontColor != null ? e.titleFontColor : ModalPopupsDefaults.titleFontColor; e.popupBackColor = e.popupBackColor != null ? e.popupBackColor : ModalPopupsDefaults.popupBackColor; e.popupFontColor = e.popupFontColor != null ? e.popupFontColor : ModalPopupsDefaults.popupFontColor; e.footerBackColor = e.footerBackColor != null ? e.footerBackColor : ModalPopupsDefaults.footerBackColor; e.footerFontColor = e.footerFontColor != null ? e.footerFontColor : ModalPopupsDefaults.footerFontColor; c += " background-color:" + e.titleBackColor + ";"; c += " color:" + e.titleFontColor + ";"; l += " background-color:" + e.popupBackColor + ";"; l += " color:" + e.popupFontColor + ";"; v += " background-color:" + e.footerBackColor + ";"; v += " color:" + e.footerFontColor + ";"; var j = 0; if (ModalPopupsSupport.getLayerWidth(r.id) > j) { j = ModalPopupsSupport.getLayerWidth(r.id) } if (ModalPopupsSupport.getLayerWidth(d.id) > j) { j = ModalPopupsSupport.getLayerWidth(d.id) } if (ModalPopupsSupport.getLayerWidth(p.id) > j) { j = ModalPopupsSupport.getLayerWidth(p.id) } var b = ModalPopupsSupport.getLayerHeight(r.id) + ModalPopupsSupport.getLayerHeight(d.id) + ModalPopupsSupport.getLayerHeight(p.id); e.width = e.width != null ? e.width : (j + 4); e.height = e.height != null ? e.height : b; var o = ModalPopupsSupport.getLayerHeight(d.id); if (e.height > b) { o = e.height - ModalPopupsSupport.getLayerHeight(r.id) - ModalPopupsSupport.getLayerHeight(p.id); l += " height:" + o + "px;"; b = ModalPopupsSupport.getLayerHeight(r.id) + o + ModalPopupsSupport.getLayerHeight(p.id) } c += " top:1px;"; l += " top:" + ModalPopupsSupport.getLayerHeight(r.id) + "px;"; v += " top:" + (ModalPopupsSupport.getLayerHeight(r.id) + (o)) + "px;"; c += " width:" + (e.width - 10) + "px;"; l += " width:" + (e.width - 10) + "px;"; v += " width:" + (e.width - 10) + "px;"; var q = ModalPopupsSupport.getFrameWidth(); var g = ModalPopupsSupport.getFrameHeight(); if (e.height < b) { e.height = b } e.top = e.top != null ? e.top : ((g / 2) - (e.height / 2)); e.left = e.left != null ? e.left : ((q / 2) - (e.width / 2)); c += " left:1px;"; l += " left:1px;"; v += " left:1px;"; if (e.width) { u += " width:" + e.width + "px;" } else { u += " width:" + e.maxWidth + "px;" } if (e.height) { u += " height:" + (e.height - 1) + "px;" } else { u += " height:" + (b - 1) + "px;" } if (ModalPopupsSupport.isIE) { r.style.cssText = c; d.style.cssText = l; p.style.cssText = v } else { r.setAttribute("style", c); d.setAttribute("style", l); p.setAttribute("style", v) } e.shadow = e.shadow != null ? e.shadow : ModalPopupsDefaults.shadow; e.shadowSize = e.shadowSize != null ? e.shadowSize : ModalPopupsDefaults.shadowSize; if (e.shadow) { e.shadowSize = e.shadowSize != null ? e.shadowSize : ModalPopupsDefaults.shadowSize; e.shadowColor = e.shadowColor != null ? e.shadowColor : ModalPopupsDefaults.shadowColor; f += "background-color:" + e.shadowColor + ";"; if (e.width) { f += " width:" + e.width + "px;" } else { f += " width:" + maxWidth + "px;" } if (e.height) { f += " height:" + (e.height - 1) + "px;" } else { f += " height:" + (b) + "px;" } } else { f += " display:none;" } if (ModalPopupsSupport.isIE) { t.style.cssText = u; a.style.cssText = f; k.style.cssText = w } else { t.setAttribute("style", u); a.setAttribute("style", f); k.setAttribute("style", w) } if (!ModalPopupsSupport.isOlderIE()) { ModalPopupsSupport.centerElement(document.getElementById(n + "_background"), 0, true) } else { var s = ModalPopupsSupport.getViewportDimensions(); k.innerHTML = "<div><iframe style='z-index:-1; position:absolute; top:0;left:0 display:none; display/**/:block; position:absolute; filter:mask(); width:" + s.width + "px; height:" + s.height + "px;' id='corr_bug_ie' src='../common/imgLay/spinner.gif'></iframe></div>" } ModalPopupsSupport.centerElement(document.getElementById(n + "_popup"), 0, false); if (e.shadow) { ModalPopupsSupport.centerElement(document.getElementById(n + "_shadow"), e.shadowSize, false) } e.loadTextFile = e.loadTextFile != null ? e.loadTextFile : ""; if (e.loadTextFile != "") { ModalPopups._loadTextFile(n, e, h, e.loadTextFile) } window.onresize = function () { ModalPopupsSupport.centerElement(document.getElementById(n + "_background"), 0, true); ModalPopupsSupport.centerElement(document.getElementById(n + "_popup"), 0, false); if (e.shadow) { ModalPopupsSupport.centerElement(document.getElementById(n + "_shadow"), e.shadowSize, false) } }; window.onscroll = function () { ModalPopupsSupport.centerElement(document.getElementById(n + "_background"), 0, true); ModalPopupsSupport.centerElement(document.getElementById(n + "_popup"), 0, false); if (e.shadow) { ModalPopupsSupport.centerElement(document.getElementById(n + "_shadow"), e.shadowSize, false) } } }, _loadTextFile: function (e, d, c, a) { var b = ModalPopupsSupport.getXmlHttp(); b.open("GET", a, true); b.onreadystatechange = function () { if (b.readyState == 4) { var f = b.responseText.replace("\r\n", "<br>").replace("\n\r", "<br>").replace("\n", "<br>").replace("\r", "<br>"); var g = "<div style='overflow-y: scroll; position:absolute; top:5px; left:5px; height:" + (d.height - 65) + "px; width:" + (d.width - 10) + "px;'>"; g += f; g += "</div>"; ModalPopups.GetCustomControl(e + "_popupBody").innerHTML = g; d.loadTextFile = ""; ModalPopups._styleAllLayers(e, d, c) } }; b.send(null) } }; var ModalPopupsSupport = { isIE: function () { return (window.ActiveXObject) ? true : false }, isOlderIE: function () { var a = -1; if (navigator.appName == "Microsoft Internet Explorer") { var b = navigator.userAgent; var c = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})"); if (c.exec(b) != null) { a = parseFloat(RegExp.$1) } } if (a > -1 && a < 7) { return true } else { return false } }, makeLayer: function (d, b, c) { var a = document.createElement("div"); a.id = d; if (c) { c.appendChild(a) } else { document.body.appendChild(a) } return a }, deleteLayer: function (b) { var a = findLayer(b); if (a) { document.body.removeChild(a) } }, findLayer: function (a) { return document.all ? document.all[a] : document.getElementById(a) }, findControl: function (b, a) { if (a == null) { return document.all ? document.all[b] : document.getElementById(b) } else { return document.all ? document.all[b] : document.getElementById(b) } }, getLayerHeight: function (a) { if (document.all) { gh = document.getElementById(a).offsetHeight } else { gh = document.getElementById(a).offsetHeight } return gh }, getLayerWidth: function (a) { gw = document.getElementById(a).offsetWidth; return gw }, getViewportDimensions: function () { var b = 0, a = 0; if (self.innerHeight) { b = window.innerHeight; a = window.innerWidth } else { if (document.documentElement && document.documentElement.clientHeight) { b = document.documentElement.clientHeight; a = document.documentElement.clientWidth } else { if (document.body) { b = document.body.clientHeight; a = document.body.clientWidth } } } return { height: parseInt(b, 10), width: parseInt(a, 10)} }, getScrollXY: function () { var b = 0, a = 0; if (typeof (window.pageYOffset) == "number") { a = window.pageYOffset; b = window.pageXOffset } else { if (document.body && (document.body.scrollLeft || document.body.scrollTop)) { a = document.body.scrollTop; b = document.body.scrollLeft } else { if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) { a = document.documentElement.scrollTop; b = document.documentElement.scrollLeft } } } return [b, a] }, centerElement: function (d, g, c) { var b = ModalPopupsSupport.getViewportDimensions(); var f = (b.width == 0) ? 50 : parseInt((b.width - d.offsetWidth) / 2, 10); var e = (b.height == 0) ? 50 : parseInt((b.height - d.offsetHeight) / 2, 10); var a = ModalPopupsSupport.getScrollXY(); if (!c) { d.style.left = (f + g) + "px" } d.style.top = (e + g + a[1]) + "px"; b, f, e, d = null }, readFile: function (c, a) { var b = getXmlHttp(); var d = c + "?r=" + Math.random(); b.open("GET", d, true); b.onreadystatechange = function () { if (b.readyState == 4) { a.innerHTML = b.responseText } }; b.send(null) }, getFrameWidth: function () { var a = document.documentElement.clientWidth; if (self.innerWidth) { a = self.innerWidth } else { if (document.documentElement && document.documentElement.clientWidth) { a = document.documentElement.clientWidth } else { if (document.body) { a = document.body.clientWidth } else { return } } } return a }, getFrameHeight: function () { var a = document.documentElement.clientHeight; if (self.innerWidth) { a = self.innerHeight } else { if (document.documentElement && document.documentElement.clientWidth) { a = document.documentElement.clientHeight } else { if (document.body) { a = document.body.clientHeight } else { return } } } return a }, getXmlHttp: function () { var a; try { a = new XMLHttpRequest() } catch (b) { try { a = new ActiveXObject("Msxml2.XMLHTTP") } catch (b) { try { a = new ActiveXObject("Microsoft.XMLHTTP") } catch (b) { alert("Your browser does not support AJAX!"); return false } } } return a } };

// JSON for old browsers
var JSON; if (!JSON) { JSON = {} } (function () { function f(n) { return n < 10 ? "0" + n : n } if (typeof Date.prototype.toJSON !== "function") { Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf() } } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + string + '"' } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === "object" && typeof value.toJSON === "function") { value = value.toJSON(key) } if (typeof rep === "function") { value = rep.call(holder, key, value) } switch (typeof value) { case "string": return quote(value); case "number": return isFinite(value) ? String(value) : "null"; case "boolean": case "null": return String(value); case "object": if (!value) { return "null" } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === "[object Array]") { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || "null" } v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]"; gap = mind; return v } if (rep && typeof rep === "object") { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === "string") { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}"; gap = mind; return v } } if (typeof JSON.stringify !== "function") { JSON.stringify = function (value, replacer, space) { var i; gap = ""; indent = ""; if (typeof space === "number") { for (i = 0; i < space; i += 1) { indent += " " } } else { if (typeof space === "string") { indent = space } } rep = replacer; if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) { throw new Error("JSON.stringify") } return str("", { "": value }) } } if (typeof JSON.parse !== "function") { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === "object") { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v } else { delete value[k] } } } } return reviver.call(holder, key, value) } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { j = eval("(" + text + ")"); return typeof reviver === "function" ? walk({ "": j }, "") : j } throw new SyntaxError("JSON.parse") } } } ());
