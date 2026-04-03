import { verifyAdminPassword } from './_security.js';
import assert from 'node:assert';

async function testVerifyAdminPassword() {
  console.log('Testing verifyAdminPassword...');

  // Case 1: ADMIN_PASSWORD is set
  process.env.ADMIN_PASSWORD = 'test-password';
  assert.strictEqual(verifyAdminPassword('test-password'), true, 'Should return true for correct password');
  assert.strictEqual(verifyAdminPassword('wrong-password'), false, 'Should return false for wrong password');

  // Case 2: ADMIN_PASSWORD is NOT set
  delete process.env.ADMIN_PASSWORD;
  console.log('Expect an error message below about missing ADMIN_PASSWORD:');
  assert.strictEqual(verifyAdminPassword('any-password'), false, 'Should return false if ADMIN_PASSWORD is not set');

  console.log('✅ verifyAdminPassword tests passed');
}

try {
  await testVerifyAdminPassword();
  console.log('Security verification passed! 🛡️');
} catch (error) {
  console.error('Test failed! ❌');
  console.error(error);
  process.exit(1);
}
