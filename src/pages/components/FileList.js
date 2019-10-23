import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

class FileList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var filelist = this.props.filelist.map((item, key) => {
            var index1 = item.lastIndexOf("\\")
            var index2 = item.length
            var filename = item.substring(index1 + 1, index2)
            if (item === "test.pdf") {
                return (
                    <ListGroup.Item key={key} as="a" onClick={this.props.viewFile} href={'#' + key} active>
                        {filename}
                    </ListGroup.Item>
                )
            } else {
                return (
                    <ListGroup.Item key={key} as="a" onClick={this.props.viewFile} href={'#' + key}>
                        {filename}
                    </ListGroup.Item>
                )
            }
            
        })

        return (
            <div style={{ marginTop: 4 + '%', marginBottom: 4 + '%' }}>
                <ListGroup>{filelist}</ListGroup>
            </div >
        )
    }
}

export default FileList;