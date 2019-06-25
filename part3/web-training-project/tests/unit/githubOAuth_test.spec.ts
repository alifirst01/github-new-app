import GithubAuthRepository from "@/repositories/GithubAuthRepository";
import GithubAuthController from '@/controllers/GithubAuthController';
import GithubAuthRepositoryImpl from '@/repositories/GithubAuthRepository';

describe("GithubAuthController unit tests", () => {
    describe("getGithubAccessToken()", () => {
        let mockAxios: any;
        beforeAll(() => {
            mockAxios = jest.genMockFromModule('axios');
            mockAxios.create = jest.fn(() => mockAxios);
        });

        it('should return meaningful error response if getAccessToken returns error with status code less than 400', () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 400, 
                error: new Error,
            });
            let getAccessTokenMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let githubAuthRepositoryStub: GithubAuthRepository = new GithubAuthRepositoryImpl(mockAxios);
            githubAuthRepositoryStub.getAccessToken = getAccessTokenMock;
            
            var expected = {
                error: new Error("Error: Could not retrieve accessToken from github.com. Please try again")
            }
            let githubAuthController = new GithubAuthController(githubAuthRepositoryStub);
            expect(githubAuthController.getGithubAccessToken('test_access_code')).resolves.toStrictEqual(expected);
        });
        
        it('should return error specifying "server is down" if the status code is 500', () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 500, 
                error: new Error("Internal Server Error"),
            });
            let getAccessTokenMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let githubAuthRepositoryStub: GithubAuthRepository = new GithubAuthRepositoryImpl(mockAxios);
            githubAuthRepositoryStub.getAccessToken = getAccessTokenMock;
            
            var expected = {
                error: new Error("Sorry, server is down. Check back later and try again.")
            }
            let githubAuthController = new GithubAuthController(githubAuthRepositoryStub);
            expect(githubAuthController.getGithubAccessToken('test_access_code')).resolves.toStrictEqual(expected);
        });

        it('should return list of trending repos if the network request was successful', () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                response: 'test_access_token'
            });
            let getAccessTokenMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let githubAuthRepositoryStub: GithubAuthRepository = new GithubAuthRepositoryImpl(mockAxios);
            githubAuthRepositoryStub.getAccessToken = getAccessTokenMock;

            var expected = {
                accessToken: 'test_access_token' 
            }
            let githubAuthController = new GithubAuthController(githubAuthRepositoryStub);
            expect(githubAuthController.getGithubAccessToken('test_access_code')).resolves.toStrictEqual(expected);
        });
        
    });
});

describe("GithubAuthRepository unit tests", () => {
    describe("getAccessToken()", () => {
        let mockAxios: any;
        beforeAll(() => {
            mockAxios = jest.genMockFromModule('axios');
        });

        it('should return error and status code if the get requests fails with rejected promise', () => {
            mockAxios.mockImplementationOnce(() => Promise.reject({
                status: 400,
                error: new Error("Server responded with an error"),
            }));
    
            let githubAuthRepository: GithubAuthRepository = new GithubAuthRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                statusCode: 400,
                error: new Error("Server responded with an error"),
            }
            expect(githubAuthRepository.getAccessToken('test_access_code')).resolves.toStrictEqual(expected);
        });

        it('should return a response containing access token if the get requests returns a response', () => {
            mockAxios.mockImplementationOnce(() => Promise.resolve({
                data: {
                    access_token: 'test_access_token',
                },
            }));
    
            let githubAuthRepository: GithubAuthRepository = new GithubAuthRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                response: "test_access_token"
            }
            expect(githubAuthRepository.getAccessToken('test_access_code')).resolves.toStrictEqual(expected);
        });
    });
});