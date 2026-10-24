import { applyPlan, planAdd, planInit } from '../src/install.ts';
import { registry } from '../src/registry.ts';

applyPlan(planInit('playground', true));
applyPlan(
  planAdd(
    'playground',
    registry.map((item) => item.name),
    true,
  ),
);
