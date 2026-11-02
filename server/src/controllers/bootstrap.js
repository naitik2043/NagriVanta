import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../config/env.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { conflict, forbidden, ok } from '../utils/http.js';

const departments = [
  { city: 'Ghaziabad', code: 'SAN', name: 'Sanitation', description: 'Waste collection and cleaning', categories: ['garbage'] },
  { city: 'Ghaziabad', code: 'JAL', name: 'Water Supply', description: 'Water pipelines and supply', categories: ['water'] },
  { city: 'Ghaziabad', code: 'ELE', name: 'Electrical (Streetlights)', description: 'Street lighting', categories: ['streetlight'] },
  { city: 'Ghaziabad', code: 'DRN', name: 'Drainage & Sewerage', description: 'Drains, sewers, waterlogging', categories: ['drainage', 'other'] },
  { city: 'Noida', code: 'SAN', name: 'Sanitation', description: 'Waste collection and cleaning', categories: ['garbage'] },
  { city: 'Noida', code: 'JAL', name: 'Water Supply', description: 'Water pipelines and supply', categories: ['water'] },
  { city: 'Noida', code: 'ELE', name: 'Electrical (Streetlights)', description: 'Street lighting', categories: ['streetlight'] },
  { city: 'Noida', code: 'DRN', name: 'Drainage & Sewerage', description: 'Drains, sewers, waterlogging', categories: ['drainage', 'other'] },
];
const targets = departments.map((department) => ({
  ...department,
  email: `${department.city === 'Ghaziabad' ? '' : `${department.city.toLowerCase()}.`}${department.code.toLowerCase()}.officer@nagrivanta.local`,
  name: `${department.city} ${department.code} Officer`,
}));
const schema = z.strictObject({
  officers: z.array(z.strictObject({ email: z.string().email(), password: z.string().min(16).max(100) })).length(targets.length),
});

function authorized(req) {
  const expected = env.staffBootstrapToken;
  const provided = req.get('x-staff-bootstrap-token') || '';
  if (!expected || Buffer.byteLength(expected) !== Buffer.byteLength(provided)) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export async function provisionDemoOfficers(req, res) {
  if (!authorized(req)) throw forbidden();
  const { officers } = schema.parse(req.body);
  if (new Set(officers.map((officer) => officer.email)).size !== targets.length
    || targets.some((target) => !officers.some((officer) => officer.email === target.email))) {
    throw conflict('Only the eight documented non-PWD demo officer accounts can be provisioned');
  }

  const existing = await User.find({ email: { $in: targets.map((target) => target.email) } }).select('email role').lean();
  if (existing.some((user) => user.role !== 'officer')) {
    throw conflict('A demo officer email is already assigned to a different role; no accounts were changed');
  }

  const departmentIds = new Map();
  for (const department of departments) {
    const record = await Department.findOneAndUpdate(
      { city: department.city, code: department.code },
      { $setOnInsert: { name: department.name, description: department.description, categories: department.categories, isActive: true } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    departmentIds.set(`${department.city}:${department.code}`, record._id);
  }

  const supplied = new Map(officers.map((officer) => [officer.email, officer.password]));
  const operations = await Promise.all(targets.map(async (target) => ({
    updateOne: {
      filter: { email: target.email, role: 'officer' },
      update: {
        $set: {
          passwordHash: await bcrypt.hash(supplied.get(target.email), 12),
          isActive: true,
          departmentId: departmentIds.get(`${target.city}:${target.code}`),
          city: target.city,
        },
        $setOnInsert: { email: target.email, name: target.name, role: 'officer' },
      },
      upsert: true,
    },
  })));
  await User.bulkWrite(operations);
  ok(res, { accounts: targets.map(({ email, city, code }) => ({ email, city, department: code })) });
}
