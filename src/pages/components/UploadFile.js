import React from 'react';

class UploadFile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:4+'%', marginBottom:4+'%'}}>
                <input type="file" name='file' ref={this.props.fileInput} />
                <input type="button" value="上传" onClick={this.props.upload} />
            </div>
        )
    }
}

export default UploadFile;