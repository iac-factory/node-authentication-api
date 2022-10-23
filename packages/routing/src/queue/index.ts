import Router, { X, Endpoint, Schema } from "./definition";
import { Default } from "@iac-factory/api-authentication-services";

Router.get(Endpoint.route, async (request, response) => {
    response.status(X["X-Default-Response"]);

    const headers = {
        "X-Polling-Interval": 5000
    }

    response.send({ message: "..." });
});

const Information = Default.Response();
Router.all(Endpoint.route, async (request, response) => {
    Information.evaluate(Endpoint.route, response);
});

export default Router;
