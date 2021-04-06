import fetch from 'isomorphic-fetch'
import qs from 'querystring'
import { isEmpty } from 'lodash'
const { NEXT_PUBLIC_ROUTE_BASE } = process.env;

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error: any = new Error(response.statusText)
        error.response = response
        throw error
    }
}

function parseJSON(response) {
    return response.json()
}

function request(opt) {
    // 重写url 
    let url = NEXT_PUBLIC_ROUTE_BASE + opt.url;
    console.log(url, 'url')
    const method = opt.method ? opt.method.toUpperCase() : 'GET'
    opt.method = method
    opt.body = method === 'GET' ? null : opt.data

    if (method !== 'GET' && opt.data && !(opt.data instanceof FormData)) { // 默认都为json
        opt.headers['Content-Type'] = 'application/json'
        opt.body = JSON.stringify(opt.data)
    } else if (method === 'GET' && !isEmpty(opt.data)) {
        url = url + '?' + qs.stringify(opt.data)
    }

    const option = {
        credentials: 'same-origin',
        ...opt
    }

    return fetch(url, option)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
            return data
        })
        .catch(err => {
            console.log(err)
            return Promise.reject('请求出错')
        })
}


export default request
