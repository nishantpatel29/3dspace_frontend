 import React from 'react'
 import { Button } from '../../components/ui/button'
 import { Trash2 } from 'lucide-react'

export default function OpenDialog({ isOpen, loading, error, files, onClose, onOpen, onAskDelete }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[28rem] max-w-[90vw] mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Open Design</h2>
        <div className="max-h-80 overflow-y-auto space-y-2">
          {loading && <div className="text-gray-400 text-sm">Loading files...</div>}
          {!!error && <div className="text-red-400 text-sm">{error}</div>}
          {!loading && !error && files.length === 0 && (
            <div className="text-gray-400 text-sm">No files found.</div>
          )}
          {files.map(file => (
            <div key={file._id} className="flex items-center justify-between glass-panel p-3 rounded border border-gray-700">
              <div className="min-w-0 pr-3">
                <div className="text-white text-sm truncate" title={file.name}>{file.name}</div>
                <div className="text-gray-400 text-xs truncate" title={file.description || ''}>{file.description || '—'}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={() => onOpen(file._id)}>Open</Button>
                <Button size="sm" variant="outline" title="Delete" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white p-2" onClick={() => onAskDelete(file)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-4 justify-end">
          <Button variant="outline" className="border-gray-700 text-gray-300" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}


