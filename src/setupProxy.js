const createProxyMiddleware = require("http-proxy-middleware");

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://kodo-capstone-backend.herokuapp.com";

const webRtcUrl = "https://capstone-kodo-webrtc.herokuapp.com";

module.exports = function(app) {
  app.use(
    createProxyMiddleware("/account", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/course", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/lesson", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/enrolledLesson", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/enrolledCourse", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/studentAttempt", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/quiz", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/stripe", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/tag", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/transaction", {
        target: url,
        changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/quizQuestion", {
      target: url,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware("/kodoSession", {
      target: webRtcUrl,
      changeOrigin: true
    })
  )
};
