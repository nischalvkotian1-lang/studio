"use client"

import * as React from "react"
import { Calculator, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Share2, Info, GraduationCap, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const FUNNY_MESSAGES = {
  safe: [
    "Safe to sleep tomorrow 😎",
    "Bunk approved 😂",
    "You're a scholar, take a break 🎓",
    "Teacher's pet? Maybe. Safe? Definitely. ✅",
    "Attendance is on point, your future is bright ✨",
    "The principal would be proud of you 👏",
  ],
  warning: [
    "Careful bro 👀",
    "One more bunk and you're finished 😭",
    "Walking on thin ice 🧊",
    "The warden is watching 👮‍♂️",
    "Don't test your luck, just attend the next one 🚶‍♂️",
    "Your attendance is gasping for air 😮‍💨",
  ],
  danger: [
    "Bro go to class 💀",
    "Emergency attendance recovery mode 🚨",
    "Even God can't save this bunk plan ⛪",
    "RIP Attendance 🪦",
    "You're practically a ghost in the classroom 👻",
    "Start writing that apology letter now 📝",
  ]
}

export function AttendanceCalculator() {
  const [total, setTotal] = React.useState<string>("")
  const [attended, setAttended] = React.useState<string>("")
  const [target, setTarget] = React.useState<string>("85")
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load from local storage
  React.useEffect(() => {
    const savedTotal = localStorage.getItem("att_total") || ""
    const savedAttended = localStorage.getItem("att_attended") || ""
    const savedTarget = localStorage.getItem("att_target") || "85"
    
    setTotal(savedTotal)
    setAttended(savedAttended)
    setTarget(savedTarget)
    setIsLoaded(true)
  }, [])

  // Save to local storage
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("att_total", total)
      localStorage.setItem("att_attended", attended)
      localStorage.setItem("att_target", target)
    }
  }, [total, attended, target, isLoaded])

  const stats = React.useMemo(() => {
    const totalNum = parseInt(total) || 0
    const attendedNum = parseInt(attended) || 0
    const targetNum = parseInt(target) || 85

    if (totalNum <= 0) return null
    if (attendedNum > totalNum) return null

    const currentPercentage = (attendedNum / totalNum) * 100
    const isAboveTarget = currentPercentage >= targetNum

    let bunkable = 0
    let required = 0

    if (isAboveTarget) {
      bunkable = Math.floor((attendedNum * 100 / targetNum) - totalNum)
    } else {
      required = Math.ceil((targetNum * totalNum - 100 * attendedNum) / (100 - targetNum))
    }

    const currentP = parseFloat(currentPercentage.toFixed(2))
    
    let status: 'safe' | 'warning' | 'danger' = 'safe'
    if (currentP >= targetNum) {
      status = 'safe'
    } else if (currentP >= targetNum - 5) {
      status = 'warning'
    } else {
      status = 'danger'
    }

    const messageIndex = (totalNum + attendedNum) % FUNNY_MESSAGES[status].length
    const funnyMessage = FUNNY_MESSAGES[status][messageIndex]

    return {
      currentPercentage: currentP,
      isAboveTarget,
      bunkable: Math.max(0, bunkable),
      required: Math.max(0, required),
      status,
      funnyMessage,
      targetNum
    }
  }, [total, attended, target])

  const handleReset = () => {
    setTotal("")
    setAttended("")
    localStorage.removeItem("att_total")
    localStorage.removeItem("att_attended")
    toast({
      description: "Data cleared! Fresh start.",
    })
  }

  const handleShareWebsite = async () => {
    const shareUrl = window.location.origin
    const shareTitle = 'College Attendance Calculator'
    const shareText = 'Bro check this College Attendance Calculator 😂'

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      toast({
        title: "Link Copied!",
        description: "Website link copied to clipboard. Send it to your friends!",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Please copy the URL manually from your browser address bar.",
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-10 md:py-16 animate-fade-in">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-3 h-3" />
          Academic Tool
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-headline leading-tight">
          College <span className="text-electric">Attendance</span>
        </h1>
        <p className="text-muted-foreground font-body text-base md:text-lg max-w-md mx-auto">
          Calculate your bunking freedom with mathematical precision.
        </p>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-1 electric-gradient w-full" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Calculator className="w-5 h-5 text-primary" />
            Class Statistics
          </CardTitle>
          <CardDescription>We'll remember your inputs for next time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="total" className="text-sm font-semibold flex items-center gap-2">
                Total Classes Conducted (Until Now)
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="total"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 50"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="h-12 bg-zinc-900/50 border-white/5 text-lg focus:ring-primary/50 transition-all"
              />
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Enter the total number of classes held by the teacher so far.</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="attended" className="text-sm font-semibold">Classes Attended</Label>
              <Input
                id="attended"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 40"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className="h-12 bg-zinc-900/50 border-white/5 text-lg focus:ring-primary/50 transition-all"
              />
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Your actual presence count</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold">Target Percentage</Label>
            <Tabs value={target} onValueChange={setTarget} className="w-full">
              <TabsList className="grid grid-cols-3 w-full h-12 bg-zinc-900/50 p-1 border border-white/5">
                <TabsTrigger value="75" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm font-bold">75%</TabsTrigger>
                <TabsTrigger value="80" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm font-bold">80%</TabsTrigger>
                <TabsTrigger value="85" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm font-bold">85%</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1 h-12 border-white/5 hover:bg-white/5 transition-all font-bold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Data
            </Button>
            <Button 
              onClick={handleShareWebsite}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Share Website
              <div className="absolute -inset-1 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all -z-10" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className={cn(
            "glass-card border-l-8 transition-all duration-500",
            stats.status === 'safe' ? "border-l-emerald-500 shadow-emerald-500/10" : (stats.status === 'warning' ? "border-l-amber-500 shadow-amber-500/10" : "border-l-rose-500 shadow-rose-500/10")
          )}>
            <CardContent className="pt-8 pb-8 px-6 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Status</p>
                  <div className="flex items-baseline gap-3 justify-center md:justify-start">
                    <span className={cn(
                      "text-6xl md:text-7xl font-black",
                      stats.status === 'safe' ? "text-emerald-400" : (stats.status === 'warning' ? "text-amber-400" : "text-rose-400")
                    )}>
                      {stats.currentPercentage}%
                    </span>
                    <span className="text-muted-foreground text-xl">/ {stats.targetNum}%</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "p-5 rounded-3xl shadow-xl",
                    stats.status === 'safe' ? "bg-emerald-500/20 text-emerald-400" : (stats.status === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400")
                  )}>
                    {stats.status === 'safe' ? <CheckCircle2 className="w-12 h-12" /> : (stats.status === 'warning' ? <AlertTriangle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />)}
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                    stats.status === 'safe' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : (stats.status === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")
                  )}>
                    {stats.status === 'safe' ? "Safe Zone" : (stats.status === 'warning' ? "Danger Ahead" : "Critical Failure")}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Progress to Target</span>
                  <span>{Math.round(stats.currentPercentage)}%</span>
                </div>
                <Progress 
                  value={Math.min(stats.currentPercentage, 100)} 
                  className="h-3 bg-zinc-800 rounded-full"
                  indicatorClassName={cn(
                     "transition-all duration-1000",
                     stats.status === 'safe' ? "bg-emerald-500" : (stats.status === 'warning' ? "bg-amber-500" : "bg-rose-500")
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {stats.isAboveTarget ? (
              <Card className="glass-card border-emerald-500/10 hover:border-emerald-500/30 transition-all group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardDescription className="text-emerald-500/80 font-bold uppercase text-[10px] tracking-widest">Safe bunk classes available</CardDescription>
                    <CardTitle className="text-5xl font-black text-emerald-400">
                      {stats.bunkable}
                    </CardTitle>
                  </div>
                  <div className="bg-emerald-500/10 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <Flame className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-zinc-300 font-medium">You can skip <span className="text-emerald-400 font-black">{stats.bunkable}</span> sessions without falling below {stats.targetNum}%.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-rose-500/10 hover:border-rose-500/30 transition-all group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardDescription className="text-rose-500/80 font-bold uppercase text-[10px] tracking-widest">Classes needed to recover target attendance</CardDescription>
                    <CardTitle className="text-5xl font-black text-rose-400">
                      {stats.required}
                    </CardTitle>
                  </div>
                  <div className="bg-rose-500/10 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-zinc-300 font-medium">You must attend the next <span className="text-rose-400 font-black">{stats.required}</span> sessions straight to reach {stats.targetNum}%.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-zinc-950/80 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Student Intelligence Unit</p>
                  <h3 className="text-2xl md:text-3xl font-black italic text-white group-hover:text-primary transition-colors duration-300 leading-tight">
                    &ldquo;{stats.funnyMessage}&rdquo;
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="text-center pt-12 space-y-4 opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Precision Academic Analytics &bull; Est 2024</p>
        <div className="flex justify-center gap-6">
           <div className="w-1 h-1 rounded-full bg-zinc-800" />
           <div className="w-1 h-1 rounded-full bg-zinc-800" />
           <div className="w-1 h-1 rounded-full bg-zinc-800" />
        </div>
      </footer>
    </div>
  )
}
