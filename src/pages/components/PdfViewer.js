import React from 'react'
import { Page } from 'react-pdf'
import { Document } from 'react-pdf/dist/entry.webpack'

class PdfViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Document file={this.props.file} onLoadSuccess={this.props.onDocumentLoadSuccess}>
                    <Page width={this.props.width} scale={1} pageNumber={this.props.pageNumber} renderAnnotationLayer={false} />
                </Document>
            </div>
        );
    }
}

export default PdfViewer