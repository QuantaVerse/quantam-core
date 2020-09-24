import { describe, expect, test } from "@jest/globals";

import { buildUrl } from "../../../../src/util/build.url";

describe("Testing buildUrl method", () => {
    test("buildUrl with no options", () => {
        expect(buildUrl("http://www.qd-core.com", {})).toEqual("http://www.qd-core.com");
    });

    test("buildUrl with url path", () => {
        expect(buildUrl("http://www.qd-core.com", { path: "api/v1/health" })).toEqual("http://www.qd-core.com/api/v1/health");
    });

    test("buildUrl with url path and 1 query param", () => {
        expect(buildUrl("http://www.qd-core.com", { path: "api/v1/search", queryParams: { version: "v2", find: "test" } })).toEqual(
            "http://www.qd-core.com/api/v1/search?version=v2&find=test"
        );
    });

    test("buildUrl with url path and 2 query param", () => {
        expect(buildUrl("http://www.qd-core.com", { path: "api/v1/demo", queryParams: { version: "v2", items: ["test", "xyz"] } })).toEqual(
            "http://www.qd-core.com/api/v1/demo?version=v2&items=test,xyz"
        );
    });
});
