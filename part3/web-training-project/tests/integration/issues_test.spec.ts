import IssuesRepository from "@/repositories/IssuesRepository"
import IssuesController from "@/controllers/IssuesController"
import IssuesRepositoryImpl from "@/repositories/IssuesRepository"

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("Issues Feature integration tests", () => {
    let issuesRepository: IssuesRepository = new IssuesRepositoryImpl(axios.create({}));
    let issuesController = new IssuesController(issuesRepository);
    
    beforeEach(() => {
        mock.reset();
    });

    it("When controller's getUserIssues is called, it should return list of Issues upon successful get request", () => {
        let testIssue:Issue = {
            url: "foo@example",
            title: "foo",
            username: "bar",
            repository: "baz",
        }; 
        mock
            .onGet().replyOnce(200, {
                login: "foo",
            })
            .onGet().replyOnce(200, [{
                name: "baz",
                issues_url: "fooUrl",
            }])
            .onGet().replyOnce(200, 
                [{
                    "html_url": "foo@example",
                    "title": "foo",
                    "user": {
                        "login": "bar",
                    }
                }]
            );

        var expected = {
            issues: [testIssue] 
        }
        expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
    });

    it("When get request fails due to network error, controller's getUserIssues should return error specifying 'system is down'", () => {
        mock.onGet().networkError()

        var expected = {
            error: new Error("Sorry, system is down. Check back later and try again.")
        }
        expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
    });

    it("When get request fails and server returns an error with a status code, controller's getUserIssues should return error with message for the user", () => {
        mock.onGet().reply(400, {
            message: "Server responds with an error",
        });
        
        var expected = {
            error: new Error("An error occurred in fetching github issues. Please try again")
        }
        expect(issuesController.getUserIssues()).resolves.toStrictEqual(expected);
    });
})