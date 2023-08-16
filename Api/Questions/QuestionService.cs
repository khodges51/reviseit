using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.Questions
{
	/// <summary>
	/// Handles questions.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class QuestionService : AutoService<Question>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public QuestionService() : base(Events.Question)
        {
			// Example admin page install:
			// InstallAdminPages("Questions", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
