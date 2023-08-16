using Microsoft.AspNetCore.Mvc;

namespace Api.SentenceFillers
{
    /// <summary>Handles sentenceFiller endpoints.</summary>
    [Route("v1/sentenceFiller")]
	public partial class SentenceFillerController : AutoController<SentenceFiller>
    {
    }
}