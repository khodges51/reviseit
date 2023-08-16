using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.FreeTypes
{
	/// <summary>
	/// Handles freeTypes.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class FreeTypeService : AutoService<FreeType>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public FreeTypeService() : base(Events.FreeType)
        {
			// Example admin page install:
			// InstallAdminPages("FreeTypes", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
