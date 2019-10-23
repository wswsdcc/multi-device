import React from 'react'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'

class MyViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ResponsiveEmbed>
                    <iframe src='https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls' width='100%' height='100%' frameborder='1'>
                    </iframe>
                </ResponsiveEmbed>
            </div>
        )
    }
}

export default MyViewer