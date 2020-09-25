/**
 * @function censorAPI
 * Censors a list of param fields in an API
 *
 * @param {string} url - URL to be censored
 * @param {string[]} fieldsToCensor - List of params to be censored. API_KEY=q\*\*\*\*\*\*p
 */
export function censorAPI(url: string, fieldsToCensor: string[]): string {
    if (fieldsToCensor.length === 0) {
        return url;
    }
    const splitUrl = url.split("?");
    if (splitUrl.length >= 2 && splitUrl[1].length > 0) {
        let splitParams: string[] = splitUrl[1].split("&");
        const paramsDict: Record<string, string> = {};
        for (const param of splitParams) {
            paramsDict[param.split("=")[0]] = param.split("=")[1];
        }
        for (const field of fieldsToCensor) {
            if (paramsDict.hasOwnProperty(field)) {
                const value = paramsDict[field];
                paramsDict[field] = value.slice(0, 1) + "*".repeat(value.length - 2) + value.slice(value.length - 1, value.length);
            }
        }
        splitParams = [];
        for (const [key, value] of Object.entries(paramsDict)) {
            splitParams.push(key + "=" + value);
        }
        splitUrl[1] = splitParams.join("&");
    }
    return splitUrl.join("?");
}
