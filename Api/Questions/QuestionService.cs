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
			InstallAdminPages("Question Configuration", "fa:fa-wrench", new string[] { "id", "name" });
		}
	}
    
}
