'use strict';

// const assert = require('assert');
// const request = require('supertest');
const mm = require('egg-mock');
// const utility = require('utility');
// const path = require('path');
// const fs = require('fs');

describe('test/pig.test.js', () => {
    let app;

    before(() => {
        app = mm.app({
            baseDir: 'apps/pigapp',
        });
        return app.ready();
    });

    afterEach(mm.restore);

    describe('test/httpverb.js', () => {
        it('should GET verb/get', () => {
            return app.httpRequest()
                .get('/verb/get')
                .expect(200)
                .expect('get');
        });
        it('should GET verb/post', () => {
            return app.httpRequest()
                .post('/verb/post')
                .type('form')
                .send({
                    foo: 'bar',
                })
                .expect(200)
                .expect('post');
        });
        it('should GET verb/head', () => {
            return app.httpRequest()
                .head('/verb/head')
                .expect(200)
                .expect();
        });
        it('should GET verb/patch', () => {
            return app.httpRequest()
                .patch('/verb/patch')
                .expect(200)
                .expect('patch');
        });
        it('should GET verb/put', () => {
            return app.httpRequest()
                .put('/verb/put')
                .expect(200)
                .expect('put');
        });
        it('should GET verb/delete', () => {
            return app.httpRequest()
                .delete('/verb/delete')
                .expect(200)
                .expect('delete');
        });
        it('should GET verb/options', () => {
            return app.httpRequest()
                .options('/verb/options')
                .expect(405)
        });
    });


    describe('test/context', () => {
        it('should GET context/query', () => {
            return app.httpRequest()
                .get('/context/query?id=1')
                .expect(200)
                .expect('1');
        });
        it('should GET context/param', () => {
            return app.httpRequest()
                .get('/context/param/1')
                .expect(200)
                .expect('1');
        });
        it('should GET context/headers', () => {
            return app.httpRequest()
                .get('/context/headers')
                .expect(200)
                .expect('127');
        });
        it('should GET context/response', () => {
            return app.httpRequest()
                .get('/context/response')
                .expect(200)
                .expect('ok');
        });
        it('should GET context/request', () => {
            return app.httpRequest()
                .get('/context/request')
                .expect(200)
                .expect('GET');
        });
        it('should GET context/session', () => {
            return app.httpRequest()
                .get('/context/session')
                .expect(200)
                .expect('{}');
        });
        it('should GET context/body', () => {
            return app.httpRequest()
                .post('/context/body')
                .type('form')
                .send({
                    id: '1',
                })
                .expect({
                    id: 1
                })
        });
    });


    describe('test/dep/**/*.js', () => {
        it('should GET dep/query', () => {
            return app.httpRequest()
                .get('/dep/query?id=1')
                .expect(200)
                .expect('1');
        });
        it('should GET innerdep/query', () => {
            return app.httpRequest()
                .get('/innerdep/query?id=1')
                .expect(200)
                .expect({
                    id: 1
                });
        });

    });

    describe('test/guard.js', () => {
        it('should GET guard', () => {
            return app.httpRequest()
                .get('/guard?id=1')
                .expect(200)
                .expect({
                    id: 1
                });
        });
        it('should GET guard/forbiden', () => {
            return app.httpRequest()
                .get('/guard/forbiden')
                .expect(403)
        });
        it('should GET guard/nothing', () => {
            return app.httpRequest()
                .get('/guard/nothing')
                .expect(200)
                .expect('nothing')
        });
    });

    describe('test/pipe.js', () => {
        it('should GET pipe/query/:id', () => {
            return app.httpRequest()
                .get('/pipe/query/12?id=1')
                .expect(200)
                .expect({
                    "type": "QUERY",
                    "val": {
                        "id": "1"
                    }
                });
        });
        it('should GET pipe', () => {
            return app.httpRequest()
                .get('/pipe/11232')
                .expect(200)
                .expect('1')
        });
        it('should GET pipe post', () => {
            return app.httpRequest()
                .post('/pipe')
                .expect(200)
                .type('form')
                .send({
                    id: 1,
                })
                .expect({
                    id: 1
                })
        });
    });

    describe('test/interceptor.js', () => {
        it('should GET interceptor/', () => {
            return app.httpRequest()
                .get('/interceptor')
                .expect(200)
                .expect({
                    "path": "/",
                    "query": {
                        "id": "1"
                    }

                });
        });
        it('should GET interceptor/body', () => {
            return app.httpRequest()
                .get('/interceptor/body')
                .expect(200)
                .expect({
                    id: 1
                })
        });
        it('should GET pipe interceptor/foo', () => {
            return app.httpRequest()
                .get('/interceptor/foo')
                .expect(200)
                .expect('/interceptor/foo')
        });
    });
});