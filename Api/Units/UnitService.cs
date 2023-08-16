using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.Units
{
	/// <summary>
	/// Handles units.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class UnitService : AutoService<Unit>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public UnitService() : base(Events.Unit)
        {
			// Example admin page install:
			// InstallAdminPages("Units", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
