using System.Web;
using System.Web.Mvc;

namespace potato_tshirt_designer
{
  public class FilterConfig
  {
    public static void RegisterGlobalFilters(GlobalFilterCollection filters)
    {
      filters.Add(new HandleErrorAttribute());
    }
  }
}
