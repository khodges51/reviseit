using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.SentenceFillers
{
	/// <summary>
	/// Handles sentenceFillers.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class SentenceFillerService : AutoService<SentenceFiller>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public SentenceFillerService() : base(Events.SentenceFiller)
        {
			// Example admin page install:
			// InstallAdminPages("SentenceFillers", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
