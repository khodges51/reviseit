using System;
using Api.AutoForms;
using Api.Categories;
using Api.Database;
using Api.MultipleChoices;
using Api.Phrases;
using Api.Startup;
using Api.Translate;
using Api.Users;


namespace Api.CategoryAnswers
{

    /// <summary>
    /// A CategoryAnswer
    /// </summary>
    [HasVirtualField("Phrase", typeof(Phrase), "AnswerId")]
    [ListAs("CategoryAsnwers", Explicit = true)]
    [ImplicitFor("CategoryAsnwers", typeof(Category))]
    public partial class CategoryAnswer : VersionedContent<uint>
	{
        /// <summary>
        /// The phrase
        /// </summary>
        [Module("Admin/ContentSelect")]
        [Data("search", "content")]
        [Data("contentType", "phrase")]
        public uint AnswerId;

        /// <summary>
        /// The category
        /// </summary>
        public string Category;
    }

}