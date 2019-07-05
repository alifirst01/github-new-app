import TrendingRepository from "@/repositories/TrendingRepository"
import TrendingController from "@/controllers/TrendingController"
import TrendingRepositoryImpl from "@/repositories/TrendingRepository"

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);
const queryParams: SearchQueryParams = {
    keywords: ["test-keyword"],
    sortBy: "test-sort",
    orderBy: "test-order",
    lastUpdated: new Date,
    pageNum: 1
}

describe("Trending Feature integration tests", () => {    
    let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(axios.create({}));
    let trendingController = new TrendingController(trendingRepository);

    beforeEach(() => {
        mock.reset();
    });

    it("When controller's getTrendingRepos is called, it should return list of Trending repos upon successful get request", () => {
        let testRepo:Repo = {
            name: "foo", 
            url: "foo@test",
            description: "bar",
            username: "baz",
            unameUrl: "baz@test",
            avatarUrl: "avatar@test"
        };
        
        mock.onGet().reply(200, {
            items: [{
                "html_url": "foo@test",
                "name": "foo",
                "description": "bar",
                "owner": {
                    "login": "baz",
                    "html_url": "baz@test",
                    "avatar_url": "avatar@test",
                }
            }]
        });

        var expected = {
            repos: [testRepo] 
        }
        expect(trendingController.getTrendingRepos(queryParams)).resolves.toStrictEqual(expected);
    });

    it("When get request fails due to network error, controller's getTrendingRepos should return error specifying 'system is down'", () => {
        mock.onGet().networkError();

        var expected = {
            error: new Error("Sorry, system is down. Check back later and try again.")
        }
        expect(trendingController.getTrendingRepos(queryParams)).resolves.toStrictEqual(expected);
    });

    it("When get request fails and server returns an error with a status code, controller's getTrendingRepos should return error with message for the user", () => {
        mock.onGet().reply(400, {
            message: "Server responds with an error",
        });
        
        var expected = {
            error: new Error("An error occurred while fetching the trending repositories from Github. Try again later....")
        }
        expect(trendingController.getTrendingRepos(queryParams)).resolves.toStrictEqual(expected);
    });
})