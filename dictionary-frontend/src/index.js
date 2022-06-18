import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store'
import App from './App';
import { WordPage } from './components'
import {BASEURL} from './config'
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,

} from "@apollo/client";

const client = new ApolloClient({
  uri: `${BASEURL}/graphql`,
  cache: new InMemoryCache()
});

const AllRoutes = () => {
  const allroutes = useRoutes([
    { exact: true, path: "/", element: <App /> },
    { exact: true, path: "/word/:word", element: <WordPage /> }
  ])
  return allroutes
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <AllRoutes />
      </Router>
    </ApolloProvider>
  </Provider>
);
