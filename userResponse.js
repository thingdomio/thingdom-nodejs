/**
 * A class that converts an api response into a simpler user response.
 */

exports.UserResponse = function( apiResponse ) {
    if( typeof apiResponse == 'string' ) {
        this.isSuccess = ( apiResponse.length == 0 ) ? true : false;
        this.message = apiResponse;
    } else {
        this.isSuccess = ( apiResponse.response === 'success' ) ? true : false;
        this.message = apiResponse.msg;
    }
};