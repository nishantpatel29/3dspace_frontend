import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'
import { Square, Undo, Redo, Grid3X3, ZoomIn, ZoomOut, Save, Download, Search, Home, Bed, ChefHat, Sofa, Lamp, Table, BookOpen, X, Menu, Eye, EyeOff, RotateCw, Trash2, MousePointer, BedSingle as Rectangle, DoorOpen, Maximize, Layers, Ruler, FolderOpen, Plus, Minus, Move, Edit3, Paintbrush, FileText, Monitor, Box } from 'lucide-react'
import { toast } from 'react-toastify'
import designFilesAPI from '../apis/designFiles'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid as DreiGrid, Box as DreiBox, Plane as DreiPlane, Environment, ContactShadows } from '@react-three/drei'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { authAPI } from '../apis/auth'
import CreateToolbar from '../components/create/CreateToolbar'
import LeftPanel from '../components/create/LeftPanel'
import RightPanel from '../components/create/RightPanel'

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

function FurnitureModel({ item, isSelected, onSelect, onPositionChange, onDragStateChange }) {
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
    onDragStateChange?.(true)
    onSelect()
  }
  const handlePointerMove = (event) => {
    if (isDragging && meshRef.current && event?.point) {
      const newPosition = { x: event.point.x, y: item.position.y, z: event.point.z }
      if (meshRef.current.position) meshRef.current.position.copy(newPosition)
      onPositionChange(newPosition)
    }
  }
  const handlePointerUp = () => { setIsDragging(false); onDragStateChange?.(false) }

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

function Scene3D({ placedFurniture, selectedFurniture, onFurnitureSelect, onFurniturePositionChange, drawingElements, gridVisible, onAnyDragChange }) {
  const controlsRef = useRef(null)
  const handleDragStateChange = (dragging) => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !dragging
    }
    onAnyDragChange?.(dragging)
  }
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
        <FurnitureModel key={item.id} item={item} isSelected={selectedFurniture === item.id} onSelect={() => onFurnitureSelect(item.id)} onPositionChange={(pos) => onFurniturePositionChange(item.id, pos)} onDragStateChange={handleDragStateChange} />
      ))}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={50} blur={2} far={10} />
      <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={50} />
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
  const [currentFile, setCurrentFile] = useState({ id: null, name: 'Untitled' })
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [fileForm, setFileForm] = useState({ name: '', description: '' })
  const [filesList, setFilesList] = useState([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [filesError, setFilesError] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '' })

  const fetchFilesList = useCallback(async () => {
    try {
      setFilesLoading(true)
      setFilesError('')
      const res = await designFilesAPI.list()
      if (res && res.success) {
        setFilesList(res.data || [])
      } else {
        setFilesError(res?.message || 'Failed to load files')
      }
    } catch (e) {
      setFilesError('Failed to load files')
    } finally {
      setFilesLoading(false)
    }
  }, [])
  
  // UI State
  const [activeMode, setActiveMode] = useState('3D')
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
      id: 'tech-startup-office',
      name: 'Tech Startup Office Floor',
      description: 'Bright open-plan workspace with hot-desking, meeting pods, private offices, a kitchenette and a social lounge',
      elements: [
        // Outer perimeter walls (20m x 12m)
        { id: 'ext-1', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: -10, y: -6 }, { x: 10, y: -6 }] },
        { id: 'ext-2', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: 10, y: -6 }, { x: 10, y: 6 }] },
        { id: 'ext-3', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: 10, y: 6 }, { x: -10, y: 6 }] },
        { id: 'ext-4', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: -10, y: 6 }, { x: -10, y: -6 }] },
    
        // Divider: separates open workspace (left) from meeting/lounge/offices (right)
        { id: 'int-1', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: -2, y: -6 }, { x: -2, y: 6 }] },
    
        // Meeting pod enclosure (center-right)
        { id: 'int-2', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 3, y: -1 }, { x: 3, y: 4 }] },
        { id: 'int-2b', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 3, y: 4 }, { x: 7, y: 4 }] },
        { id: 'int-2c', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 7, y: 4 }, { x: 7, y: -1 }] },
    
        // Private office cluster / server room divider
        { id: 'int-3', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 6, y: -6 }, { x: 6, y: 0 }] },
    
        // Kitchenette short partition
        { id: 'int-4', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 0, y: -2 }, { x: 3, y: -2 }] },
    
        // Phone booth divider (left side)
        { id: 'int-5', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: -9, y: 0 }, { x: -7, y: 0 }] }
      ],
      doors: [
        // Main entrance (left wall)
        { id: 'door-main', type: 'door', color: '#8B4513', width: 1.2, position: { x: -10, y: 0 }, wall: 'ext-4', direction: 'left' },
    
        // Passage to lounge/meeting corridor (through int-1)
        { id: 'door-corridor', type: 'door', color: '#A0826D', width: 1, position: { x: -2, y: -2 }, wall: 'int-1', direction: 'right' },
    
        // Meeting pod entrance
        { id: 'door-meeting', type: 'door', color: '#A0826D', width: 1, position: { x: 5, y: -1 }, wall: 'int-2c', direction: 'right' },
    
        // Private office door (right cluster)
        { id: 'door-office', type: 'door', color: '#A0826D', width: 0.9, position: { x: 6, y: -3 }, wall: 'int-3', direction: 'down' },
    
        // Kitchenette access
        { id: 'door-kitchen', type: 'door', color: '#8B4513', width: 0.9, position: { x: 1.5, y: -2 }, wall: 'int-4', direction: 'down' },
    
        // Phone booth door
        { id: 'door-booth', type: 'door', color: '#A0826D', width: 0.8, position: { x: -8, y: 0 }, wall: 'int-5', direction: 'left' },
    
        // Balcony / terrace door (top wall)
        { id: 'door-terrace', type: 'door', color: '#8B4513', width: 1.1, position: { x: 2, y: 6 }, wall: 'ext-3', direction: 'up' }
      ],
      furniture: [
        // Open Hot-Desking (left side: -10 to -2, -6 to 6)
        { id: `tso-hotdesk1-${Date.now()}-1`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -8.5, y: 0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair1-${Date.now()}-2`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -8.5, y: 0, z: -3.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        { id: `tso-hotdesk2-${Date.now()}-3`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -5.5, y: 0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair2-${Date.now()}-4`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -5.5, y: 0, z: -3.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        { id: `tso-hotdesk3-${Date.now()}-5`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -8.5, y: 0, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair3-${Date.now()}-6`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -8.5, y: 0, z: -0.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        { id: `tso-hotdesk4-${Date.now()}-7`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -5.5, y: 0, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair4-${Date.now()}-8`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -5.5, y: 0, z: -0.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        { id: `tso-hotdesk5-${Date.now()}-9`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -8.5, y: 0, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair5-${Date.now()}-10`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -8.5, y: 0, z: 3.1 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        { id: `tso-hotdesk6-${Date.now()}-11`, name: 'Hot Desk', category: 'Tables', price: 499, color: '#263238', type: 'Desk', position: { x: -5.5, y: 0, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 1, z: 0.9 } },
        { id: `tso-chair6-${Date.now()}-12`, name: 'Task Chair', category: 'Seating', price: 299, color: '#37474F', type: 'Dining Chair', position: { x: -5.5, y: 0, z: 3.1 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } },
    
        // Focus Pods / Phone Booths (top-left)
        { id: `tso-pod1-${Date.now()}-13`, name: 'Focus Pod', category: 'Seating', price: 1299, color: '#37474F', type: 'Lounge Chair', position: { x: -9, y: 0, z: 4 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `tso-pod2-${Date.now()}-14`, name: 'Phone Booth', category: 'Storage', price: 799, color: '#455A64', type: 'Wardrobe', position: { x: -7.2, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 1.8, z: 0.9 } },
    
        // Social Lounge (right-top:  -2 to 10, 2 to 6)
        { id: `tso-sofa-${Date.now()}-15`, name: 'Sectional Sofa', category: 'Seating', price: 2199, color: '#546E7A', type: 'Lounge Chair', position: { x: 4.5, y: 0, z: 4.2 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 2.6, y: 1, z: 1.1 } },
        { id: `tso-coffee-${Date.now()}-16`, name: 'Coffee Table', category: 'Tables', price: 399, color: '#BDBDBD', type: 'Side Table', position: { x: 3.2, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 0.6, z: 0.9 } },
        { id: `tso-armchair1-${Date.now()}-17`, name: 'Accent Chair', category: 'Seating', price: 399, color: '#1E88E5', type: 'Lounge Chair', position: { x: 6, y: 0, z: 4.6 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tso-rug-${Date.now()}-18`, name: 'Area Rug', category: 'Decor', price: 699, color: '#E0E0E0', type: 'Coffee Table', position: { x: 4.5, y: 0, z: 3.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.1, z: 2.2 } },
    
        // Collaboration / Meeting Pod (center-right)
        { id: `tso-conftable-${Date.now()}-19`, name: 'Meeting Table', category: 'Tables', price: 2699, color: '#4E342E', type: 'Side Table', position: { x: 5, y: 0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1, z: 1.2 } },
        { id: `tso-confchair1-${Date.now()}-20`, name: 'Conference Chair', category: 'Seating', price: 349, color: '#212121', type: 'Dining Chair', position: { x: 4, y: 0, z: 0.6 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } },
        { id: `tso-confchair2-${Date.now()}-21`, name: 'Conference Chair', category: 'Seating', price: 349, color: '#212121', type: 'Dining Chair', position: { x: 6, y: 0, z: 0.6 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } },
        { id: `tso-whiteboard-${Date.now()}-22`, name: 'Glass Whiteboard', category: 'Decor', price: 499, color: '#FAFAFA', type: 'Coffee Table', position: { x: 6.5, y: 1, z: 1.5 }, rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 2 }, scale: { x: 1.8, y: 0.08, z: 1.1 } },
    
        // Private Offices (right-top & right-bottom)
        { id: `tso-managerdesk1-${Date.now()}-23`, name: 'Manager Desk', category: 'Tables', price: 1899, color: '#3E2723', type: 'Desk', position: { x: 8.2, y: 0, z: 3.5 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1.8, y: 1, z: 1.2 } },
        { id: `tso-leatherchair1-${Date.now()}-24`, name: 'Leather Chair', category: 'Seating', price: 1199, color: '#5D4037', type: 'Lounge Chair', position: { x: 7.5, y: 0, z: 2.6 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tso-bookcase1-${Date.now()}-25`, name: 'Bookcase', category: 'Storage', price: 799, color: '#4E342E', type: 'Bookshelf', position: { x: 9.2, y: 0, z: 5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.6, z: 0.6 } },
    
        { id: `tso-managerdesk2-${Date.now()}-26`, name: 'Corner Desk', category: 'Tables', price: 1699, color: '#424242', type: 'Desk', position: { x: 8.2, y: 0, z: -2.5 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1.6, y: 1, z: 1.2 } },
        { id: `tso-leatherchair2-${Date.now()}-27`, name: 'Executive Chair', category: 'Seating', price: 1299, color: '#3E2723', type: 'Lounge Chair', position: { x: 7.2, y: 0, z: -3.1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tso-bookcase2-${Date.now()}-28`, name: 'Low Cabinet', category: 'Storage', price: 599, color: '#616161', type: 'Dresser', position: { x: 9.0, y: 0, z: -1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1, z: 0.6 } },
    
        // Server / Storage Room (right-bottom near x=6, y between -6 and 0)
        { id: `tso-server1-${Date.now()}-29`, name: 'Server Rack', category: 'Appliances', price: 2499, color: '#263238', type: 'Wardrobe', position: { x: 6.5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 2, z: 0.7 } },
        { id: `tso-storage1-${Date.now()}-30`, name: 'Supply Cabinet', category: 'Storage', price: 549, color: '#757575', type: 'Wardrobe', position: { x: 7.8, y: 0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.3, z: 0.6 } },
    
        // Kitchenette / Café (center-bottom)
        { id: `tso-kitchen-counter-${Date.now()}-31`, name: 'Kitchen Counter', category: 'Tables', price: 1299, color: '#795548', type: 'Desk', position: { x: 1.2, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.2, y: 1, z: 0.8 } },
        { id: `tso-espresso-${Date.now()}-32`, name: 'Coffee Machine', category: 'Appliances', price: 599, color: '#9E9E9E', type: 'Side Table', position: { x: 1.2, y: 0.7, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 0.6, z: 0.5 } },
        { id: `tso-barstool1-${Date.now()}-33`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#3E2723', type: 'Dining Chair', position: { x: 0, y: 0, z: -2 }, rotation: { x: 0, y: Math.PI / 8, z: 0 }, scale: { x: 0.8, y: 0.9, z: 0.8 } },
        { id: `tso-barstool2-${Date.now()}-34`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#3E2723', type: 'Dining Chair', position: { x: 2.4, y: 0, z: -2 }, rotation: { x: 0, y: -Math.PI / 8, z: 0 }, scale: { x: 0.8, y: 0.9, z: 0.8 } },
    
        // Utilities & Amenities
        { id: `tso-printer-${Date.now()}-35`, name: 'Printer Station', category: 'Appliances', price: 399, color: '#455A64', type: 'Side Table', position: { x: -3, y: 0, z: -3.8 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 0.7, y: 1, z: 0.6 } },
        { id: `tso-locker1-${Date.now()}-36`, name: 'Personal Lockers', category: 'Storage', price: 699, color: '#616161', type: 'Wardrobe', position: { x: -1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.8, z: 0.6 } },
    
        // Plants & Lighting
        { id: `tso-plant1-${Date.now()}-37`, name: 'Tall Plant', category: 'Decor', price: 199, color: '#2E7D32', type: 'Floor Lamp', position: { x: -4, y: 0, z: 2.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.6, z: 0.7 } },
        { id: `tso-plant2-${Date.now()}-38`, name: 'Desk Plant', category: 'Decor', price: 59, color: '#2E7D32', type: 'Table Lamp', position: { x: -6, y: 0, z: -5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 0.4 } },
    
        // AV & Screens
        { id: `tso-tv-${Date.now()}-39`, name: 'Meeting Display', category: 'Decor', price: 899, color: '#000000', type: 'Coffee Table', position: { x: 5, y: 1, z: 3 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, scale: { x: 1.8, y: 0.05, z: 1.1 } },
    
        // Extra seating for impromptu huddles
        { id: `tso-stool1-${Date.now()}-40`, name: 'Mobile Stool', category: 'Seating', price: 129, color: '#FFB300', type: 'Dining Chair', position: { x: 2, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 0.9, z: 0.6 } },
        { id: `tso-stool2-${Date.now()}-41`, name: 'Mobile Stool', category: 'Seating', price: 129, color: '#FFB300', type: 'Dining Chair', position: { x: 2.8, y: 0, z: 1.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 0.9, z: 0.6 } },
    
        // Decorative art
        { id: `tso-art1-${Date.now()}-42`, name: 'Wall Mural', category: 'Decor', price: 799, color: '#1E88E5', type: 'Coffee Table', position: { x: -2.5, y: 1.2, z: 5 }, rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 2 }, scale: { x: 2.2, y: 0.05, z: 1.2 } },
    
        // Emergency / utilities
        { id: `tso-fireext-${Date.now()}-43`, name: 'Fire Extinguisher', category: 'Safety', price: 129, color: '#D32F2F', type: 'Floor Lamp', position: { x: -9.5, y: 0, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.6, z: 0.2 } },
    
        // Reception bench
        { id: `tso-reception-${Date.now()}-44`, name: 'Reception Bench', category: 'Seating', price: 499, color: '#546E7A', type: 'Lounge Chair', position: { x: -9, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 1, z: 0.9 } }
      ]
    }
    ,
    {
      id: 'modern-family-residence',
      name: 'Modern Family Residence',
      description: 'Spacious 4-bedroom home with open plan living areas',
      elements: [
        // Outer perimeter walls (20m x 16m)
        { id: 'ext-1', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: -10, y: -8 }, { x: 10, y: -8 }] },
        { id: 'ext-2', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: 10, y: -8 }, { x: 10, y: 8 }] },
        { id: 'ext-3', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: 10, y: 8 }, { x: -10, y: 8 }] },
        { id: 'ext-4', type: 'wall', color: '#D6D6D6', completed: true, points: [{ x: -10, y: 8 }, { x: -10, y: -8 }] },
        
        // Living/Dining separator
        { id: 'int-1', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: -10, y: 0 }, { x: -3, y: 0 }] },
        
        // Kitchen wall
        { id: 'int-2', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: -3, y: -8 }, { x: -3, y: 3 }] },
        
        // Hallway wall
        { id: 'int-3', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 3, y: -8 }, { x: 3, y: 8 }] },
        
        // Master bedroom division
        { id: 'int-4', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 3, y: 3 }, { x: 10, y: 3 }] },
        
        // Bathroom wall
        { id: 'int-5', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: 3, y: -3 }, { x: 10, y: -3 }] },
        
        // Guest bedroom division
        { id: 'int-6', type: 'wall', color: '#E3E3E3', completed: true, points: [{ x: -10, y: 3 }, { x: -3, y: 3 }] }
      ],
      furniture: [
        // Living Room (bottom left: -10 to -3, -8 to 0)
        { id: `mfr-sofa-${Date.now()}-1`, name: 'L-Shaped Sofa', category: 'Seating', price: 1899, color: '#4A5568', type: 'Modern Sofa', position: { x: -7, y: 0, z: -5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 1, z: 1.5 } },
        { id: `mfr-coffee-${Date.now()}-2`, name: 'Coffee Table', category: 'Tables', price: 549, color: '#8B7355', type: 'Coffee Table', position: { x: -7, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 0.8 } },
        { id: `mfr-armchair-${Date.now()}-3`, name: 'Accent Chair', category: 'Seating', price: 699, color: '#2D3748', type: 'Lounge Chair', position: { x: -5, y: 0, z: -5 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-tv-${Date.now()}-4`, name: 'TV Console', category: 'Storage', price: 799, color: '#1A202C', type: 'Dresser', position: { x: -9.5, y: 0, z: -1.5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 1, z: 0.6 } },
        { id: `mfr-lamp1-${Date.now()}-5`, name: 'Floor Lamp', category: 'Lighting', price: 199, color: '#F59E0B', type: 'Floor Lamp', position: { x: -4.5, y: 0, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 1.8, z: 0.5 } },
        
        // Dining Area (top left: -10 to -3, 0 to 8)
        { id: `mfr-dining-${Date.now()}-6`, name: 'Dining Table', category: 'Tables', price: 1299, color: '#5D4037', type: 'Side Table', position: { x: -6.5, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.8, y: 1, z: 1.2 } },
        { id: `mfr-chair1-${Date.now()}-7`, name: 'Dining Chair', category: 'Seating', price: 249, color: '#424242', type: 'Dining Chair', position: { x: -7.5, y: 0, z: 4.5 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-chair2-${Date.now()}-8`, name: 'Dining Chair', category: 'Seating', price: 249, color: '#424242', type: 'Dining Chair', position: { x: -7.5, y: 0, z: 5.5 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-chair3-${Date.now()}-9`, name: 'Dining Chair', category: 'Seating', price: 249, color: '#424242', type: 'Dining Chair', position: { x: -5.5, y: 0, z: 4.5 }, rotation: { x: 0, y: Math.PI * 3/4, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-chair4-${Date.now()}-10`, name: 'Dining Chair', category: 'Seating', price: 249, color: '#424242', type: 'Dining Chair', position: { x: -5.5, y: 0, z: 5.5 }, rotation: { x: 0, y: -Math.PI * 3/4, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-buffet-${Date.now()}-11`, name: 'Sideboard', category: 'Storage', price: 899, color: '#4E342E', type: 'Dresser', position: { x: -9.5, y: 0, z: 5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1, z: 0.6 } },
        { id: `mfr-plant-${Date.now()}-12`, name: 'Potted Plant', category: 'Decor', price: 149, color: '#228B22', type: 'Floor Lamp', position: { x: -4, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 1.2, z: 0.6 } },
        
        // Kitchen (center left: -3 to 3, -8 to 3)
        { id: `mfr-island-${Date.now()}-13`, name: 'Kitchen Island', category: 'Tables', price: 1799, color: '#ECEFF1', type: 'Side Table', position: { x: 0, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 1, z: 1.3 } },
        { id: `mfr-stool1-${Date.now()}-14`, name: 'Bar Stool', category: 'Seating', price: 179, color: '#616161', type: 'Dining Chair', position: { x: -0.8, y: 0, z: -1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.1, z: 0.7 } },
        { id: `mfr-stool2-${Date.now()}-15`, name: 'Bar Stool', category: 'Seating', price: 179, color: '#616161', type: 'Dining Chair', position: { x: 0.8, y: 0, z: -1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.1, z: 0.7 } },
        { id: `mfr-fridge-${Date.now()}-16`, name: 'Refrigerator', category: 'Appliances', price: 1899, color: '#CFD8DC', type: 'Wardrobe', position: { x: -2.5, y: 0, z: -7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 1.6, z: 0.8 } },
        { id: `mfr-counter-${Date.now()}-17`, name: 'Counter Cabinet', category: 'Storage', price: 999, color: '#90A4AE', type: 'Dresser', position: { x: 0, y: 0, z: -7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.8, y: 1, z: 0.7 } },
        { id: `mfr-pantry-${Date.now()}-18`, name: 'Pantry', category: 'Storage', price: 699, color: '#78909C', type: 'Wardrobe', position: { x: 2.5, y: 0, z: -7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.4, z: 0.7 } },
        { id: `mfr-table-${Date.now()}-19`, name: 'Breakfast Table', category: 'Tables', price: 449, color: '#A1887F', type: 'Side Table', position: { x: 0, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `mfr-bchair1-${Date.now()}-20`, name: 'Chair', category: 'Seating', price: 129, color: '#6D4C41', type: 'Dining Chair', position: { x: -0.7, y: 0, z: 1 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } },
        { id: `mfr-bchair2-${Date.now()}-21`, name: 'Chair', category: 'Seating', price: 129, color: '#6D4C41', type: 'Dining Chair', position: { x: 0.7, y: 0, z: 1 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } },
        
        // Master Bedroom (top right: 3 to 10, 3 to 8)
        { id: `mfr-kingbed-${Date.now()}-22`, name: 'King Bed', category: 'Bedroom', price: 2299, color: '#37474F', type: 'Bed Frame', position: { x: 6.5, y: 0, z: 6.5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 2.2, y: 1, z: 2 } },
        { id: `mfr-nightstand1-${Date.now()}-23`, name: 'Nightstand', category: 'Tables', price: 349, color: '#6D4C41', type: 'Side Table', position: { x: 5, y: 0, z: 5.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1, z: 0.6 } },
        { id: `mfr-nightstand2-${Date.now()}-24`, name: 'Nightstand', category: 'Tables', price: 349, color: '#6D4C41', type: 'Side Table', position: { x: 8, y: 0, z: 5.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1, z: 0.6 } },
        { id: `mfr-lamp2-${Date.now()}-25`, name: 'Table Lamp', category: 'Lighting', price: 119, color: '#FFA726', type: 'Table Lamp', position: { x: 5, y: 0.6, z: 5.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 0.4 } },
        { id: `mfr-lamp3-${Date.now()}-26`, name: 'Table Lamp', category: 'Lighting', price: 119, color: '#FFA726', type: 'Table Lamp', position: { x: 8, y: 0.6, z: 5.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 0.4 } },
        { id: `mfr-dresser-${Date.now()}-27`, name: 'Dresser', category: 'Storage', price: 1299, color: '#4E342E', type: 'Dresser', position: { x: 9.5, y: 0, z: 4 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.5, y: 1.1, z: 0.8 } },
        { id: `mfr-wardrobe-${Date.now()}-28`, name: 'Wardrobe', category: 'Storage', price: 1899, color: '#3E2723', type: 'Wardrobe', position: { x: 3.5, y: 0, z: 7.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.6, z: 1 } },
        { id: `mfr-bench-${Date.now()}-29`, name: 'Bench', category: 'Seating', price: 399, color: '#8D6E63', type: 'Coffee Table', position: { x: 6.5, y: 0, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 0.7, z: 0.5 } },
        
        // Bathroom (center right: 3 to 10, -3 to 3)
        { id: `mfr-bathtub-${Date.now()}-30`, name: 'Bathtub', category: 'Bathroom', price: 1599, color: '#FFFFFF', type: 'Bed Frame', position: { x: 9.2, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 0.6, z: 0.9 } },
        { id: `mfr-vanity-${Date.now()}-31`, name: 'Double Vanity', category: 'Bathroom', price: 1299, color: '#90A4AE', type: 'Dresser', position: { x: 6.5, y: 0, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 1, z: 0.7 } },
        { id: `mfr-toilet-${Date.now()}-32`, name: 'Toilet', category: 'Bathroom', price: 449, color: '#F5F5F5', type: 'Side Table', position: { x: 3.8, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 0.6, y: 0.7, z: 0.5 } },
        { id: `mfr-shower-${Date.now()}-33`, name: 'Shower Unit', category: 'Bathroom', price: 899, color: '#E0E0E0', type: 'Wardrobe', position: { x: 5.5, y: 0, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.2, z: 1 } },
        
        // Guest Bedroom 1 (bottom right: 3 to 10, -8 to -3)
        { id: `mfr-queenbed-${Date.now()}-34`, name: 'Queen Bed', category: 'Bedroom', price: 1499, color: '#455A64', type: 'Bed Frame', position: { x: 6.5, y: 0, z: -6 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.8, y: 1, z: 1.7 } },
        { id: `mfr-nightstand3-${Date.now()}-35`, name: 'Side Table', category: 'Tables', price: 229, color: '#795548', type: 'Side Table', position: { x: 5.2, y: 0, z: -5.3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 1, z: 0.5 } },
        { id: `mfr-lamp4-${Date.now()}-36`, name: 'Lamp', category: 'Lighting', price: 99, color: '#FFB74D', type: 'Table Lamp', position: { x: 5.2, y: 0.6, z: -5.3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 0.4 } },
        { id: `mfr-desk1-${Date.now()}-37`, name: 'Writing Desk', category: 'Tables', price: 649, color: '#607D8B', type: 'Desk', position: { x: 9.2, y: 0, z: -6 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.3, y: 1, z: 0.8 } },
        { id: `mfr-deskchair-${Date.now()}-38`, name: 'Desk Chair', category: 'Seating', price: 279, color: '#546E7A', type: 'Dining Chair', position: { x: 9.2, y: 0, z: -5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } },
        
        // Guest Bedroom 2 (top center: -3 to 3, 3 to 8) 
        { id: `mfr-twinbed-${Date.now()}-39`, name: 'Twin Bed', category: 'Bedroom', price: 799, color: '#546E7A', type: 'Bed Frame', position: { x: 0, y: 0, z: 6.5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.2, y: 1, z: 1.5 } },
        { id: `mfr-nightstand4-${Date.now()}-40`, name: 'Small Table', category: 'Tables', price: 179, color: '#8D6E63', type: 'Side Table', position: { x: 0.9, y: 0, z: 5.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 1, z: 0.5 } },
        { id: `mfr-bookshelf-${Date.now()}-41`, name: 'Bookshelf', category: 'Storage', price: 549, color: '#5D4037', type: 'Bookshelf', position: { x: -2.5, y: 0, z: 7.3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.5, z: 0.7 } },
        { id: `mfr-toybox-${Date.now()}-42`, name: 'Storage Box', category: 'Storage', price: 199, color: '#FF7043', type: 'Coffee Table', position: { x: 2, y: 0, z: 7.3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.6, z: 0.7 } }
      ]
    },
    {
      id: 'eclipse-nightclub',
      name: 'Eclipse Nightclub & Lounge',
      description: 'Premium nightclub with VIP areas, dance floor, and cocktail lounge',
      elements: [
        // Outer perimeter walls (24m x 18m)
        { id: 'ext-1', type: 'wall', color: '#1A1A1A', completed: true, points: [{ x: -12, y: -9 }, { x: 12, y: -9 }] },
        { id: 'ext-2', type: 'wall', color: '#1A1A1A', completed: true, points: [{ x: 12, y: -9 }, { x: 12, y: 9 }] },
        { id: 'ext-3', type: 'wall', color: '#1A1A1A', completed: true, points: [{ x: 12, y: 9 }, { x: -12, y: 9 }] },
        { id: 'ext-4', type: 'wall', color: '#1A1A1A', completed: true, points: [{ x: -12, y: 9 }, { x: -12, y: -9 }] },
        
        // Main bar separator
        { id: 'int-1', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: -12, y: 3 }, { x: -6, y: 3 }] },
        
        // VIP section wall (right side)
        { id: 'int-2', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: 6, y: -9 }, { x: 6, y: 9 }] },
        
        // DJ booth enclosure (back wall)
        { id: 'int-3', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: -12, y: -4 }, { x: -8, y: -4 }] },
        
        // Lounge area separator
        { id: 'int-4', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: -6, y: 3 }, { x: -6, y: 9 }] },
        
        // Private VIP room wall
        { id: 'int-5', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: 6, y: 3 }, { x: 12, y: 3 }] },
        
        // Bathroom corridor wall
        { id: 'int-6', type: 'wall', color: '#2A2A2A', completed: true, points: [{ x: 3, y: 9 }, { x: 3, y: 6 }] }
      ],
      furniture: [
        // Main Dance Floor Area (center: -6 to 6, -9 to 3)
        { id: `club-speaker1-${Date.now()}-1`, name: 'PA Speaker Stack', category: 'Audio', price: 4999, color: '#000000', type: 'Wardrobe', position: { x: -5.5, y: 0, z: -8.5 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1, y: 2, z: 1 } },
        { id: `club-speaker2-${Date.now()}-2`, name: 'PA Speaker Stack', category: 'Audio', price: 4999, color: '#000000', type: 'Wardrobe', position: { x: 5.5, y: 0, z: -8.5 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1, y: 2, z: 1 } },
        { id: `club-subwoofer1-${Date.now()}-3`, name: 'Subwoofer', category: 'Audio', price: 2999, color: '#1A1A1A', type: 'Coffee Table', position: { x: -4, y: 0, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `club-subwoofer2-${Date.now()}-4`, name: 'Subwoofer', category: 'Audio', price: 2999, color: '#1A1A1A', type: 'Coffee Table', position: { x: 4, y: 0, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `club-laser1-${Date.now()}-5`, name: 'Laser Light System', category: 'Lighting', price: 6999, color: '#FF00FF', type: 'Floor Lamp', position: { x: 0, y: 2.5, z: -5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.8, z: 0.8 } },
        { id: `club-smoke-${Date.now()}-6`, name: 'Smoke Machine', category: 'Effects', price: 1299, color: '#4A4A4A', type: 'Side Table', position: { x: -2, y: 0, z: -7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 0.6, z: 0.5 } },
        { id: `club-led1-${Date.now()}-7`, name: 'LED Panel Wall', category: 'Lighting', price: 8999, color: '#00FFFF', type: 'Coffee Table', position: { x: 0, y: 1.5, z: -8.8 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, scale: { x: 8, y: 0.1, z: 2 } },
        { id: `club-barrier1-${Date.now()}-8`, name: 'Dance Floor Barrier', category: 'Furniture', price: 499, color: '#FFD700', type: 'Coffee Table', position: { x: -3, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 1, z: 3 } },
        { id: `club-barrier2-${Date.now()}-9`, name: 'Dance Floor Barrier', category: 'Furniture', price: 499, color: '#FFD700', type: 'Coffee Table', position: { x: 3, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 1, z: 3 } },
        { id: `club-podium1-${Date.now()}-10`, name: 'Go-Go Platform', category: 'Furniture', price: 799, color: '#C0C0C0', type: 'Side Table', position: { x: -4, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `club-podium2-${Date.now()}-11`, name: 'Go-Go Platform', category: 'Furniture', price: 799, color: '#C0C0C0', type: 'Side Table', position: { x: 4, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        
        // DJ Booth (back left: -12 to -8, -9 to -4)
        { id: `club-djdesk-${Date.now()}-12`, name: 'DJ Console', category: 'Audio', price: 12999, color: '#1A1A1A', type: 'Desk', position: { x: -10, y: 0, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 1.2, z: 1.5 } },
        { id: `club-djchair-${Date.now()}-13`, name: 'DJ Chair', category: 'Seating', price: 599, color: '#000000', type: 'Dining Chair', position: { x: -10, y: 0, z: -5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `club-cdj1-${Date.now()}-14`, name: 'CDJ Deck', category: 'Audio', price: 2499, color: '#1A1A1A', type: 'Side Table', position: { x: -11, y: 0.7, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 0.3, z: 0.5 } },
        { id: `club-cdj2-${Date.now()}-15`, name: 'CDJ Deck', category: 'Audio', price: 2499, color: '#1A1A1A', type: 'Side Table', position: { x: -9, y: 0.7, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 0.3, z: 0.5 } },
        { id: `club-mixer-${Date.now()}-16`, name: 'DJ Mixer', category: 'Audio', price: 3999, color: '#2A2A2A', type: 'Side Table', position: { x: -10, y: 0.7, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.3, z: 0.6 } },
        { id: `club-monitor1-${Date.now()}-17`, name: 'Studio Monitor', category: 'Audio', price: 899, color: '#1A1A1A', type: 'Table Lamp', position: { x: -11.5, y: 1.3, z: -6.5 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 0.5, y: 0.6, z: 0.5 } },
        { id: `club-monitor2-${Date.now()}-18`, name: 'Studio Monitor', category: 'Audio', price: 899, color: '#1A1A1A', type: 'Table Lamp', position: { x: -8.5, y: 1.3, z: -6.5 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 0.5, y: 0.6, z: 0.5 } },
        
        // Main Bar (top left: -12 to -6, 3 to 9)
        { id: `club-bar-${Date.now()}-19`, name: 'Main Bar Counter', category: 'Furniture', price: 15999, color: '#8B4513', type: 'Dresser', position: { x: -9, y: 0, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5, y: 1.1, z: 1.2 } },
        { id: `club-barstool1-${Date.now()}-20`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#C70039', type: 'Dining Chair', position: { x: -11, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `club-barstool2-${Date.now()}-21`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#C70039', type: 'Dining Chair', position: { x: -10, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `club-barstool3-${Date.now()}-22`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#C70039', type: 'Dining Chair', position: { x: -9, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `club-barstool4-${Date.now()}-23`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#C70039', type: 'Dining Chair', position: { x: -8, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `club-barstool5-${Date.now()}-24`, name: 'Bar Stool', category: 'Seating', price: 249, color: '#C70039', type: 'Dining Chair', position: { x: -7, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `club-liquor-${Date.now()}-25`, name: 'Liquor Display', category: 'Storage', price: 2999, color: '#000000', type: 'Bookshelf', position: { x: -9, y: 0, z: 8.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 1.8, z: 0.5 } },
        { id: `club-icebin-${Date.now()}-26`, name: 'Ice Bin', category: 'Appliances', price: 1299, color: '#C0C0C0', type: 'Dresser', position: { x: -11.5, y: 0, z: 8.5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 0.8, y: 0.9, z: 0.6 } },
        { id: `club-fridge-${Date.now()}-27`, name: 'Beverage Cooler', category: 'Appliances', price: 2499, color: '#1A1A1A', type: 'Wardrobe', position: { x: -6.5, y: 0, z: 8.5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.3, z: 0.8 } },
        { id: `club-neon1-${Date.now()}-28`, name: 'Neon Sign', category: 'Lighting', price: 1499, color: '#FF1493', type: 'Coffee Table', position: { x: -9, y: 2, z: 8.9 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, scale: { x: 2.5, y: 0.1, z: 0.8 } },
        
        // Lounge Area (center left: -6 to 3, 3 to 9)
        { id: `club-booth1-${Date.now()}-29`, name: 'Curved Booth', category: 'Seating', price: 1899, color: '#4B0082', type: 'Lounge Chair', position: { x: -4, y: 0, z: 5 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 2, y: 1.1, z: 1.5 } },
        { id: `club-booth2-${Date.now()}-30`, name: 'Curved Booth', category: 'Seating', price: 1899, color: '#4B0082', type: 'Lounge Chair', position: { x: -1, y: 0, z: 5 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 2, y: 1.1, z: 1.5 } },
        { id: `club-booth3-${Date.now()}-31`, name: 'Curved Booth', category: 'Seating', price: 1899, color: '#4B0082', type: 'Lounge Chair', position: { x: 2, y: 0, z: 5 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 2, y: 1.1, z: 1.5 } },
        { id: `club-cocktail1-${Date.now()}-32`, name: 'Cocktail Table', category: 'Tables', price: 599, color: '#FFD700', type: 'Side Table', position: { x: -4, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.1, z: 0.8 } },
        { id: `club-cocktail2-${Date.now()}-33`, name: 'Cocktail Table', category: 'Tables', price: 599, color: '#FFD700', type: 'Side Table', position: { x: -1, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.1, z: 0.8 } },
        { id: `club-cocktail3-${Date.now()}-34`, name: 'Cocktail Table', category: 'Tables', price: 599, color: '#FFD700', type: 'Side Table', position: { x: 2, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.1, z: 0.8 } },
        { id: `club-chandelier-${Date.now()}-35`, name: 'Crystal Chandelier', category: 'Lighting', price: 4999, color: '#FFFFFF', type: 'Floor Lamp', position: { x: -1.5, y: 2.5, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.5, z: 1.2 } },
        { id: `club-plant1-${Date.now()}-36`, name: 'Palm Tree', category: 'Decor', price: 799, color: '#228B22', type: 'Floor Lamp', position: { x: -5.5, y: 0, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.2, z: 0.8 } },
        { id: `club-plant2-${Date.now()}-37`, name: 'Palm Tree', category: 'Decor', price: 799, color: '#228B22', type: 'Floor Lamp', position: { x: 2.5, y: 0, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.2, z: 0.8 } },
        
        // VIP Section (right side: 6 to 12, -9 to 3)
        { id: `club-vipbooth1-${Date.now()}-38`, name: 'VIP Booth', category: 'Seating', price: 3999, color: '#8B0000', type: 'Lounge Chair', position: { x: 9, y: 0, z: -6 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 2.5, y: 1.2, z: 1.8 } },
        { id: `club-vipbooth2-${Date.now()}-39`, name: 'VIP Booth', category: 'Seating', price: 3999, color: '#8B0000', type: 'Lounge Chair', position: { x: 9, y: 0, z: -2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 2.5, y: 1.2, z: 1.8 } },
        { id: `club-vipbooth3-${Date.now()}-40`, name: 'VIP Booth', category: 'Seating', price: 3999, color: '#8B0000', type: 'Lounge Chair', position: { x: 9, y: 0, z: 1 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 2, y: 1.2, z: 1.8 } },
        { id: `club-viptable1-${Date.now()}-41`, name: 'VIP Table', category: 'Tables', price: 1299, color: '#000000', type: 'Side Table', position: { x: 7.5, y: 0, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 0.8, z: 1.2 } },
        { id: `club-viptable2-${Date.now()}-42`, name: 'VIP Table', category: 'Tables', price: 1299, color: '#000000', type: 'Side Table', position: { x: 7.5, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 0.8, z: 1.2 } },
        { id: `club-viptable3-${Date.now()}-43`, name: 'VIP Table', category: 'Tables', price: 1299, color: '#000000', type: 'Side Table', position: { x: 7.5, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 0.8, z: 1 } },
        { id: `club-champagne-${Date.now()}-44`, name: 'Champagne Cooler', category: 'Decor', price: 499, color: '#C0C0C0', type: 'Table Lamp', position: { x: 7.5, y: 0.5, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 0.4 } },
        { id: `club-ledstrip1-${Date.now()}-45`, name: 'LED Strip Lighting', category: 'Lighting', price: 799, color: '#9C27B0', type: 'Floor Lamp', position: { x: 11.8, y: 1, z: -4 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8, y: 0.2, z: 0.2 } },
        { id: `club-rope-${Date.now()}-46`, name: 'Velvet Rope Barrier', category: 'Furniture', price: 299, color: '#FFD700', type: 'Coffee Table', position: { x: 6.2, y: 0, z: -1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.15, y: 0.9, z: 2.5 } },
        
        // Private VIP Room (top right: 6 to 12, 3 to 9)
        { id: `club-privsofa1-${Date.now()}-47`, name: 'Luxury Sofa', category: 'Seating', price: 5999, color: '#FFD700', type: 'Modern Sofa', position: { x: 9, y: 0, z: 6.5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 3, y: 1.2, z: 1.6 } },
        { id: `club-privsofa2-${Date.now()}-48`, name: 'Luxury Armchair', category: 'Seating', price: 2499, color: '#FFD700', type: 'Lounge Chair', position: { x: 11.3, y: 0, z: 4.5 }, rotation: { x: 0, y: -Math.PI / 3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `club-privsofa3-${Date.now()}-49`, name: 'Luxury Armchair', category: 'Seating', price: 2499, color: '#FFD700', type: 'Lounge Chair', position: { x: 6.7, y: 0, z: 4.5 }, rotation: { x: 0, y: Math.PI / 3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `club-privtable-${Date.now()}-50`, name: 'Glass Coffee Table', category: 'Tables', price: 1899, color: '#FFFFFF', type: 'Coffee Table', position: { x: 9, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 0.6, z: 1 } },
        { id: `club-minibar-${Date.now()}-51`, name: 'Mini Bar', category: 'Storage', price: 3499, color: '#1A1A1A', type: 'Dresser', position: { x: 11.5, y: 0, z: 8 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.5, y: 1.1, z: 0.7 } },
        { id: `club-tvscreen-${Date.now()}-52`, name: 'Large Screen TV', category: 'Electronics', price: 4999, color: '#000000', type: 'Coffee Table', position: { x: 6.2, y: 1.5, z: 6.5 }, rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 2 }, scale: { x: 2.5, y: 0.1, z: 1.5 } },
        { id: `club-sculpture-${Date.now()}-53`, name: 'Gold Sculpture', category: 'Decor', price: 2999, color: '#FFD700', type: 'Floor Lamp', position: { x: 7, y: 0, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 1.4, z: 0.6 } }
      ]
    }
  ,    
    {
      id: 'minimalist-studio',
      name: 'Minimalist Studio',
      description: 'Clean, modern studio with essential furniture',
      elements: [
        { id: 'w1', type: 'wall', color: '#E8E8E8', completed: true, points: [{ x: -5, y: -4 }, { x: 5, y: -4 }] },
        { id: 'w2', type: 'wall', color: '#E8E8E8', completed: true, points: [{ x: 5, y: -4 }, { x: 5, y: 4 }] },
        { id: 'w3', type: 'wall', color: '#E8E8E8', completed: true, points: [{ x: 5, y: 4 }, { x: -5, y: 4 }] },
        { id: 'w4', type: 'wall', color: '#E8E8E8', completed: true, points: [{ x: -5, y: 4 }, { x: -5, y: -4 }] },
      ],
      furniture: [
        { id: `tmpl-bed-${Date.now()}-1`, name: 'Platform Bed', category: 'Bedroom', price: 799, color: '#2C2C2C', type: 'Bed Frame', position: { x: -2.5, y: 0, z: 2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `tmpl-desk-${Date.now()}-2`, name: 'Work Desk', category: 'Tables', price: 549, color: '#4A4A4A', type: 'Desk', position: { x: 3, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-chair-${Date.now()}-3`, name: 'Office Chair', category: 'Seating', price: 299, color: '#1A1A1A', type: 'Dining Chair', position: { x: 3, y: 0, z: -1.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
        { id: `tmpl-shelf-${Date.now()}-4`, name: 'Wall Shelf', category: 'Storage', price: 399, color: '#D4C5B9', type: 'Bookshelf', position: { x: -4, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1, z: 0.8 } }
      ]
    },
    {
      id: 'tropical-paradise',
      name: 'Tropical Paradise Lounge',
      description: 'Vibrant tropical-inspired space with bold colors',
      elements: [
        { id: 'tp1', type: 'wall', color: '#FFF8DC', completed: true, points: [{ x: -7, y: -6 }, { x: 7, y: -6 }] },
        { id: 'tp2', type: 'wall', color: '#FFF8DC', completed: true, points: [{ x: 7, y: -6 }, { x: 7, y: 6 }] },
        { id: 'tp3', type: 'wall', color: '#FFF8DC', completed: true, points: [{ x: 7, y: 6 }, { x: -7, y: 6 }] },
        { id: 'tp4', type: 'wall', color: '#FFF8DC', completed: true, points: [{ x: -7, y: 6 }, { x: -7, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-trop1-${Date.now()}-1`, name: 'Peacock Chair', category: 'Seating', price: 899, color: '#D2691E', type: 'Armchair', position: { x: -3, y: 0, z: 3 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 } },
        { id: `tmpl-trop2-${Date.now()}-2`, name: 'Rattan Sofa', category: 'Seating', price: 1599, color: '#CD853F', type: 'Modern Sofa', position: { x: 2, y: 0, z: 3.5 }, rotation: { x: 0, y: Math.PI / 8, z: 0 }, scale: { x: 1.5, y: 1, z: 1.2 } },
        { id: `tmpl-trop3-${Date.now()}-3`, name: 'Bamboo Coffee Table', category: 'Tables', price: 549, color: '#DEB887', type: 'Coffee Table', position: { x: 0, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1, z: 1.3 } },
        { id: `tmpl-trop4-${Date.now()}-4`, name: 'Palm Plant Stand', category: 'Decor', price: 199, color: '#228B22', type: 'Floor Lamp', position: { x: -5.5, y: 0, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.5, z: 0.8 } },
        { id: `tmpl-trop5-${Date.now()}-5`, name: 'Monstera Plant', category: 'Decor', price: 149, color: '#2E8B57', type: 'Floor Lamp', position: { x: 5.5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.3, z: 0.7 } },
        { id: `tmpl-trop6-${Date.now()}-6`, name: 'Wicker Bar Cart', category: 'Storage', price: 449, color: '#BC8F8F', type: 'Side Table', position: { x: 5, y: 0, z: 2 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 0.9, y: 1.2, z: 0.9 } },
        { id: `tmpl-trop7-${Date.now()}-7`, name: 'Macrame Wall Hanging', category: 'Decor', price: 129, color: '#F5F5DC', type: 'Bookshelf', position: { x: 0, y: 1.5, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 0.6, z: 0.3 } },
        { id: `tmpl-trop8-${Date.now()}-8`, name: 'Tiki Torch Lamp', category: 'Lighting', price: 279, color: '#DAA520', type: 'Floor Lamp', position: { x: -5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.4, z: 0.7 } }
      ]
    },
    {
      id: 'industrial-loft',
      name: 'Industrial Loft',
      description: 'Raw and edgy with exposed brick aesthetic',
      elements: [
        { id: 'il1', type: 'wall', color: '#8B4513', completed: true, points: [{ x: -8, y: -6 }, { x: 8, y: -6 }] },
        { id: 'il2', type: 'wall', color: '#8B4513', completed: true, points: [{ x: 8, y: -6 }, { x: 8, y: 6 }] },
        { id: 'il3', type: 'wall', color: '#8B4513', completed: true, points: [{ x: 8, y: 6 }, { x: -8, y: 6 }] },
        { id: 'il4', type: 'wall', color: '#8B4513', completed: true, points: [{ x: -8, y: 6 }, { x: -8, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-ind1-${Date.now()}-1`, name: 'Leather Chesterfield', category: 'Seating', price: 2199, color: '#654321', type: 'Modern Sofa', position: { x: -3, y: 0, z: 2 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1.6, y: 1.1, z: 1.4 } },
        { id: `tmpl-ind2-${Date.now()}-2`, name: 'Metal Coffee Table', category: 'Tables', price: 899, color: '#2F4F4F', type: 'Coffee Table', position: { x: -1, y: 0, z: -0.5 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 1.4, y: 0.8, z: 1.4 } },
        { id: `tmpl-ind3-${Date.now()}-3`, name: 'Industrial Bar Stool', category: 'Seating', price: 349, color: '#696969', type: 'Dining Chair', position: { x: 5, y: 0, z: -3 }, rotation: { x: 0, y: Math.PI / 3, z: 0 }, scale: { x: 0.9, y: 1.2, z: 0.9 } },
        { id: `tmpl-ind4-${Date.now()}-4`, name: 'Bar Stool', category: 'Seating', price: 349, color: '#696969', type: 'Dining Chair', position: { x: 6.5, y: 0, z: -3 }, rotation: { x: 0, y: -Math.PI / 6, z: 0 }, scale: { x: 0.9, y: 1.2, z: 0.9 } },
        { id: `tmpl-ind5-${Date.now()}-5`, name: 'Steel Pipe Shelving', category: 'Storage', price: 1299, color: '#36454F', type: 'Bookshelf', position: { x: -7, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.4, z: 1 } },
        { id: `tmpl-ind6-${Date.now()}-6`, name: 'Factory Cart Table', category: 'Tables', price: 749, color: '#4A4A4A', type: 'Side Table', position: { x: 3, y: 0, z: 3 }, rotation: { x: 0, y: Math.PI / 5, z: 0 }, scale: { x: 1.1, y: 0.7, z: 1.1 } },
        { id: `tmpl-ind7-${Date.now()}-7`, name: 'Edison Bulb Chandelier', category: 'Lighting', price: 599, color: '#FFD700', type: 'Floor Lamp', position: { x: 0, y: 2, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 0.8, z: 1.2 } },
        { id: `tmpl-ind8-${Date.now()}-8`, name: 'Metal Locker Cabinet', category: 'Storage', price: 849, color: '#36454F', type: 'Wardrobe', position: { x: 7, y: 0, z: 3 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 0.8, y: 1.2, z: 1 } },
        { id: `tmpl-ind9-${Date.now()}-9`, name: 'Vintage Desk Lamp', category: 'Lighting', price: 229, color: '#B8860B', type: 'Floor Lamp', position: { x: 3, y: 0.8, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } }
      ]
    },
    {
      id: 'zen-meditation',
      name: 'Zen Meditation Room',
      description: 'Tranquil minimalist space for mindfulness',
      elements: [
        { id: 'zm1', type: 'wall', color: '#F5F5DC', completed: true, points: [{ x: -6, y: -6 }, { x: 6, y: -6 }] },
        { id: 'zm2', type: 'wall', color: '#F5F5DC', completed: true, points: [{ x: 6, y: -6 }, { x: 6, y: 6 }] },
        { id: 'zm3', type: 'wall', color: '#F5F5DC', completed: true, points: [{ x: 6, y: 6 }, { x: -6, y: 6 }] },
        { id: 'zm4', type: 'wall', color: '#F5F5DC', completed: true, points: [{ x: -6, y: 6 }, { x: -6, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-zen1-${Date.now()}-1`, name: 'Floor Cushion', category: 'Seating', price: 149, color: '#8B4513', type: 'Armchair', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.4, z: 0.9 } },
        { id: `tmpl-zen2-${Date.now()}-2`, name: 'Meditation Cushion', category: 'Seating', price: 129, color: '#D2691E', type: 'Armchair', position: { x: -2, y: 0, z: 1 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 0.8, y: 0.3, z: 0.8 } },
        { id: `tmpl-zen3-${Date.now()}-3`, name: 'Low Tea Table', category: 'Tables', price: 399, color: '#A0826D', type: 'Coffee Table', position: { x: 3, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 0.5, z: 1 } },
        { id: `tmpl-zen4-${Date.now()}-4`, name: 'Bonsai Stand', category: 'Decor', price: 249, color: '#8B7355', type: 'Side Table', position: { x: -4, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 0.8, z: 0.6 } },
        { id: `tmpl-zen5-${Date.now()}-5`, name: 'Bamboo Screen', category: 'Decor', price: 549, color: '#D4C5B9', type: 'Bookshelf', position: { x: 5, y: 0, z: 2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1.2, z: 0.2 } },
        { id: `tmpl-zen6-${Date.now()}-6`, name: 'Stone Lantern', category: 'Lighting', price: 349, color: '#A9A9A9', type: 'Floor Lamp', position: { x: 4.5, y: 0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.1, z: 0.7 } },
        { id: `tmpl-zen7-${Date.now()}-7`, name: 'Minimalist Shelf', category: 'Storage', price: 299, color: '#C2A88A', type: 'Bookshelf', position: { x: -5.5, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 1, z: 1.2 } },
        { id: `tmpl-zen8-${Date.now()}-8`, name: 'Paper Lamp', category: 'Lighting', price: 179, color: '#FFFAF0', type: 'Floor Lamp', position: { x: -3, y: 1.2, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.8, z: 0.8 } }
      ]
    },
    {
      id: 'art-deco-glam',
      name: 'Art Deco Glamour',
      description: 'Luxurious 1920s inspired elegant space',
      elements: [
        { id: 'ad1', type: 'wall', color: '#2C1810', completed: true, points: [{ x: -7, y: -5 }, { x: 7, y: -5 }] },
        { id: 'ad2', type: 'wall', color: '#2C1810', completed: true, points: [{ x: 7, y: -5 }, { x: 7, y: 5 }] },
        { id: 'ad3', type: 'wall', color: '#2C1810', completed: true, points: [{ x: 7, y: 5 }, { x: -7, y: 5 }] },
        { id: 'ad4', type: 'wall', color: '#2C1810', completed: true, points: [{ x: -7, y: 5 }, { x: -7, y: -5 }] },
      ],
      furniture: [
        { id: `tmpl-deco1-${Date.now()}-1`, name: 'Velvet Sofa', category: 'Seating', price: 2899, color: '#8B008B', type: 'Modern Sofa', position: { x: 0, y: 0, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.7, y: 1.1, z: 1.3 } },
        { id: `tmpl-deco2-${Date.now()}-2`, name: 'Gold Mirror Table', category: 'Tables', price: 1299, color: '#FFD700', type: 'Coffee Table', position: { x: 0, y: 0, z: -0.5 }, rotation: { x: 0, y: Math.PI / 8, z: 0 }, scale: { x: 1.3, y: 0.7, z: 1.3 } },
        { id: `tmpl-deco3-${Date.now()}-3`, name: 'Peacock Armchair', category: 'Seating', price: 1499, color: '#006994', type: 'Armchair', position: { x: -4.5, y: 0, z: -1 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `tmpl-deco4-${Date.now()}-4`, name: 'Geometric Armchair', category: 'Seating', price: 1499, color: '#8B7355', type: 'Armchair', position: { x: 4.5, y: 0, z: -1 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },
        { id: `tmpl-deco5-${Date.now()}-5`, name: 'Brass Bar Cart', category: 'Storage', price: 899, color: '#B8860B', type: 'Side Table', position: { x: -6, y: 0, z: 3.5 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 0.8, y: 1.1, z: 0.8 } },
        { id: `tmpl-deco6-${Date.now()}-6`, name: 'Crystal Chandelier', category: 'Lighting', price: 1899, color: '#E0FFFF', type: 'Floor Lamp', position: { x: 0, y: 2.2, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1, z: 1.3 } },
        { id: `tmpl-deco7-${Date.now()}-7`, name: 'Art Deco Cabinet', category: 'Storage', price: 1999, color: '#1C1C1C', type: 'Dresser', position: { x: 6, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1.2, z: 1.1 } },
        { id: `tmpl-deco8-${Date.now()}-8`, name: 'Marble Pedestal', category: 'Decor', price: 649, color: '#F8F8FF', type: 'Side Table', position: { x: -5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 1.3, z: 0.6 } },
        { id: `tmpl-deco9-${Date.now()}-9`, name: 'Gold Floor Lamp', category: 'Lighting', price: 799, color: '#DAA520', type: 'Floor Lamp', position: { x: 5, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.3, z: 1 } }
      ]
    },
    {
      id: 'bohemian-eclectic',
      name: 'Bohemian Eclectic',
      description: 'Colorful, artistic space with mixed patterns',
      elements: [
        { id: 'bo1', type: 'wall', color: '#F0E68C', completed: true, points: [{ x: -7, y: -6 }, { x: 7, y: -6 }] },
        { id: 'bo2', type: 'wall', color: '#F0E68C', completed: true, points: [{ x: 7, y: -6 }, { x: 7, y: 6 }] },
        { id: 'bo3', type: 'wall', color: '#F0E68C', completed: true, points: [{ x: 7, y: 6 }, { x: -7, y: 6 }] },
        { id: 'bo4', type: 'wall', color: '#F0E68C', completed: true, points: [{ x: -7, y: 6 }, { x: -7, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-boho1-${Date.now()}-1`, name: 'Vintage Sofa', category: 'Seating', price: 1299, color: '#CD5C5C', type: 'Modern Sofa', position: { x: -2, y: 0, z: 3 }, rotation: { x: 0, y: -Math.PI / 8, z: 0 }, scale: { x: 1.5, y: 1, z: 1.3 } },
        { id: `tmpl-boho2-${Date.now()}-2`, name: 'Moroccan Pouf', category: 'Seating', price: 249, color: '#FF6347', type: 'Armchair', position: { x: 1, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.5, z: 0.8 } },
        { id: `tmpl-boho3-${Date.now()}-3`, name: 'Floor Pouf', category: 'Seating', price: 229, color: '#FF8C00', type: 'Armchair', position: { x: -1, y: 0, z: 0.5 }, rotation: { x: 0, y: Math.PI / 3, z: 0 }, scale: { x: 0.7, y: 0.5, z: 0.7 } },
        { id: `tmpl-boho4-${Date.now()}-4`, name: 'Carved Wood Table', category: 'Tables', price: 649, color: '#8B4513', type: 'Coffee Table', position: { x: -1, y: 0, z: -1 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 } },
        { id: `tmpl-boho5-${Date.now()}-5`, name: 'Hanging Chair', category: 'Seating', price: 599, color: '#D2B48C', type: 'Armchair', position: { x: 5, y: 0.8, z: 2 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 } },
        { id: `tmpl-boho6-${Date.now()}-6`, name: 'Vintage Trunk', category: 'Storage', price: 449, color: '#A0522D', type: 'Dresser', position: { x: 3, y: 0, z: -3 }, rotation: { x: 0, y: Math.PI / 5, z: 0 }, scale: { x: 1, y: 0.7, z: 0.8 } },
        { id: `tmpl-boho7-${Date.now()}-7`, name: 'Patterned Rug Stand', category: 'Decor', price: 399, color: '#CD853F', type: 'Bookshelf', position: { x: -6, y: 0, z: -2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 0.3, z: 1.5 } },
        { id: `tmpl-boho8-${Date.now()}-8`, name: 'Potted Palm', category: 'Decor', price: 179, color: '#228B22', type: 'Floor Lamp', position: { x: -6, y: 0, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.4, z: 0.8 } },
        { id: `tmpl-boho9-${Date.now()}-9`, name: 'String Lights', category: 'Lighting', price: 99, color: '#FFE4B5', type: 'Floor Lamp', position: { x: 0, y: 2, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 0.3, z: 0.3 } },
        { id: `tmpl-boho10-${Date.now()}-10`, name: 'Floor Lamp', category: 'Lighting', price: 349, color: '#DAA520', type: 'Floor Lamp', position: { x: 5.5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 1.2, z: 0.9 } }
      ]
    },
    {
      id: 'futuristic-tech',
      name: 'Futuristic Tech Hub',
      description: 'Sleek high-tech workspace with neon accents',
      elements: [
        { id: 'ft1', type: 'wall', color: '#1A1A2E', completed: true, points: [{ x: -8, y: -6 }, { x: 8, y: -6 }] },
        { id: 'ft2', type: 'wall', color: '#1A1A2E', completed: true, points: [{ x: 8, y: -6 }, { x: 8, y: 6 }] },
        { id: 'ft3', type: 'wall', color: '#1A1A2E', completed: true, points: [{ x: 8, y: 6 }, { x: -8, y: 6 }] },
        { id: 'ft4', type: 'wall', color: '#1A1A2E', completed: true, points: [{ x: -8, y: 6 }, { x: -8, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-tech1-${Date.now()}-1`, name: 'Gaming Desk', category: 'Tables', price: 1599, color: '#0F3460', type: 'Desk', position: { x: 0, y: 0, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 1, z: 1.2 } },
        { id: `tmpl-tech2-${Date.now()}-2`, name: 'Racing Chair', category: 'Seating', price: 899, color: '#E94560', type: 'Dining Chair', position: { x: 0, y: 0, z: -2.5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 } },
        { id: `tmpl-tech3-${Date.now()}-3`, name: 'LED Shelf', category: 'Storage', price: 799, color: '#00D9FF', type: 'Bookshelf', position: { x: -7, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.3, z: 1 } },
        { id: `tmpl-tech4-${Date.now()}-4`, name: 'Cable Management Station', category: 'Storage', price: 349, color: '#212121', type: 'Side Table', position: { x: 2, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1, z: 0.6 } },
        { id: `tmpl-tech5-${Date.now()}-5`, name: 'Neon Strip Light', category: 'Lighting', price: 199, color: '#00FFF0', type: 'Floor Lamp', position: { x: 0, y: 1.5, z: -5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3, y: 0.2, z: 0.2 } },
        { id: `tmpl-tech6-${Date.now()}-6`, name: 'RGB Floor Lamp', category: 'Lighting', price: 449, color: '#FF006E', type: 'Floor Lamp', position: { x: -6, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.5, z: 0.7 } },
        { id: `tmpl-tech7-${Date.now()}-7`, name: 'Server Rack', category: 'Storage', price: 1299, color: '#2C2C2C', type: 'Wardrobe', position: { x: 7, y: 0, z: -2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 0.8, y: 1.4, z: 1 } },
        { id: `tmpl-tech8-${Date.now()}-8`, name: 'Beanbag', category: 'Seating', price: 399, color: '#6C63FF', type: 'Armchair', position: { x: -4, y: 0, z: 3 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 1.2, y: 0.6, z: 1.2 } },
        { id: `tmpl-tech9-${Date.now()}-9`, name: 'Monitor Stand', category: 'Tables', price: 249, color: '#0F3460', type: 'Side Table', position: { x: 0, y: 0.8, z: -3.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 0.3, z: 0.6 } },
        { id: `tmpl-tech10-${Date.now()}-10`, name: 'LED Panel', category: 'Lighting', price: 549, color: '#8B00FF', type: 'Floor Lamp', position: { x: 7, y: 1.2, z: 2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 0.1 } }
      ]
    },
    {
      id: 'coastal-breeze',
      name: 'Coastal Breeze',
      description: 'Light and airy beach house aesthetic',
      elements: [
        { id: 'cb1', type: 'wall', color: '#E0F7FA', completed: true, points: [{ x: -7, y: -6 }, { x: 7, y: -6 }] },
        { id: 'cb2', type: 'wall', color: '#E0F7FA', completed: true, points: [{ x: 7, y: -6 }, { x: 7, y: 6 }] },
        { id: 'cb3', type: 'wall', color: '#E0F7FA', completed: true, points: [{ x: 7, y: 6 }, { x: -7, y: 6 }] },
        { id: 'cb4', type: 'wall', color: '#E0F7FA', completed: true, points: [{ x: -7, y: 6 }, { x: -7, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-coast1-${Date.now()}-1`, name: 'Wicker Sofa', category: 'Seating', price: 1799, color: '#D4C5B9', type: 'Modern Sofa', position: { x: -2, y: 0, z: 3 }, rotation: { x: 0, y: -Math.PI / 8, z: 0 }, scale: { x: 1.6, y: 1, z: 1.3 } },
        { id: `tmpl-coast2-${Date.now()}-2`, name: 'Driftwood Coffee Table', category: 'Tables', price: 899, color: '#A0826D', type: 'Coffee Table', position: { x: -1, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 6, z: 0 }, scale: { x: 1.4, y: 0.8, z: 1.4 } },
        { id: `tmpl-coast3-${Date.now()}-3`, name: 'Adirondack Chair', category: 'Seating', price: 449, color: '#87CEEB', type: 'Armchair', position: { x: 4, y: 0, z: -1 }, rotation: { x: 0, y: -Math.PI / 3, z: 0 }, scale: { x: 1.1, y: 1, z: 1.1 } },
        { id: `tmpl-coast4-${Date.now()}-4`, name: 'Rope Ottoman', category: 'Seating', price: 329, color: '#F5F5DC', type: 'Armchair', position: { x: 1, y: 0, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.6, z: 0.9 } },
        { id: `tmpl-coast5-${Date.now()}-5`, name: 'Nautical Bookshelf', category: 'Storage', price: 749, color: '#FFFFFF', type: 'Bookshelf', position: { x: -6.5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 1.2, z: 0.9 } },
        { id: `tmpl-coast6-${Date.now()}-6`, name: 'Shell Display Cabinet', category: 'Storage', price: 649, color: '#B0E0E6', type: 'Dresser', position: { x: 6, y: 0, z: 2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1.1, z: 0.9 } },
        { id: `tmpl-coast7-${Date.now()}-7`, name: 'Lantern Stand', category: 'Lighting', price: 279, color: '#FFE4B5', type: 'Floor Lamp', position: { x: -5, y: 0, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.2, z: 0.7 } },
        { id: `tmpl-coast8-${Date.now()}-8`, name: 'Sea Grass Basket', category: 'Storage', price: 129, color: '#DEB887', type: 'Side Table', position: { x: 3, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 0.8, z: 0.7 } },
        { id: `tmpl-coast9-${Date.now()}-9`, name: 'Coral Sculpture', category: 'Decor', price: 199, color: '#FF7F50', type: 'Side Table', position: { x: -1, y: 0.8, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 0.4 } },
        { id: `tmpl-coast10-${Date.now()}-10`, name: 'Beach House Lamp', category: 'Lighting', price: 349, color: '#E0FFFF', type: 'Floor Lamp', position: { x: 5.5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 1.3, z: 0.8 } }
      ]
    },
    {
      id: 'gothic-elegance',
      name: 'Gothic Elegance',
      description: 'Dark dramatic Victorian-inspired space',
      elements: [
        { id: 'go1', type: 'wall', color: '#301934', completed: true, points: [{ x: -7, y: -6 }, { x: 7, y: -6 }] },
        { id: 'go2', type: 'wall', color: '#301934', completed: true, points: [{ x: 7, y: -6 }, { x: 7, y: 6 }] },
        { id: 'go3', type: 'wall', color: '#301934', completed: true, points: [{ x: 7, y: 6 }, { x: -7, y: 6 }] },
        { id: 'go4', type: 'wall', color: '#301934', completed: true, points: [{ x: -7, y: 6 }, { x: -7, y: -6 }] },
      ],
      furniture: [
        { id: `tmpl-goth1-${Date.now()}-1`, name: 'Velvet Throne Chair', category: 'Seating', price: 1899, color: '#4B0082', type: 'Armchair', position: { x: 0, y: 0, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.4, z: 1.3 } },
        { id: `tmpl-goth2-${Date.now()}-2`, name: 'Victorian Sofa', category: 'Seating', price: 2499, color: '#800020', type: 'Modern Sofa', position: { x: -3.5, y: 0, z: -1 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1.5, y: 1.1, z: 1.3 } },
        { id: `tmpl-goth3-${Date.now()}-3`, name: 'Gothic Coffee Table', category: 'Tables', price: 1299, color: '#1C1C1C', type: 'Coffee Table', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 8, z: 0 }, scale: { x: 1.4, y: 1, z: 1.4 } },
        { id: `tmpl-goth4-${Date.now()}-4`, name: 'Ornate Bookcase', category: 'Storage', price: 1799, color: '#3E2723', type: 'Bookshelf', position: { x: -6.5, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.5, z: 1 } },
        { id: `tmpl-goth5-${Date.now()}-5`, name: 'Candelabra Stand', category: 'Lighting', price: 599, color: '#C0C0C0', type: 'Floor Lamp', position: { x: -5, y: 0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.4, z: 0.7 } },
        { id: `tmpl-goth6-${Date.now()}-6`, name: 'Cathedral Mirror', category: 'Decor', price: 899, color: '#2F4F4F', type: 'Bookshelf', position: { x: 0, y: 1, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.8, z: 0.2 } },
        { id: `tmpl-goth7-${Date.now()}-7`, name: 'Antique Cabinet', category: 'Storage', price: 1999, color: '#2C1810', type: 'Wardrobe', position: { x: 6.5, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1.3, z: 1.1 } },
        { id: `tmpl-goth8-${Date.now()}-8`, name: 'Skull Sculpture', category: 'Decor', price: 349, color: '#FFFFF0', type: 'Side Table', position: { x: 0, y: 0.8, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } },
        { id: `tmpl-goth9-${Date.now()}-9`, name: 'Chandelier', category: 'Lighting', price: 2199, color: '#1C1C1C', type: 'Floor Lamp', position: { x: 0, y: 2.3, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1.2, z: 1.4 } },
        { id: `tmpl-goth10-${Date.now()}-10`, name: 'Wrought Iron Side Table', category: 'Tables', price: 649, color: '#36454F', type: 'Side Table', position: { x: 4.5, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 1, z: 0.9 } }
      ]
    },]))


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
    saveToHistory()
  }, [saveToHistory])

  const handleFurniture2DPositionChange = useCallback((id, position) => {
    setPlacedFurniture(prev => prev.map(item => item.id === id ? { ...item, position } : item))
    saveToHistory()
  }, [saveToHistory])

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
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Save Design</h2>
            <div className="space-y-3">
              <Input type="text" placeholder="Name" value={fileForm.name} onChange={(e) => setFileForm(f => ({ ...f, name: e.target.value }))} className="bg-gray-800 border-gray-700 text-white" />
              <Input type="text" placeholder="Description (optional)" value={fileForm.description} onChange={(e) => setFileForm(f => ({ ...f, description: e.target.value }))} className="bg-gray-800 border-gray-700 text-white" />
              <div className="flex gap-2 pt-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={async () => {
                  const payload = {
                    name: (fileForm.name || '').trim() || 'Untitled',
                    description: (fileForm.description || '').trim(),
                    sceneData: { elements: drawingElements, furniture: placedFurniture, settings: { mode: activeMode, zoomLevel, gridVisible, showMeasurements } },
                  }
                  try {
                    if (currentFile.id) {
                      const res = await designFilesAPI.update(currentFile.id, payload)
                      if (res.success) { setCurrentFile({ id: res.data._id, name: res.data.name }); setShowSaveDialog(false); toast.success('Saved successfully') }
                    } else {
                      const res = await designFilesAPI.create(payload)
                      if (res.success) { setCurrentFile({ id: res.data._id, name: res.data.name }); setShowSaveDialog(false); toast.success('Saved successfully') }
                    }
                  } catch (e) { toast.error('Save failed') }
                }}>Save</Button>
                <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          </div>
            </div>
          </div>
            </div>
          )}
      {showOpenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-[28rem] max-w-[90vw] mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Open Design</h2>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filesLoading && (
                <div className="text-gray-400 text-sm">Loading files...</div>
              )}
              {!!filesError && (
                <div className="text-red-400 text-sm">{filesError}</div>
              )}
              {!filesLoading && !filesError && filesList.length === 0 && (
                <div className="text-gray-400 text-sm">No files found.</div>
              )}
              {filesList.map(file => (
                <div key={file._id} className="flex items-center justify-between glass-panel p-3 rounded border border-gray-700">
                  <div className="min-w-0 pr-3">
                    <div className="text-white text-sm truncate" title={file.name}>{file.name}</div>
                    <div className="text-gray-400 text-xs truncate" title={file.description || ''}>{file.description || '—'}</div>
        </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={async () => {
                      try {
                        const res = await designFilesAPI.get(file._id)
                        if (res.success) {
                          const data = res.data
                          setDrawingElements(data.sceneData?.elements || [])
                          setPlacedFurniture(data.sceneData?.furniture || [])
                          setSelectedFurniture(null)
                          setSelectedWallId(null)
                          setCurrentFile({ id: data._id, name: data.name })
                          setShowOpenDialog(false)
                        }
                      } catch (e) {}
                    }}>Open</Button>
                    <Button size="sm" variant="outline" title="Delete" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white p-2" onClick={() => {
                      setDeleteTarget({ id: file._id, name: file.name })
                      setShowDeleteDialog(true)
                    }}>
                      <Trash2 className="h-4 w-4" />
                      </Button>
                </div>
              </div>
                  ))}
                </div>
            <div className="flex gap-2 pt-4 justify-end">
              <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => setShowOpenDialog(false)}>Close</Button>
              </div>
            </div>
      </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-2">Delete file</h2>
            <p className="text-gray-300 mb-4 text-sm">Are you sure you want to delete <span className="text-white font-medium">{deleteTarget.name || 'this file'}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={async () => {
                try {
                  const res = await designFilesAPI.remove(deleteTarget.id)
                  if (res.success) {
                    toast.success('Deleted successfully')
                    setShowDeleteDialog(false)
                    fetchFilesList()
                    if (currentFile.id === deleteTarget.id) {
                      setCurrentFile({ id: null, name: 'Untitled' })
                    }
                  } else {
                    toast.error(res.message || 'Delete failed')
                  }
                } catch (e) {
                  toast.error('Delete failed')
                }
              }}>Delete</Button>
          </div>
          </div>
          </div>
      )}
    <div className="pt-16 h-screen flex bg-gray-900 overflow-hidden scroll-panel">
      <LeftPanel 
        leftPanelOpen={leftPanelOpen}
        toggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        currentTools={currentTools}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        templates={templates}
        loadTemplate={loadTemplate}
        MonitorIcon={Monitor}
        BoxIcon={Box}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <CreateToolbar
          currentFile={currentFile}
          undo={undo}
          redo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          activeMode={activeMode}
          gridVisible={gridVisible}
          setGridVisible={setGridVisible}
          showMeasurements={showMeasurements}
          setShowMeasurements={setShowMeasurements}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onSaveClick={() => { setFileForm({ name: currentFile?.name || 'Untitled', description: '' }); setShowSaveDialog(true) }}
          onNewClick={() => { newDesign(); setCurrentFile({ id: null, name: 'Untitled' }) }}
          onOpenClick={() => { setShowOpenDialog(true); fetchFilesList() }}
          onExportClick={exportDesign}
        />
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
      
      <RightPanel
        rightPanelOpen={rightPanelOpen}
        toggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredFurniture={filteredFurniture}
        addFurniture={addFurniture}
        selectedFurnitureItem={selectedFurnitureItem}
        handleFurnitureColorChange={handleFurnitureColorChange}
        rotateSelectedFurniture={rotateSelectedFurniture}
        deleteSelectedFurniture={deleteSelectedFurniture}
        selectedTool={selectedTool}
        selectedWallId={selectedWallId}
        drawingElements={drawingElements}
        handleWallColorChange={handleWallColorChange}
      />
      
    </div>
    </DndProvider>
  )
}
