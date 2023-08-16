using Api.Database;
using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Permissions;
using Api.Contexts;
using Api.Eventing;

namespace Api.Phrases
{
	/// <summary>
	/// Handles phrases.
	/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
	/// </summary>
	public partial class PhraseService : AutoService<Phrase>
    {
		/// <summary>
		/// Instanced automatically. Use injection to use this service, or Startup.Services.Get.
		/// </summary>
		public PhraseService() : base(Events.Phrase)
        {
			// Example admin page install:
			// InstallAdminPages("Phrases", "fa:fa-rocket", new string[] { "id", "name" });
		}
	}
    
}
