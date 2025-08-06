// Simple test script to verify the hybrid form implementation
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Hybrid Form Implementation...\n');

// Test 1: Check if create page redirects properly
const createPagePath = path.join(__dirname, 'app/admin/posts/create/page.tsx');
const createPageContent = fs.readFileSync(createPagePath, 'utf8');

if (createPageContent.includes("router.replace('/admin/posts/new/edit')")) {
    console.log('✅ Create page redirects to hybrid form');
} else {
    console.log('❌ Create page does not redirect properly');
}

// Test 2: Check if edit page exists and handles both modes
const editPagePath = path.join(__dirname, 'app/admin/posts/[id]/edit/page.tsx');
const editPageContent = fs.readFileSync(editPagePath, 'utf8');

if (editPageContent.includes('const isCreate = id === \'new\'')) {
    console.log('✅ Edit page detects create mode correctly');
} else {
    console.log('❌ Edit page does not detect create mode');
}

if (editPageContent.includes('const action = isCreate ? createPost : updatePost')) {
    console.log('✅ Edit page uses correct action based on mode');
} else {
    console.log('❌ Edit page does not use correct action');
}

// Test 3: Check if API route exists
const apiRoutePath = path.join(__dirname, 'app/api/posts/[id]/route.ts');
if (fs.existsSync(apiRoutePath)) {
    console.log('✅ API route exists for fetching post data');
} else {
    console.log('❌ API route missing');
}

// Test 4: Check form validation logic
if (editPageContent.includes('schema: isCreate ? postSchema.omit({id: true}) : postSchema')) {
    console.log('✅ Form validation adapts to create/edit mode');
} else {
    console.log('❌ Form validation does not adapt properly');
}

// Test 5: Check form title changes
if (editPageContent.includes('{isCreate ? \'Create Post\' : \'Edit Post\'}')) {
    console.log('✅ Form title changes based on mode');
} else {
    console.log('❌ Form title does not change');
}

console.log('\n🎉 Hybrid form implementation verification complete!');
console.log('\nRouting structure:');
console.log('- /admin/posts/create → redirects to → /admin/posts/new/edit (create mode)');
console.log('- /admin/posts/[id]/edit → edit mode for existing posts');
console.log('- Single form component handles both create and edit operations');