using System;
using System.Collections.Generic;
using Api.Questions;
using Api.AutoForms;
using Api.Database;
using Api.Phrases;
using Api.Translate;
using Api.Users;


namespace Api.MultipleChoices
{
	
	/// <summary>
	/// A Multiple Choice question
	/// </summary>
	public partial class MultipleChoice : BaseQuestion
	{
        /// <summary>
        /// The correct answers
        /// </summary>
        [Module("Admin/MultiSelect")]
        [Data("search", "content")]
        [Data("contentType", "phrase")]
        public List<Phrase> Answers;		
	}

}