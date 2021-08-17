import { oidcProvider} from "./config.js";
import * as msal from "@azure/msal-browser";


const msalConfig = {
    auth: {
        clientId: oidcProvider.params.client_id,
        authority: oidcProvider.provider,
        redirectUri: oidcProvider.params.redirect_uri
    },
    cache: {
        cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

const msalHandler = new msal.PublicClientApplication(msalConfig);


export function doLogout() {
    msalHandler.logoutRedirect({
        onRedirectNavigate: (url) => {
            // Return false if you would like to stop navigation after local logout
            return false;
        }
        
    });
}


export function getJwtToken() {
    return getCurrentUser().idToken;
}

export function getCurrentUser() {
    return JSON.parse(window.localStorage.getItem('current-user'));
}


export async function doLogin() {
    const loginRequest = {
        login: false
    }

    const resp = await msalHandler.loginPopup(loginRequest);
    const data = JSON.stringify(resp);
    window.alert(data);
    window.localStorage.setItem('current-user', data);
    window.location.href = "/landing.html";
}