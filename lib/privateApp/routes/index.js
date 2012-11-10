exports.index = function(app, req, res) {
  res.render('index', {
    title: "Private App",
    config: app.config
  });
};