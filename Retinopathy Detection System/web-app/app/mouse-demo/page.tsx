import { BasicDemo, InteractiveDemo, GradientDemo, DocumentationCard } from "@/components/ui/demo"

export default function MouseDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mouse Tracking Demos</h1>
          <p className="text-slate-600">Demonstrating the high-performance useMousePositionRef hook.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BasicDemo />
          <InteractiveDemo />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <GradientDemo />
             <DocumentationCard />
        </div>
      </div>
    </div>
  )
}
