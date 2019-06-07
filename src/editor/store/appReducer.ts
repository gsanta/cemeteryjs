import { combineReducers } from "redux";


export default combineReducers<AppState>({
    query: (state = {user: new UserRequests(), game: new WorldRequests(null, null)}) => state,
    world: worldReducer,
    tools: toolsReducer,
    widgetInfo: widgetReducer,
    settings: settingsReducer,
    debugOptions: debugReducer,
    appLoadingState: appLoadingStateReducer,
    errors: errorsReducer,
    gameActionDispatcher: gameActionDispatcherReducer
});
