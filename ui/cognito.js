import { cognitoIdentityPool, s3Bucket, getRegion, serviceEndpoint } from "./config.js";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { getJwtToken } from "./oidc.js";
import {Signer} from "@aws-amplify/core"

const cognitoClient = new CognitoIdentityClient({ region: cognitoIdentityPool.region });

var loginJsonTemplate = {
    region: cognitoIdentityPool.region,
    client: cognitoClient,
    identityPoolId: cognitoIdentityPool.identityPoolId,
    logins: {
    }
}


export function getBucket() {
    return s3Bucket;
}

/**
 * creates the credentials specification according to the requirements to invoke an API Gateway endpoint
 * @returns json login template for IAM call to Lambda function via Api Gateway
 */
export function getIAMIdentityClient() {
    const token = getJwtToken();
    var logins = loginJsonTemplate.logins;

    logins[cognitoIdentityPool.login] =  token;
    return loginJsonTemplate;
}

/**
 * The S3 Identity configuration
 * @returns a configured S3 identity client
 */
export function getS3IAMIdentityClient() {
    const token = getJwtToken();
    var loginJsonTemplate = {
        region: cognitoIdentityPool.region,
        credentials: fromCognitoIdentityPool(getIAMIdentityClient()),
        identityPoolId: cognitoIdentityPool.identityPoolId,
        
    }
    loginJsonTemplate[cognitoIdentityPool.login] = token
    return loginJsonTemplate;
}

/**
 * Returns the temporary IAM credentials
 * @returns IAM credentials spec
 */
export async function getIAMCredentials() {
    return await fromCognitoIdentityPool(getIAMIdentityClient())()
}

/**
 * Does a login into IAM and stores the credentials
 * @returns Does a login into IAM and stores the credentials
 */
export async function doIAMLogin() {
    if (getCurrentIAMCredentials() == null) {
        var creds = await getIAMCredentials();
        window.localStorage.setItem('iam-credentials', JSON.stringify(creds));
    }
    return getCurrentIAMCredentials();
}

/**
 * Returns the current IAM credentials, null if not set
 * @returns current IAM credentials
 */
export function getCurrentIAMCredentials() {
    return JSON.parse(window.localStorage.getItem('iam-credentials'));
}

/**
 * 
 * @returns Clears the current IAM credentials
 */
export function logoutIAM() {
    return window.localStorage.removeItem('iam-credentials');
}




/**
 * Signs an IAM fetch request with IAM credentials using the Amplify Signer
 * @returns Signed IAM request object for fetch
 */
export async function signRequest(service, request, body = null) {
    
    const creds = await doIAMLogin();

    const accessInfo = {
        access_key: creds.accessKeyId,
        secret_key: creds.secretAccessKey,
        session_token: creds.sessionToken,
    };

    const serviceInfo = {
        service: "execute-api",
        region: cognitoIdentityPool.region,
    };

    let signature = Signer.sign(request, accessInfo, serviceInfo);
    return signature;

}


