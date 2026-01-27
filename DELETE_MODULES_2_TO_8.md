# Delete Modules 2-8

Quick guide to delete modules 2 through 8 from your database.

## Method 1: Browser Console (Easiest)

1. **Open your app** in the browser (make sure you're logged in as admin)
2. **Open Developer Console** (F12 or Right-click → Inspect → Console)
3. **Copy and paste** this code:

```javascript
(async function deleteModules2to8() {
  try {
    const modulesToDelete = [2, 3, 4, 5, 6, 7, 8];
    console.log(`🗑️  Deleting modules: ${modulesToDelete.join(', ')}...`);

    const response = await fetch('/api/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'delete',
        resource: 'modules',
        data: modulesToDelete,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Delete failed');
    }

    const result = await response.json();
    console.log(`✅ Successfully deleted ${result.result.deleted} modules`);
    console.log('📊 Full result:', result);
    
    // Reload the page to see changes
    if (confirm('Modules deleted successfully! Reload page to see changes?')) {
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    alert('Error deleting modules: ' + error.message);
  }
})();
```

4. **Press Enter** to execute
5. **Confirm** when prompted to reload the page

## Method 2: Using API Helper (From Code)

If you want to delete modules programmatically from your React code:

```typescript
import { bulkDeleteModules } from './utils/api';

// Delete modules 2-8
const result = await bulkDeleteModules([2, 3, 4, 5, 6, 7, 8]);
if (result.success) {
  console.log(`Deleted ${result.data?.result.deleted} modules`);
} else {
  console.error('Error:', result.error);
}
```

## Method 3: Direct API Call (cURL)

If you have an admin session cookie:

```bash
curl -X POST http://localhost:3000/api/bulk \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_ADMIN_TOKEN" \
  -d '{
    "operation": "delete",
    "resource": "modules",
    "data": [2, 3, 4, 5, 6, 7, 8]
  }'
```

## What Gets Deleted?

- ✅ Modules 2, 3, 4, 5, 6, 7, 8
- ⚠️ **Note**: This will also delete:
  - All questions associated with these modules
  - All videos associated with these modules
  - All answers submitted for these modules

## Verification

After deletion, check that only Module 1 remains:

```javascript
// In browser console
fetch('/api/modules')
  .then(r => r.json())
  .then(data => console.log('Remaining modules:', data.modules.map(m => m.id)));
```

---

**⚠️ Warning**: This action cannot be undone! Make sure you have a backup if needed.
