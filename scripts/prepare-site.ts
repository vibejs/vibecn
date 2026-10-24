import { applyPlan, planAdd, planInit } from '../src/install.ts';
import { registry } from '../src/registry.ts';

applyPlan(planInit('site', true));
applyPlan(
  planAdd(
    'site',
    registry.map((item) => item.name),
    true,
  ),
);
