import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../config/env.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { conflict, forbidden, ok } from '../utils/http.js';

const schema = z.strictObject({
  adminPassword: z.string().min(16).max(100),
  ghaziabadOfficerPassword: z.string().min(16).max(100),
  noidaOfficerPassword: z.string().min(16).max(100),
});

function authorized(req) {
  const expected = env.staffBootstrapToken;
  const provided = req.get('x-staff-bootstrap-token') || '';
  if (!expected || Buffer.byteLength(expected) !== Buffer.byteLength(provided)) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export async function provisionDemoStaff(req, res) {
  if (!authorized(req)) throw forbidden();
  const passwords = schema.parse(req.body);
  const targets = [
    { email: 'admin@nagrivanta.local', name: 'Asha Admin', role: 'admin', password: passwords.adminPassword },
    { email: 'pwd.officer@nagrivanta.local', name: 'Ghaziabad PWD Officer', role: 'officer', city: 'Ghaziabad', password: passwords.ghaziabadOfficerPassword },
    { email: 'noida.pwd.officer@nagrivanta.local', name: 'Noida PWD Officer', role: 'officer', city: 'Noida', password: passwords.noidaOfficerPassword },
  ];

  const existing = await User.find({ email: { $in: targets.map((u) => u.email) } }).select('email role').lean();
  const conflicts = existing.filter((u) => u.role !== targets.find((t) => t.email === u.email)?.role);
  if (conflicts.length) throw conflict('A demo staff email is already assigned to a different role; no accounts were changed');

  const departments = new Map();
  for (const city of ['Ghaziabad', 'Noida']) {
    const department = await Department.findOneAndUpdate(
      { city, code: 'PWD' },
      { $setOnInsert: { name: 'Public Works (Roads)', description: 'Roads, potholes, footpaths', categories: ['road'], isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    departments.set(city, department);
  }

  const operations = [];
  for (const target of targets) {
    const passwordHash = await bcrypt.hash(target.password, 12);
    const $set = { passwordHash, isActive: true };
    const $setOnInsert = { email: target.email, name: target.name, role: target.role };
    if (target.role === 'officer') {
      $set.departmentId = departments.get(target.city)._id;
      $set.city = target.city;
      $setOnInsert.name = `${target.city} PWD Officer`;
    }
    operations.push({ updateOne: { filter: { email: target.email, role: target.role }, update: { $set, $setOnInsert }, upsert: true } });
  }
  await User.bulkWrite(operations);
  ok(res, { accounts: targets.map(({ email, role, city }) => ({ email, role, ...(city ? { city } : {}) })) });
}
