import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

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
                            {window.sessionStorage.getItem("loggedInAccount") ? <Redirect to="/progresspage" /> : <HomePage />}
                        </Route>
                        <Route path="/login" component={Login} exact />
                        <Route path="/signup" component={SignUp} exact />
                        {
                            RouteItemsWithSidebar.map(item => {
                                return (
                                    window.sessionStorage.getItem("loggedInAccount") ?  <Route key={item.path} path={item.path} component={item.component} exact /> : <Redirect to="/" /> 
                                    
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