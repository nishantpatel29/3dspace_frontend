 import React from 'react'
 import { Button } from '../../components/ui/button'
 import { Input } from '../../components/ui/input'

export default function SaveDialog({ isOpen, name, description, onChange, onSave, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Save Design</h2>
        <div className="space-y-3">
          <Input type="text" placeholder="Name" value={name} onChange={(e) => onChange({ name: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
          <Input type="text" placeholder="Description (optional)" value={description} onChange={(e) => onChange({ description: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
          <div className="flex gap-2 pt-2">
            <Button className="bg-green-600 hover:bg-green-700" onClick={onSave}>Save</Button>
            <Button variant="outline" className="border-gray-700 text-gray-300" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


