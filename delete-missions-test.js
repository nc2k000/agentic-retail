// Delete all missions for testing
// Run with: node delete-missions-test.js

async function deleteMissions() {
  try {
    const response = await fetch('http://localhost:3000/api/missions/delete-all', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('Delete result:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

deleteMissions()
