import { AxiosInstance } from 'axios';
import store from '@/store';

interface IssuesRepository{
    getIssues():Promise<HttpNetworkRequestResult>;
}

export default class IssuesRepositoryImpl implements IssuesRepository{
    constructor(private axios: AxiosInstance){
    }

    getIssues(): Promise<HttpNetworkRequestResult> {
        var accessToken = store.getters.code;
        var url = 'https://api.github.com/user';
        var headers = {'Authorization': 'token ' + accessToken};
        
        return this.axios.get(url, {
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
            var repos = reposResponse.data;
            var params = {'state': 'all'};
            
            repos.forEach(repo => {
                let repoName = repo.name;     
                let repoIssuesUrl = repo.issues_url.split('{')[0];
                this.axios.get(repoIssuesUrl, {
                    headers: headers,
                    params: params,
                }).then(issuesResponse => {
                    issuesResponse.data.forEach(issue => {
                        userIssues.push({
                            title: issue.title,
                            url: issue.html_url,
                            username: issue.user.login,
                            repository: repoName,
                        })
                    });
                })
            })
            return Promise.resolve({
                response: userIssues
            });
        })
        .catch(error => {
            return Promise.resolve({
                statusCode: error.status,
                error: error,
            });
        });
    }
}