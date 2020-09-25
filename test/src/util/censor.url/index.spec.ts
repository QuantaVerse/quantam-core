import { describe, expect, test } from "@jest/globals";

import { censorAPI } from "../../../../src/util/censor.url";

describe("Testing censorAPI method", () => {
    test("censorAPI with no params", () => {
        expect(censorAPI("http://www.qd-core.com", ["apikey", "test_key"])).toEqual("http://www.qd-core.com");
    });

    test("censorAPI with one param to censor", () => {
        expect(censorAPI("http://www.qd-core.com?apikey=qwertyuiop", ["apikey", "test_key"])).toEqual(
            "http://www.qd-core.com?apikey=q********p"
        );
    });

    test("censorAPI with one param to censor and some uncensored params", () => {
        expect(censorAPI("http://www.qd-core.com?val=1&apikey=qwertyuiop&name=test", ["apikey", "test_key"])).toEqual(
            "http://www.qd-core.com?val=1&apikey=q********p&name=test"
        );
    });

    test("censorAPI with 3 param to censor and some uncensored params", () => {
        expect(
            censorAPI("http://www.qd-core.com?val=1&apikey=qwertyuiop&name=test&test_key=123456", [
                "apikey",
                "test_key",
                "censor_this_param"
            ])
        ).toEqual("http://www.qd-core.com?val=1&apikey=q********p&name=test&test_key=1****6");
    });

    test("censorAPI with url path, 3 param to censor and some uncensored params", () => {
        expect(
            censorAPI("http://www.qd-core.com/api/v1/test?val=1&apikey=qwertyuiop&test_key=123456&hello=say_hello&version=v2", [
                "apikey",
                "test_key",
                "censor_this_param"
            ])
        ).toEqual("http://www.qd-core.com/api/v1/test?val=1&apikey=q********p&test_key=1****6&hello=say_hello&version=v2");
    });

    test("censorAPI with url path, 0 param to censor and some uncensored params", () => {
        expect(
            censorAPI("http://www.qd-core.com/api/v1/test?val=1&apikey=qwertyuiop&test_key=123456&hello=say_hello&version=v2", [])
        ).toEqual("http://www.qd-core.com/api/v1/test?val=1&apikey=qwertyuiop&test_key=123456&hello=say_hello&version=v2");
    });
});
