
/**
 * Wrapper around Jquery.ajax()
 * @param {Object} options - Options passed down to JQuery.ajax()
 * @param {Object} [context=] - The context(this) from which the function is being called.
 * */
export default function(options,context){
    var nonce = null;
    var updateNonce = null;
    //
    if(!context){
        return console.error("Failed to pass in context");
    } else {
        if(context.props && context.props.nonce){
            console.log("Nonce in is in props: "+context.props.nonce);
            nonce = context.props.nonce;
            updateNonce = context.props.updateNonce;
        }
        if(context.state && context.state.nonce){
            console.log("Nonce in is in state: "+context.state.nonce);
            nonce = context.state.nonce;
            updateNonce = context.updateNonce;
        }
        if(nonce && updateNonce){
            $.ajax(options).done(function(re){
                if(re && re.nonce){
                    console.log("Nonce out:  ")
                    console.log(re.nonce);
                    updateNonce(re.nonce);
                }
            });
        }
    }
};
