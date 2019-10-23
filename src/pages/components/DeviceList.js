import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import { FaDesktop, FaLaptop, FaTabletAlt, FaLink, FaMobileAlt } from 'react-icons/fa'


class DeviceList extends React.Component {
    constructor(props) {
        super(props);
        this.getIcon = this.getIcon.bind(this);
    }

    getIcon(devSize) {
        if (devSize === 'xl') {
            return <FaDesktop size="1.5em" />
        } else if (devSize === 'lg') {
            return <FaLaptop size="1.5em" />
        } else if (devSize === 'md') {
            return <FaTabletAlt size="1.5em" />
        } else if (devSize === 'sm') {
            return <FaMobileAlt size="1.5em" />
        } else {
            return <FaMobileAlt size="1.5em" />
        }
    }

    render() {
        var devlist = this.props.devlist.map((item, key) => {
            if (item.id === this.props.id) {
                return (
                    <ListGroup.Item key={key} active>
                        <span>{this.getIcon(item.size)}      {item.id}</span>
                    </ListGroup.Item>
                )
            } else {
                return (
                    <ListGroup.Item key={key}>
                        <span>{this.getIcon(item.size)}      {item.id}</span>
                    </ListGroup.Item>
                )
            }
        })

        var dropdowndevlist = this.props.devlist.map((item, key) => {
            if (item.id === this.props.id) {
                return (
                    <Dropdown.Item as="li" key={key} active="true">
                        <span>{this.getIcon(item.size)}      {item.id}</span>
                    </Dropdown.Item>
                )
            } else {
                return (
                    <Dropdown.Item as="li" key={key}>
                        <span>{this.getIcon(item.size)}      {item.id}</span>
                    </Dropdown.Item>
                )
            }
        })

        if ((this.props.devSize === 'xl') || (this.props.devSize === 'lg')) {
            return (
                <div className='device-list'>
                    <ListGroup>{devlist}</ListGroup>
                </div>
            )
        } else {
            return (
                <div>
                    <DropdownButton
                        title={
                            <span>
                                <FaLink />
                                <Badge variant="light" dangerouslySetInnerHTML={{
                                    __html: this.props.devnum
                                }}></Badge>
                            </span>
                        } drop={'up'} alignRight>
                        {dropdowndevlist}
                    </DropdownButton>
                </div>
            )
        }
    }
}

export default DeviceList