/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import DecoupledDocumentEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';
import InsertImage from "@utils/ckeditor/InsertImage";
import InsertVideo from "@utils/ckeditor/InsertVideo";
import FullScreen from "@utils/ckeditor/FullScreen";
import {MediaEmbed} from "@ckeditor/ckeditor5-media-embed";

class Editor extends DecoupledDocumentEditor {
}

// Plugins to include in the build.
Editor.builtinPlugins = [
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Image,
    ImageCaption,
    InsertImage,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    Strikethrough,
    Table,
    TableCellProperties,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    WordCount,
    InsertVideo,
    MediaEmbed,
    FullScreen
];
(function (t) {
    const e = t["zh-cn"] = t["zh-cn"] || {};
    e.dictionary = Object.assign(e.dictionary || {}, {
        "%0 of %1": "第 %0 步，共 %1 步",
        "Align cell text to the bottom": "使单元格文本对齐到底部",
        "Align cell text to the center": "使单元格文本水平居中",
        "Align cell text to the left": "使单元格文本左对齐",
        "Align cell text to the middle": "使单元格文本垂直居中",
        "Align cell text to the right": "使单元格文本右对齐",
        "Align cell text to the top": "使单元格文本对齐到顶部",
        "Align center": "居中对齐",
        "Align left": "左对齐",
        "Align right": "右对齐",
        "Align table to the left": "使表格左对齐",
        "Align table to the right": "使表格右对齐",
        Alignment: "对齐",
        Aquamarine: "海蓝色",
        Background: "背景",
        Big: "大",
        Black: "黑色",
        "Block quote": "块引用",
        Blue: "蓝色",
        Bold: "加粗",
        Border: "边框",
        "Break text": "",
        "Bulleted List": "项目符号列表",
        "Bulleted list styles toolbar": "项目符号列表样式工具条",
        Cancel: "取消",
        "Cannot upload file:": "无法上传的文件：",
        "Cell properties": "单元格属性",
        "Center table": "表格居中",
        "Centered image": "图片居中",
        "Change image text alternative": "更改图片替换文本",
        "Choose heading": "标题类型",
        Circle: "空心圆点",
        Color: "颜色",
        "Color picker": "颜色选择器",
        Column: "列",
        "Could not insert image at the current position.": "无法在当前位置插入图片",
        "Could not obtain resized image URL.": "无法获取重设大小的图片URL",
        Dashed: "虚线",
        Decimal: "阿拉伯数字",
        "Decimal with leading zero": "前导零阿拉伯数字",
        "Decrease indent": "减少缩进",
        Default: "默认",
        "Delete column": "删除本列",
        "Delete row": "删除本行",
        "Dim grey": "暗灰色",
        Dimensions: "尺寸",
        Disc: "实心圆点",
        "Document colors": "文档中的颜色",
        Dotted: "点状虚线",
        Double: "双线",
        Downloadable: "可下载",
        "Dropdown toolbar": "下拉工具栏",
        "Edit block": "编辑框",
        "Edit link": "修改链接",
        "Editor toolbar": "编辑器工具栏",
        "Enter image caption": "输入图片标题",
        "Font Background Color": "字体背景色",
        "Font Color": "字体颜色",
        "Font Family": "字体",
        "Font Size": "字体大小",
        "Full size image": "图片通栏显示",
        Green: "绿色",
        Grey: "灰色",
        Groove: "凹槽边框",
        "Header column": "标题列",
        "Header row": "标题行",
        Heading: "标题",
        "Heading 1": "标题 1",
        "Heading 2": "标题 2",
        "Heading 3": "标题 3",
        "Heading 4": "标题 4",
        "Heading 5": "标题 5",
        "Heading 6": "标题 6",
        Height: "高度",
        "Horizontal text alignment toolbar": "水平文本对齐工具栏",
        Huge: "极大",
        "Image resize list": "图片大小列表",
        "Image toolbar": "图片工具栏",
        "image widget": "图像小部件",
        "In line": "",
        "Increase indent": "增加缩进",
        "Insert column left": "左侧插入列",
        "Insert column right": "右侧插入列",
        "Insert image": "插入图像",
        "Insert image or file": "插入图片或文件",
        "Insert media": "插入媒体",
        "Insert paragraph after block": "在后面插入段落",
        "Insert paragraph before block": "在前面插入段落",
        "Insert row above": "在上面插入一行",
        "Insert row below": "在下面插入一行",
        "Insert table": "插入表格",
        "Inserting image failed": "插入图片失败",
        Inset: "凹边框",
        Italic: "倾斜",
        Justify: "两端对齐",
        "Justify cell text": "对齐单元格文本",
        "Left aligned image": "图片左侧对齐",
        "Light blue": "浅蓝色",
        "Light green": "浅绿色",
        "Light grey": "浅灰色",
        Link: "超链接",
        "Link URL": "链接网址",
        "List properties": "",
        "Lower-latin": "小写拉丁字母",
        "Lower–roman": "小写罗马数字",
        "Media URL": "媒体URL",
        "media widget": "媒体小部件",
        "Merge cell down": "向下合并单元格",
        "Merge cell left": "向左合并单元格",
        "Merge cell right": "向右合并单元格",
        "Merge cell up": "向上合并单元格",
        "Merge cells": "合并单元格",
        Next: "下一步",
        None: "无",
        "Numbered List": "项目编号列表",
        "Numbered list styles toolbar": "项目编号列表样式工具条",
        "Open in a new tab": "在新标签页中打开",
        "Open link in new tab": "在新标签页中打开链接",
        Orange: "橙色",
        Original: "原始大小",
        Outset: "凸边框",
        Padding: "内边距",
        Paragraph: "段落",
        "Paste the media URL in the input.": "在输入中粘贴媒体URL",
        Previous: "上一步",
        Purple: "紫色",
        Red: "红色",
        Redo: "重做",
        "Remove color": "移除颜色",
        "Resize image": "调整图像大小",
        "Resize image to %0": "调整图像大小为%0",
        "Resize image to the original size": "调整图像大小为原始大小",
        "Restore default": "恢复默认",
        "Reversed order": "",
        "Rich Text Editor": "富文本编辑器",
        "Rich Text Editor, %0": "富文本编辑器， %0",
        Ridge: "垄状边框",
        "Right aligned image": "图片右侧对齐",
        Row: "行",
        Save: "保存",
        "Select all": "全选",
        "Select column": "选择列",
        "Select row": "选择行",
        "Selecting resized image failed": "选择重设大小的图片失败",
        "Show more items": "显示更多",
        "Side image": "图片侧边显示",
        Small: "小",
        Solid: "实线",
        "Split cell horizontally": "横向拆分单元格",
        "Split cell vertically": "纵向拆分单元格",
        Square: "实心方块",
        "Start at": "",
        "Start index must be greater than 0.": "",
        Strikethrough: "删除线",
        Style: "样式",
        "Table alignment toolbar": "表格对齐工具栏",
        "Table cell text alignment": "表格单元格中的文本水平对齐",
        "Table properties": "表格属性",
        "Table toolbar": "表格工具栏",
        "Text alignment": "对齐",
        "Text alignment toolbar": "对齐工具栏",
        "Text alternative": "替换文本",
        'The color is invalid. Try "#FF0000" or "rgb(255,0,0)" or "red".': '颜色无效。尝试使用"#FF0000"、"rgb(255,0,0)"或者"red"。',
        "The URL must not be empty.": "URL不可以为空。",
        'The value is invalid. Try "10px" or "2em" or simply "2".': "无效值。尝试使用“10px”、“2ex”或者只写“2”。",
        "This link has no URL": "此链接没有设置网址",
        "This media URL is not supported.": "不支持此媒体URL。",
        Tiny: "极小",
        "Tip: Paste the URL into the content to embed faster.": "提示：将URL粘贴到内容中可更快地嵌入",
        "To-do List": "待办列表",
        "Toggle caption off": "",
        "Toggle caption on": "",
        "Toggle the circle list style": "切换空心原点列表样式",
        "Toggle the decimal list style": "切换阿拉伯数字列表样式",
        "Toggle the decimal with leading zero list style": "切换前导零阿拉伯数字列表样式",
        "Toggle the disc list style": "切换实心原点列表样式",
        "Toggle the lower–latin list style": "切换小写拉丁字母列表样式",
        "Toggle the lower–roman list style": "切换小写罗马数字列表样式",
        "Toggle the square list style": "切换实心方块列表样式",
        "Toggle the upper–latin list style": "切换大写拉丁字母列表样式",
        "Toggle the upper–roman list style": "切换大写罗马数字列表样式",
        Turquoise: "青色",
        Underline: "下划线",
        Undo: "撤销",
        Unlink: "取消超链接",
        "Upload failed": "上传失败",
        "Upload in progress": "正在上传",
        "Upper-latin": "大写拉丁字母",
        "Upper-roman": "大写罗马数字",
        "Vertical text alignment toolbar": "垂直文本对齐工具栏",
        White: "白色",
        "Widget toolbar": "小部件工具栏",
        Width: "宽度",
        "Wrap text": "",
        Yellow: "黄色",
        "Exit Full Screen": "退出全屏",
        "Enter Full Screen": "全屏"
    });
    e.getPluralForm = function (t) {
        return 0
    }
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
export default Editor;
