import $ from "jquery/dist/jquery"
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
    ImageStyle,
    ImageToolbar} from "@ckeditor/ckeditor5-image/src";
import {Table} from "@ckeditor/ckeditor5-table/src";

// Theme for CKEditor
import "@ckeditor/ckeditor5-theme-lark/theme/theme.css";

//FR  translation for CKeditor
import  "ckeditor5/build/translations/fr";

//Jquery  UI needed for ElFinder
import 'jquery-ui/dist/jquery-ui.min';
import 'jquery-ui/dist/themes/base/jquery-ui.min.css';
// Elfinder
import  "../../../public/bundles/fmelfinder/js/elfinder.full";

// init Elfinder stuffs
const uploadTargetHash = 'l1_Lw';
const connectorUrl = '/efconnect';
const elFinder = $('<div/>').dialogelfinder({
    // dialog title
    title : 'File Manager',
    // connector URL
    url : connectorUrl,
    // start folder setting
    startPathHash : open? open : void(0),
    // Set to do not use browser history to un-use location.hash
    useBrowserHistory : false,
    // Disable auto open
    autoOpen : false,
    // elFinder dialog width
    width : '80%',
    // set getfile command options
    commandsOptions : {
        getfile: {
            oncomplete : 'close',
            multiple : true
        }
    },
    lang: "fr",
    // Insert in CKEditor when choosing files
    getFileCallback : (files, fm) => {
        let imgs = [];
        fm.getUI('cwd').trigger('unselectall');
        $.each(files, function(i, f) {
            if (f && f.mime.match(/^image\//i)) {
                imgs.push(fm.convAbsUrl(f.url));
            } else {
                editor.execute('link', fm.convAbsUrl(f.url));
            }
        });
        if (imgs.length) {
            insertImages(imgs);
        }
    }
}).elfinder('instance');

//init ckeditor
ClassicEditor
    .create( document.querySelector( '.ckeditor'), {
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

        const ckf = editor.commands.get('ckfinder'),
            fileRepo = editor.plugins.get('FileRepository'),
            ntf = editor.plugins.get('Notification'),
            i18 = editor.locale.t,
            // Insert images to editor window
            insertImages = urls => {
                const imgCmd = editor.commands.get('imageUpload');
                if (!imgCmd.isEnabled) {
                    ntf.showWarning(i18('Could not insert image at the current position.'), {
                        title: i18('Inserting image failed'),
                        namespace: 'ckfinder'
                    });
                    return;
                }
                editor.execute('imageInsert', { source: urls });
            },
            // To get elFinder instance
            getfm = open => {
                return new Promise((resolve, reject) => {
                    // Execute when the elFinder instance is created
                    const done = () => {
                        if (open) {
                            // request to open folder specify
                            if (!Object.keys(_fm.files()).length) {
                                // when initial request
                                _fm.one('open', () => {
                                    _fm.file(open)? resolve(_fm) : reject(_fm, 'errFolderNotFound');
                                });
                            } else {
                                // elFinder has already been initialized
                                new Promise((res, rej) => {
                                    if (_fm.file(open)) {
                                        res();
                                    } else {
                                        // To acquire target folder information
                                        _fm.request({cmd: 'parents', target: open}).done(e =>{
                                            _fm.file(open)? res() : rej();
                                        }).fail(() => {
                                            rej();
                                        });
                                    }
                                }).then(() => {
                                    // Open folder after folder information is acquired
                                    _fm.exec('open', open).done(() => {
                                        resolve(_fm);
                                    }).fail(err => {
                                        reject(_fm, err? err : 'errFolderNotFound');
                                    });
                                }).catch((err) => {
                                    reject(_fm, err? err : 'errFolderNotFound');
                                });
                            }
                        } else {
                            // show elFinder manager only
                            resolve(_fm);
                        }
                    };

                    // Check elFinder instance
                    if (_fm) {
                        // elFinder instance has already been created
                        done();
                    } else {
                        // To create elFinder instance
                        _fm = elFinder;
                        done();
                    }
                });
            };

        // elFinder instance
        let _fm;

        if (ckf) {
            // Take over ckfinder execute()
            ckf.execute = () => {
                getfm().then(fm => {
                    fm.getUI().dialogelfinder('open');
                });
            };
        }

        // Make uploader
        const uploder = function(loader) {
            let upload = function(file, resolve, reject) {
                getfm(uploadTargetHash).then(fm => {
                    let fmNode = fm.getUI();
                    fmNode.dialogelfinder('open');
                    fm.exec('upload', {files: [file], target: uploadTargetHash}, void(0), uploadTargetHash)
                        .done(data => {
                            if (data.added && data.added.length) {
                                fm.url(data.added[0].hash, { async: true }).done(function(url) {
                                    resolve({
                                        'default': fm.convAbsUrl(url)
                                    });
                                    fmNode.dialogelfinder('close');
                                }).fail(function() {
                                    reject('errFileNotFound');
                                });
                            } else {
                                reject(fm.i18n(data.error? data.error : 'errUpload'));
                                fmNode.dialogelfinder('close');
                            }
                        })
                        .fail(err => {
                            const error = fm.parseError(err);
                            reject(fm.i18n(error? (error === 'userabort'? 'errAbort' : error) : 'errUploadNoFiles'));
                        });
                }).catch((fm, err) => {
                    const error = fm.parseError(err);
                    reject(fm.i18n(error? (error === 'userabort'? 'errAbort' : error) : 'errUploadNoFiles'));
                });
            };

            this.upload = function() {
                return new Promise(function(resolve, reject) {
                    if (loader.file instanceof Promise || (loader.file && typeof loader.file.then === 'function')) {
                        loader.file.then(function(file) {
                            upload(file, resolve, reject);
                        });
                    } else {
                        upload(loader.file, resolve, reject);
                    }
                });
            };
            this.abort = function() {
                _fm && _fm.getUI().trigger('uploadabort');
            };
        };

        // Set up image uploader
        fileRepo.createUploadAdapter = loader => {
            return new uploder(loader);
        };

        console.log(Array.from( editor.ui.componentFactory.names() ));
    } )
    .catch( error => {

        console.error( error );
    } );
