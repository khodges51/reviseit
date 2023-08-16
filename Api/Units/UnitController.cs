using Microsoft.AspNetCore.Mvc;

namespace Api.Units
{
    /// <summary>Handles unit endpoints.</summary>
    [Route("v1/unit")]
	public partial class UnitController : AutoController<Unit>
    {
    }
}