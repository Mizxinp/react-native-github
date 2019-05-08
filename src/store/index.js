import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer/index'
import {middleware} from '../navigator/AppNavigators'

// 简单自定义中间件
const logger = store => next => action => {
    if(typeof action === 'function'){
        console.log('dispatch a function');
    }else{
        console.log('dispatching',action);
    }
    const result = next(action);
    console.log('next',store.getState());
}

const middlewares = [
    middleware,
    logger,
    thunk
];
/** * 创建store */
export default createStore(reducers, applyMiddleware(...middlewares));


