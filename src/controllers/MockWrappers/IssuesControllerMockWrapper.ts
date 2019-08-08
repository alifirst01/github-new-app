import IssuesController from '../IssuesController';
import {container, TYPE} from "@/repositories/Container";

export default class IssuesControllerMockWrapper{
    controller!: IssuesController;

    constructor(private getUserIssuesMock: any){}

    getMock(): IssuesController {
        this.controller = new IssuesController(container.get(TYPE.IssuesRepository));
        this.controller.getUserIssues = this.getUserIssuesMock;
        return this.controller;
    }
}