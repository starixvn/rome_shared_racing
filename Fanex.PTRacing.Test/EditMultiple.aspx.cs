namespace Fanex.PTRacing.Test
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using Fanex.PTRacing.Templates;

    public partial class EditMultiiple : Fanex.Age.UI.TplPage
    {
        public override void RenderContent(HtmlTextWriter writer)
        {
            var template = new EditMultiple_Template();
            template.Title = "Edit Racing";
            template.targetCustId = this.Request.QueryString["custid"];
            template.targetRoleId = this.Request.QueryString["roleid"];
            template.CssBlock.Append(Fanex.PTRacing.HttpContextExtension.GenerateStyleSheetLink("Core.css?" + TplCore.TplSettings.UrlVersion));
            template.ScriptBlock.Append(Fanex.PTRacing.HttpContextExtension.GenerateScriptLink("Core.js?" + TplCore.TplSettings.UrlVersion));
            template.ScriptBlock.Append(Fanex.PTRacing.HttpContextExtension.GenerateScriptLink("Data.js?" + TplCore.TplSettings.UrlVersion));
            template.ScriptBlock.Append(Fanex.PTRacing.HttpContextExtension.GenerateScriptLink("EditMultiple.js?" + TplCore.TplSettings.UrlVersion));
            writer.Write(template);
        }

        public override object InvokeData(System.Collections.Hashtable p)
        {
            return null;
        }

        public override void ProcessRequest(ref System.Collections.Hashtable p)
        {

        }

        public override object ValidateRequest(System.Collections.Hashtable p)
        {
            return null;
        }
    }
}