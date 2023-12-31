import Collapsible from 'UI/Collapsible';
import Default from 'Admin/Layouts/Default';
import webRequest from 'UI/Functions/WebRequest';
import { useState, useEffect } from 'react';
import { useRouter } from 'UI/Session';
import getRef from 'UI/Functions/GetRef';
import ConfirmModal from 'UI/Modal/ConfirmModal';
import Search from 'UI/Search';

export default function Datamap(props) {
	const [ datamap, setDatamap ] = useState(false);
	const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ searchText, setSearchText ] = useState();
	const [ isEmpty, setIsEmpty ] = useState();
	const [ isLoading, setIsLoading ] = useState(true);
	const { setPage } = useRouter();
	var customData = [];

	function buildDatamap(results) {
		const base = { children: [] };

		for (const node of results) {
			let curr = base;
			var grandchildren = [];

			customData
				.filter(data => data.type.toLowerCase() == node.name.toLowerCase())
				.forEach(dataType => {
					var output = {
						children: []
						//iconRef
						//deleted
					};
					Object.assign(output, dataType);
					output.nickName = output.name;
					output.name = output.title; 

					grandchildren.push(output);
				});


			curr.children.push({
				children: grandchildren
			});
			curr = curr.children[curr.children.length - 1];
			Object.assign(curr, node);
		}

		base.children.forEach(node => {
			if (node.children.length) {
				node.children.sort((a, b) => (a.nickName > b.nickName) ? 1 : -1);
			}
		});

		return base.children;
    }

	async function handleFetch(url) {
		try {
			const resp = await webRequest(url);
			return resp && resp.json ? resp.json.results : undefined;
		} catch (e) {
			console.warn(e);
			return null;
		}
	}

	async function reduceFetch(acc, curr) {
		const prev = await acc;

		if (prev) {
			customData = [...customData, ...prev]
		}

		return handleFetch(curr);
	}

	useEffect(() => {
		setIsLoading(true);

		webRequest('customcontenttype/list', {
			where: {
				deleted: false,
				isForm: false
            }
        })
			.then(resp => {

			// build a list of custom data type URLs
			// ...new Set() ensures we strip out any duplicates
			var customDataTypeUrls = [...new Set(
				resp.json.results.map(result => {
					return result.name + '/list';
				})
			)];

			customData = [];

			const pipeFetch = async customDataTypeUrls => customDataTypeUrls.reduce(reduceFetch, Promise.resolve(''));

			pipeFetch(customDataTypeUrls).then(result => {

				if (result) {
					customData = [...customData, ...result]
                }

				var dm = buildDatamap(resp.json.results);
				dm.sort((a, b) => (a.nickName > b.nickName) ? 1 : -1);
				setDatamap(dm);
				setIsLoading(false);
			});
		});
	}, []);

	function searchData(data) {

		if (!data) {
			return;
		}

		data.children.forEach(child => {
			searchData(child);
		});

		let name = data.name ? data.name.toLowerCase() : '';
		let nickName = data.nickName ? data.nickName.toLowerCase() : '';
		let type = data.type ? data.type.toLowerCase() : '';
		let numericSearch = parseInt(searchText, 10);

		data.exclude = !name.includes(searchText) && !nickName.includes(searchText) && !type.includes(searchText);

		if (data.exclude && !isNaN(numericSearch)) {
			data.exclude = data.id != numericSearch;
		}

		// check - if a node has a child marked as not excluded, the parent should remain visible
		if (data.exclude && data.children?.length) {
			data.exclude = data.children.filter((child) => !child.exclude).length == 0;
		}

		return data.exclude;
	}

	function clearSearch(data) {

		if (!data) {
			return;
		}

		data.children.forEach(child => {
			clearSearch(child);
		});

		data.exclude = false;
	}

	// update search filtering
	useEffect(() => {
		if (datamap) {
			setIsLoading(true);
			let searchMap = structuredClone(datamap);
			let empty = true;

			searchMap.forEach(data => {
				// clear exclusions if search cleared
				if (!searchText) {
					clearSearch(data);
				} else {
					// mark elements as excluded if they don't match the search criteria
					searchData(data);
				}

				if (!data.exclude) {
					empty = false;
				}
			});

			setIsEmpty(empty);
			setDatamap(searchMap);
			setIsLoading(false);
		}

	}, [searchText]);

	function renderLoading() {
		return <div className="datamap__loading">
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">
					{`Loading...`}
				</span>
			</div>
		</div>;
	}

	function renderEmpty() {
		return <em className="datamap__empty">
			{searchText && `No content types match your search criteria`}
			{!searchText && `No available content types found`}
		</em>;
	}

	function renderNode(data) {
		var isInstance = data.type != 'CustomContentType';

		var newClick = function (e) {
			e.stopPropagation();
			setPage('/en-admin/' + data.name + '/add');
		};

		var editClick = function (e) {
			e.stopPropagation();

			if (isInstance) {
				// instance of a customContentType
				setPage('/en-admin/' + data.type + '/' + data.id);
			} else {
				// top-level definition of a customContentType
				setPage('/' + window.location.pathname.replace(/^\/+|\/+$/g, '') + '/' + data.id);
            }

		};

		var removeClick = function (e) {
			e.stopPropagation();
			setShowConfirmModal(data.id);
		}

		var newButton = {
			icon: 'fa fa-plus-circle',
			text: `New`,
			showLabel: true,
			variant: 'primary',
			onClick: newClick
		};

		var editButton = {
			icon: 'fa fa-edit',
			text: `Edit`,
			showLabel: true,
			variant: 'primary',
			onClick: editClick,
			children: [
				{
					icon: 'fa fa-fw fa-trash',
					text: `Remove`,
					onClick: removeClick
                }
			]
		};

		/*
		var launchButton = {
			disabled: hasParameter,
			icon: 'fa fa-external-link',
			text: `Launch`,
			showLabel: true,
			variant: 'secondary',
			//onClick: window.location.origin + page.url,
			//target: '_blank'
			onClick: function () {
				setPage(page.url);
			}
		};

		var buttons = !page.isPage ? [editButton, launchButton] : [launchButton];
		const slashUrl = '/' + page.url.replace(/^\/|\/$/g, '');
		//var largeIcon = page.url == '/' ? 'fa-home' : 'fa-file';
		 */
		var buttons = isInstance ? [editButton] : [newButton, editButton];
		var largeIcon = data.iconRef ? getRef(data.iconRef, { classNameOnly: true }) : (isInstance ? 'fa-file-alt' : 'fa-database');

		return <>
			<Collapsible compact expanderLeft title={data.nickName} subtitle={data.name} info={`ID: #${data.id}`} buttons={buttons} className="datamap-expander"
				defaultClick={data.children.length ? undefined : editClick} icon={largeIcon} searchText={searchText} hidden={data.exclude}>
				{data.children.length && data.children.map(child => {
					return renderNode(child);
				})}
			</Collapsible>
		</>;
    }

	function removeData(id) {
		/*
		webRequest(
			'customContentType/' + id,
			null,
			{ method: 'delete' }
		).then(response => {
		});
		*/
		webRequest(
			'customContentType/' + id,
			{ deleted: 1 },
			null
		).then(response => {
			window.location.reload();
		});
	}

	var addUrl = window.location.href.replace(/\/+$/g, '') + '/add';

	return (
		<Default>
			<div className="admin-page">
				<header className="admin-page__subheader">
					<div className="admin-page__subheader-info">
						<h1 className="admin-page__title">
							{`Edit Site Data`}
						</h1>
						<ul className="admin-page__breadcrumbs">
							<li>
								<a href={'/en-admin/'}>
									{`Admin`}
								</a>
							</li>
							<li>
								{`Custom content types`}
							</li>
						</ul>
					</div>
					<Search className="admin-page__search" placeholder={`Search`}
						onQuery={(where, query) => {
							setSearchText((!query || query.trim().length == 0) ? false : query.toLowerCase());
						}} />
				</header>
				<div className="datamap__wrapper">
					<div className="datamap__internal">
						{showConfirmModal && <>
							<ConfirmModal confirmCallback={() => removeData(showConfirmModal)} confirmVariant="danger" cancelCallback={() => setShowConfirmModal(false)}>
								<p>
									{`This will remove row ID #${showConfirmModal}.`}
								</p>
								<p>
									{`Are you sure you wish to do this?`}
								</p>
							</ConfirmModal>
						</>}
						{isLoading && renderLoading()}
						{!isLoading && isEmpty && renderEmpty()}
						{!isLoading && datamap && datamap.map(data => {
							return renderNode(data);
						})}
					</div>
					{!this.props.noCreate && <>
						<footer className="admin-page__footer">
							<a href={addUrl} className="btn btn-primary">
								{`Create new`}
							</a>
						</footer>
					</>}
				</div>
			</div>
		</Default>
	);
}
