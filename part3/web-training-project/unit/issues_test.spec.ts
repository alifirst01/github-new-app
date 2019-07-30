import IssuesRepository from "@/repositories/IssuesRepository"
import IssuesRepositoryImpl from "@/repositories/IssuesRepository"
import IssuesController from '@/controllers/IssuesController'

const mockAxios:any = jest.genMockFromModule("axios");

describe("IssuesController unit tests", () => {
    describe("getUserIssues()", () => {

        it("should return meaningful error response if getUserIssues returns error with status code less than 400", () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 400, 
                error: new Error,
            });
            let getIssuesMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let issuesRepositoryStub: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            issuesRepositoryStub.getAllIssues = getIssuesMock;
            
            var expected = {
                error: new Error("An error occurred in fetching github issues. Please try again"),
            }
            let issuesController = new IssuesController(issuesRepositoryStub);
            expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
        });
        
        it("should return error specifying 'system is down' if the status code is 500", () => {
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                statusCode: 500, 
                error: new Error("Internal Server Error"),
            });
            let getIssuesMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let issuesRepositoryStub: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            issuesRepositoryStub.getAllIssues = getIssuesMock;
            
            var expected = {
                error: new Error("Sorry, system is down. Check back later and try again.")
            }
            let issuesController = new IssuesController(issuesRepositoryStub);
            expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
        });

        it("should return list of issues if the network request was successful", () => {
            let testIssue:Issue = {
                url: "foo@example",
                title: "bar",
                username: "foo",
                repository: "baz",
            }; 
            var networkRequestResultStub: Promise<HttpNetworkRequestResult> = Promise.resolve({
                response: [testIssue]
            });
            let getIssuesMock = jest.fn().mockReturnValueOnce(networkRequestResultStub);
            let issuesRepositoryStub: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            issuesRepositoryStub.getAllIssues = getIssuesMock;

            var expected = {
                issues: [testIssue] 
            }
            let issuesController = new IssuesController(issuesRepositoryStub);
            expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
        });
    });
});

describe("IssuesRepository unit tests", () => {
    describe("getAllIssues()", () => {

        it("should return error and status code if the '/user' get requests fails", () => {
            mockAxios.get.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 400,
                    data: {message: "Server responded with an error on user get request"},
                }
            }));
    
            let issuesRepository: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                statusCode: 400,
                error: new Error("Server responded with an error on user get request"),
            }
            expect(issuesRepository.getAllIssues()).resolves.toStrictEqual(expected);
        });

        it("should return error and status code if '/users/:owner/repos' get request fails", () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: {
                    login: "foo",
                }
            }));

            mockAxios.get.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 400,
                    data: {message: "Server responded with error on repos get request"},
                }
            }));
    
            let issuesRepository: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                statusCode: 400,
                error: new Error("Server responded with error on repos get request"),
            }
            expect(issuesRepository.getAllIssues()).resolves.toStrictEqual(expected);
        });

        it("should return empty issues array if '/repos/:owner/:repo/issues' get request fails", () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: {
                    login: "foo",
                }
            }));

            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: [{
                    name: "foo",
                    issues_url: "fooUrl",
                }]
            }));

            mockAxios.get.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 400,
                    data: {message: "Server responded with error on issues get request"},
                }
            }));
    
            let issuesRepository: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                response: [],
            }
            expect(issuesRepository.getAllIssues()).resolves.toStrictEqual(expected);
        });

        it("should return a response containing list of user issues if all get requests are successful", () => {
            let testIssue:Issue = {
                title: "foo", 
                url: "foo@example",
                username: "baz",
                repository: "fooRepo",
            }; 

            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: {
                    login: "foo",
                }
            }));

            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data: [{
                    name: "fooRepo",
                    issues_url: "fooUrl",
                }]
            }));
            mockAxios.get.mockImplementationOnce(() => Promise.resolve({
                data:[{
                        'html_url': 'foo@example',
                        'title': 'foo',
                        'user': {
                            'login': 'baz',
                        }
                    }]
            }));
    
            let IssuesRepository: IssuesRepository = new IssuesRepositoryImpl(mockAxios);
            
            var expected: HttpNetworkRequestResult = {
                response: [testIssue]
            }
            expect(IssuesRepository.getAllIssues()).resolves.toStrictEqual(expected);
        });
    });
});