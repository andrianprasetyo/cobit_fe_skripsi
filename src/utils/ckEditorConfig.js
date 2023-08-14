const config = {
  language: 'en',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'blockQuote',
      'undo',
      'redo'
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
  }
  // image: {
  //   toolbar: [
  //     "imageStyle:full",
  //     "imageStyle:side",
  //     "|",
  //     "imageTextAlternative"
  //   ]
  // },
}

export const noConfigMenu = {
  language: 'en',
  // image: {
  //   toolbar: [
  //     "imageTextAlternative",
  //     "imageStyle:inline",
  //     "imageStyle:block",
  //     "imageStyle:side",
  //     "linkImage",
  //   ],
  // },
  // table: {
  //   contentToolbar: [
  //     "tableColumn",
  //     "tableRow",
  //     "mergeTableCells",
  //     "tableCellProperties",
  //     "tableProperties",
  //   ],
  // },
  isReadOnly: true
}

export default config
