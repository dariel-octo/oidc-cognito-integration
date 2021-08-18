
# OIDC to COGNITO demonstrator APP

The purpose of this application to to show the integration between and OIDC provider and an IAM Identity pool.

*This app is provided without warranty and is only meant to demonstrate the OIDC provider with Cognito, identity pools. it is not meant to be used in a production environment*

This app illustrates the following:

 - Shows how to integrate an OIDC provider with Cognito Credentials in the AWS JS SDK to get temporary IAM credentials using a JWT token
 - Invokes a secured S3 bucket item to retrieve content
 - Invokes a Lambda function via API Gateway which is secured by IAM_AUTH

# Building

### Pre-requisites

In order to build this app you will need the following

 - AWS account with Access keys configuration on your machine
 - AWS Serverless Application Model (SAM) installed on your machine
 - Node.js installed on your machine
 - Yarn installed on your machine
 - An S3 bucket for storing the retrieved content
 - A Configured Cognito Identity Pool set up to work on your OIDC provider
 - An attached IAM policy to the Identity Pool which grants the various permissions.

The following is an - very open - policy for accessing the service:

    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Policy1",
            "Effect": "Allow",
            "Action": [
                "cognito-identity:*",
                "lambda:*",
                "execute-api:Invoke"
            ],
            "Resource": "*"
        },
        {
            "Sid": "Policy2",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::my-cool-s3-bucket/private/content.txt"
            ]
        }
    ]
}

### Lambda Service

The Lambda function in the 'service' folder is a simple Lambda function developed using an AWS SAM model.

To build and deploy this function you need to configure AWS credentials on the machine from wish you want to deploy the application.

To build and deploy you need to do the following from the service directory

    > sam build
    > sam deploy --guided

**NB** Unless you are using a proxy for both service and ui, you need to ensure that **CORS is enabled on API Gateway** (sam definition doesn't seem to work)

### User interface

The user interface in the ui folder is a very simple web site build using JQuery. It utilizes - among others -the following packages to do it's work:
|  Package|Purpose  |
|--|--|
|@aws-sdk/client-cognito-identity | Cognito Integration  |
|@aws-sdk/credential-provider-cognito| Cognito Integration |
|@aws-sdk/client-s3| S3 client|
|@amplify/core|AWS Signer from the AWS amplify library|
|@azure/msal-browser|Microsofts Library for OIDC integration.. supposed to work with any OIDC provider (or so the documentation says)

#### Creating Configuration
In order to run all the services there is some configuration settings you need.. these are as follows

To build this application you need to add a config.js file in the root of 'ui' folder. This file should contain the following configuration values:

    //name of the host s3 bucket to host your content
    export  const  s3Bucket = "my-s3-bucket";
    
    //logout page for OIDC
    export  const  logout = "URI to your logout page as configured with your OIDC provider";
    
    //Lambda service API Gateway endpoint
    export  const  serviceEndpoint = "<lambda function api gateway endpoint>"
    
    /**OIDC provider configuration*/
    export  const  oidcProvider = {
	    provider :  "<oidc login provider endpoint>",
	    params : {
		    client_id :  "<oidc client id>",
		    response_type :  "code",
		    redirect_uri :  "<oidc redirect url>",
		    scope :  "email",
		    response_mode :  "fragment",
		    authorization_endpoint :  "<oidc auth endpoint>"0"
	    }
    }
    
    //configuration for your cognito identity pool
    export  const  cognitoIdentityPool = {
        region:  "<AWS region>",
        identityPoolId:  "<identity pool id>",	
        login:  "<oidc provider endpoint configured for the identity pool>"
    }

#### building the application

Execute the following from the root of the ui folder:

    >yarn
    >npx webpack

#### Deploying the application

You will need to copy the following files to your deployment environment:

 - **All html files** to your webserver root
 - The generated ***main.js*** to your webserver root (**Do not copy the other .js files**)
 - **private/context.txt** to you S3 bucket

To use the application you can now navigate to the following in your web browser:

    <my web service root url>/index.html





