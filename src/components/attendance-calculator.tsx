"use client"

import * as React from "react"
import { Calculator, CheckCircle2, XCircle, Info, RefreshCw, Lightbulb, AlertTriangle } from "lucide-react"
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
    if (attendedNum > totalNum) return null // Invalid input protection

    const currentPercentage = (attendedNum / totalNum) * 100
    const isAboveTarget = currentPercentage >= targetNum

    let bunkable = 0
    let required = 0

    if (isAboveTarget) {
      // Formula: Find largest x such that: (attended) / (total + x) >= targetPercentage / 100
      // attended * 100 / targetPercentage >= total + x
      // x <= (attended * 100 / targetPercentage) - total
      bunkable = Math.floor((attendedNum * 100 / targetNum) - totalNum)
    } else {
      // Formula: Find smallest x such that: (attended + x) / (total + x) >= targetPercentage / 100
      // (attended + x) * 100 >= targetPercentage * (total + x)
      // 100*attended + 100*x >= targetPercentage*total + targetPercentage*x
      // (100 - targetPercentage)*x >= targetPercentage*total - 100*attended
      // x >= (targetPercentage * total - 100 * attended) / (100 - targetPercentage)
      required = Math.ceil((targetNum * totalNum - 100 * attendedNum) / (100 - targetNum))
    }

    const currentP = parseFloat(currentPercentage.toFixed(2))
    
    let status: 'safe' | 'warning' | 'danger' = 'safe'
    let insight = ""

    if (currentP >= targetNum) {
      status = 'safe'
      if (currentP > 95) {
        insight = "Excellent standing! Your attendance is top-tier. You can safely prioritize other tasks if needed."
      } else {
        insight = `You're in the safe zone. You have a cushion of ${bunkable} classes to maintain your ${targetNum}% target.`
      }
    } else if (currentP >= targetNum - 5) {
      status = 'warning'
      insight = `You're slightly below the margin. Attending the next ${required} classes consecutively will bring you back to ${targetNum}%.`
    } else {
      status = 'danger'
      insight = `Critical status. You need to attend ${required} more classes without fail to recover your ${targetNum}% attendance.`
    }

    return {
      currentPercentage: currentP,
      isAboveTarget,
      bunkable: Math.max(0, bunkable),
      required: Math.max(0, required),
      status,
      insight,
      targetNum
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
                    <span className="text-muted-foreground">/ {stats.targetNum}%</span>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
                  <div className={cn(
                    "p-3 rounded-full",
                    stats.status === 'safe' ? "bg-emerald-500/10 text-emerald-500" : (stats.status === 'warning' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500")
                  )}>
                    {stats.status === 'safe' ? <CheckCircle2 className="w-8 h-8" /> : (stats.status === 'warning' ? <AlertTriangle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />)}
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase",
                    stats.status === 'safe' ? "text-emerald-500" : (stats.status === 'warning' ? "text-amber-500" : "text-rose-500")
                  )}>
                    {stats.status === 'safe' ? "Safe Zone" : (stats.status === 'warning' ? "Near Margin" : "Below Target")}
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
            {stats.isAboveTarget ? (
              <Card className="glass-card md:col-span-2 border-emerald-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-emerald-500/80 font-medium">Safe bunk classes available</CardDescription>
                  <CardTitle className="text-4xl font-bold flex items-center gap-3">
                    <span className="text-emerald-500">{stats.bunkable}</span>
                    <span className="text-lg font-normal text-muted-foreground">Classes can be missed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">You can safely miss {stats.bunkable} future classes while staying above your {stats.targetNum}% target.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card md:col-span-2 border-rose-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-rose-500/80 font-medium">Classes needed to recover target attendance</CardDescription>
                  <CardTitle className="text-4xl font-bold flex items-center gap-3">
                    <span className="text-rose-500">{stats.required}</span>
                    <span className="text-lg font-normal text-muted-foreground">Classes to attend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">You must attend the next {stats.required} classes consecutively to reach your {stats.targetNum}% goal.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Lightbulb className="w-4 h-4 text-primary opacity-50" />
            </div>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Calculation Insight</p>
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
        <p className="text-xs font-body tracking-widest uppercase">College Attendance Calculator &bull; Precise Logic Enabled</p>
      </footer>
    </div>
  )
}
