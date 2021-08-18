import { signRequest, getBucket, getS3IAMIdentityClient } from "./cognito";
import {S3Client, GetObjectCommand} from "@aws-sdk/client-s3"
import {serviceEndpoint} from "./config.js"


export async function streamToString(stream) {
    let reader =  stream.getReader();
    var buffer = "";
    var read = await reader.read()
    while (!read.done) {
        buffer += new TextDecoder("utf-8").decode(read.value);
        read = await reader.read();
    }
    return buffer;
}

export async function callLambdaService(name) {
    let serviceCall = `${serviceEndpoint}?name=${name}`;
    const request = {
        method: 'GET',
        url: serviceCall ,
        headers: {
            "Content-Type" : "application/json",
        }
    };
    return await callApiGatewayEnpoint(serviceCall, request);
}

export async function getS3Document(path) {
    var iamConfig = await getS3IAMIdentityClient();
    const client = new S3Client(iamConfig);

    var params = {
        Bucket: getBucket(),
        Key: path
    };

    const command = new GetObjectCommand(params);
    const response = await client.send(command);
    return (await streamToString(response.Body)).toString();

}

export async function callApiGatewayEnpoint(url, request) {
    let signature = await signRequest("execute-api", request);

    try {
        let response = await fetch(url, signature);
        return JSON.parse(await streamToString(response.body));
    } catch (err) {
        return JSON.stringify(err);
    }
}