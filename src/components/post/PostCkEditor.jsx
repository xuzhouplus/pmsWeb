import react from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import DecoupledDocumentEditor from '@utils/ckeditor';
import "./PostCkEditor.scss";

class PostCkEditor extends react.Component {
    selectedFile = {}

    selectFileInterval = null

    config = {
        toolbar: {
            items: [
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                '|',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'alignment',
                '|',
                'numberedList',
                'bulletedList',
                '|',
                'outdent',
                'indent',
                '|',
                'todoList',
                'link',
                'blockQuote',
                'findAndReplace',
                'insertTable',
                'mediaEmbed',
                'imageInsert',
                'code',
                'codeBlock',
                'pageBreak',
                '|',
                'undo',
                'redo'
            ]
        },
        language: 'zh-cn',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                'linkImage'
            ]
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
    }

    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
            showUpload: false
        }
    }

    selectFilePromise = () => {

    }

    selectFile = (file) => {
        this.selectedFile = file;
        this.hideSelect()
    }

    hideSelect = () => {
        this.setState({
            showSelect: false
        })
    }

    componentWillUnmount() {
        if (this.selectFileInterval) {
            clearInterval(this.selectFileInterval)
        }
    }

    render() {
        return (
            <div className="post-ckeditor">
                <CKEditor
                    editor={DecoupledDocumentEditor}
                    config={this.config}
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