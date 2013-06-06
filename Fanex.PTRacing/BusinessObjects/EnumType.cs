namespace Fanex.PTRacing.BusinessObjects
{
    public enum MappingType
    {
        In,
        Out
    }

    public enum FormType : int
    {
        Add = 0,
        EditPT = 1,
        EditMinPT = 2,
        EditMinMaxPT = 3,
        ViewPT = 4
    }

    public enum CustomerRole : int
    {
        Member = 1,
        Agent = 2,
        Master = 3,
        Super = 4
    }
}