router.get('/', (req, res) => {
    db.validations.find({}, (err, validations) => {
        if(err) {
            logError(err);
            res.status(500).res('Sorry, internal server error occurred. (500)');
        } else {
            res.send(validations);
        }
    })
});
