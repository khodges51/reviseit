using System;
using Api.Database;
using Api.Translate;
using Api.Users;


namespace Api.Units
{
	
	/// <summary>
	/// An Unit
	/// </summary>
	public partial class Unit : VersionedContent<uint>
	{
        /// <summary>
        /// The name of the unit
        /// </summary>
		[Localized]
		public string Name;
	}

}