"use client"

import * as React from "react"
import { Calculator, CheckCircle2, XCircle, Info, RefreshCw, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function AttendanceCalculator() {
  const [total, setTotal] = React.useState<string>("")
  const [attended, setAttended] = React.useState<string>("")
  const [target, setTarget] = React.useState<string>("85")

  const stats = React.useMemo(() => {
    const totalNum = parseInt(total) || 0
    const attendedNum = parseInt(attended) || 0
    const targetNum = parseInt(target) || 85

    if (totalNum <= 0) return null

    const currentPercentage = (attendedNum / totalNum) * 100
    const isAboveTarget = currentPercentage >= targetNum

    let bunkable = 0
    let required = 0

    if (isAboveTarget) {
      bunkable = Math.floor((100 * attendedNum / targetNum) - totalNum)
    } else {
      required = Math.ceil((targetNum * totalNum - 100 * attendedNum) / (100 - targetNum))
    }

    const currentP = parseFloat(currentPercentage.toFixed(2))
    
    // Local Logic for Motivational Messages
    let insight = ""
    if (currentP >= targetNum) {
      if (currentP > 95) {
        insight = "Excellent! You have a near-perfect record. You're in a great position to bunk a few classes if you need extra study time."
      } else if (currentP >= 90) {
        insight = `Fantastic! You're consistently hitting high numbers. You can safely miss ${bunkable} classes while staying above ${targetNum}%.`
      } else {
        insight = `You're doing well! Staying above the target. You have a cushion of ${bunkable} classes.`
      }
    } else {
      if (currentP >= targetNum - 5) {
        insight = `You're very close! Attending just ${required} more classes will bring you back to ${targetNum}%. Don't lose hope!`
      } else if (currentP >= 50) {
        insight = `Time to focus. You need to attend the next ${required} classes to get back on track. Consistency is key now.`
      } else {
        insight = `Critical status. It's imperative that you attend your next ${required} classes. Consider speaking with your professor to discuss your progress.`
      }
    }

    return {
      currentPercentage: currentP,
      isAboveTarget,
      bunkable: Math.max(0, bunkable),
      required: Math.max(0, required),
      status: currentP >= targetNum ? 'safe' : (currentP >= targetNum - 5 ? 'warning' : 'danger'),
      insight
    }
  }, [total, attended, target])

  const handleReset = () => {
    setTotal("")
    setAttended("")
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-8 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text font-headline">College Attendance Calculator</h1>
        <p className="text-muted-foreground font-body">Track your academic progress with precision.</p>
      </div>

      <Card className="glass-card shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calculator className="w-5 h-5" />
            Attendance Input
          </CardTitle>
          <CardDescription>Enter your current class details to see where you stand.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="total">Total Classes Conducted</Label>
              <Input
                id="total"
                type="number"
                placeholder="e.g. 50"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attended">Classes Attended</Label>
              <Input
                id="attended"
                type="number"
                placeholder="e.g. 40"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Target Percentage</Label>
            <Tabs value={target} onValueChange={setTarget} className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-background/50">
                <TabsTrigger value="75" className="data-[state=active]:bg-primary">75%</TabsTrigger>
                <TabsTrigger value="80" className="data-[state=active]:bg-primary">80%</TabsTrigger>
                <TabsTrigger value="85" className="data-[state=active]:bg-primary">85%</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button 
            variant="ghost" 
            onClick={handleReset}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Calculator
          </Button>
        </CardContent>
      </Card>

      {stats && (
        <div className="space-y-6 animate-fade-in">
          <Card className={cn(
            "glass-card border-l-4 overflow-hidden relative",
            stats.status === 'safe' ? "border-l-emerald-500" : (stats.status === 'warning' ? "border-l-amber-500" : "border-l-rose-500")
          )}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Attendance</p>
                  <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-5xl font-black text-foreground">{stats.currentPercentage}%</span>
                    <span className="text-muted-foreground">/ {target}%</span>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
                  <div className={cn(
                    "p-3 rounded-full",
                    stats.status === 'safe' ? "bg-emerald-500/10 text-emerald-500" : (stats.status === 'warning' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500")
                  )}>
                    {stats.status === 'safe' ? <CheckCircle2 className="w-8 h-8" /> : (stats.status === 'warning' ? <Info className="w-8 h-8" /> : <XCircle className="w-8 h-8" />)}
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase",
                    stats.status === 'safe' ? "text-emerald-500" : (stats.status === 'warning' ? "text-amber-500" : "text-rose-500")
                  )}>
                    {stats.status === 'safe' ? "Excellent Standing" : (stats.status === 'warning' ? "Near Margin" : "Below Target")}
                  </span>
                </div>
              </div>
              <Progress 
                value={Math.min(stats.currentPercentage, 100)} 
                className="mt-6 h-2 bg-white/5"
                indicatorClassName={cn(
                   stats.status === 'safe' ? "bg-emerald-500" : (stats.status === 'warning' ? "bg-amber-500" : "bg-rose-500")
                )}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardDescription>Bunk Safe Zone</CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <span className={stats.bunkable > 0 ? "text-primary" : "text-muted-foreground"}>{stats.bunkable}</span>
                  <span className="text-sm font-normal text-muted-foreground">Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Number of classes you can miss without dropping below {target}%.</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardDescription>Recovery Required</CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <span className={stats.required > 0 ? "text-accent" : "text-muted-foreground"}>{stats.required}</span>
                  <span className="text-sm font-normal text-muted-foreground">Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Additional classes to attend to reach your {target}% goal.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Lightbulb className="w-4 h-4 text-primary opacity-50" />
            </div>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Status Insight</p>
                  <p className="text-sm italic text-foreground/90 leading-relaxed">
                    &ldquo;{stats.insight}&rdquo;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="text-center pt-8 opacity-30">
        <p className="text-xs font-body tracking-widest uppercase">College Attendance Calculator &bull; Local Logic</p>
      </footer>
    </div>
  )
}
