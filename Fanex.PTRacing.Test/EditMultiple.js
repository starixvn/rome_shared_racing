function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var FunctionWrapper = function () {
}

var ElementStatusHandler = function () {
    var DisableClassName = "BetTypeInactive";

    return {
        EnableElement: function (element) {
            if (typeof (element) != 'object') return;
            if (element.nodeType == 3) return; // text node

            var isDisabled = (element.className.indexOf(DisableClassName) != -1);

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
                            element.childNodes[i].disabled = (previousValue == "true");
                        }
                    }
                }
                else {
                    ElementStatusHandler.EnableElement(element.childNodes[i]);
                }
            }
        },
        DisableElement: function (element) {
            if (typeof (element) != 'object') return;
            if (element.nodeType == 3) return; // text node

            var isDisabled = (element.className.indexOf(DisableClassName) != -1);

            if (element.tagName == "DIV" || element.tagName == "LABEL") {
                if (!isDisabled) {
                    element.setAttribute("previousValue", element.className);
                    element.className += " " + DisableClassName;
                };
            };

            var count = element.childNodes.length;
            if (typeof (count) == 'undefined') return;

            for (var i = 0; i < count; i++) {
                if (element.childNodes[i].tagName == "INPUT" || element.childNodes[i].tagName == "SELECT") {
                    var previousValue = element.childNodes[i].disabled;
                    if (!isDisabled || !element.childNodes[i].disabled) {
                        element.childNodes[i].disabled = true;
                        element.childNodes[i].setAttribute("previousValue", previousValue);
                    };
                } else {
                    ElementStatusHandler.DisableElement(element.childNodes[i]);
                }
            }
        }
    }
} ();

function InitArrays() {
    usernames = ["testcs01", "testcs02"];
}

var roleId = getParameterByName("roleid");
var targetRoleId = getParameterByName("targetroleid");
var formId = "1";
if (roleId != "") {
    if (roleId == "4" && targetRoleId == "2") {
        formId = "4";
    }
    var xxx = "_" + roleId + "_" + targetRoleId + "_" + formId;
    var context = this["context" + xxx];
    var customer = this["customer" + xxx];
    //var context = this.context_0_3_1;
    //var customer = this.customer_0_3_1;
    Fanex.PTRacing.CURRENT_CONTEXT = context;
    if (formId == "1") {
        Fanex.PTRacing.CURRENT_CONTEXT.ia3 = !customer.disableAutoMasterPt;
    }

    var oldCustomer = customer.clone();
    oldCustomer.firstName = null;
    oldCustomer.lastName = null;
    oldCustomer.phone = null;
    oldCustomer.mobilePhone = null;
    oldCustomer.fax = null;
    var newCustomer = oldCustomer.clone();

    // Customer Info
    var custids;
    var usernames;

    var CustomerModel = function (customer) {
        InitArrays();
        customer.userNames = usernames.join(", ");
        customer.targetLevel = function () {
            switch (context.targetRoleId) {
                case 4:
                    return Language.SUPER;
                case 3:
                    return Language.MASTER;
                case 2:
                    return Language.AGENT;
                case 1:
                    return Language.MEMBER;
                default:
                    return "Unknown";
            }
        } ();

        this.saveCustomer = function () {
        }
    }

    ko.applyBindings(new CustomerModel(customer));

    // Betting Commission Status
    if (customer.settings.sportTypes.length > 0) {
        var bettingLimit1 = new Fanex.PTRacing.BettingCommSetting(customer.settings.sportTypes);
        bettingLimit1.Render($('bettingLimitContainer'), context.targetRoleId);
    }
    else {
        $("bettingLimitContainer").className = "noInfoBlock";
        $("bettingLimitContainer").innerHTML = Language.NOINFO;
        $("btnSubmit").disabled = true;
    }

    // PT Setting
    if (customer.settings.sportTypes.length > 0) {
        var ptGrid = new Fanex.PTRacing.PTGrid(customer.settings);
        ptGrid.Render($("ptGridContainer"));
        EnhanceMultiplePT();
    }
    else {
    }
}

function IsMulti() {
    if (custids != null && custids != undefined && custids.length > 1)
        return true;

    return false;
}

function InitUI() {
}

//RegisterStartUp('InitUI()');

function EnhanceMultiplePT() {
    // bet settings
    if (context.roleId - context.targetRoleId == 1) {
        var element = document.getElementById("betsettingheader");
        InsertCheckBoxInFrontOf(element, BetSettingHeaderClicked);

        element = document.getElementById("commheader");
        InsertCheckBoxInFrontOf(element, BetCommHeaderClicked);

        element = document.getElementById("statusheader");
        InsertCheckBoxInFrontOf(element, BetStatusHeaderClicked);
    }

    // pt
    element = document.getElementById("ptheader");
    InsertCheckBoxInFrontOf(element, PTHeaderClicked);

    var sportLength = customer.settings.sportTypes.length;
    for (var i = 0; i < sportLength; i++) {
        var sportType = customer.settings.sportTypes[i];

        var toteLength = sportType.betTypeGroups.length;
        for (var j = 0; j < toteLength; j++) {
            var tote = sportType.betTypeGroups[j];
            // bet settings
            if (context.roleId - context.targetRoleId == 1) {
                element = document.getElementById("divBettingComm_BettypeGroup_" + sportType.id + "_" + tote.id);
                InsertCheckBoxInFrontOf(element, BetToteClicked);
            }

            // pt
            element = document.getElementById("pttoteheader_" + sportType.id + "_" + tote.id);
            InsertCheckBoxInFrontOf(element, PtToteClicked);
        }
    }

    // bet settings
    if (context.roleId - context.targetRoleId == 1) {
        var copyAllInput = document.getElementById("divBettingComm_BettypeGroup_151_41").childNodes[2];
        copyAllInput.clickFunction = copyAllInput.onclick;
        copyAllInput.onclick = BettingCopyAllClicked;
        copyAllInput.disabled = true;

        var bettingCommEditAllInput = document.getElementById("commheader").childNodes[2];
        bettingCommEditAllInput.clickFunction = bettingCommEditAllInput.onclick;
        bettingCommEditAllInput.onclick = BettingCommEditAllClicked;

        var bettingStatusEditAllInput = document.getElementById("statusheader").childNodes[2];
        bettingStatusEditAllInput.clickFunction = bettingStatusEditAllInput.onclick;
        bettingStatusEditAllInput.onclick = BettingStatusEditAllClicked;

        ValidateBettingBoxUI(document.getElementById("betsettingheader"));
    }

    // pt
    var sportLength = customer.settings.sportTypes.length;
    for (var i = 0; i < sportLength; i++) {
        var sportType = customer.settings.sportTypes[i];
        var ptsportCopied = document.getElementById("ptsportheader_" + sportType.id).parentNode.childNodes[1];
        ptsportCopied.clickFunction = ptsportCopied.onclick;
        ptsportCopied.onclick = null;
    }

    ValidatePtBoxUI(document.getElementById("ptheader"));
}

function InsertCheckBoxInFrontOf(element, clickEvent) {
    if (element) {
        var checkbox = document.createElement("INPUT");
        checkbox.type = "checkbox";
        checkbox.onclick = clickEvent;
        checkbox.parent = element;
        var textNode = element.childNodes[0];
        element.insertBefore(checkbox, textNode);
    }
}

function ValidateBettingBoxUI(caller) {
    var copyAllInput = document.getElementById("divBettingComm_BettypeGroup_151_41").childNodes[2];
    var isCopyAll = (copyAllInput.getAttribute('copyBettingComm') == "1");

    var commEditAllInput = document.getElementById("commheader").childNodes[2];
    var isCommEditAll = (commEditAllInput.getAttribute('copycomm') == "1");

    var statusEditAllInput = document.getElementById("statusheader").childNodes[2];
    var isStatusEditAll = (statusEditAllInput.getAttribute('copystatus') == "1");

    var sportLength = customer.settings.sportTypes.length;
    for (var i = 0; i < sportLength; i++) {
        var sportType = customer.settings.sportTypes[i];
        var toteLength = sportType.betTypeGroups.length;
        for (var j = 0; j < toteLength; j++) {
            var tote = sportType.betTypeGroups[j];
            var element = document.getElementById("divBettingComm_BettypeGroup_" + sportType.id + "_" + tote.id);
            if (element) {
                var isCopiedElement = (element.id == "divBettingComm_BettypeGroup_151_41");
                var toteInput = element.firstChild;
                var callerInput = caller.firstChild;

                if (caller.id == element.id && isCopiedElement) {
                    element.childNodes[2].disabled = !toteInput.checked;
                    if (!callerInput.checked) {
                        if (isCopyAll) {
                            copyAllInput.onclick.apply(copyAllInput);
                            return;
                        }
                    }
                }

                // bet settings
                var minbetElement = document.getElementById("minbet_" + sportType.id + "_" + tote.id).parentNode;
                var maxbetElement = document.getElementById("maxbet_" + sportType.id + "_" + tote.id).parentNode;
                var maxpermatchElement = document.getElementById("maxpermatch_" + sportType.id + "_" + tote.id).parentNode;
                callerInput = document.getElementById("betsettingheader").firstChild;
                if (callerInput.checked && toteInput.checked) {
                    if (isCopyAll && !isCopiedElement) {
                        ElementStatusHandler.DisableElement(minbetElement);
                        ElementStatusHandler.DisableElement(maxbetElement);
                        ElementStatusHandler.DisableElement(maxpermatchElement);
                    }
                    else {
                        ElementStatusHandler.EnableElement(minbetElement);
                        ElementStatusHandler.EnableElement(maxbetElement);
                        ElementStatusHandler.EnableElement(maxpermatchElement);
                    }
                }
                else {
                    ElementStatusHandler.DisableElement(minbetElement);
                    ElementStatusHandler.DisableElement(maxbetElement);
                    ElementStatusHandler.DisableElement(maxpermatchElement);
                }

                // bet commission
                var commElement = document.getElementById("comm_" + sportType.id + "_" + tote.id).parentNode;
                callerInput = document.getElementById("commheader").firstChild;
                if (callerInput.checked && toteInput.checked) {
                    if (isCopyAll && isCommEditAll && !isCopiedElement) {
                        ElementStatusHandler.DisableElement(commElement);
                    }
                    else {
                        ElementStatusHandler.EnableElement(commElement);
                    }
                }
                else {
                    ElementStatusHandler.DisableElement(commElement);
                }

                // bet status
                var enableElement = document.getElementById("enable_" + sportType.id + "_" + tote.id).parentNode;
                if (context.targetRoleId != 1) {
                    var downlinesElement = document.getElementById("downlines_enable_" + sportType.id + "_" + tote.id).parentNode;
                }
                callerInput = document.getElementById("statusheader").firstChild;
                if (callerInput.checked && toteInput.checked) {
                    if (isCopyAll && isStatusEditAll && !isCopiedElement) {
                        ElementStatusHandler.DisableElement(enableElement);
                        if (context.targetRoleId != 1) {
                            ElementStatusHandler.DisableElement(downlinesElement);
                        }
                    }
                    else {
                        ElementStatusHandler.EnableElement(enableElement);
                        if (context.targetRoleId != 1) {
                            ElementStatusHandler.EnableElement(downlinesElement);
                        }
                    }
                }
                else {
                    ElementStatusHandler.DisableElement(enableElement);
                    if (context.targetRoleId != 1) {
                        ElementStatusHandler.DisableElement(downlinesElement);
                    }
                }
            }
        }
    }
}

function ValidatePtBoxUI(caller) {
    var copyAllInput = document.getElementById("ptsportheader_151").parentNode.childNodes[1];
    var isCopyAll = (copyAllInput.className == "PTSportCopiedActive");
    var ptheaderInput = document.getElementById("ptheader").childNodes[0];

    var sportLength = customer.settings.sportTypes.length;
    for (var i = 0; i < sportLength; i++) {
        var sportType = customer.settings.sportTypes[i];
        var toteLength = sportType.betTypeGroups.length;
        for (var j = 0; j < toteLength; j++) {
            var tote = sportType.betTypeGroups[j];
            var element = document.getElementById("pttoteheader_" + sportType.id + "_" + tote.id);
            if (element) {
                var isCopiedElement = (element.id == "pttoteheader_151_41");
                var elementInput = element.firstChild;

                if (caller.id == element.id) {
                    if (isCopiedElement) {
                        if (!elementInput.checked) {
                            if (isCopyAll) {
                                copyAllInput.onclick.apply(copyAllInput);
                                return;
                            }
                        }
                    }

                    if (!elementInput.checked) {
                        if (isCopyWinChecked) {
                            copyWinInput.onclick.apply(copyWinInput);
                            return;
                        }
                    }
                }

                if (isCopiedElement) {
                    if (ptheaderInput.checked && elementInput.checked) {
                        copyAllInput.onclick = PtCopyAllClicked;
                        var sportLength2 = customer.settings.sportTypes.length;
                        for (var k = 0; k < sportLength2; k++) {
                            var sportType2 = customer.settings.sportTypes[k];
                            if (sportType2.id != 151) {
                                var ptsportCopied = document.getElementById("ptsportheader_" + sportType2.id).parentNode.childNodes[1];
                                ptsportCopied.onclick = PtEditAllClicked;
                            }
                        }
                    }
                    else {
                        copyAllInput.onclick = null;
                        var sportLength2 = customer.settings.sportTypes.length;
                        for (var k = 0; k < sportLength2; k++) {
                            var sportType2 = customer.settings.sportTypes[k];
                            if (sportType2.id != 151) {
                                var ptsportCopied = document.getElementById("ptsportheader_" + sportType2.id).parentNode.childNodes[1];
                                ptsportCopied.onclick = null;
                            }
                        }
                    }
                }

                var ptBox = element.parentElement.childNodes[1];
                var copyWinInput = ptBox.childNodes[1].firstChild;
                var isCopyWinChecked = (copyWinInput.childNodes[1].className.indexOf("PTBetTypeCopiedActive") != -1);
                if (!copyWinInput.clickFunction) {
                    copyWinInput.clickFunction = copyWinInput.onclick;
                }

                if (elementInput.checked && ptheaderInput.checked) {
                    if (isCopiedElement || !isCopyAll) {
                        ElementStatusHandler.EnableElement(ptBox);
                        copyWinInput.onclick = PtCopyWinClicked;
                    }
                    else {
                        var ptsportEdited = document.getElementById("ptsportheader_" + sportType.id).parentNode.childNodes[1];
                        var isPtSportEdited = (ptsportEdited.className == "PTSportEditCopied");
                        if (sportType.id != 151 && isPtSportEdited) {
                            ElementStatusHandler.EnableElement(ptBox);
                            copyWinInput.onclick = PtCopyWinClicked;
                        }
                        else {
                            ElementStatusHandler.DisableElement(ptBox);
                            copyWinInput.onclick = null;
                        }
                    }

                    if ((isCopiedElement && isCopyAll) || isCopyWinChecked) {
                        ElementStatusHandler.DisableElement(ptBox.childNodes[2]);
                    }
                }
                else {
                    ElementStatusHandler.DisableElement(ptBox);
                    copyWinInput.onclick = null;
                }
            }
        }
    }
}

function BetSettingHeaderClicked() {
    ValidateBettingBoxUI(this.parentNode);
}

function BetCommHeaderClicked() {
    ValidateBettingBoxUI(this.parentNode);
}

function BetStatusHeaderClicked() {
    ValidateBettingBoxUI(this.parentNode);
}

function BetToteClicked() {
    ValidateBettingBoxUI(this.parentNode);
}

function BettingCopyAllClicked() {
    this.clickFunction();
    ValidateBettingBoxUI(this.parentNode);
}

function BettingCommEditAllClicked() {
    this.clickFunction();
    ValidateBettingBoxUI(this.parentNode);
}

function BettingStatusEditAllClicked() {
    this.clickFunction();
    ValidateBettingBoxUI(this.parentNode);
}

function PTHeaderClicked() {
    ValidatePtBoxUI(this.parentNode);
}

function PtToteClicked() {
    ValidatePtBoxUI(this.parentNode);
}

function PtCopyAllClicked() {
    this.clickFunction();
    ValidatePtBoxUI(this.parentNode);
}

function PtEditAllClicked() {
    this.clickFunction();
    ValidatePtBoxUI(this.parentNode);
}

function PtCopyWinClicked() {
    this.clickFunction();
    ValidatePtBoxUI(this.parentNode);
}