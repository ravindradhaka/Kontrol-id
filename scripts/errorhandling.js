module.exports = app => {
    app.use(function(req, res, next) {
      let err = new Error('Not Found')
      err.status = 404
      next(err)
    })

    app.use(function(err, req, res, next) {
      res.status(err.status || 500)
      res.format({
        "application/json": () => {
          res.send({
            "error": err.message || err
          })
        },
        "default": () => {
          res.render('error', {
            message: err.message,
            error: {}
          })
        }
      })
    })
}
