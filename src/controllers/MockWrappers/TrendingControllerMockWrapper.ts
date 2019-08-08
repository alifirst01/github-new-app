import TrendingController from '../TrendingController';
import {container, TYPE} from "@/repositories/Container";

export default class TrendingControllerMockWrapper{
    controller!: TrendingController;

    constructor(private getTrendingReposMock: any){}

    getMock(): TrendingController {
        this.controller = new TrendingController(container.get(TYPE.TrendingRepository));
        this.controller.getTrendingRepos = this.getTrendingReposMock;
        return this.controller;
    }
}