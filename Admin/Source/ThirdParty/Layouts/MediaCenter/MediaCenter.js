import Loop from 'UI/Loop';
import Container from 'UI/Container';
import Row from 'UI/Row';
import Column from 'UI/Column';
import Input from 'UI/Input';
import Search from 'UI/Search';
import Uploader from 'UI/Uploader';
import ConfirmModal from 'UI/Modal/ConfirmModal';
import Modal from 'UI/Modal';
import webRequest from 'UI/Functions/WebRequest';
import getRef from 'UI/Functions/GetRef';
import Default from 'Admin/Layouts/Default';

var fields = ['id', 'originalName'];
var searchFields = ['originalName', 'alt','author','id'];

const CLOSEST_MULTIPLE = 2;
const PREVIEW_SIZE = 512;
const UPLOAD_SINGLE = 1;
const UPLOAD_MULTIPLE = 2;

export default class MediaCenter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // If an id field is specified, that's the default sort
            sort: { field: 'id', direction: 'desc' }
        };

        this.renderHeader = this.renderHeader.bind(this);
        this.renderEntry = this.renderEntry.bind(this);
    }

    componentWillReceiveProps(props) {

        var { sort } = this.state;

        if (sort && !fields.find(field => field == sort.field)) {
            // Restore to id sort:
            this.setState({
                sort: { field: 'id', direction: 'desc' }
            });
        }

    }

    showRef(ref, size) {
        var parsedRef = getRef.parse(ref);
        var size = size || 256;
        var targetSize = size;
        //var minSize = size == 256 ? 238 : size;

        // Check if it's an image/ video/ audio file. If yes, a preview is shown. Otherwise it'll be a placeholder icon.
        var canShowImage = getRef.isImage(ref);

        if (canShowImage && parsedRef.args) {
            var args = parsedRef.args;

            if ((args.w && args.w < size) && (args.h && args.h < size)) {
                targetSize = undefined;
            }

        }

        return canShowImage ?
            getRef(ref, { size: targetSize, portraitCheck: true }) :
            <span className="fal fa-4x fa-file"></span>;

    }

    renderHeader(allContent) {
        // Header (Optional)
        var heads = fields.map(field => {

            // Class for styling the sort buttons:
            var sortingByThis = this.state.sort && this.state.sort.field == field;
            var className = '';

            if (sortingByThis) {
                className = this.state.sort.direction == 'desc' ? 'sorted-desc' : 'sorted-asc';
            }

            // Field name with its first letter uppercased:
            var ucFirstFieldName = field.length ? field.charAt(0).toUpperCase() + field.slice(1) : '';

            return (
                <th className={className}>
                    {ucFirstFieldName} <i className="fa fa-caret-down" onClick={() => {
                        // Sort desc
                        this.setState({
                            sort: {
                                field,
                                direction: 'desc'
                            }
                        });
                    }} /> <i className="fa fa-caret-up" onClick={() => {
                        // Sort asc
                        this.setState({
                            sort: {
                                field,
                                direction: 'asc'
                            }
                        });
                    }} />
                </th>
            );
        });

        // If everything in allContent is selected, mark this as selected as well.
        var checked = false;
        var { bulkSelections } = this.state;

        if (bulkSelections && allContent.length) {
            checked = true;
            allContent.forEach(e => {
                if (!bulkSelections[e.id]) {
                    checked = false;
                }
            });
        }

        return [
            <th>
                <input type='checkbox' checked={checked} onClick={() => {

                    // Check or uncheck all things.
                    if (checked) {
                        this.setState({ bulkSelections: null });
                    } else {
                        bulkSelections = {};
                        allContent.forEach(e => bulkSelections[e.id] = true);
                        this.setState({ bulkSelections });
                    }

                }} />
            </th>,
            <th>
                File
            </th>
        ].concat(heads);
    }

    selectedCount() {
        var { bulkSelections } = this.state;
        if (!bulkSelections) {
            return 0;
        }
        var c = 0;
        for (var k in bulkSelections) {
            c++;
        }
        return c;
    }

    renderEntry(entry) {
        var { bulkSelections } = this.state;
        var id = `upload_${entry.id}`;
        var parsedRef = getRef.parse(entry.ref);
        var focalX = parsedRef.args && parsedRef.args.fx || 50;
        var focalY = parsedRef.args && parsedRef.args.fy || 50;
        var url = getRef(entry.ref, { url: true });
        var isImage = getRef.isImage(entry.ref);
        var isVideo = getRef.isVideo(entry.ref);
        var checked = bulkSelections && !!bulkSelections[entry.id];
        var checkbox = <>
            <input type='checkbox' className="btn-check" checked={checked} id={id} autocomplete="off" onChange={() => {

                if (bulkSelections && bulkSelections[entry.id]) {
                    delete bulkSelections[entry.id];
                } else {
                    if (!bulkSelections) {
                        bulkSelections = {};
                    }
                    bulkSelections[entry.id] = true;
                }

                this.setState({ bulkSelections });
            }} />
        </>;

        return <>
            <div className="media-center__list-item" title={entry.originalName}>
                {checkbox}
                <label className="btn btn-outline-secondary" htmlFor={id}>
                    {this.showRef(entry.ref)}
                    <span className="media-center__id badge bg-secondary rounded-pill">
                        {entry.usageCount && entry.usageCount > 0 &&
                            <span className="media-center__usage">
                                {entry.usageCount}
                            </span>
                        }
                        {entry.id}
                    </span>
                </label>

                {/* allow image properties (such as focal point) to be set */}
                {isImage ? <>
                    <button type="button" className="btn btn-sm btn-primary media-center__original-filename" data-clamp="2"
                        onClick={() => {
                            this.setState({
                                uploadModal: entry.ref,
                                uploadMode: UPLOAD_SINGLE,
                                uploadId: entry.id,
                                uploaded: true,
                                focalX: focalX,
                                focalY: focalY,
                                alt: entry.alt,
                                author: entry.author,
                                originalName: entry.originalName,
                                transcodeState: entry.transcodeState
                            })
                        }}>
                        {`Edit - `}{entry.originalName}
                    </button>
                </>
                : <>
                    <a href={url} target="_blank" className="btn btn-sm btn-primary media-center__original-filename">
                        <i className="fa-fw fal fa-external-link"></i> {`Preview - `}{entry.originalName}
                    </a>
                </>}

            </div>
        </>;
    }

    renderBulkOptions(selectedCount) {
        var message = (selectedCount > 1) ? `${selectedCount} items selected` : `1 item selected`;

        return <div className="admin-page__footer-actions">
            <span className="admin-page__footer-actions-label">
                {message}
            </span>
            <button type="button" className="btn btn-danger" onClick={() => this.startDelete()}>
                {`Delete selected`}
            </button>
        </div>;
    }

    startDelete() {
        this.setState({
            confirmDelete: true
        });
    }

    cancelDelete() {
        this.setState({
            confirmDelete: false
        });
    }

    confirmDelete() {
        this.setState({
            confirmDelete: false,
            deleting: true
        });

        // get the item IDs:
        var ids = Object.keys(this.state.bulkSelections);

        var deletes = ids.map(id => webRequest(
            'upload/' + id,
            null,
            { method: 'delete' }
        ));

        Promise.all(deletes).then(response => {

            this.setState({ bulkSelections: null });

        }).catch(e => {
            console.error(e);
            this.setState({
                deleting: false,
                deleteFailed: true
            });
        });
    }

    renderConfirmDelete(count) {
        return <ConfirmModal confirmCallback={() => this.confirmDelete()} confirmVariant="danger" cancelCallback={() => this.cancelDelete()}>
            <p>
                {`Are you sure you want to delete ${count} item(s)?`}
            </p>
        </ConfirmModal>
    }

    showUploadModal(uploadMode) {
        this.setState({
            uploadModal: true,
            uploadMode: uploadMode,
            uploaded: false,
            bulkUploaded: false,
            focalX: 50,
            focalY: 50
        });
    }

    cancelUpload() {
        this.setState({
            uploadModal: false
        });
    }

    saveUpload() {

        webRequest("upload/" + this.state.uploadId,
            {
                'focalX': this.state.focalX,
                'focalY': this.state.focalY,
                'alt': this.state.alt,
                'author': this.state.author
            },
            { method: 'post' }).then(() => {
                this.setState({
                    uploadModal: false
                });
            });

    }

    renderUploadModal() {
        var isNewMedia = this.state.uploadModal === true;
        var url = isNewMedia ? undefined : getRef(this.state.uploadModal, { url: true });
        var isImage = isNewMedia ? undefined : getRef.isImage(this.state.uploadModal);
        var isVideo = isNewMedia ? undefined : getRef.isVideo(this.state.uploadModal);
        var title = isNewMedia ? `Upload media` : `Edit - ` + this.state.originalName;

        if (isNewMedia && this.state.uploadMode == UPLOAD_MULTIPLE) {
            title = `Bulk upload media`;
        }

        return <>
            <Modal visible isExtraLarge title={title}
                onClose={() => {
                    if (this.state.uploadMode == UPLOAD_MULTIPLE && this.state.bulkUploaded) {
                        window.location.reload(true);
                    } else {
                        this.cancelUpload();
                    }
                }}
                className="media-center__upload-modal">
                <div className="media-center__upload-modal-internal">
                    <Container>
                        <Row>
                            {!isNewMedia && <>
                                <Column sizeMd='9'>
                                    <div className='media-center__preview-wrapper'>
                                        <div className="media-center__preview"
                                            onClick={(e) => {
                                                var imagePreviewRect = e.target.getBoundingClientRect();
                                                this.setState({
                                                    focalX: CLOSEST_MULTIPLE * Math.round((e.offsetX / imagePreviewRect.width * 100) / CLOSEST_MULTIPLE),
                                                    focalY: CLOSEST_MULTIPLE * Math.round((e.offsetY / imagePreviewRect.height * 100) / CLOSEST_MULTIPLE)
                                                });
                                            }}>
                                            {this.showRef(this.state.uploadModal, PREVIEW_SIZE)}
                                            {isImage && !isVideo && <>
                                                <div className="media-center__preview-crosshair" style={{
                                                    left: this.state.focalX + '%',
                                                    top: this.state.focalY + '%'
                                                }}></div>
                                            </>}
                                        </div>
                                    </div>
                                </Column>
                            </>}
                            {isNewMedia && <>
                                <Uploader
                                    multiple={this.state.uploadMode == UPLOAD_MULTIPLE ? true : undefined}
                                    onUploaded={(e) => {

                                        if (this.state.uploadMode == UPLOAD_MULTIPLE) {
                                            this.setState({
                                                bulkUploaded: true
                                            });

                                            return;
                                        }

                                        if (!e.result.isImage) {
                                            window.location.reload(true);
                                            return;
                                        }

                                        this.setState({
                                            uploadModal: e.result.ref,
                                            uploadId: e.result.id,
                                            uploaded: true,
                                            focalX: 50,
                                            focalY: 50
                                        });
                                    }} />
                            </>}
                            {this.state.uploaded && <>
                                <Column sizeMd='3'>
                                    <div className="media-center__metadata">

                                        {isImage &&
                                            <div className="media-center__transcode">
                                                {`Transcode Status`}:{this.state.transcodeState}
                                            </div>
                                        }

                                        <div className="form-text media-center__alt">
                                            <Input type="text" label={`Author/Photographer`} value={this.state.author} onChange={e => {
                                                this.setState({
                                                    author: e.target.value
                                                });
                                            }} />
                                        </div>

                                        <div className="form-text media-center__alt">
                                            <Input type="text" label={`Alternative Text`} value={this.state.alt} onChange={e => {
                                                this.setState({
                                                    alt: e.target.value
                                                });
                                            }} />
                                        </div>
                                        {isImage && !isVideo &&
                                            <div className="form-text media-center__focal-point">
                                                <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
                                                    this.setState({
                                                        focalX: 50,
                                                        focalY: 50
                                                    });
                                                }}>
                                                    <i className="fal fa-fw fa-sync"></i>
                                                </button>
                                                {this.state.focalX}%, {this.state.focalY}%
                                            </div>
                                        }
                                    </div>

                                </Column>
                            </>}
                        </Row>
                    </Container>
                </div>

                <footer className="media-center__upload-modal-footer">
                    {this.state.uploaded && <>
                        <a href={url} target="_blank" className="btn btn-secondary">
                            <i className="fa-fw fal fa-external-link"></i> {`Preview`}
                        </a>
                    </>}
                    {!this.state.uploaded && <>&nbsp;</>}
                    <div className="media-center__upload-modal-footer-options">

                        {!this.state.uploaded && <>
                            <button type="button" className="btn btn-primary" onClick={() => {

                                if (this.state.uploadMode == UPLOAD_MULTIPLE && this.state.bulkUploaded) {
                                    window.location.reload(true);
                                } else {
                                    this.cancelUpload();
                                }

                            }}>
                                {`Close`}
                            </button>
                        </>}
                        {this.state.uploaded && <>
                            <button type="button" className="btn btn-outline-primary" onClick={() => this.cancelUpload()}>
                                {`Cancel`}
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => this.saveUpload()}>
                                {`Save`}
                            </button>
                        </>}
                    </div>
                </footer>
            </Modal>
        </>;
    }

    render() {
        var combinedFilter = {};

        if (!combinedFilter.sort && this.state.sort) {
            combinedFilter.sort = this.state.sort;
        }

        if (this.state.searchText && searchFields) {
            var where = [];

            for (var i = 0; i < searchFields.length; i++) {
                var ob = null;

                var field = searchFields[i];
                var fieldNameUcFirst = field.charAt(0).toUpperCase() + field.slice(1);

                if (fieldNameUcFirst == "Id") {
                    if (/^\d+$/.test(this.state.searchText)) {
                        ob = {};
                        ob[fieldNameUcFirst] = {
                            equals: this.state.searchText
                        };
                    }
                } else {
                    ob = {};
                    ob[fieldNameUcFirst] = {
                        contains: this.state.searchText
                    };

                }

                if (ob) {
                    where.push(ob);
                }
            }

            combinedFilter.where = where;
        }

        var selectedCount = this.selectedCount();
        combinedFilter.pageSize = 60;

        return <Default>
            <div className="admin-page">
                <header className="admin-page__subheader">
                    <div className="admin-page__subheader-info">
                        <h1 className="admin-page__title">
                            {`Uploads`}
                        </h1>
                        <ul className="admin-page__breadcrumbs">
                            <li>
                                <a href={'/en-admin/'}>
                                    {`Admin`}
                                </a>
                            </li>
                            <li>
                                {`Uploads`}
                            </li>
                        </ul>
                    </div>
                    {searchFields && <>
                        <Search className="admin-page__search" placeholder={`Search`}
                            onQuery={(where, query) => {
                                this.setState({
                                    searchText: query
                                });
                            }} />
                    </>}
                </header>
                <div className="admin-page__content">
                    <div className="admin-page__internal">
                        <div className="media-center__list">
                            <Loop raw over={'upload/list'} filter={combinedFilter} paged onResults={results => {
                                // Either changed page or loaded for first time - clear bulk selects if there is any.
                                if (this.state.bulkSelections) {
                                    this.setState({ bulkSelections: null });
                                }

                                return results;
                            }}>
                                {this.renderEntry}
                            </Loop>
                        </div>
                        {this.state.confirmDelete && this.renderConfirmDelete(selectedCount)}
                        {this.state.uploadModal && this.renderUploadModal()}
                    </div>
                    <footer className="admin-page__footer">
                        {selectedCount > 0 ? this.renderBulkOptions(selectedCount) : null}
                        <button type="button" className="btn btn-primary" onClick={() => this.showUploadModal(UPLOAD_SINGLE)}>
                            {`Upload`}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => this.showUploadModal(UPLOAD_MULTIPLE)}>
                            {`Bulk upload`}
                        </button>
                    </footer>
                </div>
            </div>
        </Default>;
    }
}