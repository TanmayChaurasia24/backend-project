class apiresponse {
    constructor(statuscode, data, message = "sucess") {
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
        this.sucess = = statusCode < 400
    }
}
module.exports = apiresponse;
