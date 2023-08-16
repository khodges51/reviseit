using System;
using Api.Database;
using Api.Translate;
using Api.Users;


namespace Api.Questions
{
	
	/// <summary>
	/// A type of Question
	/// </summary>
	public partial class Question : VersionedContent<uint>
	{
        /// <summary>
        /// The name of the question type
        /// </summary>
		[Localized]
		public string Name;

        /// <summary>
        /// The name of the Api service for this question type
        /// </summary>
        public string Service;

        /// <summary>
        /// The UI module this question uses
        /// </summary>
        public string UIModule;
    }

}