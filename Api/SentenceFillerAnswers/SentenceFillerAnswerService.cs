using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.SentenceFillerAnswers
{
	/// <summary>
	/// Handles sentenceFillerAnswers.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class SentenceFillerAnswerService : AutoService<SentenceFillerAnswer>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public SentenceFillerAnswerService() : base(Events.SentenceFillerAnswer)
        {
			// Example admin page install:
			// InstallAdminPages("SentenceFillerAnswers", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
