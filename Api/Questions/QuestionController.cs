using Microsoft.AspNetCore.Mvc;

namespace Api.Questions
{
    /// <summary>Handles question endpoints.</summary>
    [Route("v1/question")]
	public partial class QuestionController : AutoController<Question>
    {
    }
}