import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestVehicleFormats, type VehicleNeeds } from '../src/lib/vehicle-fit.ts';
const base: VehicleNeeds = { crew: 'solo-couple', rhythm: 'moving', comfort: 'simple', daily: 'yes', retro: 'no', ladder: 'no' };
test('daily compact travel has two distinct explained suggestions', () => {
  const results = suggestVehicleFormats(base);
  assert.equal(results[0].id, 'compact');
  assert.equal(new Set(results.map(r => r.id)).size, 2);
  assert.ok(results.every(r => r.why && r.check));
});
test('ladder and retro preferences are respected across all combinations', () => {
  for (const crew of ['solo-couple', 'family'] as const) for (const rhythm of ['moving', 'base'] as const) for (const comfort of ['simple', 'inside'] as const) for (const daily of ['yes', 'no'] as const) {
    const results = suggestVehicleFormats({ ...base, crew, rhythm, comfort, daily });
    assert.ok(results.every(r => r.id !== 'toit' && r.id !== 'retro'));
  }
});
test('camping base and indoor family use highlights caravan or motorhome', () => {
  const results = suggestVehicleFormats({ ...base, crew: 'family', rhythm: 'base', comfort: 'inside', daily: 'no' });
  assert.deepEqual(new Set(results.map(r => r.id)), new Set(['caravane', 'campingcar']));
});
