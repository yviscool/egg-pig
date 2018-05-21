'use strict';

const mm = require('egg-mock');
const rimraf = require('mz-modules/rimraf');
const path = require('path');

describe('test/pig.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: 'apps/pigapp',
    });
    return app.ready();
  });

  afterEach(mm.restore);
  after(() => rimraf(path.join(app.config.baseDir, 'app/public')));

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
        .expect(405);
    });
  });


  describe('test/context', () => {
    it('should GET context/context', () => {
      return app.httpRequest()
        .get('/context/context')
        .expect(200)
        .expect('ok');
    });
    it('should GET context/ctx', () => {
      return app.httpRequest()
        .get('/context/ctx')
        .expect(200)
        .expect('ok');
    });
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
          id: 1,
        });
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
          id: 1,
        });
    });

  });

  describe('test/guard.js', () => {
    it('should GET guard', () => {
      return app.httpRequest()
        .get('/guard?id=1')
        .expect(200)
        .expect({
          id: 1,
        });
    });
    it('should GET guard/forbiden', () => {
      return app.httpRequest()
        .get('/guard/forbiden')
        .expect(403);
    });
    it('should GET guard/nothing', () => {
      return app.httpRequest()
        .get('/guard/nothing')
        .expect(200)
        .expect('nothing');
    });
  });

  describe('test/pipe.js', () => {
    it('should GET pipe/query/:id', () => {
      return app.httpRequest()
        .get('/pipe/query/12?id=1')
        .expect(200)
        .expect({
          type: 'QUERY',
          val: {
            id: '1',
          },
        });
    });
    it('should GET pipe', () => {
      return app.httpRequest()
        .get('/pipe/11232')
        .expect(200)
        .expect('1');
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
          id: 1,
        });
    });
  });

  describe('test/interceptor.js', () => {
    it('should GET interceptor/', () => {
      return app.httpRequest()
        .get('/interceptor')
        .expect(200)
        .expect({
          path: '/',
          query: {
            id: '1',
          },

        });
    });
    it('should GET interceptor/body', () => {
      return app.httpRequest()
        .get('/interceptor/body')
        .expect(200)
        .expect({
          id: 1,
        });
    });
    it('should GET pipe interceptor/foo', () => {
      return app.httpRequest()
        .get('/interceptor/foo')
        .expect(204);
    });
  });


  describe('test/resources.js', () => {
    it('should GET /cats', () => {
      return app.httpRequest()
        .get('/cats')
        .expect(200)
        .expect('/cats/');
    });
    it('should GET /cats/new', () => {
      return app.httpRequest()
        .get('/cats/new')
        .expect(200)
        .expect('/cats/new');
    });
    it('should GET /cats/:id', () => {
      return app.httpRequest()
        .get('/cats/12')
        .expect(200)
        .expect('/cats/1');
    });
    it('should GET /cats/:id/edit', () => {
      return app.httpRequest()
        .get('/cats/12/edit')
        .expect(200)
        .expect('/cats/1/edit');
    });
    it('should GET /cats/create', () => {
      return app.httpRequest()
        .post('/cats')
        .expect(200)
        .expect('/cats/?id=1');
    });
    it('should GET /cats/update', () => {
      return app.httpRequest()
        .put('/cats/12')
        .expect(200)
        .expect('/cats/1');
    });
    it('should GET /cats/dectory', () => {
      return app.httpRequest()
        .delete('/cats/12')
        .expect(200)
        .expect('/cats/1');
    });
  });

  describe('test/upload.js', () => {
    it('should form', async () => {
      app.mockCsrf();
      await app.httpRequest()
        .post('/upload/form')
        .field('name', 'form')
        .attach('file', path.join(__dirname, '1.jpg'))
        .expect('ok');

      await app.httpRequest()
        .get('/public/form.jpg')
        .expect('content-length', '16424')
        .expect(200);
    });


    it('should multiple', async () => {
      app.mockCsrf();
      await app.httpRequest()
        .post('/upload/multiple')
        .field('name1', '1')
        .attach('file1', path.join(__dirname, '1.jpg'))
        .field('name2', '2')
        .attach('file2', path.join(__dirname, '2.jpg'))
        .field('name3', '3')
        .expect('ok');

      await app.httpRequest()
        .get('/public/1.jpg')
        .expect('content-length', '16424')
        .expect(200);

      await app.httpRequest()
        .get('/public/2.jpg')
        .expect('content-length', '16424')
        .expect(200);
    });
  });


  describe('test/render.js', () => {
    it('should GET render/', () => {
      return app.httpRequest()
        .get('/render?id=1')
        .expect(200)
        .expect(`<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
  </head>
  <body>
    <ul class="news-view view">
      
        <li class="item">
          <a href="/news/1">this is news 1</a>
        </li>
      
        <li class="item">
          <a href="/news/2">this is news 2</a>
        </li>
      
    </ul>
  </body>
</html>`);
    });
    it('should GET render/home', () => {
      return app.httpRequest()
        .get('/render/home')
        .expect(200)
        .expect('/render/home');
    });
  });

  describe('test/user.js', () => {
    it('should GET user', () => {
      return app.httpRequest()
        .get('/user')
        .expect(200)
        .expect('/user/test');
    });
  });


  describe('test/middleware.js', () => {
    it('should GET middleware_a/foo', () => {
      return app.httpRequest()
        .get('/middleware_a/foo')
        .expect(200)
        .expect('foo');
    });
    it('should GET middleware_a/bar', () => {
      return app.httpRequest()
        .get('/middleware_a/bar')
        .expect(200)
        .expect('bar');
    });
    it('should GET middleware_b/foo', () => {
      return app.httpRequest()
        .get('/middleware_b/foo')
        .expect(200)
        .expect('foo');
    });
    it('should GET middleware_b/bar', () => {
      return app.httpRequest()
        .get('/middleware_b/bar')
        .expect(200)
        .expect('bar');
    });
  });

  describe('test/filter.js', () => {
    it('should GET filter/common', () => {
      return app.httpRequest()
        .get('/filter/common')
        .expect(500)
        .expect('{"error":"error"}');
    });
    it('should GET filter/httpexception', () => {
      return app.httpRequest()
        .get('/filter/httpexception')
        .expect(403)
        .expect('{"statusCode":403,"message":"Forbidden"}');
    });
    it('should GET filter/another', () => {
      return app.httpRequest()
        .get('/filter/another')
        .expect(403)
        .expect('{"statusCode":403,"path":"/filter/another"}');
    });
    it('should GET filter/forbiden', () => {
      return app.httpRequest()
        .get('/filter/forbiden')
        .expect(403)
        .expect('{"statusCode":403,"message":"Forbidden"}');
    });
  });


  describe('test/helper.js', () => {
    it('should GET helper/forbiden', () => {
      return app.httpRequest()
        .get('/helper')
        .expect(200)
        .expect('admin');
    });
  });

  describe('test/exception.js', () => {
    it('should GET exception/forbiden', () => {
      return app.httpRequest()
        .get('/exception/forbiden')
        .expect(403)
        .expect('{"statusCode":403,"error":"Forbidden"}');
    });
    it('should GET exception/badrequest', () => {
      return app.httpRequest()
        .get('/exception/badrequest')
        .expect(400)
        .expect('{"statusCode":400,"error":"Bad Request"}');
    });
    it('should GET exception/unauthorized', () => {
      return app.httpRequest()
        .get('/exception/unauthorized')
        .expect(401)
        .expect('{"statusCode":401,"error":"Unauthorized"}');
    });
    it('should GET exception/notfound', () => {
      return app.httpRequest()
        .get('/exception/notfound')
        .expect(404)
        .expect('{"statusCode":404,"error":"Not Found"}');
    });
    it('should GET exception/notacceptable', () => {
      return app.httpRequest()
        .get('/exception/notacceptable')
        .expect(406)
        .expect('{"statusCode":406,"error":"Not Acceptable"}');
    });
    it('should GET exception/timeout', () => {
      return app.httpRequest()
        .get('/exception/timeout')
        .expect(408)
        .expect('{"statusCode":408,"error":"Request Timeout"}');
    });
    it('should GET exception/conflict', () => {
      return app.httpRequest()
        .get('/exception/conflict')
        .expect(409)
        .expect('{"statusCode":409,"error":"Conflict"}');
    });
    it('should GET exception/gone', () => {
      return app.httpRequest()
        .get('/exception/gone')
        .expect(410)
        .expect('{"statusCode":410,"error":"Gone"}');
    });
    it('should GET exception/payload', () => {
      return app.httpRequest()
        .get('/exception/payload')
        .expect(413)
        .expect('{"statusCode":413,"error":"Payload Too Large"}');
    });
    it('should GET exception/unsupport', () => {
      return app.httpRequest()
        .get('/exception/unsupport')
        .expect(415)
        .expect('{"statusCode":415,"error":"Unsupported Media Type"}');
    });
    it('should GET exception/unprocess', () => {
      return app.httpRequest()
        .get('/exception/unprocess')
        .expect(422)
        .expect('{"statusCode":422,"error":"Unprocessable Entity"}');
    });
    it('should GET exception/internal', () => {
      return app.httpRequest()
        .get('/exception/internal')
        .expect(500)
        .expect('{"statusCode":500,"error":"Internal Server Error"}');
    });
    it('should GET exception/notimplement', () => {
      return app.httpRequest()
        .get('/exception/notimplement')
        .expect(501)
        .expect('{"statusCode":501,"error":"Not Implemented"}');
    });
    it('should GET exception/service', () => {
      return app.httpRequest()
        .get('/exception/service')
        .expect(503)
        .expect('{"statusCode":503,"error":"Service Unavailable"}');
    });
    it('should GET exception/badgateway', () => {
      return app.httpRequest()
        .get('/exception/badgateway')
        .expect(502)
        .expect('{"statusCode":502,"error":"Bad Gateway"}');
    });
    it('should GET exception/gatewaytimeout', () => {
      return app.httpRequest()
        .get('/exception/gatewaytimeout')
        .expect(504)
        .expect( '{"statusCode":504,"error":"Gateway Timeout"}');
    });
  });
});
