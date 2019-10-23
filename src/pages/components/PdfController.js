import React from 'react'
import Button from 'react-bootstrap/Button'

class PdfController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Button onClick={this.props.handlePrevClick}> prev </Button>
                <span style={{padding:4+"%"}}>Page {this.props.pageNumber} of {this.props.numPages}</span>
                <Button onClick={this.props.handleNextClick}> next </Button>
            </div>
        );
    }
}

export default PdfController