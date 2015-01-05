/**
 * A class that encapsulates the web services needed by the Node JS wrapper.
 */
var HttpHelper = require( './httpHelper' ).HttpHelper;

var httpHelper = null;
var deviceSecret = 'none';
var apiSecret = '';
var applicationToken = '';

/**
 *
 * @param secret - A secret identifier for an application obtained by the user during the registration process.
 *                 Without this, the app will not have access to Thingdom.
 * @constructor
 */
exports.WebService = function ( secret ) {
    httpHelper = new HttpHelper();
    apiSecret = secret;
};

/**
 * Ping Thingdom.
 */
exports.WebService.prototype.pingServer = function ( callback ) {
    httpHelper.getData( 'ping', function ( result ) {
        callback( result );
    } );
};

/**
 * Authorize this application by sending the application secret to Thingdom.  If valid, Thingdom will send back a token
 * which must be used for subsequent communications.
 *
 * @param callback - A callback function that gets invoked with the request results.
 */
exports.WebService.prototype.getAuthorization = function( callback ) {
    //
    // Authorization request object.
    //
    var data = {
        api_secret: apiSecret,
        device_secret: deviceSecret
    };
    //
    // Post authorization request.  Save local copy of application token.
    //
    httpHelper.postData( 'token', data, function( result ) {
        applicationToken = result.application_token;
        callback( result );
    });
}

/**
 * Retrieve a thing, if it doesn't exist then add it.
 *
 * @param thing     - The thing to get/add.
 * @param callback  - A callback function that gets invoked with the request results.
 */
exports.WebService.prototype.addThing = function( thing, callback ) {
    //
    // Thing request object.
    //
    var data = {
        token       : applicationToken,
        name        : thing.name,
        display_name: thing.displayName
    };
    //
    // Only post product type if it exists.
    //
    if( thing.productType.length > 0 ) {
        data.product_type = thing.productType;
    }
    //
    // Post thing request.
    //
    httpHelper.postData( 'thing', data, function( result ) {
        callback( result );
    });
};

/**
 * Update a status variable associated with a Thing.
 *
 * @param thing         - The Thing for which status is being updated.
 * @param statusArray   - An array of status updates.
 * @param callback      - A callback function that gets invoked with the request results.
 */
exports.WebService.prototype.addStatus = function( thing, statusArray, callback ) {
    //
    // Status request object.
    //
    var data = {
        token       : applicationToken,
        thing_id    : thing.id,
        id          : null,
        status_array: statusArray
    };
    //
    // Post status request.
    //
    httpHelper.postData( 'status', data, function( result ) {
        callback( result );
    });
};

/**
 * Add a feed that is associated with a Thing.
 *
 * @param thing         - The Thing associated with the feed.
 * @param category      - The feed category which is defined during the registration process.
 * @param message       - A feed message.
 * @param feedOption    - (optional) An additional option/object to attach to the feed:  icon, image, or progress indicator.
 * @param callback      - A callback function that gets invoked with the request results.
 */
exports.WebService.prototype.addFeed = function( thing, category, message, feedOption, callback ) {
    //
    // Feed request object.
    //
    var data = {
        token        : applicationToken,
        thing_id     : thing.id,
        feed_category: category,
        message      : message,
        options      : feedOption
    };
    //
    // Post feed request.
    //
    httpHelper.postData( 'feed', data, function( result ) {
        callback( result );
    });

};
