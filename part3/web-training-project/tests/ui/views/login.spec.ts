import Login from "@/views/Login.vue"
import { mount, Wrapper } from "@vue/test-utils"

describe("Login.vue UI tests", () => {
    class LoginWrapper {
      constructor(public wrapper: Wrapper<Login>) {}

      get loginView(): Wrapper<Login> {
        return this.wrapper.find("#login-view") as Wrapper<Login>
      }

      get loginRedirectButton(): Wrapper<Login> {
        return this.wrapper.find("#github-login") as Wrapper<Login>
      }
    }

    it("expect to see a login view on page load", () => {
      const wrapper = new LoginWrapper(mount(Login));
        expect(wrapper.loginView.isVisible()).toBe(true);
    });

    it("expect to view to redirect user to github.com when login button is clicked", () => {
      const wrapper = new LoginWrapper(mount(Login));
      window.location.assign = jest.fn();
      wrapper.loginRedirectButton.trigger('click');
      expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining("github.com/login/oauth/"));
  });
})