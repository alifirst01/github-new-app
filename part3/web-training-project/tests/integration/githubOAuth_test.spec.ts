import GithubAuthRepository from "@/repositories/GithubAuthRepository"
import GithubAuthController from "@/controllers/GithubAuthController"
import GithubAuthRepositoryImpl from "@/repositories/GithubAuthRepository"

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("Issues Feature integration tests", () => {
    var githubAuthRepository: GithubAuthRepository = new GithubAuthRepositoryImpl(axios.create({}));
    var githubAuthController = new GithubAuthController(githubAuthRepository);
    
    beforeEach(() => {
        mock.reset();
    });

    it("When controller's getAccessToken is called, it should return access token upon successful get request", () => {
        mock.onPost().reply(200, {
            access_token: "test_access_token"
        });    

        var expected = {
            accessToken: "test_access_token"
        }
        expect(githubAuthController.getGithubAccessToken("test_access_code")).resolves.toStrictEqual(expected);
    });

    it("When get request fails due to network error, controller's getAccessToken should return error specifying 'system is down'", () => {
        mock.onPost().networkError();

        var expected = {
            error: new Error("Sorry, server is down. Check back later and try again.")
        }
        expect(githubAuthController.getGithubAccessToken("test_access_code")).resolves.toStrictEqual(expected);
    });

    it("When get request fails and server returns an error with a status code, controller's getAccessToken should return error with message for the user", () => {
        mock.onPost().reply(400, {
            message: "Server responds with an error",
        });
        
        var expected = {
            error: new Error("Error: Could not retrieve accessToken from github.com. Please try again")
        }
        expect(githubAuthController.getGithubAccessToken("test_access_code")).resolves.toStrictEqual(expected);
    });
})