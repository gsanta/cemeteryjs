import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';

const sagaMiddleware = createSagaMiddleware();

export const AppStore = createStore(
    appReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(function* rootSaga() {
    yield all([
        GetWorldActions.watch(),
        LoginFacebookActions.watch(),
        GetUserActions.watch(),
        SignoutActions.watch(),
        LoginActions.watch(),
        SignupActions.watch(),
        UpdatePasswordActions.watch(),
        UpdateSettingsActions.watch(),
        // UpdateWorldActions.watch(),
        GetWorldActions.watch(),
        TurnOnAllLigthsActions.watch(),
        ShowRoomLabelsActions.watch(),
        ShowBoundingBoxesAction.watch(),
        ActivateToolActions.watch(),
        DeactivateToolActions.watch(),
        ReleaseToolActions.watch()
    ]);
});

AppStore.dispatch(GetUserActions.request());