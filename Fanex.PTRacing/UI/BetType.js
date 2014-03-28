if (typeof (Fanex) == 'undefined') { // Require Fanex namespace
	Fanex = {};
}
if (typeof (Fanex.PTRacing) == 'undefined') { // Require Fanex.PTRacing namespace
    alert('Require Fanex.PTRacing namespace');

}

Fanex.PTRacing.BetType.prototype.RenderHeader = function (owner) {
    var header = document.createElement("DIV");
    header.title = this.title;
    header.className = "BetTypeHeader";
    var span = document.createElement("SPAN");
    span.innerHTML = this.name;
    span.className = "BetTypeHeaderSpan";
    header.appendChild(span);
    owner.appendChild(header); // Header bet type name
}

/*--company edit super pt--*/
Fanex.PTRacing.BetType.prototype.Render_0_4_1 = function (owner) { // s4
    box = document.createElement("DIV");
    if (typeof (this.pt.s4) == 'undefined') {
        this.pt.s4 = 0;
        this.pt.m4 = 0;
        this.pt.n4 = 0;
    }

    this.RenderHeader(box);

    if (this.pt.iBC != null && this.pt.iBC >= 0) {
        // house pt
        var min = 0;
        var max = this.pt.iBCMax;
        var selected = this.pt.iBC;
        var houseSelect = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
        houseSelect.select.id = houseSelect.select.name = "ibc$" + this.suffixId;
        houseSelect.select.className = "housePtSelect PTSelect";
        houseSelect.className = "BetTypeSelect";
        houseSelect.style.position = "relative";
        box.appendChild(houseSelect);
    }
    else {
        var emptyBox = document.createElement("DIV");
        emptyBox.className = "BetTypeSelect " + (this.suffixId == '151$42' ? 'ukToteHousePt' : '');
        emptyBox.style.borderTop = 'none';
        box.appendChild(emptyBox);
    }
    // s4
    var min = this.pt.n4;
    var max = this.pt.l4;
    var selected = this.pt.s4;
    var s4Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    s4Select.select.id = s4Select.select.name = "s4$" + this.suffixId;
    s4Select.className = "BetTypeSelect";
    box.appendChild(s4Select);
    s4Select.select.onchange = function () {
        var m4 = this.value;
        Fanex.PTRacing.PT_SetSelect(m4Select.select, min, m4, Fanex.PTRacing.PT_STEP, m4);
        Fanex.PTRacing.PT_SetSelect(a4Select.select, min, m4, Fanex.PTRacing.PT_STEP, m4);
    };

    // m4
    var min = 0;
    var max = this.pt.s4;
    var selected = this.pt.m4;
    var m4Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    m4Select.select.id = m4Select.select.name = "m4$" + this.suffixId;
    m4Select.className = "BetTypeSelect";
    box.appendChild(m4Select);
    m4Select.select.onchange = function () {
        var a4 = this.value;
        Fanex.PTRacing.PT_SetSelect(a4Select.select, min, a4, Fanex.PTRacing.PT_STEP, a4);
    };

    // a4
    var min = 0;
    var max = this.pt.m4;
    var selected = this.pt.a4;
    var a4Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    a4Select.select.id = a4Select.select.name = "a4$" + this.suffixId;
    a4Select.className = "BetTypeSelect";
    box.appendChild(a4Select);

    box.id = "e$" + this.suffixId;
    this.Save = function () {
        this.pt.s4 = parseFloat(s4Select.select.value);
        this.pt.m4 = parseFloat(m4Select.select.value);
        this.pt.a4 = parseFloat(a4Select.select.value);
        if (this.pt.iBC != null && this.pt.iBC >= 0) {
            this.pt.iBC = parseFloat(houseSelect.select.value);
        }
        return {
            id: this.id,
            pt: this.pt
        }
    }
    box.className = "PTSuperBox";
    return box;
};
/*--/company edit super pt--*/

// Super edit Master
Fanex.PTRacing.BetType.prototype.Render_0_3_1 = function (owner) { // s3, m3, is3, us3, min/max: m4, n3, s4
    box = document.createElement("DIV");
    if (typeof (this.pt.m3) == 'undefined') {
        this.pt.n3 = 0;
        this.pt.m3 = 0;
        this.pt.s3 = this.pt.s4;
    }

    // If Auto Preset is false, then us3 default = 0
    if (!this.pt.is3) {
        this.pt.us3 = 0;
    }

    this.RenderHeader(box);

    // s3
    var min = 0;
    var max = this.pt.s4 - this.pt.n3;
    var selected = this.pt.s3;
    var s3Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    s3Select.select.id = s3Select.select.name = "s3$" + this.suffixId;
    s3Select.className = "BetTypeSelect";
    box.appendChild(s3Select);

    // is3
    var is3Check = document.createElement("INPUT");
    is3Check.type = "checkbox";
    is3Check.className = "BetTypeCheckbox";
    is3Check.checked = is3Check.defaultChecked = this.pt.is3;
    is3Check.id = is3Check.name = "is3$" + this.suffixId;
    var is3Div = document.createElement("DIV");
    is3Div.className = "BetTypeSelect";
    is3Div.appendChild(is3Check);
    box.appendChild(is3Div);
    if (is3Check.checked) {
        s3Select.select.disabled = is3Check.checked;
    }

    // us3
    min = 0;
    max = this.pt.s4;
    selected = this.pt.us3;
    var us3Select = document.createElement("select");
    us3Select.className = "PTSelect";
    Fanex.PTRacing.PT_SetSelect(us3Select, min, max, Fanex.PTRacing.PT_STEP, selected);
    us3Select.id = us3Select.name = "us3$" + this.suffixId;
    us3Select.disabled = !this.pt.is3;
    //us3Select.className = "BetTypeSelect";
    is3Div.appendChild(us3Select);

    // m3
    //Fanex.getMaxPt = function (uplineMaxPt, uplinePt, maxPt)
    var min = this.pt.n3;
    var max = this.pt.is3 ? this.pt.l3 : Fanex.getMaxPt(this.pt.l4, this.pt.s3, this.pt.l3);
    var selected = this.pt.m3;
    var m3Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    m3Select.select.id = m3Select.select.name = "m3$" + this.suffixId;
    m3Select.className = "BetTypeSelect";
    box.appendChild(m3Select);

    // is3 handling
    var s4 = this.pt.s4;
    var n3 = this.pt.n3;
    var m4 = this.pt.m4;
    var l3 = this.pt.l3;

    is3Check.onclick = function (e) {
        // Detect current value is out of range, reset it to max
        Fanex.PTRacing.PT_ValidateSelect(this.checked ? us3Select.select : s3Select.select);

        s3Select.select.onchange(e, true);
        us3Select.disabled = !is3Check.checked;
        s3Select.select.disabled = is3Check.checked;
    }

    // Event change Super Preset PT
    s3Select.select.onchange = function (e, keepCurrent) {
        // Reset m3
        var max = is3Check.checked ? l3 : Math.min(l3, Fanex.Round(s4 - parseFloat(s3Select.select.value)));
        var min = n3;
        var selected = parseFloat(m3Select.select.value);

        if (!keepCurrent || selected < min || selected > max) {
            selected = max;
        }

        Fanex.PTRacing.PT_SetSelect(m3Select.select, min, max, Fanex.PTRacing.PT_STEP, selected);
    }

    box.id = "e$" + this.suffixId;
    box.className = "PTLineBox";

    // Get updated data
    this.Save = function () {
        this.pt.m3 = parseFloat(m3Select.select.value);
        this.pt.is3 = is3Check.checked;

        if (this.pt.is3) {
            this.pt.us3 = parseFloat(us3Select.value);
            this.pt.s3 = 0;
        }
        else {
            this.pt.us3 = 0;
            this.pt.s3 = parseFloat(s3Select.select.value);
        }

        return {
            id: this.id,
            pt: this.pt
        }
    }
    return box;
};

// Agent edit Member
Fanex.PTRacing.BetType.prototype.Render_2_1_1 = function (owner) {
    if (typeof (this.pt.a1) == 'undefined') {
        this.pt.l2 = this.pt.a2;
        this.pt.a1 = this.pt.a2;
    }
    else {
        this.pt.l2 = this.pt.a2;
    }
    box = document.createElement("DIV");

    this.RenderHeader(box);

    // a1 selection
    var min = this.pt.n2;
    var max = Math.min(this.pt.l2, this.pt.a2);
    var selected = this.pt.a1;
    var a1Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    a1Select.select.id = a1Select.select.name = "a1$" + this.suffixId;
    a1Select.className = "BetTypeSelect";
    box.appendChild(a1Select);
    box.id = "e$" + this.suffixId;
    box.className = "PTMemberBox";

    // Get updated data
    this.Save = function () {
        this.pt.a1 = parseFloat(a1Select.select.value);
        return {
            id: this.id,
            pt: this.pt
        }
    }
    return box;
};

/*--super edit agent pt--*/
Fanex.PTRacing.BetType.prototype.Render_4_2_1 = function (owner) {
    this.Render_0_2_1(owner);
}

/*--super view agent pt--*/
Fanex.PTRacing.BetType.prototype.Render_4_2_4 = function (owner) {
    box = document.createElement("DIV");
    box.className = "PTLineBox";
    if (typeof (this.pt.a2) == 'undefined') { // Add new case
        this.pt.a2 = 0;
        this.pt.um2 = 0;
        this.pt.l3 = this.pt.m3;
        this.pt.n2 = 0;
    }

    var a2 = this.pt.a2;
    var n2 = this.pt.n2;
    var l2 = this.pt.l2;
    var im2 = this.pt.im2;
    var um2 = im2 ? this.pt.um2 : 0;
    var us3 = this.pt.us3;
    var m2 = this.pt.m2;
    var n3 = this.pt.n3;
    var l3 = this.pt.l3;

    this.RenderHeader(box);

    // m2
    var m2Div = document.createElement("DIV");
    m2Div.className = "BetTypeSelect";
    m2Div.id = m2Div.name = "m2$" + this.suffixId;
    m2Div.innerHTML = m2;
    box.appendChild(m2Div);

    var im2Check = null;
    var um2Select = null;
    // im2
    im2Check = document.createElement("INPUT");
    im2Check.checked = im2Check.defaultChecked = im2;
    im2Check.disabled = "disabled";
    im2Check.id = im2Check.name = "im2$" + this.suffixId;
    im2Check.type = "checkbox";
    im2Check.className = "BetTypeCheckbox";
    var im2Div = document.createElement("DIV");
    im2Div.className = "BetTypeSelect";
    im2Div.appendChild(im2Check);
    box.appendChild(im2Div);

    // um2
    var min = 0;
    var max = us3;
    selected = um2;
    um2Select = document.createElement("LABEL");
    um2Select.className = "PTSelect";
    um2Select.innerHTML = um2;
    im2Div.appendChild(um2Select);

    // a2
    var a2Div = document.createElement("DIV");
    a2Div.id = a2Div.name = "a2$" + this.suffixId;
    a2Div.className = "BetTypeSelect";
    a2Div.innerHTML = a2;
    box.appendChild(a2Div);

    box.id = "e$" + this.suffixId;

    return box;
}

/*--master edit agent pt--*/
Fanex.PTRacing.BetType.prototype.Render_0_2_1 = function (owner) {
    box = document.createElement("DIV");
    box.className = "PTLineBox";
    if (typeof (this.pt.a2) == 'undefined') { // Add new case
        this.pt.a2 = 0;
        this.pt.um2 = 0;
        this.pt.l3 = this.pt.m3;
        this.pt.n2 = 0;
    }

    var a2 = this.pt.a2;
    var n2 = this.pt.n2;
    var l2 = this.pt.l2;
    var im2 = this.pt.im2;
    var um2 = im2 ? this.pt.um2 : 0;
    var us3 = this.pt.us3;
    var m2 = this.pt.m2;
    var n3 = this.pt.n3;
    var l3 = this.pt.l3;

    this.RenderHeader(box);

    // m2
    var min = Math.max(0, Fanex.Round(n3 - l2));
    var max = Fanex.Round(l3 - n2);
    var selected = m2;
    var m2Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    m2Select.select.id = m2Select.select.name = "m2$" + this.suffixId;
    m2Select.className = "BetTypeSelect";
    m2Select.select.disabled = this.pt.im2;
    box.appendChild(m2Select);


    var im2Check = null;
    var um2Select = null;
    if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
        // im2
        im2Check = document.createElement("INPUT");
        im2Check.checked = im2Check.defaultChecked = im2;
        im2Check.id = im2Check.name = "im2$" + this.suffixId;
        im2Check.type = "checkbox";
        im2Check.className = "BetTypeCheckbox";
        var im2Div = document.createElement("DIV");
        im2Div.className = "BetTypeSelect";
        im2Div.appendChild(im2Check);
        box.appendChild(im2Div);

        // um2
        var min = 0;
        var max = us3;
        selected = um2;
        um2Select = document.createElement("select");
        um2Select.className = "PTSelect";
        Fanex.PTRacing.PT_SetSelect(um2Select, min, max, Fanex.PTRacing.PT_STEP, selected);
        um2Select.id = um2Select.name = "um2$" + this.suffixId;
        um2Select.disabled = !im2;
        im2Div.appendChild(um2Select);
        
        // Event change m2, reset a2Select
        m2Select.select.onchange = function (e, keepCurrent) {
            var min = Fanex.Round(im2Check.checked ? n2 : n3 - parseFloat(this.value));
            min = Math.max(min, n2);
            var max = im2Check.checked ? Math.min(us3, l2) : Math.min(Fanex.Round(us3 - parseFloat(this.value)), l2);
            var selected = parseFloat(a2Select.select.value);
            
            if (!keepCurrent || selected < min || selected > max) {
                selected = max;
            }
            Fanex.PTRacing.PT_SetSelect(a2Select.select, min, max, Fanex.PTRacing.PT_STEP, selected);
        }

        // im2 handling
        im2Check.onclick = function (e) {
            // Detect current value is out of range, reset it to max
            Fanex.PTRacing.PT_ValidateSelect(this.checked ? um2Select.select : m2Select.select);

            m2Select.select.onchange(e, true);
            um2Select.disabled = !im2Check.checked;
            m2Select.select.disabled = im2Check.checked;
        }
    }
    else {
        box.className = "PTAgentDisableAutMPTBox";
        // Event change m2, reset a2Select
        m2Select.select.onchange = function () {
            var min = Fanex.Round(n3 - parseFloat(this.value));
            min = Math.max(min, n2);
            var max = Math.min(Fanex.Round(l3 - parseFloat(this.value)), l2);
            var selected = max;
            
            Fanex.PTRacing.PT_SetSelect(a2Select.select, min, max, Fanex.PTRacing.PT_STEP, selected);
        }
    }

    // a2
    var min = n2;
    var max = im2 ? Math.min(l3, l2) : Fanex.getMaxPt(l3, m2, l2);
    var selected = a2;
    var a2Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
    a2Select.select.id = a2Select.select.name = "a2$" + this.suffixId;
    a2Select.className = "BetTypeSelect";
    box.appendChild(a2Select);

    box.id = "e$" + this.suffixId;
    
    // Get updated data
    this.Save = function () {
        if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
            this.pt.a2 = parseFloat(a2Select.select.value);
            this.pt.im2 = im2Check.checked;

            if (this.pt.im2) {
                this.pt.m2 = 0;
                this.pt.um2 = parseFloat(um2Select.value);
            }
            else {
                this.pt.m2 = parseFloat(m2Select.select.value);
                this.pt.um2 = 0;
            }
        }
        else {
            this.pt.m2 = parseFloat(m2Select.select.value);
            this.pt.a2 = parseFloat(a2Select.select.value);
        }
        return {
            id: this.id,
            pt: this.pt
        }
    }

    return box;
};
/*--/master edit agent pt--*/

/*--super edit member pt--*/
Fanex.PTRacing.BetType.prototype.Render_4_1_1 = function (owner) {
    box = document.createElement("DIV");

    this.RenderHeader(box);

    var min = this.pt.n4;
    var max = 0;
    var selected = null;

    // s1
    var s1Select = null;
    if (!this.pt.is3) {        
        max = Math.max(this.pt.l2, min);
        selected = this.pt.s1;

        s1Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
        s1Select.select.id = s1Select.select.name = "s1$" + this.suffixId;
        s1Select.select.disabled = this.pt.is1;
        s1Select.className = "BetTypeSelect";
        box.appendChild(s1Select);
    } else {
        // s1 label
        var s1Label = document.createElement("DIV");
        s1Label.innerHTML = this.pt.s1;
        s1Label.className = "BetTypeSelect";
        box.appendChild(s1Label);
    }

    // is1
    var is1Check = document.createElement("INPUT");
    is1Check.checked = is1Check.defaultChecked = this.pt.is1;
    is1Check.name = "is1$" + this.suffixId;
    is1Check.title = "Click here to check Auto Super on Member";
    is1Check.type = "checkbox";
    is1Check.className = "BetTypeCheckbox";
    var is1Div = document.createElement("DIV");
    is1Div.className = "BetTypeSelect";
    is1Div.appendChild(is1Check);
    box.appendChild(is1Div);

    // us1
    max = Math.max(this.pt.s4, min);
    selected = this.pt.us1;

    var us1Select = document.createElement("select");
    us1Select.className = "PTSelect";
    Fanex.PTRacing.PT_SetSelect(us1Select, min, max, Fanex.PTRacing.PT_STEP, selected);
    us1Select.id = us1Select.name = "us1$" + this.suffixId;
    us1Select.disabled = !this.pt.is1;
    is1Div.appendChild(us1Select);
    box.appendChild(is1Div);

    // m1 label
    var m1Label = document.createElement("DIV");
    m1Label.innerHTML = this.pt.m1;
    m1Label.className = "BetTypeSelect";
    box.appendChild(m1Label);

    // a1 label
    var a1Label = document.createElement("DIV");
    a1Label.innerHTML = this.pt.a1;
    a1Label.className = "BetTypeSelect";
    box.appendChild(a1Label);

    // is1 handling
    var is3 = this.pt.is3;
    is1Check.onclick = function () {
        us1Select.disabled = !is1Check.checked;
        if (!is3) {
            s1Select.select.disabled = is1Check.checked;
        }
    }
    box.id = "e$" + this.suffixId;
    box.className = "PTSuperBox";

    // Get updated data
    this.Save = function () {
        this.pt.is1 = is1Check.checked;
        if (!this.pt.is1) {
            if (!this.pt.is3) {
                this.pt.s1 = parseFloat(s1Select.select.value);
            }

            this.pt.us1 = 0;
        }
        else {
            this.pt.us1 = parseFloat(us1Select.value);
        }

        return {
            id: this.id,
            pt: this.pt
        }
    }

    return box;
};
/*--/super edit agent pt--*/

/*--master edit member pt--*/
Fanex.PTRacing.BetType.prototype.Render_3_1_1 = function (owner) {
    box = document.createElement("DIV");
    this.RenderHeader(box);

    var min = this.pt.n3;
    var max = 0;
    var selected = 0;

    // m1 selection
    if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
        box.className = "PTLineBox";
        if (!this.pt.im2) {
            max = Math.max(this.pt.m3, min);
            selected = this.pt.m1;

            var m1Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
            m1Select.select.id = m1Select.select.name = "m1$" + this.suffixId;
            m1Select.className = "BetTypeSelect";
            box.appendChild(m1Select);
        } else {
            // m1 label
            var m1Label = document.createElement("DIV");
            m1Label.innerHTML = this.pt.m1;
            m1Label.className = "BetTypeSelect";
            box.appendChild(m1Label);
        }

        var im1Check = null;
        var um1Select = null;
        // im1
        im1Check = document.createElement("INPUT");
        im1Check.checked = im1Check.defaultChecked = this.pt.im1;
        im1Check.name = "im1$" + this.suffixId;
        im1Check.type = "checkbox";
        im1Check.className = "BetTypeCheckbox";
        var im1Div = document.createElement("DIV");
        im1Div.className = "BetTypeSelect";
        im1Div.appendChild(im1Check);
        box.appendChild(im1Div);

        // um1
        max = Math.max(this.pt.um2, min);
        selected = this.pt.um1;

        um1Select = document.createElement("select");
        um1Select.className = "PTSelect";
        Fanex.PTRacing.PT_SetSelect(um1Select, min, max, Fanex.PTRacing.PT_STEP, selected);
        um1Select.id = um1Select.name = "um1$" + this.suffixId;
        im1Div.appendChild(um1Select);

        // im1 handling
        var im2 = this.pt.im2;
        um1Select.disabled = !this.pt.im1;
        if (!im2) {
            m1Select.select.disabled = im1Check.checked;
        }

        im1Check.onclick = function () {
            um1Select.disabled = !im1Check.checked;
            if (!im2) {
                m1Select.select.disabled = im1Check.checked;
            }
        }
    }
    else {
        box.className = "PTAgentDisableAutMPTBox";
        max = this.pt.m3;
        selected = this.pt.m1;

        var m1Select = Fanex.PTRacing.PT_RenderSelect(min, max, Fanex.PTRacing.PT_STEP, selected, this.showButtons);
        m1Select.select.id = m1Select.select.name = "m1$" + this.suffixId;
        m1Select.className = "BetTypeSelect";
        box.appendChild(m1Select);
    }

    // a1 label
    var a1Label = document.createElement("DIV");
    a1Label.innerHTML = this.pt.a1;
    a1Label.className = "BetTypeSelect";
    box.appendChild(a1Label);

    box.id = "e$" + this.suffixId;
    // Get updated data
    this.Save = function () {
        if (Fanex.PTRacing.CURRENT_CONTEXT.ia3) {
            this.pt.im1 = im1Check.checked;

            if (!this.pt.im1) {
                if (!this.pt.im2) {
                    this.pt.m1 = parseFloat(m1Select.select.value);
                }

                this.pt.um1 = 0;
            }
            else {
                this.pt.um1 = parseFloat(um1Select.value);
            }
        } else {
            this.pt.m1 = parseFloat(m1Select.select.value);
        }

        return {
            id: this.id,
            pt: this.pt
        }
    }
    return box;
}
/*--/master edit member pt--*/
