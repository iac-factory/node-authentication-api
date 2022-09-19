import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Users.Paginate" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/users/pagination" } as const;

export const X = {
    "X-Default-Response": 200
}

export default Router.update( {
    [ Endpoint.route ]: {
        summary:     "API Endpoints",
        description: "REST Responses",
        post:        {
            responses: {
                "200": {
                    description: "... Description",
                    headers:     {},
                    content:     {
                        "Application/JSON": {
                            schema: {
                                type:    "object",
                                example: {
                                    "users": [
                                        {
                                            "id":           "f8a34fdc-0001-4619-91de-cc6c207fbd4d",
                                            "email":        "administrator@internal.io",
                                            "description":  "Quam explicabo ipsa quo ratione doloribus debitis.",
                                            "avatar":       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1174.jpg",
                                            "comment":      [
                                                "circuit",
                                                "exploit",
                                                "CFA"
                                            ],
                                            "username":     "administrator",
                                            "rotation":     "2022-09-14T07:44:45.797Z",
                                            "login":        {
                                                "date":       "2022-07-29T04:46:00.708Z",
                                                "expiration": "2022-07-30T04:28:28.000Z",
                                                "token":      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkFwcGxpY2F0aW9uL0pXVCJ9.eyJpZCI6IjYyYzM3NDdhNzNiNGYxOWE2YWNkNmI0MiIsInVpZCI6ImViMDM4MDQyLTE5MzYtNGRmZS05NTUzLWIwNTYzY2VhOTc2ZSIsImlhdCI6MTY1OTA2ODkwOCwiZXhwIjoxNjU5MTU1MzA4LCJpc3MiOiJJbnRlcm5hbCIsInN1YiI6ImFkbWluaXN0cmF0b3IifQ.h01egFPkLDOOiVeIWCoObTCVcoTuaLJxq2Q2tAeSeWo",
                                                "origin":     "127.0.0.1"
                                            },
                                            "role":         4,
                                            "entitlements": [
                                                "Methodologies",
                                                "Deliverables",
                                                "Applications",
                                                "Synergies",
                                                "Aggregate",
                                                "Expedite"
                                            ],
                                            "version":      "8.6.2",
                                            "creation":     "2021-08-31T19:46:34.855Z",
                                            "modification": "2022-06-17T23:33:42.215Z",
                                            "name":         "Jacob Sanders"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }, ... X,
    }
}, false );