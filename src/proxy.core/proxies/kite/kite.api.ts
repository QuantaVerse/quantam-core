import { KiteConnect } from "kiteconnect";

export class KiteApi {
    private readonly kc;

    constructor(kc: KiteConnect) {
        this.kc = new KiteConnect({ api_key: "your_api_key" });
    }
    // kc = new KiteConnect({
    //     api_key: "your_api_key"
    // });
    //
    // kc.generateSession("request_token", "api_secret").then(function(response) {
    //     init();
    // }).catch(function(err) {
    //     console.log(err);
    // });
    //
    // function init() {
    //     // Fetch equity margins.
    //     // You can have other api calls here.
    //     kc.getMargins()
    //         .then(function(response) {
    //             // You got user's margin details.
    //         }).catch(function(err) {
    //         // Something went wrong.
    //     });
    // }
}
