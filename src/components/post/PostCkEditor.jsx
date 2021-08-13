import react from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import Editor from '@utils/ckeditor';

class PostCkEditor extends react.Component {
    render() {
        return (
            <div className="post-ckeditor">
                <CKEditor
                    onReady={editor => {
                        console.log('Editor is ready to use!', editor);
                        // Insert the toolbar before the editable area.
                        editor.ui.getEditableElement().parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement()
                        );

                        this.editor = editor;
                    }}
                    onError={({willEditorRestart}) => {
                        // If the editor is restarted, the toolbar element will be created once again.
                        // The `onReady` callback will be called again and the new toolbar will be added.
                        // This is why you need to remove the older toolbar.
                        if (willEditorRestart) {
                            this.editor.ui.view.toolbar.element.remove();
                        }
                    }}
                    onChange={(event, editor) => console.log({event, editor})}
                    editor={Editor}
                    data="<p>Hello from CKEditor 5's decoupled editor!</p>"
                    config={{
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
                                'imageUpload',
                                'insertTable',
                                'mediaEmbed',
                                'codeBlock',
                                'code',
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
                                'imageStyle:side'
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
                    }}
                />
            </div>
        );
    }
}

export default PostCkEditor