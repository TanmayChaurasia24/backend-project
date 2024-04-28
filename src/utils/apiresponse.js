class apiresponse {
    // Constructor method for creating an API response object
    constructor(statuscode, data, message = "success") {
        // Initialize properties of the API response object
        this.statuscode = statuscode; // HTTP status code of the response
        this.data = data; // Data to be included in the response
        this.message = message; // Message associated with the response, defaults to "success"
        this.success = statuscode < 400; // Boolean indicating if the response is successful
    }
}

// Export the apiresponse class to be used by other modules
export { apiresponse };
