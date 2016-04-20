import React from 'react';
import Component from './Component';
import apiCall from './apiCall';

/**
 * googleAuth2  Sign in/Sign out Button.
 * @class GoogleAuth2
 * */
export default class GoogleAuth2 extends Component {
    /**
     * @constructs GoogleAuth2
     * @param {Object} props - Object passed down to us from our parent.
     * @param {Object} props.onSessionChange - See {@link CatalogApp#onSessionChange}
     * @param {string} props.nonce - See {@link CatalogApp#state}
     * @param {Object} props.updateNonce - See {@link CatalogApp#updateNonce}
     * */
    constructor(props) {
        super(props);
        /**
         *Represents login status
         * @type {Object}
         * @property {{value: true, name: "LoggedIn"}} STATUS.LoggedIn - User is logged in.
         * @property {{value: false, name: "LoggedOut"}} STATUS.LoggedOut - User is logged out.
         * */
        this.STATUS = {
            LoggedIn : {value: true, name: "LoggedIn"},
            LoggedOut : {value: false, name: "LoggedOut"}
        }
        /**
         *Represents the current state.
         * @type {Object}
         * @property {string} state.nonce - The current nonce value.
         * @property {STATUS} state.login_status - The current login status.
         * @property {integer} state.userId - The id received from google.
         * @property {string} state.userName
         * @property {string} state.userEmail
         * @property {string} state.userPicture
         * */
        this.state = {
            loginStatus: this.STATUS.LoggedOut,
            userId: 0,
            userName: "",
            userEmail: "",
            userPicture: null
        }
    }

    /**
     * Listener triggered when a change in the user's login status occurs.
     * @param {boolean} loginState - loginState is true when the state just switched from logged out to logged in and false otherwise.
     * */
    onSessionChange(loginState){
        if(loginState){
            //There's a user logged in.
            var googleAuth = gapi.auth2.getAuthInstance();
            var googleUser = googleAuth.currentUser.get();
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
                    apiCall({
                            url: "/gconnect?state="+this.props.nonce,
                            type: 'POST',
                            data: authResponse['code'],
                            processData: false,
                            //We're going to ship that authorization response's code
                            //to the backend.
                            contentType: 'application/octet-stream; charset=utf-8',
                            success: function (result) {
                                //If the backend can verify it, or if the
                                //user is already logged in, we'll get
                                //a result
                                if(result){
                                    var userProfile = googleUser.getBasicProfile();
                                    this.setState({...this.state,
                                        loginStatus: this.STATUS.LoggedIn,
                                        userPicture : userProfile.getImageUrl(),
                                        userEmail: userProfile.getEmail(),
                                        userName: userProfile.getName(),
                                        userId: userProfile.getId(),
                                    });
                                    this.props.onSessionChange(this.state.loginStatus);
                                }
                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error("Error signing in user.");
                                console.error(xhr, status, err.toString());
                            }.bind(this)
                    },this);
                }
            }.bind(this));
        } else {
            this.setState({...this.state,loginStatus: this.STATUS.LoggedOut});
            this.props.onSessionChange(this.state.loginStatus);
        }
    }

    /**This function is required by google, but I don't need it since I'm already
     * listening to the changes in the session status. Hence it is empty.
     * */
    signInSuccess(googleUser){
        //We're going to let the signin listener deal with this.
    }

    /**
     * Not much to do if things go wrong with google. I'm not implementing a back up login system.
     * */
    signInFailure(reason){
        console.error("Failed to sign in with google.");
        console.error(reason);
    }

    /**
     * This function is called when the sign out button is pressed by the user.
     *
     * */
    signOut(){
        //In production, we wouldn't revoke all permits
        //when a user signs out, however we don't want
        //to let random apps like this with privileges
        //lying around. Hence, we will revoke all permits
        //whenever a user signs out.
        apiCall({
                url: '/gdisconnect?state='+this.props.nonce,
                type: 'GET',
                data: [],
                processData: false,
                //We're going to ship that authorization response's code
                //to the backend.
                success: function(result) {
                    //We have successfully disconnected the user
                    //from the app in the back end.
                    //Now let's get a pointer to google Auth2 Instance.
                    var googleAuth = gapi.auth2.getAuthInstance();
                    //And use it to sign out the front end as well.
                    //Note that I don't change the state here, instead
                    //I let the listener I setup earlier take care of updating the state.
                    googleAuth.signOut();
                    this.setState({...this.state,
                        userPicture : "",
                        userEmail: "",
                        userName: ""
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(xhr);
                    console.error(status);
                    console.error(err.toString());
                }.bind(this)
            },this);
    }

    componentDidMount() {
        //Let's get the google api's JS SDK
        $.getScript('https://apis.google.com/js/platform.js',
            function(){
                var initSignInV2 = function(){
                    //Initialize googleAuth2
                    var googleAuth = gapi.auth2.init({
                        'client_id': '487962395938-f923dbtpisv3oq7tivlvu4127g1jlh9m.apps.googleusercontent.com',
                        'cookie_policy': 'single_host_origin',
                        'scope':'openid email'
                    });
                    googleAuth.isSignedIn.listen(this.onSessionChange);
                    //Attach click handler to the sign in button.
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
            }.bind(this)
        );
    }

    render() {
        /**
         * @todo Implement this without using JQuery.
         * */
        $('.ui.dropdown').dropdown();
        return (
            <div className="ui blue top fixed inverted menu"
                 style={this.state.loginStatus.value ? {height: '54px'}: {} }>
                <div className="right menu">
                    <a className="ui item">
                        <div id="signInButton"
                             className="ui google plus button"
                             style={{display: this.state.loginStatus.value ? 'none' : 'inline-block'}}>
                            <i className="google plus icon"></i>
                            Sign in.
                        </div>
                        <div className="ui dropdown"
                             style={{display: this.state.loginStatus.value ? 'inline-block' : 'none'}}>
                            <img className="ui avatar image dropdown"
                                 src={this.state.userPicture}>
                            </img>
                            <div className="ui inverted menu">
                                <div className="ui item">
                                    <div className="ui red card">
                                        <div className="image">
                                            <img src={this.state.userPicture}>
                                            </img>
                                        </div>
                                        <div className="content">
                                            <div className="header">
                                                {this.state.userName}
                                            </div>
                                            <div className="meta">
                                                {this.state.userEmail}
                                            </div>
                                        </div>
                                        <div className="extra content">
                                            <div className="ui one white button">
                                                <div id="signOutButton"
                                                     className="ui google plus button"
                                                     onClick={this.signOut}
                                                     style={{display: this.state.loginStatus.value ? 'inline-block' : 'none'}}>
                                                    <i className="google plus icon"></i>
                                                    Sign out.
                                                </div>
                                            </div>
                                        </div>
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