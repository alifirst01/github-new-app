import TrendingRepository from "@/repositories/TrendingRepository";
import TrendingController from '@/controllers/TrendingController';
import TrendingRepositoryImpl from '@/repositories/TrendingRepository';

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

describe("Trending Feature integration tests", () => {
    afterEach(() => {
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
                'html_url': 'foo@test',
                'name': 'foo',
                'description': 'bar',
                'owner': {
                    'login': 'baz',
                    'html_url': 'baz@test',
                    'avatar_url': 'avatar@test',
                }
            }]
        });
    
        let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(axios.create({}));
        let trendingController = new TrendingController(trendingRepository);

        var expected = {
            repos: [testRepo] 
        }
        expect(trendingController.getTrendingRepos()).resolves.toStrictEqual(expected);
    });

    it("When get request fails due to network error, controller's getTrendingRepos should return error specifying 'system is down'", () => {
        mock.onGet().networkError();
    
        let trendingRepository: TrendingRepository = new TrendingRepositoryImpl(axios.create({}));
        let trendingController = new TrendingController(trendingRepository);

        var expected = {
            error: new Error("Sorry, system is down. Check back later and try again.")
        }
        expect(trendingController.getTrendingRepos()).resolves.toStrictEqual(expected);
    });
})