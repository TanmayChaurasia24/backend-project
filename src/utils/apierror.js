class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        error = [],
        stack = ""
    ) {
        super(message); // Calls the Error class constructor with the provided message

        // Initialize properties of the ApiError object
        this.statusCode = statusCode; // HTTP status code of the error
        this.data = null; // Additional data associated with the error (defaults to null)
        this.message = message; // Message associated with the error
        this.success = false; // Boolean indicating if the response is successful (defaults to false)
        this.error = error; // Array containing additional error details (defaults to an empty array)

        // If a stack trace is provided, set the stack property; otherwise, capture the stack trace
        if (stack) {
            this.stack = stack; // Set the stack property to the provided stack trace
        } else {
            Error.captureStackTrace(this, this.constructor); // Capture the stack trace
        }
    }
}

// Export the ApiError class to be used by other modules
export { ApiError };
