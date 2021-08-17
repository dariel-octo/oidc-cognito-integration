import * as jquery from "jquery";
import { getS3Document, callLambdaService } from "./utils.js"

export async function doLanding() {


    jquery("#greeter").on("click", function () {
        callLambdaService(jquery("#name").val()).then(resp => {
            window.alert(resp.greeting);
        })
        .catch(err => {
            window.alert(`Lambda call failed with ${err}`)
        })
        
    });

    try {
        var resp = await getS3Document("private/content.txt")
        jquery("#content").text(`<b>${resp}</b>`);
    } catch (e) {
        window.alert(JSON.stringify(e));
        throw e;
    }
}

