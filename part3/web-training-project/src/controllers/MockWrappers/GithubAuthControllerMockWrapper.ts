import GithubAuthController from '../GithubAuthController';
import {container, TYPE} from "@/repositories/Container";

export default class GithubAuthControllerMockWrapper{
    controller!: GithubAuthController;

    constructor(private getGithubAccessTokenMock: any){}

    getMock(): GithubAuthController {
        this.controller = new GithubAuthController(container.get(TYPE.GithubAuthRepository));
        this.controller.getGithubAccessToken = this.getGithubAccessTokenMock;
        return this.controller;
    }
}