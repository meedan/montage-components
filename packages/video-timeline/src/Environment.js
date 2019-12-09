import { Environment, Network, RecordSource, Store } from 'relay-runtime';

// FIXME: Load these things from configuration file
const config = {
  // token: 'dev',
  token: 'eyJwcm92aWRlciI6ImNoZWNrZGVzayIsImlkIjoiIiwidG9rZW4iOiI0S1g3++nZmZpNSIsInNlY3JldCI6IlNiZ2FUNHBoIn0=++n',
  teamSlug: window.location.search.split(/[=&]/)[5],
  checkApiUrl: 'http://localhost:3000',
};

function createFetchQuery() {
  return function fetchQuery(operation, variables, cacheConfig, uploadables) {
    let body = JSON.stringify({
      query: operation.text,
      variables,
      team: config.teamSlug,
    });
    const headers = {
      'X-Check-Token': config.token,
      'X-Check-Client': 'montage-components',
      credentials: 'include',
    };
    headers['content-type'] = 'application/json';

    return fetch(config.checkApiUrl + '/api/graphql', {
      method: 'POST',
      headers,
      body,
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        let json = {};
        try {
          json = JSON.parse(text);
          if (json.error) {
            return {
              data: null,
              errors: [json],
            };
          }
          return json;
        } catch (e) {
          return {
            data: null,
            errors: [{ error: 'Not a JSON: ' + text }],
          };
        }
      })
      .catch(error => {
        return {
          data: null,
          errors: [{ error: error.message }],
        };
      });
  };
}

export function createEnvironment() {
  const network = Network.create(createFetchQuery());
  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({ network, store });
  return environment;
}
