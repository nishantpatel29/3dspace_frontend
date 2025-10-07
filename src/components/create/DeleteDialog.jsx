 import React from 'react'
 import { Button } from '../../components/ui/button'

export default function DeleteDialog({ isOpen, fileName, onCancel, onDelete }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-semibold text-white mb-2">Delete file</h2>
        <p className="text-gray-300 mb-4 text-sm">Are you sure you want to delete <span className="text-white font-medium">{fileName || 'this file'}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="border-gray-700 text-gray-300" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  )
}


