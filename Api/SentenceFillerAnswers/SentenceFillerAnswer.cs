using System;
using Api.AutoForms;
using Api.Database;
using Api.MultipleChoices;
using Api.Phrases;
using Api.SentenceFillers;
using Api.Startup;
using Api.Translate;
using Api.Users;


namespace Api.SentenceFillerAnswers
{

    /// <summary>
    /// A SentenceFillerAnswer
    /// </summary>
    [HasVirtualField("Phrase", typeof(Phrase), "AnswerId")]
    [ListAs("SentenceFillAsnwers", Explicit = true)]
    [ImplicitFor("SentenceFillAsnwers", typeof(SentenceFiller))]
    public partial class SentenceFillerAnswer : VersionedContent<uint>
	{
        /// <summary>
        /// The phrase
        /// </summary>
        [Module("Admin/ContentSelect")]
        [Data("search", "content")]
        [Data("contentType", "phrase")]
        public uint AnswerId;

        /// <summary>
        /// The order in which the phrase appears in the sentence
        /// </summary>
        public uint Order;
    }

}