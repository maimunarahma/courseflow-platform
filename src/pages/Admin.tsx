import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, FileText, Plus, Edit, Trash2, 
  Search, MoreHorizontal, Eye
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCourses, mockEnrollments, mockAssignments, mockBatches } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Courses', value: mockCourses.length, icon: BookOpen },
    { label: 'Total Enrollments', value: mockEnrollments.length, icon: Users },
    { label: 'Active Batches', value: mockBatches.length, icon: LayoutDashboard },
    { label: 'Submissions', value: mockAssignments.reduce((a, b) => a + b.submissions.length, 0), icon: FileText },
  ];

  const handleDelete = (id: string) => {
    toast({ title: 'Course deleted', description: 'Course has been removed.' });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage courses, enrollments, and submissions</p>
          </div>
          <Button className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>All Courses</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={course.thumbnail} alt="" className="h-10 w-16 rounded object-cover" />
                            <div>
                              <p className="font-medium line-clamp-1">{course.title}</p>
                              <p className="text-sm text-muted-foreground">{course.instructor}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{course.category}</Badge></TableCell>
                        <TableCell>${course.price}</TableCell>
                        <TableCell>{course.enrolledCount.toLocaleString()}</TableCell>
                        <TableCell>{course.rating}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments">
            <Card>
              <CardHeader><CardTitle>Recent Enrollments</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEnrollments.map((enrollment) => {
                      const course = mockCourses.find(c => c.id === enrollment.courseId);
                      return (
                        <TableRow key={enrollment.id}>
                          <TableCell>Student {enrollment.userId}</TableCell>
                          <TableCell>{course?.title}</TableCell>
                          <TableCell><Badge>{enrollment.progress}%</Badge></TableCell>
                          <TableCell>{new Date(enrollment.enrolledAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader><CardTitle>Assignment Submissions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssignments.flatMap(a => a.submissions.map(s => (
                      <TableRow key={s.id}>
                        <TableCell>{a.title}</TableCell>
                        <TableCell>Student {s.userId}</TableCell>
                        <TableCell>{new Date(s.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {s.grade ? <Badge className="bg-success">{s.grade}/100</Badge> : <Badge variant="outline">Pending</Badge>}
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
