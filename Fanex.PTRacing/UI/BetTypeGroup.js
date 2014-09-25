if (typeof (Fanex) == 'undefined') { // Require Fanex namespace
	Fanex = {};
}
if (typeof (Fanex.PTRacing) == 'undefined') { // Require Fanex.PTRacing namespace
	alert('Require Fanex.PTRacing namespace');
}

Fanex.PTRacing.BetTypeGroup.prototype.RenderBetTypes = function (owner) {
    // bettypes
    // Each bet types
    var elements = []; // Child bet type element
    var count = this.betTypes.length;
   
    for (var i = 0; i < count; i++) {
        var item = this.betTypes[i];
        item.sportId = this.sportId;
        var betItem = new Fanex.PTRacing.BetType(item);
        betItem.parent = this; // Keep reference to current bet type group
        var element = betItem.Render(owner);
        if (element != null) {
            elements[i] = element;
            this.items[i] = betItem;
        }
    }
    this.elements = elements;
}

/*--company edit super pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_0_4_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel3";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTSuperBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var ibcLabel = document.createElement("DIV");
    ibcLabel.innerHTML = Language.HOUSE_AUTO;
    ibcLabel.className = "PTLabel";
    ptHeaderBox.appendChild(ibcLabel);

    var s4Label = document.createElement("DIV");
    s4Label.innerHTML = Language.SUPER_MAX;
    s4Label.className = "PTLabel";
    ptHeaderBox.appendChild(s4Label);

    var m4Label = document.createElement("DIV");
    m4Label.innerHTML = Language.MASTER_MAX;
    m4Label.className = "PTLabel";
    ptHeaderBox.appendChild(m4Label);

    var a4Label = document.createElement("DIV");
    a4Label.innerHTML = Language.AGENT_MAX;
    a4Label.className = "PTLabel";
    ptHeaderBox.appendChild(a4Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    return box;
};
/*--/company edit super pt--*/

Fanex.PTRacing.BetTypeGroup.prototype.Render_0_3_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel4";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var s3Label = document.createElement("DIV");
    s3Label.innerHTML = Language.SUPER_PRESET;
    s3Label.className = "PTLabel";
    ptHeaderBox.appendChild(s3Label);

    var is3Label = document.createElement("DIV");
    is3Label.innerHTML = Language.AUTO_SUPER_PRESET;
    is3Label.className = "PTLabel";
    ptHeaderBox.appendChild(is3Label);

    var m3Label = document.createElement("DIV");
    m3Label.innerHTML = Language.MASTER_PRESET;
    m3Label.className = "PTLabel";
    ptHeaderBox.appendChild(m3Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    // apply all members
    var is1Div = document.createElement("DIV");
    is1Div.className = "PTLineBox";
    ptBox.appendChild(is1Div);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    is1Div.appendChild(bettypeHeader);

    var is1Select = document.createElement("DIV");
    is1Select.className = "BetTypeSelect2";
    is1Div.appendChild(is1Select);

    var is1Label = document.createElement("LABEL");
    is1Select.appendChild(is1Label);

    var is1Check = document.createElement("INPUT");
    is1Check.id = is1Check.name = "isApplyPtPreset$" + this.suffixId;
    is1Check.className = "BetTypeCheckbox";
    is1Check.type = "checkbox";
    is1Check.checked = false;
    is1Label.appendChild(is1Check);
    is1Label.appendChild(document.createTextNode(Language.APPLY_SUPER_PRESET_TO_ALL_MEMBERS));

    this.applyAllMembersElement = is1Div;
    var bettypeGroupItem = this;
    bettypeGroupItem.applyAllMembers = false;
    // handling is1
    is1Check.onclick = function (e) {
        bettypeGroupItem.applyAllMembers = this.checked;
    }

    return box;
}

Fanex.PTRacing.BetTypeGroup.prototype.Render_2_1_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel3";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTMemberBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var a1Label = document.createElement("DIV");
    a1Label.innerHTML = Language.AGENT_POSITION;
    a1Label.className = "PTLabel";
    ptHeaderBox.appendChild(a1Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    return box;
}

/*--super edit agent pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_4_2_1 = function (owner) {
    this.Render_0_2_1(owner);
}

/*--super view agent pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_4_2_4 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel3";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var m2Label = document.createElement("DIV");
    m2Label.innerHTML = Language.MASTER_PRESET;
    m2Label.className = "PTLabel";
    ptHeaderBox.appendChild(m2Label);

    var im2Label = document.createElement("DIV");
    im2Label.innerHTML = Language.AUTO_MASTER_PRESET;
    im2Label.className = "PTLabel";
    ptHeaderBox.appendChild(im2Label);

    var a2Label = document.createElement("DIV");
    a2Label.innerHTML = Language.AGENT_POSITION;
    a2Label.className = "PTLabel";
    ptHeaderBox.appendChild(a2Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    return box;
}

/*--master edit agent pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_0_2_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel4";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var m2Label = document.createElement("DIV");
    m2Label.innerHTML = Language.MASTER_PRESET;
    m2Label.className = "PTLabel";
    ptHeaderBox.appendChild(m2Label);

    if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
        var im2Label = document.createElement("DIV");
        im2Label.innerHTML = Language.AUTO_MASTER_PRESET;
        im2Label.className = "PTLabel";
        ptHeaderBox.appendChild(im2Label);
    }
    else {
        ptBox.className = "PTAgentDisableAutMPTBox";
    }

    var a2Label = document.createElement("DIV");
    a2Label.innerHTML = Language.AGENT_POSITION;
    a2Label.className = "PTLabel";
    ptHeaderBox.appendChild(a2Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    // apply all members
    var is1Div = document.createElement("DIV");
    is1Div.className = "PTLineBox";
    ptBox.appendChild(is1Div);

    var bettypeHeader = document.createElement("DIV");

    if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
        bettypeHeader.className = "BetTypeLabel";
    }

    is1Div.appendChild(bettypeHeader);

    var is1Select = document.createElement("DIV");
    is1Select.className = "BetTypeSelect2";
    is1Div.appendChild(is1Select);

    var is1Label = document.createElement("LABEL");
    is1Select.appendChild(is1Label);

    var is1Check = document.createElement("INPUT");
    is1Check.id = is1Check.name = "isApplyPtPreset$" + this.suffixId;
    is1Check.className = "BetTypeCheckbox";
    is1Check.type = "checkbox";
    is1Check.checked = false;
    is1Label.appendChild(is1Check);
    is1Label.appendChild(document.createTextNode(Language.APPLY_MASTER_PRESET_TO_ALL_MEMBERS));

    this.applyAllMembersElement = is1Div;
    var bettypeGroupItem = this;
    bettypeGroupItem.applyAllMembers = false;
    // handling is1
    is1Check.onclick = function (e) {
        bettypeGroupItem.applyAllMembers = this.checked;
    }

    return box;
};
/*--/master edit agent pt--*/

/*--super edit member pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_4_1_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel3";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTSuperBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var s1Label = document.createElement("DIV");
    s1Label.innerHTML = Language.SUPER;
    s1Label.className = "PTLabel";
    ptHeaderBox.appendChild(s1Label);

    var us1Label = document.createElement("DIV");
    us1Label.innerHTML = Language.AUTO_SUPER;
    us1Label.className = "PTLabel";
    ptHeaderBox.appendChild(us1Label);

    var m1Label = document.createElement("DIV");
    m1Label.innerHTML = Language.MASTER;
    m1Label.className = "PTLabel";
    ptHeaderBox.appendChild(m1Label);

    var a1Label = document.createElement("DIV");
    a1Label.innerHTML = Language.AGENT;
    a1Label.className = "PTLabel";
    ptHeaderBox.appendChild(a1Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    return box;
};
/*--super edit agent pt--*/

/*--master edit member pt--*/
Fanex.PTRacing.BetTypeGroup.prototype.Render_3_1_1 = function (owner) {
    var box = document.createElement("DIV");

    var toteBox = document.createElement("DIV");
    toteBox.id = "pttoteheader_" + this.sportId + "_" + this.id;
    toteBox.innerHTML = this.name;
    toteBox.title = this.title;
    toteBox.className = "ToteLabel3";
    box.appendChild(toteBox);

    var ptBox = document.createElement("DIV");
    ptBox.className = "PTBox";
    box.appendChild(ptBox);

    // header
    var ptHeaderBox = document.createElement("DIV");
    ptHeaderBox.className = "PTLineBox";
    ptBox.appendChild(ptHeaderBox);

    var bettypeHeader = document.createElement("DIV");
    bettypeHeader.className = "BetTypeLabel";
    ptHeaderBox.appendChild(bettypeHeader);

    var m1Label = document.createElement("DIV");
    m1Label.innerHTML = Language.MASTER;
    m1Label.className = "PTLabel";
    ptHeaderBox.appendChild(m1Label);

    if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
        var um1Label = document.createElement("DIV");
        um1Label.innerHTML = Language.AUTO_MASTER;
        um1Label.className = "PTLabel";
        ptHeaderBox.appendChild(um1Label);
    }
    else {
        ptBox.className = "PTAgentDisableAutMPTBox";
        this.rowSpan = 4;
    }

    var a1Label = document.createElement("DIV");
    a1Label.innerHTML = Language.AGENT;
    a1Label.className = "PTLabel";
    ptHeaderBox.appendChild(a1Label);

    // bettypes
    this.RenderBetTypes(ptBox);

    return box;
}
/*--/master edit member pt--*/