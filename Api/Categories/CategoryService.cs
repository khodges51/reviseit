using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.Categories
{
	/// <summary>
	/// Handles categories.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class CategoryService : AutoService<Category>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public CategoryService() : base(Events.Category)
        {
			// Example admin page install:
			// InstallAdminPages("Categories", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
