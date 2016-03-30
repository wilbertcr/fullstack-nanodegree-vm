import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

export default class GooglePlusSignInButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nonce: $('#root').data("state"),
            logged_in: false,
            user_picture: null
        }
    }

    signInSuccess(googleUser){
        //I need to get the auth2 instance that was initialized.
        var googleAuth = gapi.auth2.getAuthInstance();
        //Now we ask google to give our backend access.
        //grantOfflineAccess makes a promise that
        //gets fulfilled in the "then" and provides us
        //with an authorization response.
        googleAuth.grantOfflineAccess({
            'redirect_uri':'postmessage'
        }).then(function(authResponse){
            //There should be a 'code' in authResponse.
            //we need to send it to the back end.
            if (authResponse['code']){
                $.ajax({
                    type: 'POST',
                    url: "/gconnect?state="+this.state.nonce,
                    processData: false,
                    //We're going to ship that authorization response's code
                    //to the backend.
                    data: authResponse['code'],
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: function(result) {
                        //If the backend can verify it, or if the
                        //user is already logged in, we'll get
                        //a result
                        if(result){
                            console.log(result);
                            var userProfile = googleUser.getBasicProfile();
                            this.setState({...this.state,
                                logged_in:true,
                                user_picture : userProfile.getImageUrl()
                            });
                        } else {
                            console.log("Error");
                            console.log(result);
                        }
                    }.bind(this),
                    error: function(result){
                        console.log("There was a network error")
                        console.log(result);
                    }
                });
            }
        }.bind(this));
    }

    signInFailure(){
        console.log("Something went wrong..")
    }

    signOut(){
        $.ajax({
            type: 'GET',
            url: "/gdisconnect",
            processData: false,
            //We're going to ship that authorization sresponse's code
            //to the backend.
            data: [],
            contentType: 'application/octet-stream; charset=utf-8',
            success: function(result) {
                this.setState({...this.state,
                    logged_in: false});
                var googleAuth = gapi.auth2.getAuthInstance();
                googleAuth.signOut().then(function(resp){
                    console.log(resp);
                });
            }.bind(this),
            error: function(result){
                console.log("There was an error");
            }
        });
    }

    componentDidMount() {
        //Let's get the google api's JS SDK
        $.getScript('https://apis.google.com/js/platform.js').done(
            //Once the script is done loading
            function(){
                //This function initializes the googleAuth
                //object, gets and and attaches the listener
                //to the right button.
                var initSignInV2 = function(){
                    var googleAuth = gapi.auth2.init({
                        'client_id': '487962395938-f923dbtpisv3oq7tivlvu4127g1jlh9m.apps.googleusercontent.com',
                        'cookie_policy': 'single_host_origin',
                        'scope':'openid email'
                    });
                    googleAuth.attachClickHandler(
                        'signInButton',
                        {'scope': 'openid email',
                            'redirect-uri':'postmessage',
                            'accesstype': 'offline'
                        },
                        this.signInSuccess,
                        this.signInFailure
                    );

                }.bind(this);
                //Now we load auth2 and use initSignInV2 as call back,
                //that way we make sure it is called after auth2 has loaded.
                gapi.load('auth2', initSignInV2);
            }.bind(this));
    }

    render() {
        this.props.onChange(this.state.logged_in);
        console.log($('.ui.dropdown').dropdown());
        //console.log(this.state.logged_in);
        return (
            <div className="ui blue top fixed inverted menu"
            style={{height: '76px'}}>
                <div className="right menu">
                    <a className="ui item">
                        <div id="signInButton"
                             className="ui google plus button"
                             style={{display: this.state.logged_in ? 'none' : 'inline-block'}}>
                            <i className="google plus icon"></i>
                            Sign in.
                        </div>
                        <div className="ui dropdown"
                             style={{display: this.state.logged_in ? 'inline-block' : 'none'}}>
                            <img className="ui mini image dropdown"
                                 src={this.state.user_picture}>
                            </img>
                            <div className="ui blue inverted menu">
                                <div className="ui item">
                                    <div id="signOutButton"
                                         className="ui google plus button"
                                         onClick={this.signOut}
                                         style={{display: this.state.logged_in ? 'inline-block' : 'none'}}>
                                        <i className="google plus icon"></i>
                                        Sign out.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}