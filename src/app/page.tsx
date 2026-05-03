import { AttendanceCalculator } from "@/components/attendance-calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <AttendanceCalculator />
      </div>
    </main>
  );
}
