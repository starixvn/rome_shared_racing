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

// Customer Info
var custids;
var usernames;

function InitArrays() {
    if (custids == null || custids == undefined) {
        if (parent.$("arrayCustID") != null) {
            custids = parent.$("arrayCustID").value.split('^');
            custids.pop();
            usernames = parent.$("arrayUserName").value.split('^');
            usernames.pop();
        }
        else {
            custids = [context.targetCustId];
            usernames = [customer.userName];
        }

        if (custids.length == 0) {
            custids = [context.targetCustId];
            usernames = [customer.userName];
        }
    }
}

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

function IsMulti() {
    if (custids != null && custids != undefined && custids.length > 1)
        return true;

    return false;
}

function InitUI() {
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
    }
    else {
    }
}

//RegisterStartUp('InitUI()');