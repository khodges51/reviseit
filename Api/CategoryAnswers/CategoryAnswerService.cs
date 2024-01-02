using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.CategoryAnswers
{
	/// <summary>
	/// Handles categoryAnswers.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class CategoryAnswerService : AutoService<CategoryAnswer>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public CategoryAnswerService() : base(Events.CategoryAnswer)
        {
			// Example admin page install:
			// InstallAdminPages("CategoryAnswers", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
