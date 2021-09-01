import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Pages without sidebar
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

import Layout from "./components/Layout";
import { RouteItemsWithSidebar } from "./routeItems";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";

function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    <Switch>
                        <Route path="/" component={HomePage} exact >
                            {/* TODO: Redirect to My Progress if user is logged in */}
                        </Route>
                        <Route path="/login" component={Login} exact />
                        <Route path="/signup" component={SignUp} exact />
                        {
                            RouteItemsWithSidebar.map(item => {
                                return (
                                    <Route key={item.path} path={item.path} component={item.component} exact />
                                );
                            })
                        }
                        <Route component={NotFound} />
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )
}

export default Routes;