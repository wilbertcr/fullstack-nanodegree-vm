import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

export default class CatalogApp extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {

    }

    render() {
        return (
            <div className="card">
                <div className="content">
                    <img className="ui medium circular bordered image" src={this.props.item.picture}></img>
                    <div className="header">
                        Name: {this.props.item.name}
                    </div>
                    <div className="meta">
                        Price: ${this.props.item.price}
                    </div>
                    <div className="content">
                        Description: {this.props.item.description}
                    </div>
                </div>
                <div className="extra content"
                     style={{display: this.props.login_status.value ? 'inline-block' : 'none'}}>
                    <div className="ui two butons">
                        <div className="ui basic blue button">Edit</div>
                        <div className="ui basic red button">Delete</div>
                    </div>
                </div>
            </div>
        );
    }
}