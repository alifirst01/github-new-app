import { AxiosInstance } from 'axios';
import store from '@/store';

interface IssuesRepository{
    getAllIssues():Promise<HttpNetworkRequestResult>;
}

export default class IssuesRepositoryImpl implements IssuesRepository{
    constructor(private axios: AxiosInstance){
    }

    async getIssuesFromRepo(headers: Object, params: Object, repo: any): Promise<any>{
        let repoName = repo.name;     
        let repoIssuesUrl = repo.issues_url.split('{')[0];
        let userIssues: Issue[] = [];

        return this.axios.get(repoIssuesUrl, {
            headers: headers,
            params: params,
        }).then(issuesResponse => {
            issuesResponse.data.forEach((issue: any) => {
                userIssues.push({
                    title: issue.title,
                    url: issue.html_url,
                    username: issue.user.login,
                    repository: repoName,
                })
            });
            return Promise.resolve({
                repoIssues: userIssues
            });
        })
        .catch(error => {
            return Promise.reject({
                statusCode: error.status,
                error: error.error,
            });
        });
    }

    async getAllIssues(): Promise<HttpNetworkRequestResult> {
        var accessToken = store.getters.code;
        var url = 'https://api.github.com/user';
        var headers = {'Authorization': 'token ' + accessToken};
        
        return await this.axios.get(url, {
            headers: headers
        })
        .then(response => {
            var repoUrl = "https://api.github.com/users/" + response.data.login + "/repos";
            return this.axios.get(repoUrl, {
                headers: headers
            });
        })
        .then(reposResponse => {
            var userIssues: Issue[] = [];
            var params = {'state': 'all'};
            var repos = reposResponse.data;
            
            repos.forEach((repo: any) => {
                this.getIssuesFromRepo(headers, params, repo).then(response => {
                    userIssues.push(...response.repoIssues);
                })
            });
            return Promise.resolve({
                response: userIssues
            });
        })
        .catch(error => {
            return Promise.resolve({
                statusCode: error.status,
                error: error.error,
            });
        });
    }
}