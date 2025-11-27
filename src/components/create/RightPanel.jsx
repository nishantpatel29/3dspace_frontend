import React from 'react'
import { useDrag } from 'react-dnd'
import { Button } from '../../components/ui/button'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from '../../components/ui/separator'
import { Search, Sofa, Table, Lamp, BookOpen, Bed, Home, RotateCw, Trash2 } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { CardContent } from '../../components/ui/card'

function DraggableCatalogCard({ item, onAdd, children }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'FURNITURE_ITEM',
    item: { itemId: item.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (_dragged, monitor) => {
      if (!monitor.didDrop()) {
        onAdd?.()
      }
    },
  }), [item, onAdd])

  return (
    <div
      ref={dragRef}
      className={`glass-panel cursor-pointer hover:border-green-400 transition-colors group ${isDragging ? 'opacity-50' : ''}`}
      onClick={onAdd}
    >
      {children}
    </div>
  )
}

export default function RightPanel({
  rightPanelOpen,
  toggleRightPanel,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredFurniture,
  addFurniture,
  selectedFurnitureItem,
  handleFurnitureColorChange,
  rotateSelectedFurniture,
  deleteSelectedFurniture,
  selectedTool,
  selectedWallId,
  drawingElements,
  handleWallColorChange,
}) {
  return (
    <div className={`${rightPanelOpen ? 'w-72 md:w-80' : 'w-0 md:w-16'} bg-gray-950 border-l border-gray-800 flex flex-col transition-all duration-300 relative`}>
      <div className="p-3 md:p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-white ${!rightPanelOpen && 'hidden'}`}>Properties</h2>
          <Button variant="ghost" size="sm" onClick={toggleRightPanel} className="text-gray-400 hover:text-white">{rightPanelOpen ? <span className="h-4 w-4">×</span> : <span className="h-4 w-4">≡</span>}</Button>
        </div>
      </div>
      {rightPanelOpen && (
        <ScrollArea className="flex-1 scroll-panel">
          <div className="p-3 md:p-4 space-y-4">
            {selectedFurnitureItem && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Item</h3>
                <div className="space-y-3">
                  <p className="text-white text-sm font-medium">{selectedFurnitureItem.name}</p>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={selectedFurnitureItem.color} onChange={(e) => handleFurnitureColorChange(selectedFurnitureItem.id, e.target.value)} className="w-10 h-10 p-1 bg-gray-800 border-gray-700" />
                    <Input type="text" value={selectedFurnitureItem.color} onChange={(e) => handleFurnitureColorChange(selectedFurnitureItem.id, e.target.value)} className="flex-1 bg-gray-800 border-gray-700 text-white text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={rotateSelectedFurniture} className="flex-1 bg-transparent">
                      <RotateCw className="h-4 w-4 mr-1" />Rotate
                    </Button>
                    <Button variant="outline" size="sm" onClick={deleteSelectedFurniture} className="flex-1 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-1" />Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Furniture Catalog</h3>
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="text" placeholder="Search furniture..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-400 text-sm" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(category => (
                  <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)} className={`text-xs ${selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                    {category}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredFurniture.map(item => (
                  <DraggableCatalogCard key={item.id} item={item} onAdd={() => addFurniture(item.id)}>
                    <CardContent className="p-2">
                      <div className="aspect-square bg-gray-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                        {item.category === 'Seating' && <Sofa className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                        {item.category === 'Tables' && <Table className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                        {item.category === 'Lighting' && <Lamp className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                        {item.category === 'Storage' && <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                        {item.category === 'Bedroom' && <Bed className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                        {!['Seating', 'Tables', 'Lighting', 'Storage', 'Bedroom'].includes(item.category) && <Home className="h-6 w-6 text-gray-400 group-hover:text-green-400 transition-colors" />}
                      </div>
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    </CardContent>
                  </DraggableCatalogCard>
                ))}
              </div>
              {filteredFurniture.length === 0 && (
                <div className="text-center text-gray-400 mt-4">
                  <p className="text-sm">No furniture found</p>
                </div>
              )}
            </div>
            <Separator />
            
            {selectedTool === 'select' && selectedWallId && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Wall Properties</h3>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">Click a wall on canvas, then change color.</p>
                    <div className="flex items-center gap-2">
                      <Input type="color" value={(drawingElements.find(e => e.id === selectedWallId)?.color) || '#666666'} onChange={(e) => selectedWallId && handleWallColorChange(selectedWallId, e.target.value)} className="w-10 h-10 p-1 bg-gray-800 border-gray-700" />
                      <Input type="text" value={(drawingElements.find(e => e.id === selectedWallId)?.color) || ''} onChange={(e) => selectedWallId && handleWallColorChange(selectedWallId, e.target.value)} placeholder="#666666" className="flex-1 bg-gray-800 border-gray-700 text-white text-xs" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}


