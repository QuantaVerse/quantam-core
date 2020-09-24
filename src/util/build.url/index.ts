interface BuildUrlOptions {
    path?: string;
    queryParams?: { [name: string]: string | string[] };
}

/**
 * @function buildUrl
 *
 * Build URL from url and options
 *
 * @param {string} url - URL string
 * @param {BuildUrlOptions} options - path and query params to be pushed in the URL
 *
 * @returns string
 */
export function buildUrl(url: string, options?: BuildUrlOptions): string {
    let uri: string = url;
    if (options) {
        if (options.path) {
            uri += `/${options.path}`;
        }
        if (options.queryParams && Object.keys(options.queryParams).length > 0) {
            uri += `?`;
            const paramsList: string[] = [];
            for (const param of Object.keys(options.queryParams)) {
                const value: string | string[] = options.queryParams[param];
                let strValue: string;
                if (Array.isArray(value)) {
                    strValue = value.join(",");
                } else {
                    strValue = value;
                }
                paramsList.push(param + "=" + strValue);
            }
            uri += paramsList.join("&");
        }
    }
    return uri;
}
