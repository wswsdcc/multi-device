import React from 'react'
import DeviceList from './components/DeviceList'
import PdfViewer from './components/PdfViewer'
import PdfController from './components/PdfController'
import UploadFile from './components/UploadFile'
import FileList from './components/FileList'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// var pdfurl = require('../../public/test.pdf')

const socket = require('socket.io-client')();

var bigScreen = window.matchMedia('(min-width:1200px)');
var normalScreen = window.matchMedia('(min-width:992px)');
var smallScreen = window.matchMedia('(min-width:768px)');
var miniScreen = window.matchMedia('(min-width:576px)');

var pdfWidth = 200;
var deviceSize = undefined;
if (bigScreen.matches) {
    console.log("超大屏幕(>=1200)");
    pdfWidth = 800;
    deviceSize = 'xl';
} else if (normalScreen.matches) {
    console.log("大屏幕(>=992&<=1200)");
    pdfWidth = 700;
    deviceSize = 'lg';
} else if (smallScreen.matches) {
    console.log("中等屏幕(>=768&<=992)");
    pdfWidth = 680;
    deviceSize = 'md';
} else if (miniScreen.matches) {
    console.log("小屏幕(>=576&<=768)");
    pdfWidth = 480;
    deviceSize = 'sm';
} else {
    console.log("超小屏幕(<=576)");
    pdfWidth = 350;
    deviceSize = 'xs';
}

class Slides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: "",
            id: "",
            size: "",
            devs: [],
            numPages: null,
            pageNumber: 1,
            filelist: [],
            pdfurl: 'http://192.168.2.31:8080/uploads/test.pdf'
        }
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.fileInput = React.createRef();
        this.upload = this.upload.bind(this);
        this.viewFile = this.viewFile.bind(this);
    }

    componentDidMount() {
        var that = this;
        socket.on("connect", function () {
            socket.emit('user ready', { deviceSize: deviceSize });
            that.setState({ size: deviceSize })
        });
        socket.on("deviceid", function (data) {
            console.log(data)
            that.setState({ id: data.id });
        })
        socket.on("userlist", function (data) {
            console.log("devicelist change");
            var connDevs = [];
            for (var key in data.connDevs) {
                var item = data.connDevs[key];
                connDevs.push(item)
            }
            that.setState({ devs: connDevs });
        });
        socket.on("filelist", function (data) {
            console.log(data);
            var old = that.state.filelist
            that.setState({ filelist: [...old, ...data.filelist] })
        });
        socket.on("pageTurning", function (curPage) {
            console.log(curPage)
            that.setState({ pageNumber: curPage });
        });
        socket.on("fileViewChange", function (data) {
            console.log(data);
            that.setState({ pdfurl: data.pdfurl, pageNumber: data.pagenumber })
        })
    }

    onDocumentLoadSuccess(proxy) {
        console.log(proxy);
        this.setState({ numPages: proxy._pdfInfo.numPages });
    }

    handlePrevClick() {
        if (this.state.pageNumber > 1) {
            var old = this.state.pageNumber;
            this.setState({ pageNumber: old - 1 });
            socket.emit("pageTurning", this.state.pageNumber - 1);
        }
    }

    handleNextClick() {
        if (this.state.pageNumber < this.state.numPages) {
            var old = this.state.pageNumber;
            this.setState({ pageNumber: old + 1 });
            socket.emit("pageTurning", this.state.pageNumber + 1);
        }
    }

    upload() {
        var that = this;
        const data = new FormData();
        var fileObj = that.fileInput.current.files[0];
        data.append('file', fileObj);  //相当于 input:file 中的name属性
        fetch('http://192.168.2.31:8080/file/upload', {
            method: 'POST',
            body: data
        }).then(function (response) {
            if (response.status == 200) {

            } else {
                console.log(response)
            }
        })
    }

    viewFile(e) {
        console.log(e.target.innerHTML);
        var filename = e.target.innerHTML;
        this.setState({ pdfurl: 'http://192.168.2.31:8080/uploads/' + filename, pageNumber: 1 });
        socket.emit("fileViewChange", { pdfurl: 'http://192.168.2.31:8080/uploads/' + filename, pagenumber: 1 });
    }

    render() {
        if ((deviceSize === 'xl') || (deviceSize === 'lg')) {
            return (
                <div>
                    <Container fluid={true}>
                        <Row>
                            <Col xs={8} sm={8}>
                                <PdfViewer file={this.state.pdfurl} onDocumentLoadSuccess={this.onDocumentLoadSuccess}
                                    pageNumber={this.state.pageNumber} width={pdfWidth}>
                                </PdfViewer>
                            </Col>
                            <Col xs={4} sm={4}>
                                <Row>
                                    <DeviceList devlist={this.state.devs} id={this.state.id} devSize={this.state.size}></DeviceList>
                                </Row>
                                <Row>
                                    <UploadFile fileInput={this.fileInput} upload={this.upload} />
                                </Row>
                                <Row>
                                    <FileList filelist={this.state.filelist} viewFile={this.viewFile}></FileList>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <PdfController handleNextClick={this.handleNextClick} handlePrevClick={this.handlePrevClick}
                                    numPages={this.state.numPages} pageNumber={this.state.pageNumber}>
                                </PdfController>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (
                <div>
                    <Container fluid={true}>
                        <Row>
                            <PdfViewer file={this.state.pdfurl} onDocumentLoadSuccess={this.onDocumentLoadSuccess}
                                pageNumber={this.state.pageNumber} width={pdfWidth}>
                            </PdfViewer>
                        </Row>
                        <Row>
                            <Col xs={10} sm={10}>
                                <PdfController handleNextClick={this.handleNextClick} handlePrevClick={this.handlePrevClick}
                                    numPages={this.state.numPages} pageNumber={this.state.pageNumber}>
                                </PdfController>
                            </Col>
                            <Col xs={2} sm={2}>
                                <DeviceList devlist={this.state.devs} id={this.state.id} devSize={this.state.size}
                                    devnum={this.state.devs.length}></DeviceList>
                            </Col>
                        </Row>
                        <Row>
                            <FileList filelist={this.state.filelist} viewFile={this.viewFile}></FileList>
                        </Row>
                    </Container>
                </div>
            )
        }

    }
}

export default Slides