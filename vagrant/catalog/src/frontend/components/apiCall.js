
/**
 * Wrapper around Jquery.ajax()
 * @param {Object} options - Options passed down to JQuery.ajax()
 * @param {Object} [context=] - The context(this) from which the function is being called.
 * */
export default function(options,context){
    return new Promise(function(resolve, reject) {

        var nonce = null;
        var updateNonce = null;

        if(!context){
            //If user failed to pass the context(this)
            return console.error("Failed to pass in context");
        } else {
            //The nonce may be in the props or in the state.
            if(context.props && context.props.nonce){
                //If it is in the props.
                nonce = context.props.nonce;
                updateNonce = context.props.updateNonce;
            }
            if(context.state && context.state.nonce){
                //If it is in the state
                nonce = context.state.nonce;
                updateNonce = context.updateNonce;
            }
            if(nonce && updateNonce){
                //If we found the nonce and the function to update it in the context we received.
                //Then we make the ajax call we were asked to do.
                $.ajax(options).done(
                    function(re){
                        //When the ajax call is done.
                        if(re && re.nonce){
                            //If we received a new nonce,
                            //then we update the state.
                            updateNonce(re.nonce);
                            resolve(re);
                        }
                    });
            }
        }
    });
};
