/**
 * Created by Wilbert on 3/30/2016.
 */
/**
 * ApiCall is a wrapper around jQuery.ajax taking a subset of its
 * possible parameters.
 * @param {String} url The url to which the call will be made.
 * @param {String} type One of 'GET','POST','DELETE'...
 * @param {Object} data The payload, one of xml, json, script, or html.
 * @param {String } contentType 'application/x-www-form-urlencoded; charset=UTF-8'
 * @param {boolean} cache Wether to cache responses or not.
 * @param {{result: Object}} onsuccess The function that will be called upon success(don't forget to bind(this) if needed ;))
 * @param {{xhr, status, err}} onerror The function that will be called upon error(don't forget to bind(this) if needed ;))
 */

export default function(options){
    $.ajax(options);
};
