import * as jquery from "jquery";
import {doIndex} from "./login"
import {doLanding} from "./logged_in"

jquery(async function() {

    if (jquery("#indexContent").length > 0) {
        doIndex();
    }

    else if (jquery("#landingContent").length > 0) {
        await doLanding();
    }

    else {
        window.alert('index and landing not present')
    }


});
