const request = require('supertest');
const http = require('http');
const app = require('../index'); // modify index.js to export `app` for testing
const { actionManager } = require('../ActionManager');

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe('Actions API', () => {
  test('GET /api/health should return status ok', async () => {
    const res = await request(server).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('POST /api/actions/start should start a new SpecGenerator action', async () => {
    const res = await request(server)
      .post('/api/actions/start')
      .send({
        actionType: 'SpecGenerator',
        additionalInput: { requirements: 'Test requirement spec' }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('actionId');

    // Check action is now live
    const live = actionManager.getLiveActions();
    expect(live.some(a => a.id === res.body.actionId)).toBe(true);
  });

  test('GET /api/actions/live should list running actions', async () => {
    const res = await request(server).get('/api/actions/live');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('live');
    expect(Array.isArray(res.body.live)).toBe(true);
  });

  test('POST /api/actions/stop/:id should stop a running action', async () => {
    // First start an action
    const startRes = await request(server)
      .post('/api/actions/start')
      .send({
        actionType: 'SpecGenerator',
        additionalInput: { requirements: 'Stop test' }
      });

    const actionId = startRes.body.actionId;
    expect(actionId).toBeDefined();

    // Now stop it
    const stopRes = await request(server).post(`/api/actions/stop/${actionId}`);
    expect(stopRes.statusCode).toBe(200);
    expect(stopRes.body.message).toMatch(`Action ${actionId} stopped.`);

    // Check it's no longer running
    const live = actionManager.getLiveActions();
    expect(live.some(a => a.id === actionId)).toBe(false);
  });

  test('POST /api/actions/stop-all should stop all actions', async () => {
    // Start a couple of actions
    await request(server).post('/api/actions/start')
      .send({ actionType: 'SpecGenerator', additionalInput: { requirements: 'First action' } });
    await request(server).post('/api/actions/start')
      .send({ actionType: 'SpecGenerator', additionalInput: { requirements: 'Second action' } });

    // Now stop all
    const res = await request(server).post('/api/actions/stop-all');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch('All actions stopped.');

    // Confirm no running actions
    const live = actionManager.getLiveActions();
    expect(live.length).toBe(0);
  });

  test('GET /api/actions/history should return completed action history', async () => {
    const res = await request(server).get('/api/actions/history');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('history');
    expect(Array.isArray(res.body.history)).toBe(true);
  });
});
