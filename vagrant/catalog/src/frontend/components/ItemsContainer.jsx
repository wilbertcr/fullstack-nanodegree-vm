import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

export default class ItemsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {

    }

    render() {
        return (
            <div className="ui cards container">
                <div className="card">
                    <div className="content">
                        <img className="left floated tiny ui image" src="/static/images/baseball_glove.jpg"></img>
                        <div className="header">
                            Baseball Glove
                        </div>
                        <div className="meta">
                            $200
                        </div>
                        <div className="description">
                            This is a very expensive baseball glove
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}