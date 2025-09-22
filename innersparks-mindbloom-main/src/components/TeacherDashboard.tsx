import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Target, 
  Download, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings,
  FileText,
  BarChart3,
  Filter
} from "lucide-react";

const classesData = {
  "7A": {
    name: "Class 7A",
    totalStudents: 28,
    activeThisWeek: 24,
    consistencyRate: 86,
    consistencyChange: 12,
    avgMood: 3.8,
    moodChange: 0.4,
    topValues: [
      { name: "Perseverance", count: 12, percentage: 43 },
      { name: "Kindness", count: 8, percentage: 29 },
      { name: "Honesty", count: 6, percentage: 21 },
      { name: "Courage", count: 4, percentage: 14 },
      { name: "Empathy", count: 3, percentage: 11 }
    ],
    weeklyTrend: [3.2, 3.5, 3.8, 3.6, 4.0],
    streakLeaders: [
      { name: "Sneha P.", streak: 15, consistent: true },
      { name: "Arjun K.", streak: 12, consistent: true },
      { name: "Maya S.", streak: 10, consistent: true },
      { name: "Ravi M.", streak: 8, consistent: false }
    ]
  },
  "7B": {
    name: "Class 7B",
    totalStudents: 32,
    activeThisWeek: 26,
    consistencyRate: 81,
    consistencyChange: 8,
    avgMood: 3.4,
    moodChange: 0.3,
    topValues: [
      { name: "Kindness", count: 11, percentage: 34 },
      { name: "Honesty", count: 7, percentage: 22 },
      { name: "Perseverance", count: 5, percentage: 16 },
      { name: "Empathy", count: 4, percentage: 13 },
      { name: "Courage", count: 3, percentage: 9 }
    ],
    weeklyTrend: [2.8, 3.1, 3.6, 3.4, 3.7],
    streakLeaders: [
      { name: "Arjun M.", streak: 12, consistent: true },
      { name: "Priya S.", streak: 9, consistent: true },
      { name: "Rahul K.", streak: 8, consistent: false },
      { name: "Ananya T.", streak: 7, consistent: true }
    ]
  },
  "8A": {
    name: "Class 8A",
    totalStudents: 30,
    activeThisWeek: 28,
    consistencyRate: 93,
    consistencyChange: 5,
    avgMood: 4.1,
    moodChange: 0.2,
    topValues: [
      { name: "Integrity", count: 15, percentage: 50 },
      { name: "Leadership", count: 10, percentage: 33 },
      { name: "Empathy", count: 8, percentage: 27 },
      { name: "Responsibility", count: 6, percentage: 20 },
      { name: "Resilience", count: 5, percentage: 17 }
    ],
    weeklyTrend: [3.8, 4.0, 4.2, 4.0, 4.3],
    streakLeaders: [
      { name: "Aisha R.", streak: 18, consistent: true },
      { name: "Vikram T.", streak: 16, consistent: true },
      { name: "Kavya L.", streak: 14, consistent: true },
      { name: "Dev P.", streak: 12, consistent: true }
    ]
  }
};

const TrendIcon = ({ change }: { change: number }) => {
  if (change > 0) return <ArrowUp className="w-4 h-4 text-success" />;
  if (change < 0) return <ArrowDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

interface TeacherDashboardProps {
  onBack?: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [selectedClass, setSelectedClass] = useState<keyof typeof classesData>("7B");
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [activeTab, setActiveTab] = useState("overview");
  
  const classData = classesData[selectedClass];
  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                ← Home
              </Button>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <h1 className="text-xl lg:text-2xl font-semibold">InnerSparks Teacher Dashboard</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Weekly insights for {classData.name} • Week of March 4-8, 2024
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as keyof typeof classesData)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7A">Class 7A</SelectItem>
                <SelectItem value="7B">Class 7B</SelectItem>
                <SelectItem value="8A">Class 8A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="last">Last Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm"
              onClick={() => {
                const reportData = `
InnerSparks Weekly Report - ${classData.name}
Generated: ${new Date().toLocaleDateString()}

PARTICIPATION METRICS:
- Active Students: ${classData.activeThisWeek}/${classData.totalStudents}
- Consistency Rate: ${classData.consistencyRate}%
- Mood Average: ${classData.avgMood}/5.0

TOP VALUES EXPLORED:
${classData.topValues.map(v => `- ${v.name}: ${v.count} students (${v.percentage}%)`).join('\n')}

STREAK LEADERS:
${classData.streakLeaders.map(s => `- ${s.name}: ${s.streak} days`).join('\n')}

RECOMMENDATIONS:
- Continue encouraging kindness-based activities
- Consider group reflection sessions on honesty
- Celebrate consistency improvements

Generated by InnerSparks Teacher Dashboard
`;
                const blob = new Blob([reportData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `InnerSparks-${classData.name}-Report.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participation</p>
                <p className="text-2xl font-semibold">{classData.activeThisWeek}/{classData.totalStudents}</p>
              </div>
              <Target className="w-8 h-8 text-primary-light" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon change={classData.consistencyChange} />
              <span className="text-xs text-muted-foreground">
                {classData.consistencyRate}% this week
              </span>
            </div>
          </Card>

          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <p className="text-2xl font-semibold">{classData.consistencyRate}%</p>
              </div>
              <Users className="w-8 h-8 text-primary-light" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon change={classData.consistencyChange} />
              <span className="text-xs text-success">
                +{classData.consistencyChange}% vs last week
              </span>
            </div>
          </Card>

          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Mood</p>
                <p className="text-2xl font-semibold">{classData.avgMood}/5</p>
              </div>
              <Heart className="w-8 h-8 text-primary-light" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon change={classData.moodChange} />
              <span className="text-xs text-success">
                +{classData.moodChange} vs last week
              </span>
            </div>
          </Card>

          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Most Improved</p>
                <p className="text-lg font-semibold">Group B</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">
                +15% consistency
              </span>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Values Explored */}
          <Card className="p-6 shadow-medium">
            <h3 className="text-lg font-medium mb-4">Values Explored This Week</h3>
            <div className="space-y-3">
              {classData.topValues.map((value, index) => (
                <div key={value.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{value.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${value.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                      {value.count} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mood Trend */}
          <Card className="p-6 shadow-medium">
            <h3 className="text-lg font-medium mb-4">Mood Trend (5-Day)</h3>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-32 px-2">
                {classData.weeklyTrend.map((mood, index) => {
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                  const height = (mood / 5) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="bg-secondary rounded-full w-8 relative" style={{ height: '80px' }}>
                        <div 
                          className="bg-primary rounded-full w-full absolute bottom-0 transition-smooth"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{days[index]}</span>
                      <span className="text-xs font-medium">{mood}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Class average mood has improved by 0.3 points this week
              </div>
            </div>
          </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-medium mb-4">Mood Patterns</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Very Positive Days</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '35%' }} />
                      </div>
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Positive Days</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Neutral Days</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div className="bg-muted h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-medium mb-4">Values Distribution</h3>
                <div className="space-y-3">
                  {classData.topValues.slice(0, 3).map((value, index) => (
                    <div key={value.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{value.name}</span>
                          <span className="text-xs text-muted-foreground">{value.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${value.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Student Overview</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classData.streakLeaders.map((student, index) => (
                  <div key={student.name} className="bg-card-soft p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{student.name}</span>
                      <div className="flex items-center gap-1">
                        {student.consistent && (
                          <Badge variant="outline" className="text-xs">
                            Consistent
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-primary mb-1">
                      {student.streak} days
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current streak
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Recent values: Kindness, Honesty
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-medium mb-4">Generate Reports</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Weekly Summary Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Monthly Analytics Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Student Progress Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trends & Insights Report
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-medium">
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-3">
                    Choose format for your reports:
                  </div>
                  <Button className="w-full justify-start" variant="outline">
                    📊 Excel Spreadsheet
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    📄 PDF Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    📈 Interactive Dashboard
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    📧 Email Summary
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Engagement Leaders */}
        <Card className="p-6 shadow-medium">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Consistency Leaders</h3>
            <Badge variant="secondary">Privacy Protected</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classData.streakLeaders.map((student, index) => (
              <div key={student.name} className="bg-card-soft p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{student.name}</span>
                  {student.consistent && (
                    <Badge variant="outline" className="text-xs">
                      Consistent
                    </Badge>
                  )}
                </div>
                <div className="text-xl font-semibold text-primary">
                  {student.streak} days
                </div>
                <div className="text-xs text-muted-foreground">
                  Current streak
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 shadow-medium bg-card-soft">
          <h3 className="text-lg font-medium mb-4">Suggested Classroom Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Friday Gratitude Circle</p>
                <p className="text-xs text-muted-foreground">
                  Based on high kindness themes, try a 5-minute gratitude sharing session
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Honesty Discussion</p>
                <p className="text-xs text-muted-foreground">
                  Students explored honesty frequently - consider a class discussion about difficult truths
                </p>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}