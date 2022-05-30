import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import thunk from "redux-thunk";
import persistedReducers from '../reducers';
import '../styles/globals.css';
const store = createStore(persistedReducers, applyMiddleware(thunk));

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
      <Component {...pageProps} />
    </PersistGate>
    </Provider>
  )
}

export default MyApp
