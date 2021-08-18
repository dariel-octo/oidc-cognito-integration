import * as jquery from "jquery";
import { doLogin, doLogout } from "./oidc.js";
import {logoutIAM} from "./cognito.js"

export function doIndex() {

    jquery("#loginButton").on("click", function() {
        doLogin()
    });
    jquery("#logoutButton").on("click", function() {
        doLogout()
        logoutIAM();
        window.alert('credentials cleared');
    });
}


