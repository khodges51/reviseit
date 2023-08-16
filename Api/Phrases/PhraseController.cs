using Microsoft.AspNetCore.Mvc;

namespace Api.Phrases
{
    /// <summary>Handles phrase endpoints.</summary>
    [Route("v1/phrase")]
	public partial class PhraseController : AutoController<Phrase>
    {
    }
}