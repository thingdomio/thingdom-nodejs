/**
 * A class the encapsulates a Thing.
 */
var UserResponse = require( './userResponse' ).UserResponse;
var web = null;
var applicationToken = '';

/**
 * Create a new Thing.
 *
 * @param webService    - A webservice that provides the communication with Thingdom.
 * @param name          - The name of the Thing.
 * @param productType   - (optional) The product type associated with the Thing.
 * @param displayName   - (optional) The display name for the Thing.
 * @param callback      - A callback function that gets invoked with the result of this constructor.
 * @constructor
 */
exports.Thing = function( webService, name, productType, displayName, callback ) {
    web = webService;
    this.id = '';
    this.name = name;
    this.productType = productType;
    this.displayName = displayName;
    this.code = '';

    web.addThing( this, function( result ) {
        callback( result );
    });
};

/**
 * Update a status variable associated with this Thing.
 *
 * @param name          - The status variable name.
 * @param value         - The new value for the status variable.
 * @param unit          - (optional) The unit of measure for the variable.
 * @param callback      - A callback function that gets invoked with the result of the status request.
 *
 * Alternate parameter list.
 *
 * @param statusArray   - An array of status objects: [{name: 'statusName', value: 'statusValue', unit: 'unitOfMeasure'}]
 * @param callback      - Same as above.
 */
exports.Thing.prototype.status = function( name, value, unit, callback) {
    var theThing = this;
    validateStatus( arguments, function( result ) {
       callback = result.callback;

       if( result.isSuccess ) {
           web.addStatus( theThing, result.statusArray, function( result ) {
                callback( new UserResponse( result ) );
           });

       } else {
           if( typeof callback == 'function' ) {
               callback( new UserResponse( result ) );
           } else {
               throw result.msg;
           }
       }
    });
};

/**
 * Add a feed and associate with this Thing.
 *
 * @param category      - The feed category.
 * @param message       - The feed message.
 * @param feedOption    - (optional) An additional option/object to attach to the feed:  icon, image, or progress indicator.
 * @param callback      - A callback function that gets invoked with the result of the feed request.
 */
exports.Thing.prototype.feed = function( category, message, feedOption, callback ) {
    var theThing = this;
    validateFeed( arguments, function( result ) {
        callback = result.callback;

        if( result.isSuccess ) {
            catetory = result.category;
            message = result.message;
            feedOption = result.feedOption;

            web.addFeed( theThing, category, message, feedOption, function( result ) {
                callback( new UserResponse( result ) );
            });

        } else {
            if( typeof callback == 'function' ) {
                callback( new UserResponse( result ) );
            } else {
                throw result.msg;
            }
        }
    });
}

// ****************************************************************************
// Private Helper Methods
// ****************************************************************************

//
// Validate status parameters.
//
var validateStatus = function( statusArgs, callback ) {
    process.nextTick( function() {
        var result = {
            isSuccess:   false,
            msg:         '',
            statusArray: [],
            callback:    null
        };

        var argCount = statusArgs.length;
        if( argCount > 0 ) {
            if( typeof statusArgs[ argCount-1 ] != 'function' ) {
                result.msg = 'Invalid arguments for status update.  Callback is not a function';
            } else {
                result.callback = statusArgs[ argCount-1 ];
            }
        }

        if( argCount <= 1 ) {
            result.msg = 'Missing arguments for status update.  At minimum, status array and callback required.';
        }

        if( argCount >= 2 && argCount <= 4) {
            switch( argCount ) {
                case 2:
                    if( validateStatusArray( statusArgs[0] ) ) {
                        result.statusArray = statusArgs[0];
                    } else {
                        result.msg = 'Invalid arguments for status update.  Error in status array.';
                    }
                    break;
                case 3:
                    result.statusArray.push( { name: statusArgs[0], value: statusArgs[1], unit: ""} );
                    break;
                case 4:
                    result.statusArray.push( { name: statusArgs[0], value: statusArgs[1], unit: statusArgs[2]} );
                    break;
            }
        }
        if( argCount > 4 ) {
            result.msg = 'Too many arguments for status update.  More than 4 detected.';
        }

        result.isSuccess = ( result.msg.length == 0 ) ? true : false;
        callback( result );
    });
}

//
// Validate a status array.  Make sure each entry has a name, value and unit.
//
var validateStatusArray = function( statusArray ) {
    //
    // Make sure status array is a array.
    //
    if( !(statusArray instanceof Array) ) {
        return false;
    }
    //
    // Check each item in array for valid properties (name, value, unit).
    //
    for( var i = 0; i < statusArray.length; i++ ) {
        if( !statusArray[i].hasOwnProperty( 'name' ) || !statusArray[i].hasOwnProperty( 'value' ) ) {
            return false;
        }
        if( !statusArray[i].hasOwnProperty( 'unit' ) ) {
            statusArray[i].unit = '';
        }
    }
    return true;
}

//
// Validate feed parameters.
//
var validateFeed = function( feedArgs, callback ) {
    process.nextTick( function() {
        var result = {
            isSuccess : false,
            msg       : '',
            category  : '',
            message   : '',
            feedOption: null,
            callback  : null
        };

        var argCount = feedArgs.length;
        if( argCount > 0 ) {
            if( typeof feedArgs[ argCount-1 ] != 'function' ) {
                result.msg = 'Invalid arguments for feed.  Callback is not a function.';
            } else {
                result.callback = feedArgs[ argCount-1 ];
            }
        }

        if( argCount <= 2 ) {
            result.msg = 'Missing arguments for feed.  At minimum, category, message and callback are required.';
        }

        if( argCount >= 3 && argCount <= 4 ) {
            switch( argCount ) {
                case 3:
                    result.category = feedArgs[0];
                    result.message = feedArgs[1];
                    break;
                case 4:
                    result.category = feedArgs[0];
                    result.message = feedArgs[1];
                    result.feedOption = feedArgs[2];
                    break;
            }
        }

        if( argCount > 4 ) {
            result.msg = 'Too many arguments for feed.  More than 4 detected.';
        }

        result.isSuccess = ( result.msg.length == 0 ) ? true : false;
        callback( result );
    });
}

