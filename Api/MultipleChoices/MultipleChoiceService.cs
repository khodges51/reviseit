using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.MultipleChoices
{
	/// <summary>
	/// Handles multipleChoices.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class MultipleChoiceService : AutoService<MultipleChoice>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public MultipleChoiceService() : base(Events.MultipleChoice)
        {
            // Example admin page install:
            InstallAdminPages("Questions: Multiple Choice", "fa:fa-question-circle", new string[] { "id", "question" });
        }
	}
    
}
