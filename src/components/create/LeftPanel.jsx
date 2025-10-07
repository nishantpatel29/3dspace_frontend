 import React from 'react'
 import { Button } from '../../components/ui/button'
 import { ScrollArea } from '../../components/ui/scroll-area'
 import { Separator } from '../../components/ui/separator'

export default function LeftPanel({
  leftPanelOpen,
  toggleLeftPanel,
  activeMode,
  setActiveMode,
  currentTools,
  selectedTool,
  setSelectedTool,
  templates,
  loadTemplate,
  MonitorIcon,
  BoxIcon,
}) {
  return (
    <div className={`${leftPanelOpen ? 'w-72 md:w-80' : 'w-0 md:w-16'} bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300 relative`}>
      <div className="p-3 md:p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-white ${!leftPanelOpen && 'hidden'}`}>Design Tools</h2>
          <Button variant="ghost" size="sm" onClick={toggleLeftPanel} className="text-gray-400 hover:text-white">{leftPanelOpen ? <span className="h-4 w-4">×</span> : <span className="h-4 w-4">≡</span>}</Button>
        </div>
        {leftPanelOpen && (
          <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
            <Button variant={activeMode === '2D' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setActiveMode('2D')}><MonitorIcon className="h-4 w-4 mr-1" />2D</Button>
            <Button variant={activeMode === '3D' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setActiveMode('3D')}><BoxIcon className="h-4 w-4 mr-1" />3D</Button>
          </div>
        )}
      </div>
      {leftPanelOpen && (
        <ScrollArea className="flex-1">
          <div className="p-3 md:p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {activeMode === '2D' ? 'Drawing Tools' : '3D Tools'}
              </h3>
              <div className="space-y-1">
                {currentTools.map(tool => {
                  const Icon = tool.icon
                  return (
                    <Button 
                      key={tool.id} 
                      variant={selectedTool === tool.id ? 'default' : 'ghost'} 
                      size="sm" 
                      className={`w-full justify-start text-xs sm:text-sm ${selectedTool === tool.id ? '' : 'text-white'}`} 
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />{tool.name}
                    </Button>
                  )
                })}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Templates</h3>
              <div className="space-y-2">
                {templates.map(t => (
                  <Button key={t.id} variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" onClick={() => loadTemplate(t.id)}>
                    {t.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}


