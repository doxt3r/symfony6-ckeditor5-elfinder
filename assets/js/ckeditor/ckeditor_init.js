import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import { Essentials } from '@ckeditor/ckeditor5-essentials/src';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat/src';
import { Bold, Italic, Strikethrough } from '@ckeditor/ckeditor5-basic-styles/src';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote/src';
import { Heading } from '@ckeditor/ckeditor5-heading/src';
import { Link } from '@ckeditor/ckeditor5-link/src';
import { List } from '@ckeditor/ckeditor5-list/src';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph/src';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block/src';
import { Highlight } from '@ckeditor/ckeditor5-highlight/src';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder/src';
import {CKFinderUploadAdapter} from "@ckeditor/ckeditor5-adapter-ckfinder/src";
import {Image, ImageUpload, ImageCaption,
    ImageStyle, ImageResize,
    ImageToolbar} from "@ckeditor/ckeditor5-image/src";
import {Table} from "@ckeditor/ckeditor5-table/src";

// Theme for CKEditor
import "@ckeditor/ckeditor5-theme-lark/theme/theme.css";

//FR  translation for CKeditor
import  "ckeditor5/build/translations/fr";

window.initEditor =  function(elementId, callback) {
    ClassicEditor
        .create( document.querySelector( elementId), {
            language: {
                ui: 'fr',
            },
            plugins: [
                SourceEditing,
                Essentials,
                Autoformat,
                Bold,
                Italic,
                Strikethrough,
                BlockQuote,
                Heading,
                Link,
                List,
                Paragraph,
                Highlight,
                CodeBlock,
                CKFinderUploadAdapter,
                CKFinder,
                Image,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                ImageResize,
                Table,
            ],
            toolbar: [
                // Existing toolbar buttons
                'undo',
                'redo',
                '|',
                'heading',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'insertImage',
                'blockQuote',
                'insertTable',
                'codeBlock', 'sourceEditing'

            ],
            codeBlock: {
                languages: [
                    { language: 'plaintext', label: 'Plain text' }, // The default language.
                    { language: 'c', label: 'C' },
                    { language: 'cs', label: 'C#' },
                    { language: 'cpp', label: 'C++' },
                    { language: 'css', label: 'CSS' },
                    { language: 'diff', label: 'Diff' },
                    { language: 'html', label: 'HTML' },
                    { language: 'java', label: 'Java' },
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'php', label: 'PHP' },
                    { language: 'python', label: 'Python' },
                    { language: 'ruby', label: 'Ruby' },
                    { language: 'typescript', label: 'TypeScript' },
                    { language: 'xml', label: 'XML' }
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells'
                ]
            },
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'toggleImageCaption',
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side'
                ]
            },
        } )
        .then( editor => {
            callback(editor);

            console.log(Array.from( editor.ui.componentFactory.names() ));
        } )
        .catch( error => {
            console.error( error );
        } )

}
