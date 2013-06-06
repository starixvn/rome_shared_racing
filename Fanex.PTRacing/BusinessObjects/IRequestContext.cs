namespace Fanex.PTRacing.BusinessObjects
{
    public interface IRequestContext
    {
        int CustId { get; set; }
        
        int AgentId { get; set; }

        string UserName { get; set; }

        int TargetCustId { get; set; }

        int AdminId { get; set; }

        int SubAccId { get; set; }

        int RoleId { get; set; }

        int CurrencyId { get; set; }

        string SiteName { get; set; }

        int TargetRoleId { get; set; }

        bool IsNeutralSite { get; set; }

        FormType FormId { get; set; }

        string IP { get; set; }

        string Language { get; set; }

        string LangKey { get; set; }
    }
}