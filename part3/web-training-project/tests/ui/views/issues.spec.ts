import { shallowMount, Wrapper, WrapperArray, mount, createLocalVue } from "@vue/test-utils"
import VueRouter from 'vue-router'
import Issues from "@/views/Issues.vue"
import { container, TYPE } from "@/repositories/Container";
import flushpromises from "flush-promises";
import IssuesController from '@/controllers/IssuesController';
import IssuesControllerMockWrapper from '@/controllers/MockWrappers/IssuesControllerMockWrapper';
import GithubAuthController from '@/controllers/GithubAuthController';
import GithubAuthControllerMockWrapper from '@/controllers/MockWrappers/GithubAuthControllerMockWrapper';


describe("Issues.vue UI tests", () => {
    class IssuesWrapper {
		constructor(public wrapper: Wrapper<Issues>) {}

		get loadingView(): Wrapper<Issues> {
			return this.wrapper.find("#token-fetch-loading") as Wrapper<Issues>
		}

		get issuesLoadingSpinner(): Wrapper<Issues> {
			return this.wrapper.find("#issues-loading") as Wrapper<Issues>
		}

		get issuesContentView(): Wrapper<Issues> {
			return this.wrapper.find("#issues-content") as Wrapper<Issues>
		}

		get issuesErrorView(): Wrapper<Issues> {
			return this.wrapper.find("#issues-error") as Wrapper<Issues>
		}

		get issuesListView(): Wrapper<Issues> {
			return this.wrapper.find("#issues-list") as Wrapper<Issues>
		}

		get logoutLink(): Wrapper<Issues> {
			return this.wrapper.find("#logout") as Wrapper<Issues>
		}
	};

	const localVue = createLocalVue();
	localVue.use(VueRouter);
	const router = new VueRouter();

	const testIssue:Issue = {
		url: "foo@example",
		title: "bar",
		username: "foo",
		repository: "baz",
	}; 

    const $Progress = {
        start: jest.fn().mockReturnValue(null),
        fail: jest.fn().mockReturnValue(null),
        finish: jest.fn().mockReturnValue(null),
	};
	
	const $store = {
        getters: {
            isLoggedIn: false
		},
		dispatch: jest.fn().mockReturnValue(null),
	};

    const setIssuesControllerMocks = (issuesControllerMock: IssuesController) => {
      container
        .rebind<IssuesController>(TYPE.IssuesController)
        .toValue(issuesControllerMock);
	};
	
	const setGithubAuthControllerMocks = (githubAuthControllerMock: GithubAuthController) => {
		container
		  .rebind<GithubAuthController>(TYPE.GithubAuthController)
		  .toValue(githubAuthControllerMock);
	};

    beforeEach(() => {
		window = Object.create(window);
		const url = "http://dummy.com?code=123";
		Object.defineProperty(window, 'location', {
			value: {
				href: url
			}
		});
    });

    it("expect to see a loading view when page is loaded and user is not logged in", async () => {
        let mockWrapper = new GithubAuthControllerMockWrapper(
          jest.fn().mockReturnValueOnce(new Promise((res, rej) => {}))
        );
        setGithubAuthControllerMocks(mockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	mount(Issues, {
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.loadingView.isVisible()).toBe(true);
		expect(wrapper.issuesContentView.exists()).toBe(false);
	});

	it("expect user to get redirected to /login if there is an error in retrieving access token", async () => {
		let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				error: new Error("Internal Server Error"),
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(new Promise((res, rej) => {}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
				localVue,
				router,
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.wrapper.vm.$route.path).toBe('/login');
	});
	
	it("expect to see issues content view and loading spinner if the token got retrieved successfully", async () => {
        let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				accessToken: "abc"
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(new Promise((res, rej) => {}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.loadingView.exists()).toBe(false);
		expect(wrapper.issuesContentView.isVisible()).toBe(true);
		expect(wrapper.issuesLoadingSpinner.isVisible()).toBe(true);
	});
	
	it("expect to see error view if user issues could not get retrieved from their github profile", async () => {
		var errorMsg = "Couldn't retrieve issues. Try again later";

        let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				accessToken: "abc"
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				error: new Error(errorMsg),
			}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.issuesLoadingSpinner.exists()).toBe(false);
		expect(wrapper.issuesErrorView.isVisible()).toBe(true);	
		expect(wrapper.issuesErrorView.find("p").html()).toContain(errorMsg);
	});
	
	it("expect to see issues list view if user issues got retrieved successfully from their github profile", async () => {
        let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				accessToken: "abc"
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				issues: [testIssue],
			}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.issuesLoadingSpinner.exists()).toBe(false);
		expect(wrapper.issuesErrorView.exists()).toBe(false);	
		expect(wrapper.issuesListView.isVisible()).toBe(true);	
	});
	
	it("expect user to get redirected to /login if logout link is clicked on issues content view", async () => {
		let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				accessToken: "abc"
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(new Promise((res, rej) => {}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
				localVue,
				router,
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.wrapper.vm.$route.path).toBe('/login');
	});

	it("expect getUserIssues of IssuesController to be called again when", async () => {
		let githubAuthMockWrapper = new GithubAuthControllerMockWrapper(
			jest.fn().mockReturnValueOnce(Promise.resolve({
				accessToken: "abc"
			}))
		);
		
		let issuesMockWrapper = new IssuesControllerMockWrapper(
			jest.fn().mockReturnValueOnce(new Promise((res, rej) => {}))
        );
		setGithubAuthControllerMocks(githubAuthMockWrapper.getMock());
		setIssuesControllerMocks(issuesMockWrapper.getMock());
        const wrapper = new IssuesWrapper(
          	shallowMount(Issues, {
				localVue,
				router,
            	mocks: {
					$store,
					$Progress,
            	}
			})
		);
		await flushpromises();
		expect(wrapper.wrapper.vm.$route.path).toBe('/login');
	});
})