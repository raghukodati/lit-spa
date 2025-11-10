/**
 * IMPERSONATION MENU DEBUG SCRIPT
 * 
 * Paste this entire script into your browser console while logged in
 * to diagnose why the impersonation menu item is not showing
 */

(async function debugImpersonation() {
  console.log('\n🔍 ===== IMPERSONATION MENU DEBUG =====\n');

  try {
    // Step 1: Check imports
    console.log('1️⃣ Checking module imports...');
    const authModule = await import('./src/services/authService.js');
    const dataModule = await import('./src/services/dataService.js');
    const caslModule = await import('./src/services/casl-permission.service.js');
    const impersonationModule = await import('./src/services/impersonation.service.js');
    
    const { getCurrentUser } = authModule;
    const { hasModuleAccess } = dataModule;
    const { hasPermission } = caslModule;
    const { impersonationService } = impersonationModule;
    
    console.log('✅ All modules imported successfully');

    // Step 2: Check current user
    console.log('\n2️⃣ Checking current user...');
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ No user logged in!');
      return;
    }
    console.log('✅ User:', {
      id: user.id,
      name: user.name,
      email: user.email,
      assignedRoles: user.assignedRoles
    });

    // Step 3: Check user roles
    console.log('\n3️⃣ Checking user roles...');
    const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
    const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
    const userFromDb = users.find(u => u.id === user.id);
    
    if (!userFromDb) {
      console.error('❌ User not found in users_cache');
      return;
    }
    
    const userRoles = (userFromDb.assignedRoles || [])
      .map(roleId => roles.find(r => r.id === roleId))
      .filter(Boolean);
    
    console.log('✅ User roles:', userRoles.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      permissions: r.permissions
    })));

    // Step 4: Check admin module access
    console.log('\n4️⃣ Checking admin module access...');
    const hasAdmin = hasModuleAccess('admin');
    console.log(hasAdmin ? '✅' : '❌', 'Has admin module access:', hasAdmin);
    
    if (!hasAdmin) {
      console.log('📋 User permissions from roles:');
      userRoles.forEach(role => {
        console.log(`  - ${role.name}:`, role.permissions);
      });
    }

    // Step 5: Check users.read permission
    console.log('\n5️⃣ Checking users.read permission...');
    const hasUsersRead = hasPermission('users', 'read');
    console.log(hasUsersRead ? '✅' : '❌', 'Has users.read permission:', hasUsersRead);

    // Step 6: Check canImpersonate
    console.log('\n6️⃣ Checking canImpersonate()...');
    const canImp = impersonationService.canImpersonate();
    console.log(canImp ? '✅' : '❌', 'Can impersonate:', canImp);

    // Step 7: Check menu config
    console.log('\n7️⃣ Checking menu configuration...');
    const configResponse = await fetch('/src/shared/components/side-nav/menu-config.json');
    const menuConfig = await configResponse.json();
    const adminItems = menuConfig.moduleSubmenus.admin.items;
    const impersonateItem = adminItems.find(item => item.id === 'impersonate');
    
    if (!impersonateItem) {
      console.error('❌ Impersonate menu item NOT found in config!');
    } else {
      console.log('✅ Impersonate menu item found:', impersonateItem);
    }

    // Step 8: Summary
    console.log('\n📊 ===== SUMMARY =====');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Admin module access: ${hasAdmin ? '✅ YES' : '❌ NO'}`);
    console.log(`users.read permission: ${hasUsersRead ? '✅ YES' : '❌ NO'}`);
    console.log(`Can impersonate: ${canImp ? '✅ YES' : '❌ NO'}`);
    console.log(`Menu item in config: ${impersonateItem ? '✅ YES' : '❌ NO'}`);

    if (canImp && impersonateItem) {
      console.log('\n✅ RESULT: Menu item SHOULD be visible!');
      console.log('   If not visible, try:');
      console.log('   1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)');
      console.log('   2. Clear cache: localStorage.clear(); location.reload();');
      console.log('   3. Check browser console for JavaScript errors');
    } else {
      console.log('\n❌ RESULT: Menu item will NOT be visible because:');
      if (!hasAdmin) console.log('   - User lacks admin module access');
      if (!hasUsersRead) console.log('   - User lacks users.read permission');
      if (!impersonateItem) console.log('   - Menu item not in configuration');
      
      console.log('\n🔧 FIX:');
      if (!hasAdmin || !hasUsersRead) {
        console.log('   Assign user a role with admin permissions including users.read');
      }
    }

    console.log('\n✅ ===== DEBUG COMPLETE =====\n');

  } catch (error) {
    console.error('\n❌ ERROR during debug:', error);
    console.error('Stack:', error.stack);
  }
})();
