/**
 * The top level class that provides the Thingdom API.
 */
var WebService   = require( './webService' ).WebService;
var Thing        = require( './thing' ).Thing;
var UserResponse = require( './userResponse' ).UserResponse;

var webService = null;
var applicationToken = '';

/**
 * Create and return an instance of the Thingdom API.
 *
 * @param appSecret - A secret identifier for the application.
 * @param callback  - A callback function that gets invoked with the request results.
 * @constructor
 */
exports.Thingdom = function ( appSecret, callback ) {
    //
    // Create web service and authorize application.
    //
    webService = new WebService( appSecret );
    webService.getAuthorization( function( result ) {
        //
        // Store application token and invoke callback.  If authorization was unsuccessful, then token
        // will be undefined.
        //
        applicationToken = result.application_token;
        callback( new UserResponse( result ) );
    });
};

/**
 * Retrieve a "Thing" that represents a Thingdom enabled object with a default display name.
 * If not found, then create one.
 *
 * @param name        - The name of the "Thing".
 * @param productType - An optional product type for the "Thing".  If you want to use your company's default
 *                      product type, set this parameter to "default".
 * @param displayName - An optional display name for the "Thing".
 * @param callback    -
 */
exports.Thingdom.prototype.getThing = function ( name, productType, displayName, callback ) {
    validateGetThing( arguments, function( result ) {
        callback = result.callback;

        if( result.isSuccess ) {
            name = result.name;
            productType = result.productType;
            displayName = result.displayName;

            var thing = new Thing( webService, name, productType, displayName, function( result ) {
                thing.id = result.thing_id;
                thing.code = result.code;
                callback( thing, new UserResponse( result ) )
            });

        } else {
            if( typeof callback == 'function' ) {
                callback( null, new UserResponse( result ) );
            } else {
                throw result.msg;
            }
        }
    });
};

// ****************************************************************************
// Private Helper Methods
// ****************************************************************************

//
// Validate getThing parameters.
//
var validateGetThing = function( getThingArgs, callback ) {
    process.nextTick( function() {
        var result = {
            isSuccess  : false,
            msg        : '',
            name       : '',
            productType: '',
            displayName: '',
            callback   : null
        };

        var argCount = getThingArgs.length;
        if( argCount > 0 ) {
            if( typeof getThingArgs[ argCount-1 ] != 'function' ) {
                result.msg = 'Invalid arguments for getThing.  Callback is not a function.';
            } else {
                result.callback = getThingArgs[argCount - 1];
            }
        }

        if( argCount <= 1 ) {
            result.msg = 'Missing arguments for getThing.  At minimum, name and callback are required.';
        }

        if( argCount >= 2  && argCount <= 4 ) {
            switch( argCount ) {
                case 2:
                    result.name = getThingArgs[0];
                    break;
                case 3:
                    result.name = getThingArgs[0];
                    result.productType = getThingArgs[1];
                    break;
                case 4:
                    result.name = getThingArgs[0];
                    result.productType = getThingArgs[1];
                    result.displayName = getThingArgs[2];
                    break;
            }
        }

        if( argCount > 4 ) {
            result.msg = 'Too many arguments for getThing.  Greater than 4 detected.'
        }

        result.isSuccess = ( result.msg.length == 0 ) ? true : false;
        callback( result );
    });
};