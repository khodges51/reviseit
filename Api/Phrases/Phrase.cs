using System;
using Api.AutoForms;
using Api.Database;
using Api.Startup;
using Api.Translate;
using Api.Units;
using Api.Users;


namespace Api.Phrases
{

    /// <summary>
    /// A Phrase
    /// </summary>
    [HasVirtualField("Unit", typeof(Unit), "UnitId")]
    public partial class Phrase : VersionedContent<uint>
	{
        /// <summary>
        /// The content of the phrase
        /// </summary>
		[Localized]
		public string Content;

		/// <summary>
		/// The unit this phrase belongs too
		/// </summary>
        [Data("search", "Name")]
        public uint UnitId;
    }

}