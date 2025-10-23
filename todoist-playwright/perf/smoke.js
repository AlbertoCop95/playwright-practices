import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Simple sample test structure
 * Replace with real data
 */

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<400']
  }
};

export default function () {
  const res = http.get(`${BASE_URL}/your/endpoint`);
  check(res, { 'status is 200': r => r.status === 200 });
  sleep(1);
}
