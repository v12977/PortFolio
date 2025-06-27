class errHandler extends Error {
    constructor(Status,Message) {
        super();
        this.status=Status;
        this.message=Message;
    }
}

module.exports=errHandler;