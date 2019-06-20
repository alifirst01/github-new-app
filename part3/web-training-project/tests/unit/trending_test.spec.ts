interface Repo {
    name: string 
    description: string 
}
  
interface GetTrendingReposHttpRequestResult {
    repos?: Repo[]
    error?: Error
}
  
interface HttpNetworkRequestResult {
    // Both of these fields will be populated if the network request happened. You may have received a bad HTTP response such as a 500 or 422, but at least it happened!
    statusCode?: number 
    responseBody?: any 
    // Error will only be populated if the network request happened. Maybe there was a problem with the Internet. 
    error?: Error
}
  
interface HttpNetworkRequestUtil {
    get(path: string): Promise<HttpNetworkRequestResult>
}
  
class GetTrendingReposController {
    constructor(private networkRequestUtil: HttpNetworkRequestUtil) {
    }

    async getTrendingRepos(): Promise<GetTrendingReposHttpRequestResult> {
        return this.networkRequestUtil.get("/search/trending").then(networkResult => {
            let result: GetTrendingReposHttpRequestResult
            if (networkResult.error) {
                result = {
                    error: networkResult.error
                }
            } else {
                if (networkResult.statusCode! >= 500) {
                    result = {
                        error: new Error("Sorry, our system is down. Check back later and try again.")
                    }
                } 
                // We could continue to parse status codes, but the trending repos endpoint doesn't return other http response codes we need to prepare for. 
            
                else {
                    result = {
                        repos: networkResult.responseBody as Repo[]
                    }
                }
            }
            return Promise.resolve(result)
        })
    }
}

describe("GetTrendingReposController unit tests", () => {
    
    describe("getTrendingRepos()", () => {

        it("should receive error if network request returns back a 500", () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 500, 
                responseBody: "Internal Server Error",
            });
            let getRequestMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let networkRequestStub: HttpNetworkRequestUtil = {
                get: getRequestMock,
            };
            
            var expected = {
                error: new Error("Sorry, our system is down. Check back later and try again.")
            }
            let getTrendingReposController = new GetTrendingReposController(networkRequestStub);
            expect(getTrendingReposController.getTrendingRepos()).resolves.toEqual(expected);
        });

        it("should receive error if the network request failed with an error (the request did not complete)", () => {
            let testError = new Error("the request did not complete");
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                error: testError
            });
            let getRequestMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let networkRequestStub: HttpNetworkRequestUtil = {
                get: getRequestMock,
            };
            var expected = {
                error: testError
            }
            let getTrendingReposController = new GetTrendingReposController(networkRequestStub);
            expect(getTrendingReposController.getTrendingRepos()).resolves.toEqual(expected);
        })

        it("should receive list of repos if the network request was successful", () => {
            let testRepo:Repo = {
                name: "foo", 
                description: "bar"
            } 
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 200, 
                responseBody: [testRepo],
            });
            let getRequestMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let networkRequestStub: HttpNetworkRequestUtil = {
                get: getRequestMock,
            };
            var expected = {
                repos: [testRepo] 
            }
            let getTrendingReposController = new GetTrendingReposController(networkRequestStub);
            expect(getTrendingReposController.getTrendingRepos()).resolves.toEqual(expected);
        })
    })
})