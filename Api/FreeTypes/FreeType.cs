using System;
using Api.Questions;
using Api.AutoForms;
using Api.Database;
using Api.Phrases;
using Api.Startup;
using Api.Translate;
using Api.Users;


namespace Api.FreeTypes
{

    /// <summary>
    /// A Free Type answer question
    /// </summary>
    [HasVirtualField("Phrase", typeof(Phrase), "AnswerId")]
    public partial class FreeType : BaseQuestion
	{
        /// <summary>
        /// The correct answer
        /// </summary>
        [Module("Admin/ContentSelect")]
        [Data("search", "content")]
        [Data("contentType", "phrase")]
        public uint AnswerId;
	}

}