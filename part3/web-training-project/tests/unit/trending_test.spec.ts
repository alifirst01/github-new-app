import TrendingRepository from "@/repositories/TrendingRepository"
import TrendingController from "@/controllers/TrendingController"
import TrendingRepositoryImpl from "@/repositories/TrendingRepository"

const mockAxios:any = jest.genMockFromModule("axios");

describe("TrendingController unit tests", () => {
    describe("getTrendingRepos()", () => {
        
        it("should return meaningful error response if getTrendingRepos returns error with status code less than 500", () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 400, 
                error: new Error,
            });
            let getReposMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let trendingRepositoryStub: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            trendingRepositoryStub.getRepos = getReposMock;
            
            var expected = {
                error: new Error("An error occurred while fetching the trending repositories from Github. Try again later....")
            }
            let trendingController = new TrendingController(trendingRepositoryStub);
            expect(trendingController.getTrendingRepos()).resolves.toStrictEqual(expected);
        });
        
        it("should return error specifying 'system is down' if the status code is 500", () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 500, 
                error: new Error("Internal Server Error"),
            });
            let getReposMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let trendingRepositoryStub: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            trendingRepositoryStub.getRepos = getReposMock;
            
            var expected = {
                error: new Error("Sorry, system is down. Check back later and try again.")
            }
            let trendingController = new TrendingController(trendingRepositoryStub);
            expect(trendingController.getTrendingRepos()).resolves.toStrictEqual(expected);
        });

        it("should return list of trending repos if the network request was successful", () => {
            let testRepo:Repo = {
                name: "foo", 
                url: "foo@example",
                description: "bar",
                username: "baz",
                unameUrl: "baz@example",
                avatarUrl: "avatar@example"
            }; 
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                response: [testRepo]
            });
            let getReposMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let trendingRepositoryStub: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            trendingRepositoryStub.getRepos = getReposMock;

            var expected = {
                repos: [testRepo] 
            }
            let trendingController = new TrendingController(trendingRepositoryStub);
            expect(trendingController.getTrendingRepos()).resolves.toStrictEqual(expected);
        });
        
    });
});

describe("TrendingRepository unit tests", () => {
    describe("getRepos()", () => {

        it("should return error and status code if the get requests fails with rejected promise", () => {
            mockAxios.get.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 400,
                    data: {message: "Server responded with an error"},
                }
            }));
    
            let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                statusCode: 400,
                error: new Error("Server responded with an error"),
            }
            expect(trendingRepository.getRepos()).resolves.toStrictEqual(expected);
        });

        it("should return an error if the get requests returned a response but an error occurred during parsing of response", () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: {
                    items: [{
                        'html_url': 'foo@example',
                        'name': 'foo',
                        'description': 'bar',
                    }]
                },
            }));
    
            let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                statusCode: 500,
                error: new Error("Cannot read property 'login' of undefined"),
            };
            expect(trendingRepository.getRepos()).resolves.toStrictEqual(expected);
        });

        it("should return a response containing trendingRepos list if the get requests returns a response", () => {
            let testRepo:Repo = {
                name: "foo", 
                url: "foo@example",
                description: "bar",
                username: "baz",
                unameUrl: "baz@example",
                avatarUrl: "avatar@example"
            }; 
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: {
                    items: [{
                        'html_url': 'foo@example',
                        'name': 'foo',
                        'description': 'bar',
                        'owner': {
                            'login': 'baz',
                            'html_url': 'baz@example',
                            'avatar_url': 'avatar@example',
                        }
                    }]
                },
            }));
    
            let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                response: [testRepo]
            }
            expect(trendingRepository.getRepos()).resolves.toStrictEqual(expected);
        });
    });
});