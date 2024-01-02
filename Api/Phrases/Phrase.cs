using System;
using Api.AutoForms;
using Api.Database;
using Api.MultipleChoices;
using Api.Startup;
using Api.Translate;
using Api.Units;
using Api.Users;


namespace Api.Phrases
{

    /// <summary>
    /// A Phrase
    /// </summary>
    [ListAs("Asnwers", Explicit = true)]
    [ImplicitFor("Asnwers", typeof(MultipleChoice))]
    public partial class Phrase : VersionedContent<uint>
	{
        /// <summary>
        /// The content of the phrase
        /// </summary>
		[Localized]
		public string Content;
    }

}