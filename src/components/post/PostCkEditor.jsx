import react from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import DecoupledDocumentEditor from '@utils/ckeditor';
import "./PostCkEditor.scss";
import FileListModal from "@components/file/FileListModal";
import React from "react";

class PostCkEditor extends react.Component {
    selectedFile = {}

    constructor(props) {
        super(props);
        this.state = {
            selectType: null,
            selectPromise: null,
            showSelect: false,
            showUpload: false
        }
    }

    selectFilePromise = (fileType) => {
        return new Promise((topResolve, topReject) => {
            this.selectedFile = {};
            new Promise((resolve, reject) => {
                this.setState({
                    selectType: fileType,
                    showSelect: true,
                    selectPromise: resolve
                })
            }).then(result => {
                topResolve(result)
            })
        })
    }


    selectFile = (file) => {
        this.selectedFile = file;
        let selectPromise = this.state.selectPromise
        if (this.selectedFile.path) {
            selectPromise(this.selectedFile);
        } else {
            if (!this.state.showSelect) {
                selectPromise(null);
            }
        }
        this.hideSelect()
    }

    hideSelect = () => {
        this.setState({
            showSelect: false,
            selectPromise: null
        })
    }

    componentWillUnmount() {
    }

    render() {
        let selectFileModal
        if (this.state.showSelect) {
            selectFileModal = <FileListModal fileType={this.state.selectType} upload show={this.state.showSelect}
                                             hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>;
        }
        return (
            <div className="post-ckeditor">
                {selectFileModal}
                <CKEditor
                    editor={DecoupledDocumentEditor}
                    config={{
                        toolbar: {
                            items: [
                                'heading',
                                '|',
                                'fontSize',
                                'fontFamily',
                                'fontColor',
                                'fontBackgroundColor',
                                '|',
                                'bold',
                                'italic',
                                'underline',
                                'strikethrough',
                                '|',
                                'numberedList',
                                'bulletedList',
                                '|',
                                'outdent',
                                'indent',
                                'alignment',
                                '|',
                                'todoList',
                                'link',
                                'blockQuote',
                                'findAndReplace',
                                'insertTable',
                                'insertImage',
                                'insertVideo',
                                'code',
                                'codeBlock',
                                'pageBreak',
                                '|',
                                'undo',
                                'redo',
                                'fullScreen'
                            ]
                        },
                        language: 'zh-cn',
                        video:{
                            onFilePeek: this.selectFilePromise.bind(this, 'video'),
                        },
                        image: {
                            toolbar: [
                                'imageTextAlternative',
                                'imageStyle:inline',
                                'imageStyle:block',
                                'imageStyle:side',
                                'linkImage'
                            ],
                            onFilePeek: this.selectFilePromise.bind(this, 'image'),
                        },
                        table: {
                            contentToolbar: [
                                'tableColumn',
                                'tableRow',
                                'mergeTableCells',
                                'tableCellProperties',
                                'tableProperties'
                            ]
                        },
                        licenseKey: '',
                    }}
                    data={this.props.value}
                    onReady={editor => {
                        editor.ui.getEditableElement().parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement()
                        );
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        this.props.onChange(data)
                    }}
                />
            </div>
        );
    }
}

export default PostCkEditor
