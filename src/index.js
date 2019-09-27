import http from "http";
import express from "express";
import console from "chalk-console";
import { ApolloServer } from "apollo-server-express";



const port = process.env.PORT || 8088;

const configureHttpServer = async (httpServer) => {
  console.info("Creating Express app");
  const expressApp = express();
  console.info("Creating Apollo server");
  const { default: resolvers } = await import(/* webpackChunkName: "resolvers" */ './resolvers');
  const { default: typeDefs } = await import(/* webpackChunkName: "typeDefs" */ '././schemas/main.graphql');
  
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });
  apolloServer.applyMiddleware({
    app: expressApp
  });
  console.info("Express app created with Apollo middleware");
  httpServer.on("request", expressApp);
  apolloServer.installSubscriptionHandlers(httpServer);
};

const runServer = async (port) => new Promise(async (resolver, rejector) => {
  if (!process.httpServer) {
    console.info("Creating HTTP server");

    process.httpServer = http.createServer();

    await configureHttpServer(process.httpServer);

    process.httpServer.listen(port, () => resolver(port));
  } else {
    console.info("Reloading HTTP server");
    process.httpServer.removeAllListeners("upgrade");
    process.httpServer.removeAllListeners("request");

    await configureHttpServer(process.httpServer);

    console.info("HTTP server reloaded");
  }
});

runServer(port)
  .then(port => {
    console.info(`HTTP server ready at http://localhost:${port}`);
    console.info(`Websocket server ready at ws://localhost:${port}`);
  })
  .catch(error => console.log);

if (module.hot) {
  module.hot.accept();
}
