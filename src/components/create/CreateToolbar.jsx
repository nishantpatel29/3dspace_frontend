 import React from 'react'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Grid3X3, ZoomIn, ZoomOut, Download, Undo, Redo, Ruler, Sparkles } from 'lucide-react'

export default function CreateToolbar({
  currentFile,
  undo,
  redo,
  canUndo,
  canRedo,
  activeMode,
  gridVisible,
  setGridVisible,
  showMeasurements,
  setShowMeasurements,
  zoomLevel,
  setZoomLevel,
  onSaveClick,
  onNewClick,
  onOpenClick,
  onExportClick,
  onAIGenerateClick,
  aiGenerating,
}) {
  return (
    <div className="h-16 bg-gray-950 border-b border-gray-800 flex items-center px-4 gap-2 overflow-x-auto flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300 truncate max-w-[30vw]" title={currentFile?.name || 'Untitled'}>
          {currentFile?.name || 'Untitled'}
        </span>
        <Button variant="outline" size="default" onClick={undo} disabled={!canUndo} title="Undo"><Undo className="h-5 w-5" /></Button>
        <Button variant="outline" size="default" onClick={redo} disabled={!canRedo} title="Redo"><Redo className="h-5 w-5" /></Button>
      </div>
      <Separator orientation="vertical" className="h-8" />
      <div className="flex items-center gap-2">
        <Button variant={gridVisible ? 'default' : 'outline'} size="default" onClick={() => setGridVisible(!gridVisible)} title="Toggle Grid"><Grid3X3 className="h-5 w-5" /></Button>
        {activeMode === '2D' && (
          <Button variant={showMeasurements ? 'default' : 'outline'} size="default" onClick={() => setShowMeasurements(!showMeasurements)} title="Measurements"><Ruler className="h-5 w-5" /></Button>
        )}
      </div>
      {activeMode === '2D' && (
        <>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" onClick={() => setZoomLevel(z => Math.max(25, z - 25))} title="Zoom Out"><ZoomOut className="h-5 w-5" /></Button>
            <span className="text-sm text-gray-400 min-w-[60px] text-center">{zoomLevel}%</span>
            <Button variant="outline" size="default" onClick={() => setZoomLevel(z => Math.min(400, z + 25))} title="Zoom In"><ZoomIn className="h-5 w-5" /></Button>
          </div>
        </>
      )}
      <div className="ml-auto flex items-center gap-2">
        <Button className="bg-purple-600 hover:bg-purple-500" size="default" onClick={onAIGenerateClick} disabled={aiGenerating}>
          <Sparkles className="h-5 w-5 mr-2" />
          {aiGenerating ? 'Generating…' : 'Generate with AI'}
        </Button>
        <Button variant="outline" size="default" title="Save" onClick={onSaveClick}>Save</Button>
        <Button variant="outline" size="default" onClick={onNewClick}><span className="hidden md:inline">+ New</span><span className="md:hidden">New</span></Button>
        <Button variant="outline" size="default" onClick={onOpenClick}><span className="hidden md:inline">Open</span><span className="md:hidden">Open</span></Button>
        <Button className="bg-green-600 hover:bg-green-700" size="default" onClick={onExportClick}><Download className="h-5 w-5 mr-2" /><span className="hidden md:inline">Download</span></Button>
      </div>
    </div>
  )
}


