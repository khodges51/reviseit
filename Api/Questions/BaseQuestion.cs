using System;
using Api.AutoForms;
using Api.Database;
using Api.Startup;
using Api.Translate;
using Api.Units;
using Api.Users;

namespace Api.Questions
{
    /// <summary>
    /// Common properties of a question
    /// </summary>
    [HasVirtualField("Unit", typeof(Unit), "UnitId")]
    public abstract class BaseQuestion : VersionedContent<uint>
    {
        /// <summary>
        /// The question
        /// </summary>
		[Localized]
        public string Question;

        /// <summary>
        /// The unit this phrase belongs too
        /// </summary>
        [Data("search", "Name")]
        public uint UnitId;
    }
}
