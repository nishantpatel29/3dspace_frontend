import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'
import { Square, Undo, Redo, Grid3X3, ZoomIn, ZoomOut, Save, Download, Settings, Search, Home, Bed, ChefHat, Sofa, Lamp, Table, BookOpen, X, Menu, Eye, EyeOff, RotateCw, Trash2, MousePointer, BedSingle as Rectangle, DoorOpen, Maximize, Layers, Ruler, FolderOpen, Plus, Minus, Move, Edit3, Paintbrush, FileText, Monitor, Box } from 'lucide-react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid as DreiGrid, Box as DreiBox, Plane as DreiPlane, Environment, ContactShadows } from '@react-three/drei'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { authAPI } from '../apis/auth'

// File Management Dialog
function FileDialog({ isOpen, onClose, onNew, onOpen }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Create New Project</h2>
        <p className="text-gray-400 mb-6">Start with a template or create from scratch</p>
        
        <div className="space-y-3">
          <Button onClick={onNew} className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Project
          </Button>
          <Button onClick={onOpen} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
            <FolderOpen className="h-4 w-4 mr-2" />
            Open Existing Project
          </Button>
          <Button onClick={onClose} variant="ghost" className="w-full text-gray-400">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function FurnitureModel({ item, isSelected, onSelect, onPositionChange }) {
  const meshRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const getFurnitureGeometry = (category, type) => {
    switch (category) {
      case 'Seating':
        if (type === 'Modern Sofa') {
          return (
            <group>
              <DreiBox args={[2.5, 0.4, 1.2]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
              <DreiBox args={[2.5, 1.2, 0.3]} position={[0, 0.8, -0.45]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
              <DreiBox args={[0.3, 1, 1.2]} position={[1.1, 0.7, 0]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
              <DreiBox args={[0.3, 1, 1.2]} position={[-1.1, 0.7, 0]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
            </group>
          )
        } else {
          return (
            <group>
              <DreiBox args={[0.8, 0.4, 0.8]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
              <DreiBox args={[0.8, 0.8, 0.2]} position={[0, 0.6, -0.3]}>
                <meshStandardMaterial color={item.color} />
              </DreiBox>
            </group>
          )
        }
      case 'Tables':
        return (
          <group>
            <DreiBox args={[2, 0.1, 1]} position={[0, 0.75, 0]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
            <DreiBox args={[0.1, 0.75, 0.1]} position={[0.9, 0.375, 0.4]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
            <DreiBox args={[0.1, 0.75, 0.1]} position={[-0.9, 0.375, 0.4]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
            <DreiBox args={[0.1, 0.75, 0.1]} position={[0.9, 0.375, -0.4]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
            <DreiBox args={[0.1, 0.75, 0.1]} position={[-0.9, 0.375, -0.4]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
          </group>
        )
      case 'Storage':
        return (
          <DreiBox args={[1.2, 2, 0.5]} position={[0, 1, 0]}>
            <meshStandardMaterial color={item.color} />
          </DreiBox>
        )
      case 'Lighting':
        return (
          <group>
            <DreiBox args={[0.05, 1.8, 0.05]} position={[0, 0.9, 0]}>
              <meshStandardMaterial color="#333333" />
            </DreiBox>
            <DreiBox args={[0.6, 0.6, 0.6]} position={[0, 2, 0]}>
              <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.2} />
            </DreiBox>
          </group>
        )
      case 'Bedroom':
        return (
          <group>
            <DreiBox args={[2, 0.3, 3]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
            <DreiBox args={[2, 0.8, 0.2]} position={[0, 0.55, -1.4]}>
              <meshStandardMaterial color={item.color} />
            </DreiBox>
          </group>
        )
      default:
        return (
          <DreiBox args={[1, 1, 1]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color={item.color} />
          </DreiBox>
        )
    }
  }

  const handlePointerDown = (event) => {
    event?.stopPropagation?.()
    setIsDragging(true)
    onSelect()
  }
  const handlePointerMove = (event) => {
    if (isDragging && meshRef.current && event?.point) {
      const newPosition = { x: event.point.x, y: item.position.y, z: event.point.z }
      if (meshRef.current.position) meshRef.current.position.copy(newPosition)
      onPositionChange(newPosition)
    }
  }
  const handlePointerUp = () => setIsDragging(false)

  return (
    <group
      ref={meshRef}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {getFurnitureGeometry(item.category, item.type)}
      {isSelected && (
        <DreiBox args={[3, 2.5, 3]} position={[0, 1.25, 0]}>
          <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.3} />
        </DreiBox>
      )}
    </group>
  )
}

function Scene3D({ placedFurniture, selectedFurniture, onFurnitureSelect, onFurniturePositionChange, drawingElements, gridVisible }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 15, 10]} intensity={0.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[5, 8, 5]} intensity={0.2} />
      <Environment preset="city" background={false} />
      <DreiPlane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={1} metalness={0} />
      </DreiPlane>
      {gridVisible && <DreiGrid args={[100, 100]} position={[0, 0.002, 0]} />}
      {drawingElements.filter(el => el.type === 'wall' && el.completed).map((wall, index) => (
        <group key={`wall-${index}`}>
          {wall.points.map((point, i) => {
            if (i === wall.points.length - 1) return null
            const nextPoint = wall.points[i + 1]
            if (!nextPoint) return null
            const length = Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y)
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)
            return (
              <DreiBox key={i} args={[length, 3, 0.2]} position={[(point.x + nextPoint.x) / 2, 1.5, (point.y + nextPoint.y) / 2]} rotation={[0, angle, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={wall.color} />
              </DreiBox>
            )
          })}
        </group>
      ))}
      {/* Windows as glass inserts */}
      {drawingElements.filter(el => el.type === 'window').map((win, idx) => {
        const wall = drawingElements.find(w => w.id === win.wallId)
        if (!wall) return null
        const a = wall.points[win.segmentIndex]
        const b = wall.points[win.segmentIndex + 1]
        if (!a || !b) return null
        const length = Math.hypot(b.x - a.x, b.y - a.y)
        const angle = Math.atan2(b.y - a.y, b.x - a.x)
        const cx = (a.x + b.x) / 2
        const cz = (a.y + b.y) / 2
        const wx = a.x + (b.x - a.x) * win.t
        const wz = a.y + (b.y - a.y) * win.t
        return (
          <group key={`win-${idx}`}>
            <DreiBox args={[0.05, win.height, 0.3]} position={[wx, win.sill + win.height / 2, wz]} rotation={[0, angle, 0]}>
              <meshPhysicalMaterial color={win.color || '#22d3ee'} transparent opacity={0.5} roughness={0.1} metalness={0} transmission={0.9} />
            </DreiBox>
          </group>
        )
      })}
      {/* Doors */}
      {drawingElements.filter(el => el.type === 'door').map((door, idx) => {
        const wall = drawingElements.find(w => w.id === door.wallId)
        if (!wall) return null
        const a = wall.points[door.segmentIndex]
        const b = wall.points[door.segmentIndex + 1]
        if (!a || !b) return null
        const length = Math.hypot(b.x - a.x, b.y - a.y)
        const angle = Math.atan2(b.y - a.y, b.x - a.x)
        const dx = a.x + (b.x - a.x) * door.t
        const dz = a.y + (b.y - a.y) * door.t
        return (
          <group key={`door-${idx}`}>
            <DreiBox args={[0.1, door.height, door.width]} position={[dx, door.height / 2, dz]} rotation={[0, angle, 0]}>
              <meshStandardMaterial color={door.color || '#8B4513'} />
            </DreiBox>
          </group>
        )
      })}
      {placedFurniture.map(item => (
        <FurnitureModel key={item.id} item={item} isSelected={selectedFurniture === item.id} onSelect={() => onFurnitureSelect(item.id)} onPositionChange={(pos) => onFurniturePositionChange(item.id, pos)} />
      ))}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={50} blur={2} far={10} />
      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={50} />
    </>
  )
}

function ThreeContextBridge({ onReady }) {
  const { scene, camera, gl } = useThree()
  useEffect(() => { onReady?.({ scene, camera, gl }) }, [onReady, scene, camera, gl])
  return null
}

function Canvas2D({ drawingElements, currentDrawing, selectedTool, gridVisible, zoomLevel, selectedWallId, placedFurniture, selectedFurniture, snapToGrid, showMeasurements, onCanvasClick, onCanvasDoubleClick, onWallSelect, onFurnitureSelect, onFurniture2DPositionChange }) {
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFurniture, setDraggedFurniture] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Ensure canvas internal size matches displayed size for accurate coordinates
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const width = Math.max(1, Math.floor(rect.width * dpr))
      const height = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(zoomLevel / 100, zoomLevel / 100)
    if (gridVisible) {
      for (let i = -50; i <= 50; i++) {
        if (i % 5 === 0) { ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1 }
        else { ctx.strokeStyle = '#374151'; ctx.lineWidth = 0.5 }
        ctx.beginPath(); ctx.moveTo(i * 20, -1000); ctx.lineTo(i * 20, 1000); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(-1000, i * 20); ctx.lineTo(1000, i * 20); ctx.stroke()
      }
    }
    drawingElements.forEach(element => {
      if (element.points.length < 2) return
      ctx.strokeStyle = element.id === selectedWallId ? '#22c55e' : element.color
      ctx.lineWidth = element.type === 'wall' ? 4 : 2
      ctx.beginPath()
      element.points.forEach((point, index) => {
        const x = point.x * 20; const y = point.y * 20
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      if (element.type === 'room' && element.completed) { ctx.closePath(); ctx.fillStyle = element.color + '20'; ctx.fill() }
      ctx.stroke()
    })
    // Windows
    drawingElements.forEach(el => {
      if (el.type !== 'window') return
      const wall = drawingElements.find(w => w.id === el.wallId)
      if (!wall) return
      const a = wall.points[el.segmentIndex]
      const b = wall.points[el.segmentIndex + 1]
      if (!a || !b) return
      const wx = a.x + (b.x - a.x) * el.t
      const wy = a.y + (b.y - a.y) * el.t
      ctx.strokeStyle = el.color || '#22d3ee'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(wx * 20 - 6, wy * 20)
      ctx.lineTo(wx * 20 + 6, wy * 20)
      ctx.stroke()
    })
    // Doors
    drawingElements.forEach(el => {
      if (el.type !== 'door') return
      const wall = drawingElements.find(w => w.id === el.wallId)
      if (!wall) return
      const a = wall.points[el.segmentIndex]
      const b = wall.points[el.segmentIndex + 1]
      if (!a || !b) return
      const dx = a.x + (b.x - a.x) * el.t
      const dy = a.y + (b.y - a.y) * el.t
      ctx.strokeStyle = el.color || '#8B4513'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(dx * 20 - 4, dy * 20)
      ctx.lineTo(dx * 20 + 4, dy * 20)
      ctx.stroke()
    })
    if (currentDrawing.length > 0) {
      ctx.strokeStyle = selectedTool === 'wall' ? '#666666' : '#00ff00'
      ctx.lineWidth = 3; ctx.beginPath()
      currentDrawing.forEach((point, index) => {
        const x = point.x * 20; const y = point.y * 20
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.stroke()
      currentDrawing.forEach(point => { ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(point.x * 20, point.y * 20, 3, 0, Math.PI * 2); ctx.fill() })
    }
    // Furniture in 2D
    placedFurniture.forEach(item => {
      const x = item.position.x * 20
      const z = item.position.z * 20
      const width = 20
      const depth = 20
      ctx.save()
      ctx.translate(x, z)
      ctx.rotate(item.rotation.y || 0)
      ctx.fillStyle = (item.color || '#888') + (item.id === selectedFurniture ? '80' : '60')
      ctx.strokeStyle = item.id === selectedFurniture ? '#22c55e' : (item.color || '#888')
      ctx.lineWidth = item.id === selectedFurniture ? 3 : 1
      ctx.fillRect(-width/2, -depth/2, width, depth)
      ctx.strokeRect(-width/2, -depth/2, width, depth)
      if (showMeasurements) { ctx.fillStyle = '#9ca3af'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText('1.0×1.0m', 0, depth/2 + 14) }
      ctx.restore()
    })

    ctx.restore()
  }, [drawingElements, currentDrawing, selectedTool, gridVisible, zoomLevel, selectedWallId, placedFurniture, selectedFurniture, showMeasurements])

  const getCanvasCoordinates = (e) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const px = (e.clientX - rect.left) * dpr
    const py = (e.clientY - rect.top) * dpr
    const x = (px - canvas.width / 2) / (zoomLevel / 100) / 20
    const y = (py - canvas.height / 2) / (zoomLevel / 100) / 20
    return { x, y }
  }

  const hitTestFurniture = (point) => {
    for (let i = placedFurniture.length - 1; i >= 0; i--) {
      const item = placedFurniture[i]
      const half = 0.5
      if (point.x >= item.position.x - half && point.x <= item.position.x + half && point.y >= item.position.z - half && point.y <= item.position.z + half) {
        return item
      }
    }
    return null
  }

  const hitTestWall = (clickPoint) => {
    const distancePointToSegment = (p, a, b) => {
      const ap = { x: p.x - a.x, y: p.y - a.y }
      const ab = { x: b.x - a.x, y: b.y - a.y }
      const abLenSq = ab.x * ab.x + ab.y * ab.y
      const t = Math.max(0, Math.min(1, abLenSq === 0 ? 0 : (ap.x * ab.x + ap.y * ab.y) / abLenSq))
      const closest = { x: a.x + ab.x * t, y: a.y + ab.y * t }
      const dx = p.x - closest.x
      const dy = p.y - closest.y
      return Math.sqrt(dx * dx + dy * dy)
    }
    const tolerance = 0.6
    let best = { id: null, dist: Infinity }
    for (const element of drawingElements) {
      if (element.type !== 'wall' || element.points.length < 2) continue
      for (let i = 0; i < element.points.length - 1; i++) {
        const a = element.points[i]
        const b = element.points[i + 1]
        const d = distancePointToSegment(clickPoint, a, b)
        if (d < tolerance && d < best.dist) {
          best = { id: element.id, dist: d }
        }
      }
    }
    return best.id
  }

  const handleMouseDown = (e) => {
    const point = getCanvasCoordinates(e)
    if (selectedTool === 'select') {
      const furniture = hitTestFurniture(point)
      if (furniture) {
        setIsDragging(true)
        setDraggedFurniture(furniture.id)
        setDragOffset({ x: point.x - furniture.position.x, y: point.y - furniture.position.z })
        onFurnitureSelect(furniture.id)
        return
      }
      const wallId = hitTestWall(point)
      onWallSelect(wallId)
    } else {
      onCanvasClick(e)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !draggedFurniture) return
    const point = getCanvasCoordinates(e)
    let newX = point.x - dragOffset.x
    let newZ = point.y - dragOffset.y
    if (snapToGrid) { newX = Math.round(newX * 2) / 2; newZ = Math.round(newZ * 2) / 2 }
    onFurniture2DPositionChange(draggedFurniture, { x: newX, y: 0, z: newZ })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggedFurniture(null)
  }

  return (
    <canvas id="canvas-2d" ref={canvasRef} width={800} height={600} className="absolute inset-0 w-full h-full cursor-crosshair" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onDoubleClick={onCanvasDoubleClick} style={{ imageRendering: 'pixelated' }} />
  )
}

// Drop overlay for 2D canvas
function DropCanvasOverlay({ onDropItem }) {
  const [, dropRef] = useDrop(() => ({
    accept: 'FURNITURE_ITEM',
    drop: (dragItem, monitor) => {
      const client = monitor.getClientOffset()
      if (!client) return
      onDropItem?.(dragItem.itemId, client.x, client.y)
      return { moved: true }
    }
  }), [onDropItem])
  return <div ref={dropRef} className="absolute inset-0" />
}

// Draggable catalog item wrapper
function DraggableCatalogCard({ item, onAdd, children }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'FURNITURE_ITEM',
    item: { itemId: item.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (dragged, monitor) => {
      if (!monitor.didDrop()) {
        onAdd?.()
      }
    }
  }), [item, onAdd])
  return (
    <div ref={dragRef} className={`glass-panel cursor-pointer hover:border-green-400 transition-colors group ${isDragging ? 'opacity-50' : ''}`}>
      {children}
    </div>
  )
}

export default function Create() {
  // File Management
  const [showFileDialog, setShowFileDialog] = useState(false)
  
  // UI State
  const [activeMode, setActiveMode] = useState('2D')
  const [selectedTool, setSelectedTool] = useState('select')
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  
  // Drawing State
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [gridVisible, setGridVisible] = useState(true)
  const [drawingElements, setDrawingElements] = useState([])
  const [placedFurniture, setPlacedFurniture] = useState([])
  const [selectedFurniture, setSelectedFurniture] = useState(null)
  const [selectedWallId, setSelectedWallId] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState([])
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const threeCtxRef = useRef(null)

  // Authentication check
  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      window.location.hash = '#signin'
    }
  }, [])
  
  // Catalog State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  
  // Enhanced tools for different modes
  const tools2D = [
    { id: 'select', name: 'Select', icon: MousePointer, category: 'basic' },
    { id: 'wall', name: 'Wall', icon: Rectangle, category: 'drawing' },
    { id: 'door', name: 'Door', icon: DoorOpen, category: 'drawing' },
    { id: 'window', name: 'Window', icon: Square, category: 'drawing' },
    { id: 'room', name: 'Room', icon: Maximize, category: 'rooms' },
  ]
  
  const tools3D = [
    { id: 'select', name: 'Select', icon: MousePointer, category: 'basic' },
  ]
  
  const currentTools = activeMode === '2D' ? tools2D : tools3D
  
  const templates = useMemo(() => ([
    {
      id: 'studio-basic',
      name: 'Studio (Basic)',
      elements: [
        { id: 'w1', type: 'wall', color: '#666666', completed: true, points: [{ x: -4, y: -3 }, { x: 4, y: -3 }] },
        { id: 'w2', type: 'wall', color: '#666666', completed: true, points: [{ x: 4, y: -3 }, { x: 4, y: 3 }] },
        { id: 'w3', type: 'wall', color: '#666666', completed: true, points: [{ x: 4, y: 3 }, { x: -4, y: 3 }] },
        { id: 'w4', type: 'wall', color: '#666666', completed: true, points: [{ x: -4, y: 3 }, { x: -4, y: -3 }] },
      ],
      furniture: [
        { id: `tmpl-sofa-${Date.now()}`, name: 'Modern Sofa', category: 'Seating', price: 1299, color: '#8B4513', type: 'Modern Sofa', position: { x: 0, y: 0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-table-${Date.now()}`, name: 'Coffee Table', category: 'Tables', price: 599, color: '#D2691E', type: 'Coffee Table', position: { x: 0, y: 0, z: 0.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    },
    {
      id: 'bedroom-small',
      name: 'Bedroom (Small)',
      elements: [
        { id: 'bw1', type: 'wall', color: '#666666', completed: true, points: [{ x: -3, y: -3 }, { x: 3, y: -3 }] },
        { id: 'bw2', type: 'wall', color: '#666666', completed: true, points: [{ x: 3, y: -3 }, { x: 3, y: 3 }] },
        { id: 'bw3', type: 'wall', color: '#666666', completed: true, points: [{ x: 3, y: 3 }, { x: -3, y: 3 }] },
        { id: 'bw4', type: 'wall', color: '#666666', completed: true, points: [{ x: -3, y: 3 }, { x: -3, y: -3 }] },
      ],
      furniture: [
        { id: `tmpl-bed-${Date.now()}`, name: 'Bed Frame', category: 'Bedroom', price: 899, color: '#8B4513', type: 'Bed Frame', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-lamp-${Date.now()}`, name: 'Floor Lamp', category: 'Lighting', price: 299, color: '#FFD700', type: 'Floor Lamp', position: { x: 2, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    },
    {
      id: 'living-dining-large',
      name: 'Living + Dining (Large)',
      elements: [
        { id: 'ld1', type: 'wall', color: '#666666', completed: true, points: [{ x: -8, y: -6 }, { x: 8, y: -6 }] },
        { id: 'ld2', type: 'wall', color: '#666666', completed: true, points: [{ x: 8, y: -6 }, { x: 8, y: 6 }] },
        { id: 'ld3', type: 'wall', color: '#666666', completed: true, points: [{ x: 8, y: 6 }, { x: -8, y: 6 }] },
        { id: 'ld4', type: 'wall', color: '#666666', completed: true, points: [{ x: -8, y: 6 }, { x: -8, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-sofa2-${Date.now()}`, name: 'Modern Sofa', category: 'Seating', price: 1299, color: '#8B4513', type: 'Modern Sofa', position: { x: -3, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `tmpl-arm-${Date.now()}`, name: 'Armchair', category: 'Seating', price: 799, color: '#A0522D', type: 'Armchair', position: { x: -5, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-cof-${Date.now()}`, name: 'Coffee Table', category: 'Tables', price: 599, color: '#D2691E', type: 'Coffee Table', position: { x: -3, y: 0, z: 0.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `tmpl-desk-${Date.now()}`, name: 'Desk', category: 'Tables', price: 699, color: '#8B4513', type: 'Desk', position: { x: 4, y: 0, z: -1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-sidet-${Date.now()}`, name: 'Side Table', category: 'Tables', price: 299, color: '#D2691E', type: 'Side Table', position: { x: -1, y: 0, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-lamp2-${Date.now()}`, name: 'Floor Lamp', category: 'Lighting', price: 299, color: '#FFD700', type: 'Floor Lamp', position: { x: -6, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    },
    {
      id: 'open-kitchen-diner',
      name: 'Open Kitchen Diner',
      elements: [
        { id: 'ok1', type: 'wall', color: '#666666', completed: true, points: [{ x: -7, y: -4 }, { x: 7, y: -4 }] },
        { id: 'ok2', type: 'wall', color: '#666666', completed: true, points: [{ x: 7, y: -4 }, { x: 7, y: 4 }] },
        { id: 'ok3', type: 'wall', color: '#666666', completed: true, points: [{ x: 7, y: 4 }, { x: -7, y: 4 }] },
        { id: 'ok4', type: 'wall', color: '#666666', completed: true, points: [{ x: -7, y: 4 }, { x: -7, y: -4 }] },
      ],
      furniture: [
        { id: `tmpl-table6-${Date.now()}`, name: 'Desk', category: 'Tables', price: 699, color: '#8B4513', type: 'Desk', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 1, z: 1 } },
        { id: `tmpl-chair1-${Date.now()}`, name: 'Dining Chair', category: 'Seating', price: 199, color: '#654321', type: 'Dining Chair', position: { x: -1.2, y: 0, z: -0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-chair2-${Date.now()}`, name: 'Dining Chair', category: 'Seating', price: 199, color: '#654321', type: 'Dining Chair', position: { x: 1.2, y: 0, z: -0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-chair3-${Date.now()}`, name: 'Dining Chair', category: 'Seating', price: 199, color: '#654321', type: 'Dining Chair', position: { x: -1.2, y: 0, z: 0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-chair4-${Date.now()}`, name: 'Dining Chair', category: 'Seating', price: 199, color: '#654321', type: 'Dining Chair', position: { x: 1.2, y: 0, z: 0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-books-${Date.now()}`, name: 'Bookshelf', category: 'Storage', price: 799, color: '#8B4513', type: 'Bookshelf', position: { x: -6, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    },
    {
      id: 'master-bedroom',
      name: 'Master Bedroom (Large)',
      elements: [
        { id: 'mb1', type: 'wall', color: '#666666', completed: true, points: [{ x: -6, y: -5 }, { x: 6, y: -5 }] },
        { id: 'mb2', type: 'wall', color: '#666666', completed: true, points: [{ x: 6, y: -5 }, { x: 6, y: 5 }] },
        { id: 'mb3', type: 'wall', color: '#666666', completed: true, points: [{ x: 6, y: 5 }, { x: -6, y: 5 }] },
        { id: 'mb4', type: 'wall', color: '#666666', completed: true, points: [{ x: -6, y: 5 }, { x: -6, y: -5 }] },
      ],
      furniture: [
        { id: `tmpl-bed2-${Date.now()}`, name: 'Bed Frame', category: 'Bedroom', price: 899, color: '#8B4513', type: 'Bed Frame', position: { x: 0, y: 0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 1, z: 1.5 } },
        { id: `tmpl-side-${Date.now()}`, name: 'Side Table', category: 'Tables', price: 299, color: '#D2691E', type: 'Side Table', position: { x: -1.5, y: 0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-side2-${Date.now()}`, name: 'Side Table', category: 'Tables', price: 299, color: '#D2691E', type: 'Side Table', position: { x: 1.5, y: 0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-dresser-${Date.now()}`, name: 'Dresser', category: 'Storage', price: 899, color: '#8B4513', type: 'Dresser', position: { x: -4.5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-wardrobe-${Date.now()}`, name: 'Wardrobe', category: 'Storage', price: 1199, color: '#696969', type: 'Wardrobe', position: { x: 4.5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    }
  ]), [])


  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 768
      if (isMobile) { setLeftPanelOpen(false); setRightPanelOpen(false) }
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const tools = [
    { id: 'select', name: 'Select', icon: MousePointer, category: 'basic' },
    { id: 'wall', name: 'Wall', icon: Rectangle, category: 'drawing' },
    { id: 'door', name: 'Door', icon: DoorOpen, category: 'drawing' },
    { id: 'window', name: 'Window', icon: Square, category: 'drawing' },
    { id: 'room', name: 'Room', icon: Maximize, category: 'rooms' },
  ]

  const furnitureItems = [
    { id: '1', name: 'Modern Sofa', category: 'Seating', price: 1299, defaultColor: '#8B4513', type: 'Modern Sofa' },
    { id: '2', name: 'Coffee Table', category: 'Tables', price: 599, defaultColor: '#D2691E', type: 'Coffee Table' },
    { id: '3', name: 'Floor Lamp', category: 'Lighting', price: 299, defaultColor: '#FFD700', type: 'Floor Lamp' },
    { id: '4', name: 'Bookshelf', category: 'Storage', price: 799, defaultColor: '#8B4513', type: 'Bookshelf' },
    { id: '5', name: 'Dining Chair', category: 'Seating', price: 199, defaultColor: '#654321', type: 'Dining Chair' },
    { id: '6', name: 'Bed Frame', category: 'Bedroom', price: 899, defaultColor: '#8B4513', type: 'Bed Frame' },
    { id: '7', name: 'Wardrobe', category: 'Storage', price: 1199, defaultColor: '#696969', type: 'Wardrobe' },
    { id: '8', name: 'Desk', category: 'Tables', price: 699, defaultColor: '#8B4513', type: 'Desk' },
    { id: '9', name: 'Armchair', category: 'Seating', price: 799, defaultColor: '#A0522D', type: 'Armchair' },
    { id: '10', name: 'Side Table', category: 'Tables', price: 299, defaultColor: '#D2691E', type: 'Side Table' },
    { id: '11', name: 'Table Lamp', category: 'Lighting', price: 149, defaultColor: '#FFA500', type: 'Table Lamp' },
    { id: '12', name: 'Dresser', category: 'Storage', price: 899, defaultColor: '#8B4513', type: 'Dresser' },
  ]
  const categories = ['All', 'Seating', 'Tables', 'Storage', 'Lighting', 'Bedroom']
  const filteredFurniture = useMemo(() => furnitureItems.filter(item => (item.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === 'All' || item.category === selectedCategory))), [searchTerm, selectedCategory])

  const saveToHistory = useCallback(() => {
    const state = { drawingElements: [...drawingElements], placedFurniture: [...placedFurniture] }
    const newHistory = history.slice(0, historyIndex + 1); newHistory.push(state)
    setHistory(newHistory); setHistoryIndex(newHistory.length - 1)
  }, [drawingElements, placedFurniture, history, historyIndex])

  const handleCanvasClick = useCallback((event) => {
    if (activeMode !== '2D' || selectedTool === 'select') return
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const px = (event.clientX - rect.left) * dpr
    const py = (event.clientY - rect.top) * dpr
    const x = (px - canvas.width / 2) / (zoomLevel / 100) / 20
    const y = (py - canvas.height / 2) / (zoomLevel / 100) / 20
    const point = { x, y }
    if (selectedTool === 'wall' || selectedTool === 'room') {
      if (!isDrawing) { setIsDrawing(true); setCurrentDrawing([point]) }
      else { setCurrentDrawing(prev => [...prev, point]) }
    } else if (selectedTool === 'window') {
      const distancePointToSegmentWithT = (p, a, b) => {
        const ap = { x: p.x - a.x, y: p.y - a.y }
        const ab = { x: b.x - a.x, y: b.y - a.y }
        const abLenSq = ab.x * ab.x + ab.y * ab.y
        const t = Math.max(0, Math.min(1, abLenSq === 0 ? 0 : (ap.x * ab.x + ap.y * ab.y) / abLenSq))
        const proj = { x: a.x + ab.x * t, y: a.y + ab.y * t }
        const dx = p.x - proj.x
        const dy = p.y - proj.y
        return { dist: Math.sqrt(dx * dx + dy * dy), t, proj }
      }
      let best = { wallId: null, segmentIndex: -1, t: 0, proj: null, dist: Infinity }
      drawingElements.forEach(el => {
        if (el.type !== 'wall' || !el.completed || el.points.length < 2) return
        for (let i = 0; i < el.points.length - 1; i++) {
          const a = el.points[i]
          const b = el.points[i + 1]
          const res = distancePointToSegmentWithT(point, a, b)
          if (res.dist < best.dist) {
            best = { wallId: el.id, segmentIndex: i, t: res.t, proj: res.proj, dist: res.dist }
          }
        }
      })
      if (best.wallId) {
        if (selectedTool === 'window') {
          const newWindow = { id: `win-${Date.now()}`, type: 'window', wallId: best.wallId, segmentIndex: best.segmentIndex, t: best.t, width: 1.2, height: 1.2, sill: 0.9, color: '#22d3ee' }
          setDrawingElements(prev => [...prev, newWindow])
        } else if (selectedTool === 'door') {
          const newDoor = { id: `door-${Date.now()}`, type: 'door', wallId: best.wallId, segmentIndex: best.segmentIndex, t: best.t, width: 0.9, height: 2.1, color: '#8B4513' }
          setDrawingElements(prev => [...prev, newDoor])
        }
        saveToHistory()
      }
    }
  }, [activeMode, selectedTool, isDrawing, zoomLevel, drawingElements, saveToHistory])

  const handleCanvasDoubleClick = useCallback(() => {
    if (isDrawing && currentDrawing.length > 1) {
      const newElement = { id: Date.now().toString(), type: selectedTool, points: [...currentDrawing], color: selectedTool === 'wall' ? '#666666' : '#00ff0080', completed: true }
      setDrawingElements(prev => [...prev, newElement])
      setIsDrawing(false); setCurrentDrawing([]); saveToHistory()
    }
  }, [isDrawing, currentDrawing, selectedTool, saveToHistory])

  const addFurniture = useCallback((furnitureId) => {
    const furniture = furnitureItems.find(item => item.id === furnitureId)
    if (!furniture) return
    const newFurniture = { id: `${furniture.id}-${Date.now()}`, name: furniture.name, category: furniture.category, price: furniture.price, color: furniture.defaultColor, type: furniture.type, position: { x: Math.random() * 10 - 5, y: 0, z: Math.random() * 10 - 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    setPlacedFurniture(prev => [...prev, newFurniture]); setSelectedFurniture(newFurniture.id); saveToHistory()
  }, [saveToHistory])

  const handleFurnitureColorChange = useCallback((id, color) => {
    setPlacedFurniture(prev => prev.map(item => item.id === id ? { ...item, color } : item)); saveToHistory()
  }, [saveToHistory])

  const handleFurniturePositionChange = useCallback((id, position) => {
    setPlacedFurniture(prev => prev.map(item => item.id === id ? { ...item, position } : item))
  }, [])

  const handleFurniture2DPositionChange = useCallback((id, position) => {
    setPlacedFurniture(prev => prev.map(item => item.id === id ? { ...item, position } : item))
  }, [])

  const handleWallColorChange = useCallback((id, color) => {
    setDrawingElements(prev => prev.map(el => el.id === id ? { ...el, color } : el))
    saveToHistory()
  }, [saveToHistory])

  const deleteSelectedFurniture = useCallback(() => {
    if (selectedFurniture) { setPlacedFurniture(prev => prev.filter(item => item.id !== selectedFurniture)); setSelectedFurniture(null); saveToHistory() }
  }, [selectedFurniture, saveToHistory])

  const rotateSelectedFurniture = useCallback(() => {
    if (selectedFurniture) { setPlacedFurniture(prev => prev.map(item => item.id === selectedFurniture ? { ...item, rotation: { ...item.rotation, y: item.rotation.y + Math.PI / 4 } } : item)); saveToHistory() }
  }, [selectedFurniture, saveToHistory])

  const undo = useCallback(() => {
    if (historyIndex > 0) { const prevState = history[historyIndex - 1]; if (prevState) { setDrawingElements(prevState.drawingElements || []); setPlacedFurniture(prevState.placedFurniture || []); setHistoryIndex(historyIndex - 1) } }
  }, [history, historyIndex])
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) { const nextState = history[historyIndex + 1]; if (nextState) { setDrawingElements(nextState.drawingElements || []); setPlacedFurniture(nextState.placedFurniture || []); setHistoryIndex(historyIndex + 1) } }
  }, [history, historyIndex])

  const newDesign = useCallback(() => {
    setDrawingElements([])
    setPlacedFurniture([])
    setSelectedFurniture(null)
    setSelectedWallId(null)
    setIsDrawing(false)
    setCurrentDrawing([])
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  const loadTemplate = useCallback((templateId) => {
    const t = templates.find(t => t.id === templateId)
    if (!t) return
    setDrawingElements(t.elements.map(e => ({ ...e, id: `${e.id}-${Date.now()}` })))
    setPlacedFurniture(t.furniture.map(f => ({ ...f, id: `${f.id}-${Math.floor(Math.random()*10000)}` })))
    setSelectedFurniture(null)
    setSelectedWallId(null)
    setIsDrawing(false)
    setCurrentDrawing([])
    setHistory([])
    setHistoryIndex(-1)
  }, [templates])

  const exportDesign = useCallback(() => {
    const tryExport = () => {
      const ctx = threeCtxRef.current
      if (!ctx || !ctx.scene) return false
      const exporter = new GLTFExporter()
      exporter.parse(
        ctx.scene,
        (result) => {
          let blob
          if (result instanceof ArrayBuffer) {
            blob = new Blob([result], { type: 'model/gltf-binary' })
          } else {
            const json = JSON.stringify(result)
            blob = new Blob([json], { type: 'application/json' })
          }
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `design-${Date.now()}.glb`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        },
        (error) => { console.error('GLTF export error', error) },
        { binary: true }
      )
      return true
    }

    if (tryExport()) return
    const prevMode = activeMode
    setActiveMode('3D')
    setTimeout(() => {
      tryExport()
      setActiveMode(prevMode)
    }, 350)
  }, [activeMode])

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z / Ctrl+Y (redo), Ctrl+D duplicate
  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target
      if (target && target instanceof HTMLElement) {
        const tag = target.tagName.toLowerCase()
        if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return
      }
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (!mod) return
      const key = (e.key || '').toLowerCase()
      if (key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo(); else undo()
      } else if (key === 'y') {
        e.preventDefault()
        redo()
      } else if (key === 'd') {
        e.preventDefault()
        if (selectedFurniture) {
          const src = placedFurniture.find(f => f.id === selectedFurniture)
          if (src) {
            const dup = { ...src, id: `${src.id}-copy-${Date.now()}`, position: { x: src.position.x + 1, y: src.position.y, z: src.position.z + 1 } }
            setPlacedFurniture(prev => [...prev, dup]);
            setSelectedFurniture(dup.id);
            saveToHistory();
          }
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, selectedFurniture, placedFurniture, saveToHistory])


  // File Management Functions
  const handleNewProject = () => {
    setDrawingElements([])
    setPlacedFurniture([])
    setSelectedFurniture(null)
    setSelectedWallId(null)
    setIsDrawing(false)
    setCurrentDrawing([])
    setHistory([])
    setHistoryIndex(-1)
    setShowFileDialog(false)
  }

  const handleOpenProject = () => {
    // TODO: Implement file picker
    console.log('Open project')
    setShowFileDialog(false)
  }

  const selectedFurnitureItem = placedFurniture.find(item => item.id === selectedFurniture)

  return (
    <DndProvider backend={HTML5Backend}>
      <FileDialog 
        isOpen={showFileDialog} 
        onClose={() => setShowFileDialog(false)} 
        onNew={handleNewProject}
        onOpen={handleOpenProject}
      />
    <div className="pt-16 h-screen flex bg-gray-900 overflow-hidden">
      {/* Left Panel - Tools & Layers */}
      <div className={`${leftPanelOpen ? 'w-72 md:w-80' : 'w-0 md:w-16'} bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300 relative`}>
        <div className="p-3 md:p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold text-white ${!leftPanelOpen && 'hidden'}`}>Design Tools</h2>
            <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="text-gray-400 hover:text-white">{leftPanelOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</Button>
          </div>
          {leftPanelOpen && (
            <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
              <Button variant={activeMode === '2D' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setActiveMode('2D')}><Monitor className="h-4 w-4 mr-1" />2D</Button>
              <Button variant={activeMode === '3D' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setActiveMode('3D')}><Box className="h-4 w-4 mr-1" />3D</Button>
            </div>
          )}
        </div>
        {leftPanelOpen && (
          <ScrollArea className="flex-1">
            <div className="p-3 md:p-4 space-y-4">
              {/* Tools Section */}
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
                <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Room Templates</h3>
                <p className="text-xs text-gray-500 mb-2">Click to load room layouts</p>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" onClick={() => loadTemplate('living-dining-large')}><Home className="h-4 w-4 mr-2" />Living Room</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" onClick={() => loadTemplate('master-bedroom')}><Bed className="h-4 w-4 mr-2" />Bedroom</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" onClick={() => loadTemplate('open-kitchen-diner')}><ChefHat className="h-4 w-4 mr-2" />Kitchen</Button>
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

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 bg-gray-950 border-b border-gray-800 flex items-center px-4 gap-2 overflow-x-auto flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" onClick={undo} disabled={historyIndex <= 0} title="Undo"><Undo className="h-5 w-5" /></Button>
            <Button variant="outline" size="default" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo"><Redo className="h-5 w-5" /></Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Button variant={gridVisible ? 'default' : 'outline'} size="default" onClick={() => setGridVisible(!gridVisible)} title="Toggle Grid"><Grid3X3 className="h-5 w-5" /></Button>
            <Button variant={showMeasurements ? 'default' : 'outline'} size="default" onClick={() => setShowMeasurements(!showMeasurements)} title="Measurements"><Ruler className="h-5 w-5" /></Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" onClick={() => setZoomLevel(z => Math.max(25, z - 25))} title="Zoom Out"><ZoomOut className="h-5 w-5" /></Button>
            <span className="text-sm text-gray-400 min-w-[60px] text-center">{zoomLevel}%</span>
            <Button variant="outline" size="default" onClick={() => setZoomLevel(z => Math.min(400, z + 25))} title="Zoom In"><ZoomIn className="h-5 w-5" /></Button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="default" title="Save"><Save className="h-5 w-5" /></Button>
            <Button variant="outline" size="default" title="Settings" className="hidden sm:flex"><Settings className="h-5 w-5" /></Button>
            <Button variant="outline" size="default" onClick={() => setShowFileDialog(true)}><span className="hidden md:inline">+ New</span><span className="md:hidden">New</span></Button>
            <Button className="bg-green-600 hover:bg-green-700" size="default" onClick={exportDesign}><Download className="h-5 w-5 mr-2" /><span className="hidden md:inline">Download</span></Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-900 relative overflow-hidden">
          {activeMode === '2D' ? (
            <div className="absolute inset-0">
              <DropCanvasOverlay onDropItem={(itemId, clientX, clientY) => {
                // convert screen to canvas world
                const container = document.querySelector('#canvas-2d')
                if (!container) return
                const rect = container.getBoundingClientRect()
                const dpr = window.devicePixelRatio || 1
                const px = (clientX - rect.left) * dpr
                const py = (clientY - rect.top) * dpr
                const x = (px - container.width / 2) / (zoomLevel / 100) / 20
                const y = (py - container.height / 2) / (zoomLevel / 100) / 20
                let wx = x, wy = y
                if (snapToGrid) { wx = Math.round(wx * 2) / 2; wy = Math.round(wy * 2) / 2 }
                // add furniture at this position
                const furniture = furnitureItems.find(f => f.id === itemId)
                if (furniture) {
                  const newFurniture = { id: `${furniture.id}-${Date.now()}`, name: furniture.name, category: furniture.category, price: furniture.price, color: furniture.defaultColor, type: furniture.type, position: { x: wx, y: 0, z: wy }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
                  setPlacedFurniture(prev => [...prev, newFurniture]); setSelectedFurniture(newFurniture.id); saveToHistory()
                }
              }} />
              <Canvas2D 
                drawingElements={drawingElements} 
                currentDrawing={currentDrawing} 
                selectedTool={selectedTool} 
                gridVisible={gridVisible} 
                zoomLevel={zoomLevel} 
                selectedWallId={selectedWallId}
                placedFurniture={placedFurniture}
                selectedFurniture={selectedFurniture}
                snapToGrid={snapToGrid}
                showMeasurements={showMeasurements}
                onCanvasClick={handleCanvasClick} 
                onCanvasDoubleClick={handleCanvasDoubleClick} 
                onWallSelect={setSelectedWallId}
                onFurnitureSelect={setSelectedFurniture}
                onFurniture2DPositionChange={handleFurniture2DPositionChange}
              />
            </div>
          ) : (
            <Canvas camera={{ position: [15, 15, 15], fov: 60 }} shadows>
              <Scene3D 
                placedFurniture={placedFurniture} 
                selectedFurniture={selectedFurniture} 
                onFurnitureSelect={setSelectedFurniture} 
                onFurniturePositionChange={handleFurniturePositionChange} 
                drawingElements={drawingElements} 
                gridVisible={gridVisible} 
              />
              <ThreeContextBridge onReady={(ctx) => { threeCtxRef.current = ctx }} />
            </Canvas>
          )}
        </div>
      </div>
      
      {/* Right Panel - Properties & Furniture Catalog */}
      <div className={`${rightPanelOpen ? 'w-72 md:w-80' : 'w-0 md:w-16'} bg-gray-950 border-l border-gray-800 flex flex-col transition-all duration-300 relative`}>
        <div className="p-3 md:p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold text-white ${!rightPanelOpen && 'hidden'}`}>Properties</h2>
            <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(!rightPanelOpen)} className="text-gray-400 hover:text-white">{rightPanelOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</Button>
          </div>
        </div>
        {rightPanelOpen && (
          <ScrollArea className="flex-1">
            <div className="p-3 md:p-4 space-y-4">
              {/* Furniture Catalog */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Furniture Catalog</h3>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Search furniture..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-400 text-sm" 
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {categories.map(category => (
                    <Button 
                      key={category} 
                      variant={selectedCategory === category ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setSelectedCategory(category)} 
                      className={`text-xs ${selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
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
                        <p className="text-[10px] text-gray-400">${item.price.toLocaleString()}</p>
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
              
              {/* Selected Item Properties */}
              {selectedFurnitureItem && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Selected Item</h3>
                  <div className="space-y-3">
                    <p className="text-white text-sm font-medium">{selectedFurnitureItem.name}</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="color" 
                        value={selectedFurnitureItem.color} 
                        onChange={(e) => handleFurnitureColorChange(selectedFurnitureItem.id, e.target.value)} 
                        className="w-10 h-10 p-1 bg-gray-800 border-gray-700" 
                      />
                      <Input 
                        type="text" 
                        value={selectedFurnitureItem.color} 
                        onChange={(e) => handleFurnitureColorChange(selectedFurnitureItem.id, e.target.value)} 
                        className="flex-1 bg-gray-800 border-gray-700 text-white text-xs" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => rotateSelectedFurniture()} className="flex-1 bg-transparent">
                        <RotateCw className="h-4 w-4 mr-1" />Rotate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteSelectedFurniture()} className="flex-1 bg-transparent">
                        <Trash2 className="h-4 w-4 mr-1" />Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Wall Properties */}
              {selectedTool === 'select' && selectedWallId && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Wall Properties</h3>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400">Click a wall on canvas, then change color.</p>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          value={(drawingElements.find(e => e.id === selectedWallId)?.color) || '#666666'} 
                          onChange={(e) => selectedWallId && handleWallColorChange(selectedWallId, e.target.value)} 
                          className="w-10 h-10 p-1 bg-gray-800 border-gray-700" 
                        />
                        <Input 
                          type="text" 
                          value={(drawingElements.find(e => e.id === selectedWallId)?.color) || ''} 
                          onChange={(e) => selectedWallId && handleWallColorChange(selectedWallId, e.target.value)} 
                          placeholder="#666666" 
                          className="flex-1 bg-gray-800 border-gray-700 text-white text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      
    </div>
    </DndProvider>
  )
}
